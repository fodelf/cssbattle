/*
 * @Description:
 * @version: 1.0.0
 * @Author: 吴文周
 * @Date: 2021-10-17 19:05:39
 * @LastEditors: 吴文周
 * @LastEditTime: 2021-10-19 13:02:06
 */
type WebRtcOptions = {
  im: any;
  userId: string;
};
class WebRtc {
  private im;
  private userId;
  private cache = new Map<string, any>();
  constructor(options: WebRtcOptions) {
    this.im = options.im;
    this.userId = options.userId;
    this.init();
  }
  public async init() {
    const message = {
      type: 'WebRtc:addRemote',
      content: {
        displayId: this.userId,
      },
    };
    this.im.send(message);
    console.log('初始化发送');
    this.im.on('message', async (mes: any) => {
      const content = mes.content.content;
      const sendId = mes.userId;
      const type = mes.content.type;
      switch (type) {
        case 'WebRtc:addRemote':
          if (!this.cache.get(sendId)) {
            const pc1 = await this.newPC(sendId);
            this.cache.set(sendId, pc1);
          }
          break;
        //监听到远程的offer//只处理自己设备的offer
        case 'WebRtc:RTCOffer':
          // if (content.displayId == displayId) {
          // 创建的时间可以自定义不一定在offer中创建
          let pc = this.cache.get(sendId);
          if (!this.cache.get(sendId)) {
            pc = await this.newPC(sendId);
            this.cache.set(sendId, pc);
            const rtcDescription = { type: 'offer', sdp: content.sdp };
            //设置远端setRemoteDescription
            pc.setRemoteDescription(
              new RTCSessionDescription(rtcDescription as any),
            );
          }
          //createAnswer
          const offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
          };
          pc.createAnswer(offerOptions).then(
            (offer: any) => {
              pc.setLocalDescription(offer);
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
          if (this.cache.get(sendId)) {
            this.cache
              .get(sendId)
              .addIceCandidate(rtcIceCandidate)
              .then(() => {
                console.log('连上了');
              })
              .catch((e: any) => {
                console.log('Error: Failure during addIceCandidate()', e);
              });
            // }
          }
          break;
        case 'WebRtc:RTCAnswer':
          const rtcDescription1 = { type: 'answer', sdp: content.sdp };
          //设置远端setRemoteDescription
          var pc2 = this.cache.get(sendId);
          pc2.setRemoteDescription(
            new RTCSessionDescription(rtcDescription1 as any),
          );
      }
    });
  }
  public async newPC(userId: string) {
    const config = {
      configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      iceServers: [
        {
          urls: 'turn:110.42.220.32:3478',
          username: 'admin',
          credential: '123456',
        },
      ],
      // iceTransportPolicy: 're',
    } as any;
    const pc = new RTCPeerConnection(config) as any;
    // this.cache.set(userId, pc);
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
    // pc.onnegotiationneeded = (e: any) => {
    //   console.log('onnegotiationneeded', e);
    // };
    // pc.onicegatheringstatechange = (e: any) => {
    //   console.log('onicegatheringstatechange', e);
    // };
    // pc.oniceconnectionstatechange = (e: any) => {
    //   console.log('oniceconnectionstatechange', e);
    // };
    // pc.onsignalingstatechange = (e: any) => {
    //   console.log('onsignalingstatechange', e);
    // };
    // pc.ontrack = (e: any) => {
    // console.log('ontrack', e);
    // const video = document.getElementById('2') as HTMLVideoElement;
    // debugger;
    // video.srcObject = e.streams[0];
    // video.play();
    // video.onloadedmetadata = (e) => {
    //   video.play();
    // };
    // };

    pc.onaddstream = (e: any) => {
      console.log('渲染视频', e);
      var video = document.getElementById('2') as HTMLVideoElement;
      video.srcObject = e.stream;
      video.play();
      // video.onloadedmetadata = function (e) {
      //   video.play();
      // };
    };
    // console.log("onaddstream", e);
    // const video = document.getElementById('2') as HTMLVideoElement;
    // video.srcObject = e.stream;
    // video.play();
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    // debugger;
    // };
    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    } as any;
    const constraints = {
      audio: {
        noiseSuppression: true, // 降噪
        echoCancellation: true, // 回音消除
      },
      video: true,
    };
    // const constraints = {
    //   audio: true,
    //   video: true,
    // };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    // const video = document.getElementById('1') as HTMLVideoElement;
    // video.srcObject = stream;
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    pc.addStream(stream);
    // 创建offer
    const offer = await pc.createOffer(offerOptions);
    // 设置本地
    await pc.setLocalDescription(offer);
    // 发送offer
    const mes = {
      type: 'WebRtc:RTCOffer',
      content: {
        sdp: offer.sdp,
      },
    };
    this.im.send(mes);
    return pc;
  }
}

export default WebRtc;
