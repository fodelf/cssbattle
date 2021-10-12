/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-08-28 11:49:43
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-12 13:25:07
 */
import { useCallback, useState, useRef, useEffect } from 'react';
import styles from './index.less';
import {
  Radio,
  Button,
  message,
  Drawer,
  List,
  Avatar,
  Modal,
  Select,
  Divider,
} from 'antd';
const { Option } = Select;
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
import {
  getAuditionDetail,
  auditionIMGCompare,
  getAuditionIMGCompare,
} from '@/api/audition';
import {
  getAuditionCssList,
  getAuditionExerciseList,
  getAuditionExerciseDetail,
} from '@/api/manage';

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

const Audition: React.FC = (props: any) => {
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
  const [interviewStatus, setStatus] = useState('activeInterview');
  const [auditionList, setAuditionList] = useState<any[]>([]);
  const [exciseList, setExciseList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const iframeRef = useRef(null);
  const iframeBoxRef = useRef(null);
  const draggleLineRef = useRef(null);
  const contentRef = useRef(null);

  const changeCode = (editor: any, data: any, value: string) => {
    setValue(value);
  };
  function randomString(e: number): string {
    e = e || 32;
    var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
      a = t.length,
      n = '';
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  }
  const initIm = async () => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', randomString(12));
    }

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(async (stream) => {
        const video = document.getElementById('1');
        //@ts-ignore
        video.srcObject = stream;
        //@ts-ignore
        video.play();
        const options = {
          stream,
          serverUrl: `ws:110.42.220.32:9528/api/v1/im/message`,
          joinUrl: 'http://110.42.220.32:9528',
          // serverUrl: `ws:localhost:9528/api/v1/im/message`,
          // joinUrl: 'http://127.0.0.1:9528',
          roomId: props.match.params.id,
          userId: localStorage.getItem('userId'),
          debug: true,
          peerOptions: {
            config: {
              iceServers: [
                {
                  urls: 'turn:110.42.220.32:3478',
                  username: 'admin',
                  credential: '123456',
                },
              ],
            },
          },
        };
        const spw = new window.Lsp(options);
        spw.join(props.match.params.id);
        await spw.connect();
        spw.send({
          message: location.href,
        });

        spw.on('message', ({ content }) => {
          // alert(content.message);
        });
        spw.on('stream', (videoStream: any) => {
          console.log('sssssssssssssssssssssssssssssss', videoStream);
          const video = document.getElementById('2');
          //@ts-ignore
          video.srcObject = videoStream;
          //@ts-ignore
          video.play();
          // spw.publishVideo();
          // connectToNewUser(user, videoStream);
        });
      })
      .catch(() => {});

    // spw.publishVideo('1').then(async (stream: any) => {
    //   // let video = document.getElementById('1') as any;
    //   // debugger;
    //   // video.srcObject = stream;
    //   // console.log('=======videovideo=====', stream);
    //   // spw.peerClient.addStream(stream.videoStream);
    // });
    // spw.shareScreen().then(async (stream: any) => {
    //   console.log('=======videovideo=====', stream);
    // });
  };
  useEffect(() => {
    // changeStyle();
    initIm();
  }, []);

  useEffect(() => {
    changeStyle();
  }, [checkType, codeValue]);

  useEffect(() => {
    drag();
  }, []);

  useEffect(() => {
    // getImg();
    queryAuditionDetail();
    getCssList();
    // getExciseList();
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

  // 获取面试详情
  const queryAuditionDetail = () => {
    getAuditionDetail({
      auditionId: props.match.params.id,
    }).then((res) => {
      console.log(localStorage.getItem('userId'));
      if (res.data.data.userId === localStorage.getItem('userId')) {
        setStatus('activeInterview');
      } else {
        setStatus('unactiveInterview');
      }
    });
  };
  const getCssList = () => {
    getAuditionCssList({ auditionId: props.match.params.id }).then((res) => {
      let result = res.data.data || [];
      setAuditionList(result);
      if (result.length > 0) {
        getImg(result[0].cssId);
        queryDetail(result[0].cssId);
      }
      getExciseList();
    });
  };

  const getExciseList = () => {
    getAuditionExerciseList({
      auditionId: props.match.params.id,
    }).then((res) => {
      let list = [...auditionList, ...(res.data.data || [])];
      setAuditionList(list);
    });
  };

  const getImg = (id: any) => {
    getImgDetail({ id }).then((res) => {
      setImgUrl(res.data.data.imgUrl);
      setColors(res.data.data.colors || []);
    });
  };

  const createIframe = () => {
    const iframe = iframeRef.current;
    console.log(iframeRef);
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

  // 提交
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
      id: auditionList[currentIndex].cssId,
      userId: localStorage.getItem('userId'),
      auditionId: props.match.params.id,
    };
    auditionIMGCompare(params)
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

  const nextProblem = () => {
    if (currentIndex < auditionList.length - 1) {
      // Modal.warning({
      //   title: '提示',
      //   content: '请确认是否提交，若未提交代码将不予以保存',
      //   cancelText: '取消',
      //   okText:'提交',
      // });
      setCurrentIndex(currentIndex + 1);
      if (auditionList[currentIndex + 1].cssId) {
        getImg(auditionList[currentIndex + 1].cssId);
        queryDetail(auditionList[currentIndex + 1].cssId);
      } else {
        queryPratiseDetail(auditionList[currentIndex + 1].id);
      }
    } else {
      // message.warning('已经是最后一题！');
    }
  };

  const queryPratiseDetail = (id: string) => {
    let params = {
      id,
      auditionId: props.match.params.id,
    };
    getAuditionExerciseDetail(params).then((res) => {});
  };

  const queryDetail = (id: any) => {
    getAuditionIMGCompare({
      id,
      userId: localStorage.getItem('userId'),
      auditionId: props.match.params.id,
    }).then((res) => {
      if (res.data.data.code === '') {
        setCodeValue(
          `<div>\n  <div></div>\n</div>\n\n<style>\n  div {\n    width: 100px;\n    height: 100px;\n    background: #dd6b4d;\n  }\n</style>\n\n<!-- 在此编辑器中编写 HTML/CSS 并以尽可能少的代码复制给定的目标图像。\n 你在这里写的，按原样呈现 -->\n\n<!-- 得分 -->\n<!-- 分数是根据您使用的字符数（此评论包括：P）以及复制图像的接近程度计算得出的。 \n阅读常见问题解答 (https://cssbattle.dev/faqs) 了解更多信息。 -->\n<!-- 总结：匹配度越高，使用字符数越少得分越高--> \n\n<!-- 重要提示：提交前删除此段提示信息-->`,
        );
        setValue(
          `<div>\n  <div></div>\n</div>\n\n<style>\n  div {\n    width: 100px;\n    height: 100px;\n    background: #dd6b4d;\n  }\n</style>\n\n<!-- 在此编辑器中编写 HTML/CSS 并以尽可能少的代码复制给定的目标图像。\n 你在这里写的，按原样呈现 -->\n\n<!-- 得分 -->\n<!-- 分数是根据您使用的字符数（此评论包括：P）以及复制图像的接近程度计算得出的。 \n阅读常见问题解答 (https://cssbattle.dev/faqs) 了解更多信息。 -->\n<!-- 总结：匹配度越高，使用字符数越少得分越高--> \n\n<!-- 重要提示：提交前删除此段提示信息-->`,
        );
      } else {
        setCodeValue(res.data.data.code);
        setValue(res.data.data.code);
      }
      setScore(res.data.data.score.toFixed(2));
      const match = (res.data.data.match * 100).toFixed(2) + '%';
      setMatch(match);
    });
  };

  const prevProblem = () => {
    if (currentIndex >= 1) {
      getImg(auditionList[currentIndex - 1].cssId);
      setCurrentIndex(currentIndex - 1);
      queryDetail(auditionList[currentIndex - 1].cssId);
    } else {
      // message.warning('已经是第一题！');
    }
  };

  return (
    <div className={styles.playEditor}>
      <div className={styles.playLeft}>
        <div className={styles.title}>
          <span className={styles.textTit}>答案</span>
          <div>
            {/* <Select placeholder="选择代码类型" style={{ width: 150 }}>
              <Option value="js">原生js</Option>
              <Option value="vue">vue.js</Option>
              <Option value="react">react.js</Option>
            </Select> */}
            <span className={styles.textTit}>字符数:{codeValue.length}</span>
          </div>
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
          <div className={styles.btnList}>
            {interviewStatus === 'unactiveInterview' ? (
              <>
                <Button type="default" onClick={prevProblem}>
                  上一题
                </Button>
                <Button type="primary" onClick={nextProblem}>
                  下一题
                </Button>
                <Button type="primary" loading={loading} onClick={confirmCode}>
                  提交
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" loading={loading} onClick={prevProblem}>
                  开始面试
                </Button>
                <Button type="primary" loading={loading} onClick={nextProblem}>
                  结束面试
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.playRight}>
        <div className={[styles.title, styles.middle].join(' ')}>
          <span className={styles.textTit}>题目</span>
          <span className={styles.textTit}>图片大小400px x 300px</span>
          {/* <span className={styles.textTit}>滑动&比较</span> */}
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
          </div>
        </div>
      </div>
      <div className={styles.playRight}>
        <div className={styles.title}>
          <span className={styles.textTit}>视频</span>
        </div>
        <div className={styles.rightContent}>
          <video className={styles.videoContent} id="1"></video>
          <Divider />
          <video className={styles.videoContent} id="2"></video>
          {/* <div className={styles.imgBg}></div>
          <div className={styles.imgBg}></div> */}
        </div>
      </div>
    </div>
  );
};

export default Audition;
