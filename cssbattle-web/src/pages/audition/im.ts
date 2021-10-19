type IMOptions = {
  userId: string;
  roomId: string;
};
class IM {
  public userId;
  private roomId;
  private joinUrl = 'cssbattle.wuwenzhou.com.cn:9529';
  private Socket: any;
  private callbackList: any = [];
  constructor(options: IMOptions) {
    this.userId = options.userId;
    this.roomId = options.roomId;
  }
  public async init() {
    const url = `https://cssbattle.wuwenzhou.com.cn:9529/api/v1/im/join`;
    const data = {
      userId: this.userId,
      roomId: this.roomId,
    };
    await fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
    })
      .then((response) => response.json())
      .then(function (myJson) {
        console.log(myJson);
      })
      .catch((err) => {
        console.log(err);
      });
    await this.initSocket();
  }
  private initSocket() {
    return new Promise((resolve, reject) => {
      const url = `wss://cssbattle.wuwenzhou.com.cn:9529/api/v1/im/message?roomId=${this.roomId}&userId=${this.userId}`;
      //   const url = `ws://110.42.220.32:952/api/v1/im/message`;
      this.Socket = new WebSocket(url);
      this.Socket.onopen = function () {
        console.log('链接成功');
        resolve('ok');
      };
      this.Socket.onerror = function () {
        console.log('链接失败');
        reject('error');
      };
      this.Socket.onmessage = async (event: any) => {
        const data = event.data;
        // console.log('接收消息', data);
        // debugger;
        for (let i = 0; i < this.callbackList.length; i++) {
          let item = this.callbackList[i];
          await item(JSON.parse(data));
        }
        // this.callbackList.forEach((item: any) => {
        //   item(JSON.parse(data));
        // });
      };
    });
  }
  send(mes: any) {
    // console.log('发送消息', mes);
    this.Socket.send(
      JSON.stringify({
        Cmd: 1,
        userId: this.userId,
        roomId: this.roomId,
        content: mes,
      }),
    );
  }
  on(type: string, callback: any) {
    this.callbackList.push(callback);
  }
  private join() {}
}

export default IM;
