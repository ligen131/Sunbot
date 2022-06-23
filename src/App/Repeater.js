import { isRoom } from "../Message.js";
import { Reply } from "../Send.js";
import { App } from "./App.js";

export { Repeater };

class Repeater_CacheWord {
  constructor (_roomid, _text, _RepeatNum) {
    this.roomid = _roomid;
    this.text = _text;
    this.RepeatNum = _RepeatNum;
  }
}

class Repeater extends App {
  constructor () {
    super(6, "Repeater");
    this.InitFunc = undefined;
    this.ClockeventFunc = undefined;
    this.ExecuteFunc = this.Repeat;
    
    this.RepeatNum = 4;
    this.CacheWord = new Array();
  }
  
  async Repeat(msg) {
    if (!isRoom(msg)) return;
    var roomid = await msg.room().id;
    var text = await msg.text();
    var ok = false;
    this.CacheWord.forEach((obj, ind) => {
      if (obj.roomid == roomid) {
        ok = true;
        if (obj.text == text) this.CacheWord[ind].RepeatNum++;
        else {
          this.CacheWord[ind].RepeatNum = 1;
          this.CacheWord[ind].text = text;
        }
        if (obj.RepeatNum == this.RepeatNum) {
          this.CacheWord[ind].RepeatNum = 0;
          await Reply(msg, text);
        }
      }
      if (!ok) {
        this.CacheWord.push(Repeater_CacheWord(roomid, text, 1));
      }
    })
  }

}