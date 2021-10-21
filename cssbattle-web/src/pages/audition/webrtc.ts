/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-17 19:05:39
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-21 09:04:49
 */
type WebRtcOptions = {
  im: any;
  userId: string;
  ownerId: string;
};
class WebRtc {
  private im;
  private userId;
  private pc: any;
  private cache = new Map<string, any>();
  constructor(options: WebRtcOptions) {
    this.im = options.im;
    this.userId = options.userId;
    // this.ownerId = options.ownerId;
    this.init();
  }
  public async init() {
    await this.newPC('1634737217616');
    const message = {
      type: 'WebRtc:call',
      content: {
        displayId: this.userId,
      },
    };
    this.im.send(message);
    // console.log('初始化发送');
    // this.pc = await this.newPC(this.userId);
    // this.cache.set(sendId, pc1);
    this.im.on('message', async (mes: any) => {
      const content = mes.content.content;
      const sendId = mes.userId;
      const type = mes.content.type;
      // let pc = this.cache.get(sendId);
      switch (type) {
        case 'WebRtc:call':
          await this.newPC(`${this.userId}_${sendId}`);
          // await this.newPC(`${sendId}_${this.userId}`, 'call');
          const message = {
            type: 'WebRtc:replay',
            content: {
              displayId: this.userId,
            },
          };
          this.im.send(message);
          break;
        case 'WebRtc:replay':
          await this.newPC(`${this.userId}_${sendId}`);
          await this.newPC(`${sendId}_${this.userId}`, 'call');
          const message1 = {
            type: 'WebRtc:replayBack',
            content: {
              displayId: this.userId,
            },
          };
          this.im.send(message1);
          break;
        case 'WebRtc:replayBack':
          await this.newPC(`${sendId}_${this.userId}`, 'call');
          // await this.newPC(`${sendId}_${sendId}`, 'replay');
          break;
        case 'WebRtc:addRemote':
          // await this.newPC(`${this.userId}_${mes.userId}`, false);
          // await this.newPC(sendId, true);
          // if (!this.cache.get(sendId)) {
          // const message = {
          //   type: 'WebRtc:addRemote',
          //   content: {
          //     displayId: this.userId,
          //   },
          // };
          // this.im.send(message);
          // const pc1 = await this.newPC(sendId, true);
          // this.cache.set(sendId, pc1);
          // }
          break;
        //监听到远程的offer//只处理自己设备的offer
        case 'WebRtc:RTCOffer':
          // if (content.displayId == displayId) {
          // 创建的时间可以自定义不一定在offer中创建
          // debugger;
          let pcRTCOffer = this.cache.get(`${this.userId}_${sendId}`);
          const rtcDescription = { type: 'offer', sdp: content.sdp };
          console.log('sendId----------', sendId);
          //设置远端setRemoteDescription
          pcRTCOffer.setRemoteDescription(
            new RTCSessionDescription(rtcDescription as any),
          );
          //createAnswer
          const offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
          };
          pcRTCOffer.createAnswer(offerOptions).then(
            async (offer: any) => {
              pcRTCOffer.setLocalDescription(offer);
              //发送answer消息
              const mes = {
                type: 'WebRtc:RTCAnswer',
                content: {
                  displayId: sendId,
                  sdp: offer.sdp,
                },
              };
              this.im.send(mes);
            },
            (error: any) => {
              console.log(error);
            },
          );
          break;
        case 'WebRtc:RTCOnicecandidate':
          // if (content.displayId == displayId) {
          const rtcIceCandidate = new RTCIceCandidate({
            candidate: content.sdp,
            sdpMid: content.sdpMid,
            sdpMLineIndex: content.sdpMLineIndex,
          });
          //添加对端Candidate
          let pcRTCOnicecandidate = this.cache.get(`${this.userId}_${sendId}`);
          if (pcRTCOnicecandidate) {
            pcRTCOnicecandidate
              .addIceCandidate(rtcIceCandidate)
              .then(async () => {
                console.log('连上了');
              })
              .catch((e: any) => {
                console.log('Error: Failure during addIceCandidate()', e);
              });
          }
          break;
        case 'WebRtc:RTCAnswer':
          const rtcDescription1 = { type: 'answer', sdp: content.sdp };
          //设置远端setRemoteDescription
          // debugger;
          // var pc2 = this.cache.get(sendId);
          let pcRTCAnswer = this.cache.get(`${sendId}_${this.userId}`);
          pcRTCAnswer.setRemoteDescription(
            new RTCSessionDescription(rtcDescription1 as any),
          );
        // await this.newPC('Y5rYyGCecPy7');
        // const message = {
        //   type: 'WebRtc:addRemote',
        //   content: {
        //     displayId: this.userId,
        //   },
        // };
        // this.im.send(message);
        // const message = {
        //   type: 'WebRtc:addRemote',
        //   content: {
        //     displayId: this.userId,
        //   },
        // };
        // this.im.send(message);
      }
    });
  }
  public async newPC(sendId: string, newWithOffer?: string) {
    const config = {
      configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      iceServers: [
        {
          urls: ['turn:110.42.220.32:3478'],
          username: 'admin',
          credential: '123456',
        },
      ],
      // iceTransportPolicy: 'relay',
      // iceCandidatePoolSize: '0',
      // iceTransportPolicy: 're',
    } as any;
    const pc = new RTCPeerConnection(config) as any;
    if (newWithOffer == 'call') {
      const offerOptions1 = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      } as any;
      const offer = await pc.createOffer(offerOptions1);
      // 设置本地
      await pc.setLocalDescription(offer);
      const mes = {
        type: 'WebRtc:RTCOffer',
        content: {
          sdp: offer.sdp,
        },
      };
      this.im.send(mes);
      pc.onicecandidate = (event: any) => {
        // 点对点链接
        if (event.candidate) {
          const mes = {
            type: 'WebRtc:RTCOnicecandidate',
            content: {
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdp: event.candidate.candidate,
            },
          };
          this.im.send(mes);
        }
      };
    }
    // const constraints = {
    //   audio: true,
    //   video: true,
    // };
    // 发送offer
    // }
    // this.cache.set(userId, pc);

    pc.onnegotiationneeded = (e: any) => {
      console.log('onnegotiationneeded', e);
    };
    pc.onicegatheringstatechange = (e: any) => {
      console.log('onicegatheringstatechange', e);
    };
    pc.oniceconnectionstatechange = (e: any) => {
      console.log('oniceconnectionstatechange', e);
    };
    pc.onsignalingstatechange = (e: any) => {
      console.log('onsignalingstatechange', e);
    };
    pc.ontrack = (e: any) => {
      console.log('ontrack', e);
    };
    pc.onaddstream = (e: any) => {
      console.log('渲染视频', e);
      var video = document.getElementById('2') as HTMLVideoElement;
      video.srcObject = e.stream;
      // video.play();
      video.onloadedmetadata = function (e) {
        video.play();
      };
    };
    const constraints = {
      audio: {
        noiseSuppression: true, // 降噪
        echoCancellation: true, // 回音消除
      },
      video: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // const video = document.getElementById('1') as HTMLVideoElement;
    // video.srcObject = stream;
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    pc.addStream(stream);
    this.cache.set(sendId, pc);
    // console.log("onaddstream", e);
    // const video = document.getElementById('2') as HTMLVideoElement;
    // video.srcObject = e.stream;
    // video.play();
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    // debugger;
    // };
    // if (isAddRemote) {
    //   // 创建offer
    //   const offer = await pc.createOffer(offerOptions);
    //   // 设置本地
    //   await pc.setLocalDescription(offer);
    //   const mes = {
    //     type: 'WebRtc:RTCOffer',
    //     content: {
    //       sdp: offer.sdp,
    //     },
    //   };
    //   this.im.send(mes);
    // }
    return pc;
  }
  public async newPC1(sendId: string, newWithOffer?: boolean) {
    const config = {
      configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      iceServers: [
        {
          urls: ['turn:110.42.220.32:3478'],
          username: 'admin',
          credential: '123456',
        },
      ],
      // iceTransportPolicy: 'relay',
      // iceCandidatePoolSize: '0',
      // iceTransportPolicy: 're',
    } as any;
    const pc = new RTCPeerConnection(config) as any;
    if (newWithOffer) {
      const offerOptions1 = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      } as any;
      const offer = await pc.createOffer(offerOptions1);
      // 设置本地
      await pc.setLocalDescription(offer);
      const mes = {
        type: 'WebRtc:RTCOffer1',
        displayId: sendId,
        content: {
          sdp: offer.sdp,
        },
      };
      this.im.send(mes);
    }
    // const constraints = {
    //   audio: true,
    //   video: true,
    // };
    // 发送offer
    // }
    // this.cache.set(userId, pc);
    pc.onicecandidate = (event: any) => {
      // 点对点链接
      if (event.candidate) {
        const mes = {
          type: 'WebRtc:RTCOnicecandidate',
          displayId: sendId,
          content: {
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdp: event.candidate.candidate,
          },
        };
        this.im.send(mes);
      }
    };
    pc.onnegotiationneeded = (e: any) => {
      console.log('onnegotiationneeded', e);
    };
    pc.onicegatheringstatechange = (e: any) => {
      console.log('onicegatheringstatechange', e);
    };
    pc.oniceconnectionstatechange = (e: any) => {
      console.log('oniceconnectionstatechange', e);
    };
    pc.onsignalingstatechange = (e: any) => {
      console.log('onsignalingstatechange', e);
    };
    pc.ontrack = (e: any) => {
      console.log('ontrack', e);
    };
    pc.onaddstream = (e: any) => {
      console.log('渲染视频', e);
      var video = document.getElementById('2') as HTMLVideoElement;
      video.srcObject = e.stream;
      // video.play();
      video.onloadedmetadata = function (e) {
        video.play();
      };
    };
    const constraints = {
      audio: {
        noiseSuppression: true, // 降噪
        echoCancellation: true, // 回音消除
      },
      video: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // const video = document.getElementById('1') as HTMLVideoElement;
    // video.srcObject = stream;
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    pc.addStream(stream);
    this.cache.set(sendId, pc);
    // console.log("onaddstream", e);
    // const video = document.getElementById('2') as HTMLVideoElement;
    // video.srcObject = e.stream;
    // video.play();
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    // debugger;
    // };
    // if (isAddRemote) {
    //   // 创建offer
    //   const offer = await pc.createOffer(offerOptions);
    //   // 设置本地
    //   await pc.setLocalDescription(offer);
    //   const mes = {
    //     type: 'WebRtc:RTCOffer',
    //     content: {
    //       sdp: offer.sdp,
    //     },
    //   };
    //   this.im.send(mes);
    // }
    return pc;
  }
}

export default WebRtc;
