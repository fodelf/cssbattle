/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-08-28 11:49:43
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-09-29 09:35:50
 */
import { useCallback, useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { Radio, Button, message, Drawer, List, Avatar } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
// 主题风格
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/duotone-dark.css';
// 代码模式，clike是包含java,c++等模式的
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
//ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/javascript-hint.js'; // 自动提示
//代码高亮
import 'codemirror/addon/selection/active-line';
//折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchBrackets';

import {
  upload,
  getImgDetail,
  compare,
  getPlayRankList,
  getUserImgDetail,
} from '@/api/play';

const BattleRank: React.FC = (props: any) => {
  const [rankList, setRankList] = useState([]);

  useEffect(() => {
    queryPlayRankList();
  }, [props.visible]);

  const queryPlayRankList = () => {
    console.log(props);
    let params = {
      id: props.match.params.id,
    };
    getPlayRankList(params).then((res) => {
      setRankList(res.data.data || []);
    });
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={rankList}
      renderItem={(item: any, index: number) => (
        <List.Item>
          {/* <Skeleton avatar title={false} active> */}
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.userIcon || require('@/assets/imgs/avator.svg')}
              />
            }
            title={item.userName}
            description={`${item.score.toFixed(2)}（${item.chars}个字符）`}
          />
          <div className={styles.rank}>
            {index > 2 ? `${index + 1}th` : <i className={styles.rankBg}></i>}
          </div>
          {/* </Skeleton> */}
        </List.Item>
      )}
    />
  );
};

const Play: React.FC = (props: any) => {
  const [codeValue, setValue] = useState(
    '<div>\n  <div></div>\n</div>\n\n<style>\n  div {\n    width: 100px;\n    height: 100px;\n    background: #dd6b4d;\n  }\n</style>',
  );
  const [showCodeValue, setCodeValue] = useState('');
  const [checkType, setType] = useState('iframe');
  const [imgUrl, setImgUrl] = useState('');
  const [score, setScore] = useState(0);
  const [match, setMatch] = useState('0%');
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [visible, setVisible] = useState(false);

  const iframeRef = useRef(null);
  const iframeBoxRef = useRef(null);
  const draggleLineRef = useRef(null);
  const contentRef = useRef(null);

  const changeCode = (editor: any, data: any, value: string) => {
    setValue(value);
  };

  useEffect(() => {
    changeStyle();
  }, [checkType, codeValue]);

  useEffect(() => {
    drag();
  }, []);

  useEffect(() => {
    getImg();
  }, []);

  useEffect(() => {
    getUserImgDetail(props.match.params).then((res: any) => {
      if (res.data.data.code) {
        setCodeValue(res.data.data.code);
        setScore(res.data.data.score.toFixed(2));
        const match = (res.data.data.match * 100).toFixed(2) + '%';
        setMatch(match);
      } else {
        setCodeValue(
          `<div>\n  <div></div>\n</div>\n\n<style>\n  div {\n    width: 100px;\n    height: 100px;\n    background: #dd6b4d;\n  }\n</style>\n\n<!-- 在此编辑器中编写 HTML/CSS 并以尽可能少的代码复制给定的目标图像。\n 你在这里写的，按原样呈现 -->\n\n<!-- 得分 -->\n<!-- 分数是根据您使用的字符数（此评论包括：P）以及复制图像的接近程度计算得出的。 \n阅读常见问题解答 (https://cssbattle.dev/faqs) 了解更多信息。 -->\n<!-- 总结：匹配度越高，使用字符数越少得分越高--> \n\n<!-- 重要提示：提交前删除此段提示信息-->`,
        );
      }
    });
  }, []);
  const getImg = () => {
    let params = props.match.params;
    getImgDetail(params).then((res) => {
      setImgUrl(res.data.data.imgUrl);
      setColors(res.data.data.colors || []);
    });
  };

  const createIframe = () => {
    const iframe = iframeRef.current;
    if (iframe !== null) {
      const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
      iframeDoc?.open();
      iframeDoc?.write(`
      <body>
        ${codeValue}
      </body>
      `);

      iframeDoc?.close();
    }
  };

  const createWebComp = () => {
    class PopUpInfo extends HTMLElement {
      constructor() {
        // Always call super first in constructor
        super();
        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });
        const htmlLength = codeValue.indexOf('<style>');
        shadow.innerHTML = codeValue.slice(0, htmlLength);
        const style = document.createElement('style');
        const styleLength = codeValue.indexOf('</style>');
        style.textContent = `${codeValue.slice(htmlLength + 8, styleLength)}`;
        shadow.appendChild(style);
      }
    }
    customElements.get('web-component') ||
      customElements.define('web-component', PopUpInfo);
  };

  const onChange = (e: any) => {
    setType(e.target.value);
  };

  const changeStyle = () => {
    if (checkType === 'iframe') {
      createIframe();
      drag();
    } else {
      createWebComp();
    }
  };

  const submit = () => {
    let params = {
      div: codeValue.slice(0, codeValue.indexOf('<style>')),
      style: codeValue.slice(
        codeValue.indexOf('<style>') + 8,
        codeValue.indexOf('</style>'),
      ),
    };
    upload(params).then((res) => {
      message.success('上传成功！');
    });
  };

  const drag = () => {
    const contentDom = (contentRef.current as any) as HTMLElement;
    const iframeDom = (iframeBoxRef.current as any) as HTMLElement;
    contentDom.onmouseover = (e: any) => {
      const firstX = e.clientX;
      iframeDom.style.width = firstX - contentDom.offsetLeft + 'px';

      document.onmousemove = (event: any) => {
        const clientX = event.clientX;
        iframeDom.style.width = clientX - contentDom.offsetLeft + 'px';
      };

      contentDom.onmouseleave = () => {
        iframeDom.style.width = contentDom.offsetWidth + 'px';
        document.onmousemove = null;
      };
      return false;
    };
  };

  const confirmCode = () => {
    setLoading(true);
    let params = {
      code: codeValue,
      id: props.match.params.id,
    };
    compare(params)
      .then((res) => {
        setLoading(false);
        setScore(res.data.data.score.toFixed(2));
        const match = (res.data.data.match * 100).toFixed(2) + '%';
        setMatch(match);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onCopy = (colorText: string) => {
    const oInput = document.createElement('input');
    oInput.value = colorText;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand('Copy'); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    document.body.removeChild(oInput);
    message.success('复制成功');
  };

  return (
    <div className={styles.playEditor}>
      <div className={styles.playLeft}>
        <div className={styles.title}>
          <span className={styles.textTit}>编辑</span>
          <span className={styles.textTit}>字符数:{codeValue.length}</span>
        </div>
        <div className={styles.leftContent}>
          <CodeMirror
            value={showCodeValue}
            options={{
              mode: { name: 'text/css' },
              theme: 'duotone-dark',
              autofocus: true, //自动获取焦点
              styleActiveLine: true, //光标代码高亮
              lineNumbers: true, //显示行号
              smartIndent: true, //自动缩进
              matchBrackets: true, // 匹配括号
              autoCloseBrackets: true, // 自动闭合符号
              //start-设置支持代码折叠
              lineWrapping: false,
              foldGutter: true,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            }} //end
            onChange={changeCode}
          />
          <Button
            type="primary"
            className={styles.confirmCodeBtn}
            loading={loading}
            onClick={confirmCode}
          >
            提交
          </Button>
        </div>
      </div>
      <div className={styles.playRight}>
        <div className={[styles.title, styles.middle].join(' ')}>
          <span className={styles.textTit}>输出</span>
          {/* <Radio.Group onChange={onChange} value={checkType}> */}
          {/* <Radio value='iframe'>Iframe</Radio> */}
          {/* <Radio value='webComponent'>WebComponent</Radio> */}
          {/* </Radio.Group> */}
          <span className={styles.textTit}>滑动&比较</span>
        </div>
        <div className={styles.rightContent}>
          {checkType === 'iframe' ? (
            <div className={styles.iframeContent} ref={contentRef}>
              <div
                id="iframeBox"
                ref={iframeBoxRef}
                className={styles.iframeBox}
              >
                <iframe id="iframe" ref={iframeRef}></iframe>
                <div className={styles.dragLine} ref={draggleLineRef}></div>
              </div>
              <img className={styles.imgBox} src={imgUrl} alt="" />
            </div>
          ) : (
            <>
              {/* <web-component></web-component> */}
              <Button onClick={submit}>Submit</Button>
            </>
          )}
          <p className={styles.scoreTit}>你的分数</p>
          <div className={styles.scoreContent}>
            <p className={styles.score}>
              <span>最后得分：</span>
              {score}（匹配度：{match}）
            </p>
            <p>
              <Button type="primary" onClick={() => setVisible(true)}>
                排行榜
              </Button>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.playRight}>
        <div className={styles.title}>
          <span className={styles.textTit}>目标</span>
          <span className={styles.textTit}>400px x 300px</span>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.imgBg}>
            <img src={imgUrl} alt="" />
          </div>
          <p className={styles.scoreTit}>使用的颜色（点击复制)</p>
          <div className={styles.colorContent}>
            {colors.map((item: any) => {
              return (
                <div className={styles.colorItem} onClick={() => onCopy(item)}>
                  <i
                    style={{ background: item }}
                    className={styles.circleBg}
                  ></i>
                  {item}
                </div>
              );
            })}
          </div>
          <p className={styles.scoreTit}>联系我</p>
          <div className={styles.connectContent}>
            <img src="https://cdn.wuwenzhou.com.cn/media/dd.png" alt="" />
            <img src="https://cdn.wuwenzhou.com.cn/media/wx.png" alt="" />
          </div>
        </div>
      </div>
      <Drawer
        title="排行榜"
        placement={'left'}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={'left'}
        getContainer={false}
        style={{ position: 'absolute' }}
        width="400"
      >
        <BattleRank {...props} visible={visible}></BattleRank>
      </Drawer>
    </div>
  );
};

export default Play;
