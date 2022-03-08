import { FileAppend } from "../../FileExe.js";
import { Sun_bot } from "../../main.js";
import { Reply } from "../../Send.js";
import { App } from "../App.js";
import child_process from 'child_process';
import { FileBox } from 'file-box';

export { Wordcloud };
/*
[
  WechatifiedMessageImpl {
    _events: [Object: null prototype] {},
    _eventsCount: 0,
    _maxListeners: undefined,
    id: 'cl0chdqr500002wvqfci08lse',
    payload: {
      fromId: 'wxid_20q4ek5d8q9u22',
      id: 'cl0chdqr500002wvqfci08lse',
      roomId: '21636095289@chatroom',
      text: 'test',
      timestamp: 1646402234801,
      toId: '',
      type: 7
    },
    [Symbol(kCapture)]: false
  }
]
*/

class Wordcloud extends App {
  constructor () {
    super(2, "Wordcloud");
    this.InitFunc = undefined;
    this.ClockeventFunc = this.MessageStorage;
    this.ExecuteFunc = this.WordcloudParser;

    this.CurrentIndex = 0;
  }

  async MessageStorage () {
    var AllMes = await Sun_bot.Message.findAll();
    var len = Object.keys(AllMes).length;
    var ti;
    var st = 0;
    for (let i = this.CurrentIndex; i < len; ++i) {
      if (AllMes[i]?.payload?.type === 7 && AllMes[i]?.payload?.roomId != '') {
        ti = Math.floor(AllMes[i]?.payload?.timestamp / (1000 * 60 * 60 * 24));
        await FileAppend(AllMes[i]?.payload?.roomId + '.' + ti + '.txt', ' ' + AllMes[i]?.payload?.text);
        ++st;
      }
    }
    this.LogInfo(`Storage ${st} messages.`)
    this.CurrentIndex = len;
  }

  async ReplyWordcloud (msg) {
    if (null == await msg.room()) {
      Reply(msg, "Wordcloud is only available in a room.");
      return;
    }
    var ti = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    var roomid = await msg.room().id;
    var _command = `python ./src/App/Wordcloud/Wordcloud.py ./data/${roomid}.${ti}.txt ./data/${roomid}.${ti}.png`;
    try{
      child_process.execSync(_command);
      _command = `upgit ./data/${roomid}.${ti}.png`;
      child_process.exec(_command, (err, stdout, stderr) => {
        try {
          this.LogInfo(stdout);
          var file_box = FileBox.fromUrl(stdout);
          Reply(msg, file_box);
        } catch (e) { this.LogError(e); }
      });
    } catch (e) { this.LogError(e); }
  }

  async WordcloudParser (msg) {
    var text = await msg.text();
    if (text.length >= 9) {
      text = await text.toLowerCase();
      if (text.substring(0,9) === 'wordcloud') {
        this.ReplyWordcloud(msg);
      }
    }
  }
}