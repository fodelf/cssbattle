/*
 * @Descripttion:
 * @version:
 * @Author: pym
 * @Date: 2021-08-28 11:49:43
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-26 09:24:42
 */
import React, { useCallback, useState, useRef, useEffect } from 'react';
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
  Checkbox,
  Input,
  Row,
  Col,
  Divider,
} from 'antd';
const { Option } = Select;
const { TextArea } = Input;
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
  setAudition,
  auditionEnd,
  exerciseSubmit,
  getExerciseDetail,
  updateAuditionInfo,
} from '@/api/audition';
import {
  getAuditionCssList,
  getAuditionExerciseList,
  getAuditionExerciseDetail,
} from '@/api/manage';
import IM from './im';
import WebRtc from './webrtc';

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

const Excise: React.FC = (props: any) => {
  console.log(props);
  const { exciseItem, interviewStatus, answer } = props;

  const changeAnswer = (value: any) => {
    props.changeAnswer(value);
  };

  return (
    <div>
      <Row className={styles.exciseRow} gutter={20}>
        <Col span={5} className={styles.leftCol}>
          题目：
        </Col>
        <Col span={19} className={styles.rightCol}>
          {exciseItem.content}
        </Col>
      </Row>
      {exciseItem.type !== 2 && (
        <Row className={styles.exciseRow} gutter={20}>
          <Col span={5} className={styles.leftCol}>
            选项内容：
          </Col>
          <Col span={19} className={styles.rightCol}>
            {exciseItem.options.map((item: any) => {
              return (
                <p>
                  {item.key}.{item.des}
                </p>
              );
            })}
          </Col>
        </Row>
      )}
      <Row className={styles.exciseRow} gutter={20}>
        <Col span={5} className={styles.leftCol}>
          答案：
        </Col>
        <Col span={19} className={styles.rightCol}>
          {exciseItem.type === 0 ? (
            <Radio.Group
              onChange={(e) => changeAnswer(e.target.value)}
              value={answer}
            >
              {exciseItem.options.map((item: any) => {
                return (
                  <Radio
                    value={item.key}
                    disabled={
                      interviewStatus === 'activeInterview' ? true : false
                    }
                  >
                    {item.key}
                  </Radio>
                );
              })}
            </Radio.Group>
          ) : exciseItem.type === 1 ? (
            <Checkbox.Group onChange={changeAnswer} value={answer}>
              {exciseItem.options.map((item: any) => {
                return (
                  <Checkbox
                    value={item.key}
                    disabled={
                      interviewStatus === 'activeInterview' ? true : false
                    }
                  >
                    {item.key}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          ) : (
            <TextArea
              rows={4}
              disabled={interviewStatus === 'activeInterview' ? true : false}
              onChange={(e) => changeAnswer(e.target.value)}
              value={answer}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

const CssDetail = (props: any) => {
  const iframeRef = useRef(null);
  const iframeBoxRef = useRef(null);
  const draggleLineRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!props.codeType) {
      createIframe();
      drag();
    }
  }, [props.codeValue, props.codeType]);

  useEffect(() => {
    if (props.isRunCode) {
      createIframe();
    }
  }, [props.isRunCode]);

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

  const createIframe = () => {
    const iframe = iframeRef.current;
    console.log(iframeRef);
    if (iframe !== null) {
      const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
      iframeDoc?.open();
      iframeDoc?.write(`
      <body>
        ${props.codeValue}
      </body>
      `);
      iframeDoc?.close();
    }
  };

  return (
    <>
      <div className={styles.rightContent}>
        {!props.codeType && (
          <>
            <div className={styles.imgBg}>
              <img src={props.imgUrl} alt="" />
            </div>
            <p className={styles.scoreTit}>使用的颜色（点击复制)</p>
            <div className={styles.colorContent}>
              {(props.colors || []).map((item: any, index: number) => {
                return (
                  <div
                    className={styles.colorItem}
                    onClick={() => onCopy(item)}
                    key={index}
                  >
                    <i
                      style={{ background: item }}
                      className={styles.circleBg}
                    ></i>
                    {item}
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className={styles.iframeContent} ref={contentRef}>
          <div id="iframeBox" ref={iframeBoxRef} className={styles.iframeBox}>
            <iframe id="iframe" ref={iframeRef}></iframe>
            <div className={styles.dragLine} ref={draggleLineRef}></div>
          </div>
          <img className={styles.imgBox} src={props.imgUrl} alt="" />
        </div>
        {!props.codeType && (
          <>
            <p className={styles.scoreTit}>你的分数</p>
            <div className={styles.scoreContent}>
              <p className={styles.score}>
                <span>最后得分：</span>
                {props.score}（匹配度：{props.match}）
              </p>
            </div>
          </>
        )}
      </div>
    </>
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
  const [currentPratise, setPratise] = useState({
    exciseType: '',
    cssId: '',
    name: '',
    id: '',
    type: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [im, setIm] = useState<any>(null);
  const [auditionStatus, setAuditionStatus] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selectShow, setSelectShow] = useState(false);
  const [codeType, setCodeType] = useState('');
  const [unableEdit, setUnableEdit] = useState(false);
  const [isRunCode, setIsRunCode] = useState(false);
  const [webRtc, setwebRtc] = useState<any>(null);
  const [isShare, setShare] = useState<any>(true);
  const [isStuShare, setStuShare] = useState<any>(true);

  // const [contentDetail, setContentDetail] = useState<any>({})
  let contentDetail: any;

  const changeCode = (editor: any, data: any, value: string) => {
    const message = {
      type: 'Audition:coding',
      content: {
        value: value,
      },
    };
    if (im) {
      im.send(message);
    }
    // setValue(value);
  };
  const randomString = (e: number): string => {
    e = e || 32;
    var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
      a = t.length,
      n = '';
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  };

  const initIm = async () => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', randomString(12));
    }
    let im = new IM({
      roomId: props.match.params.id,
      userId: localStorage.getItem('userId') as string,
    });
    await im.init();
    setIm(im as any);
    // im.send({
    //   message: location.href,
    // });
    im.on('message', (message: any) => {
      // alert(content.message);
      const content = message.content.content;
      const sendId = message.userId;
      const type = message.content.type;
      // let pc = this.cache.get(sendId);
      switch (type) {
        case 'Audition:start':
          console.log('12121212');
          getCssList();

          break;
        case 'Audition:end':
          setUnableEdit(true);
          break;
        case 'Audition:coding':
          setValue(content.value);
          break;
        case 'Audition:next':
          changeNext(content.currentIndex, content.auditionList, sendId);
          break;
        case 'Audition:prev':
          changePrev(content.currentIndex, content.auditionList, sendId);
          break;
        case 'Audition:answer':
          setAnswer(content.value);
          break;
        case 'Audition:selectShow':
          setSelectShow(true);
          break;
        case 'Audition:changeCodeType':
          changeCodeType(content.value);
          break;
        case 'Share:open':
          setShare(false);
          break;
        case 'Share:close':
          setShare(true);
          break;
      }
    });
    initWebRtc(im);
  };

  const judgeType = (item: any) => {
    console.log(item);
    let type = 0;
    if (!codeType) {
      if (item.cssId) {
        type = 0;
      } else {
        type = 1;
      }
    } else {
      if (codeType === 'js') {
        type = 2;
      } else if (codeType === 'vue') {
        type = 3;
      } else {
        type = 4;
      }
    }
    return type;
  };

  const updateAudition = (item: any, currentIndex: number) => {
    let type = judgeType(item);
    updateAuditionInfo({
      id: props.match.params.id,
      type, // css 0 excise 1 js 2 vue 3 react 4
      content: {
        ...((type === 0 || type === 1) && { currentIndex }),
      },
    }).then((res) => {});
  };

  const startAudition = () => {
    setAudition({
      id: props.match.params.id,
    }).then((res) => {
      const message = {
        type: 'Audition:start',
        content: {},
      };
      im.send(message);
      setAuditionStatus(1);
    });
  };

  const endAudition = () => {
    auditionEnd({
      id: props.match.params.id,
    }).then((res) => {
      const message = {
        type: 'Audition:end',
        content: {},
      };
      im.send(message);
    });
  };

  const initWebRtc = async (im: any) => {
    const constraints = {
      audio: false,
      video: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        const video = document.getElementById('1') as HTMLVideoElement;
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
        console.log('初始化rtc');
        setwebRtc(
          new WebRtc({
            im: im,
            userId: localStorage.getItem('userId') as string,
          }),
        );
      })
      .catch(function (err) {
        /* 处理error */
      });
  };
  useEffect(() => {
    initIm();
  }, []);

  useEffect(() => {
    queryAuditionDetail();
  }, []);

  // 获取面试详情
  const queryAuditionDetail = () => {
    getAuditionDetail({
      auditionId: props.match.params.id,
    }).then((res) => {
      console.log(localStorage.getItem('userId'));
      contentDetail = res.data.data.auditionInfo;
      setAuditionStatus(res.data.data.state);
      if (res.data.data.userId === localStorage.getItem('userId')) {
        setStatus('activeInterview');
        getCssList();
      } else {
        setStatus('unactiveInterview');
        if (res.data.data.state !== 0) {
          getCssList(res.data.data.state);
        }
      }
    });
  };
  const getCssList = (state?: number) => {
    getAuditionCssList({ auditionId: props.match.params.id }).then((res) => {
      let result = res.data.data || [];
      console.log(result);
      setAuditionList(result);
      if (state === 0) {
        // if(result.length > 0) {
        //   setPratise(result[0])
        //   getImg(result[0].cssId);
        //   queryDetail(result[0].cssId);
        // }
        updateAudition(result[0], 0);
      }
      getExciseList();
    });
  };

  const getExciseList = () => {
    getAuditionExerciseList({
      auditionId: props.match.params.id,
    }).then((res) => {
      let list = (res.data.data || []).map((item: any) => {
        item.exciseType = 'excise';
        return item;
      });
      setAuditionList((prevState) => [...prevState, ...list]);
      new Promise((resolve) => {
        setAuditionList((prevState) => {
          resolve([...prevState, ...list]);
          return [...prevState, ...list];
        });
      }).then((res: any) => {
        let currentIndex = 0;
        if (contentDetail.content) {
          currentIndex = contentDetail.content.currentIndex;
        }
        console.log(res, 'dfhhfjdhfdjfhjjjjj');
        console.log(currentIndex);
        setCurrentIndex(currentIndex);
        setPratise(res[currentIndex]);
        if (res[currentIndex].cssId) {
          getImg(res[currentIndex].cssId);
          queryDetail(res[currentIndex].cssId);
        } else {
          queryExciseDetail(res[currentIndex]);
        }
      });
    });
  };

  const getImg = (id: any) => {
    getImgDetail({ id }).then((res) => {
      setImgUrl(res.data.data.imgUrl);
      setColors(res.data.data.colors || []);
    });
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

  // const changeStyle = () => {
  //   if (checkType === 'iframe') {
  //     createIframe();
  //     drag();
  //   } else {
  //     createWebComp();
  //   }
  // };

  const confirmCode = () => {
    setLoading(true);
    console.log(currentPratise);
    if (currentPratise.cssId) {
      submitCss();
    } else {
      submitExcise();
    }
  };

  const submitCss = () => {
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

  const submitExcise = () => {
    let params = {
      name: currentPratise?.name,
      exerciseId: currentPratise?.id,
      userId: localStorage.getItem('userId'),
      answer: currentPratise.type === 1 ? answer : [answer],
      auditionId: props.match.params.id,
      type: currentPratise?.type,
    };
    exerciseSubmit(params)
      .then((res) => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const changeNext = (
    currentIndex: number,
    auditionList: any[],
    sendId?: string,
  ) => {
    if (currentIndex < auditionList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPratise(auditionList[currentIndex + 1]);
      if (auditionList[currentIndex + 1].cssId) {
        getImg(auditionList[currentIndex + 1].cssId);
        queryDetail(auditionList[currentIndex + 1].cssId, sendId);
      } else {
        queryExciseDetail(auditionList[currentIndex + 1], sendId);
      }
      updateAudition(auditionList[currentIndex + 1], currentIndex + 1);
    }
  };

  const queryExciseDetail = (item: any, sendId?: string) => {
    getExerciseDetail({
      exerciseId: item.id,
      userId: sendId || localStorage.getItem('userId'),
      auditionId: props.match.params.id,
    }).then((res) => {
      if (res.data.data.answer && res.data.data.answer.length > 0) {
        let answer =
          item.type === 1 ? res.data.data.answer : res.data.data.answer[0];
        setAnswer(answer);
      } else {
        let answer = item.type === 1 ? res.data.data.answer : '';
        setAnswer(answer);
      }
    });
  };

  const nextProblem = () => {
    const message = {
      type: 'Audition:next',
      content: {
        currentIndex,
        auditionList,
      },
    };
    im.send(message);
    changeNext(currentIndex, auditionList);
  };

  const prevProblem = () => {
    const message = {
      type: 'Audition:prev',
      content: {
        currentIndex,
        auditionList,
      },
    };
    im.send(message);
    changePrev(currentIndex, auditionList);
  };

  const changePrev = (
    currentIndex: number,
    auditionList: any[],
    sendId?: string,
  ) => {
    console.log(currentIndex, '0000000');
    if (currentIndex >= 1) {
      setCurrentIndex(currentIndex - 1);
      setPratise(auditionList[currentIndex - 1]);
      if (auditionList[currentIndex - 1].cssId) {
        getImg(auditionList[currentIndex - 1].cssId);
        queryDetail(auditionList[currentIndex - 1].cssId, sendId);
      } else {
        queryExciseDetail(auditionList[currentIndex - 1], sendId);
      }
      updateAudition(auditionList[currentIndex - 1], currentIndex - 1);
    }
  };

  const queryDetail = (id: any, sendId?: string) => {
    getAuditionIMGCompare({
      id,
      userId: sendId || localStorage.getItem('userId'),
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

  const handleChange = (value: string) => {
    const message = {
      type: 'Audition:changeCodeType',
      content: {
        value,
      },
    };
    im.send(message);
    changeCodeType(value);
  };

  const changeCodeType = (value: string) => {
    setCodeType(value);
    if (value === 'js') {
      setCodeValue(`<script>\n</script>`);
      setValue(`<script>\n</script>`);
    } else if (value === 'vue') {
      setCodeValue(
        `<script src=\"https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js\"></script>\n\n<div id=\"app\">\n  {{ message }}\n</div>\n<script>\nvar app = new Vue({\n  el: '#app',\n  data: {\n    message: 'Hello Vue!'\n  }\n})\n</script>`,
      );
      setValue(
        `<script src=\"https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js\"></script>\n\n<div id=\"app\">\n  {{ message }}\n</div>\n<script>\nvar app = new Vue({\n  el: '#app',\n  data: {\n    message: 'Hello Vue!'\n  }\n})\n</script>`,
      );
    }
  };

  const changeAnswer = (value: any) => {
    const message = {
      type: 'Audition:answer',
      content: {
        value,
      },
    };
    im.send(message);
    setAnswer(value);
  };

  // 显示自定义面试题下拉列表
  const changeSelectShow = () => {
    const message = {
      type: 'Audition:selectShow',
      content: {},
    };
    im.send(message);
    setSelectShow(true);
  };

  // 分享屏幕
  const shareScreen = () => {
    const message = {
      type: 'Share:open',
      content: {},
    };
    im.send(message);
    if (webRtc.share()) {
      setStuShare(false);
    }
  };
  // 分享屏幕
  const closeScreen = () => {
    const message = {
      type: 'Share:close',
      content: {},
    };
    im.send(message);
    setStuShare(true);
  };
  const runCode = () => {
    setIsRunCode(true);
  };

  return (
    <div className={styles.playEditor}>
      <div
        className={[styles.share, !isShare ? '' : styles.hide].join(' ')}
        id="share"
      ></div>
      <div className={[styles.playLeft, isShare ? '' : styles.hide].join(' ')}>
        <div className={styles.title}>
          <span className={styles.textTit}>
            {currentPratise &&
              (currentPratise.exciseType !== 'excise' ? '答案' : '面试题')}
          </span>
          <div>
            {interviewStatus === 'unactiveInterview' &&
              (codeType === 'js' || codeType === 'vue') && (
                <Button type="primary" onClick={runCode}>
                  run
                </Button>
              )}
            {selectShow && (
              <Select
                placeholder="选择代码类型"
                style={{ width: 150 }}
                onChange={handleChange}
                value={codeType}
                disabled={interviewStatus === 'activeInterview' ? false : true}
              >
                <Option value="js">原生js</Option>
                <Option value="vue">vue.js</Option>
                {/* <Option value="react">react.js</Option> */}
              </Select>
            )}
            {currentPratise && currentPratise.cssId && (
              <span className={styles.textTit}>字符数:{codeValue.length}</span>
            )}
          </div>
        </div>
        <div className={styles.leftContent}>
          {currentPratise &&
            (currentPratise.exciseType !== 'excise' ? (
              <CodeMirror
                value={
                  interviewStatus === 'activeInterview'
                    ? codeValue
                    : showCodeValue
                }
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
                  readOnly:
                    interviewStatus === 'activeInterview' || unableEdit
                      ? 'nocursor'
                      : false,
                  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                }} //end
                onChange={changeCode}
              />
            ) : (
              <Excise
                exciseItem={currentPratise}
                interviewStatus={interviewStatus}
                answer={answer}
                changeAnswer={changeAnswer}
              ></Excise>
            ))}
          <div className={styles.btnList}>
            {interviewStatus === 'unactiveInterview' ? (
              !unableEdit ? (
                <>
                  <Button
                    type="default"
                    onClick={prevProblem}
                    disabled={currentIndex === 0}
                  >
                    上一题
                  </Button>
                  <Button
                    type="primary"
                    onClick={nextProblem}
                    disabled={currentIndex === auditionList.length - 1}
                  >
                    下一题
                  </Button>
                  <Button
                    type="primary"
                    onClick={shareScreen}
                    className={isStuShare ? '' : styles.hide}
                  >
                    分享屏幕
                  </Button>
                  <Button
                    type="primary"
                    onClick={closeScreen}
                    className={!isStuShare ? '' : styles.hide}
                  >
                    关闭分享
                  </Button>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={confirmCode}
                  >
                    提交
                  </Button>
                </>
              ) : (
                <></>
              )
            ) : (
              <>
                {auditionStatus === 0 && (
                  <Button type="primary" onClick={startAudition}>
                    开始面试
                  </Button>
                )}
                <Button type="primary" onClick={changeSelectShow}>
                  自定义面试题
                </Button>
                <Button type="primary" onClick={nextProblem}>
                  收卷
                </Button>
                <Button type="primary" onClick={endAudition}>
                  结束面试
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={[styles.playRight, isShare ? '' : styles.hide].join(' ')}>
        <div className={[styles.title, styles.middle].join(' ')}>
          {currentPratise &&
            (currentPratise.exciseType === 'excise' ? (
              <span className={styles.textTit}>面试题描述</span>
            ) : (
              <>
                <span className={styles.textTit}>题目</span>
                {interviewStatus === 'unactiveInterview' &&
                auditionStatus === 0 ? (
                  <></>
                ) : (
                  <span className={styles.textTit}>图片大小400px x 300px</span>
                )}
              </>
            ))}
          {/* <span className={styles.textTit}>滑动&比较</span> */}
        </div>
        {interviewStatus === 'unactiveInterview' && auditionStatus === 0 ? (
          <div className={styles.rightContent}></div>
        ) : (
          currentPratise &&
          (currentPratise.exciseType === 'excise' ? (
            <div className={styles.rightContent}>
              {auditionList[currentIndex].describe}
            </div>
          ) : (
            <CssDetail
              imgUrl={imgUrl}
              colors={colors}
              score={score}
              match={match}
              codeValue={codeValue}
              isRunCode={isRunCode}
              codeType={codeType}
            ></CssDetail>
          ))
        )}
      </div>
      <div className={styles.playRight}>
        <div className={styles.title}>
          <span className={styles.textTit}>视频</span>
        </div>
        <div className={styles.rightContent}>
          <video className={styles.videoContent} id="1"></video>
          <Divider />
          <div className={styles.videoContent} id="2"></div>
        </div>
      </div>
    </div>
  );
};

export default Audition;
