import { FileBox } from "file-box";
import { ADMIN_WXID } from "../../config.js";
import { FileReadJSON, FileWriteJSON } from "../../FileExe.js";
import { isRoom } from "../../Message.js";
import { Reply, Send, SendRoomMessage } from "../../Send.js";
import { App } from "../App.js";
import { EnrollAskWord, EnrollReply, EnrollWord } from "./EnrollWords.js";
import { Sun_bot } from "../../main.js";

export { EnrollHelper };

class EnrollHelper_EnrollRoom {
  constructor (_room, _university, _allowReply, _allowClockevent) {
    this.room = _room;
    this.university = _university;
    this.allowReply = _allowReply;
    this.allowClockevent = _allowClockevent;
    this.lastSendTime = 0;
  }
}

const EnrollHelperClockTime = [
  {
    h: 10,
    min: 0,
  },
  {
    h: 17,
    min: 30,
  },
  {
    h: 20,
    min: 30,
  },
];

class EnrollHelper extends App {
  constructor () {
    super(5, "EnrollHelper");
    this.InitFunc = this.EnrollHelperInit;
    this.ClockeventFunc = this.EnrollClockSend;
    this.ExecuteFunc = this.EnrollHelperFunc;

    this.imgArray = new Array();
    this.EnrollRoomStorageFile = "EnrollRoom.json";
    this.EnrollRoom = undefined;
  }

  async EnrollRoomUpdate() {
    await FileWriteJSON(this.EnrollRoomStorageFile, this.EnrollRoom);
    this.LogInfo(`Enroll Room Updated.`);
  }

  async EnrollHelperInit() {
    this.EnrollRoom = await FileReadJSON(this.EnrollRoomStorageFile);
    if (!this.EnrollRoom) {
      this.EnrollRoom = new Array();
    }

    EnrollReply.forEach((obj) => {
      obj.reply.forEach((rep) => {
        var FailedTrial;
        var img;
        var err;
        if (rep.type == "url") {
          FailedTrial = 0;
          for (img = undefined; !img && FailedTrial <= 10; ++FailedTrial) try {
            img = FileBox.fromUrl(rep.content);
          } catch (e) { err = e; }
          if (!img) throw new Error(`[EnrollHelper] Failed to load ${obj.university}.${rep?.img_index} img. url = ${rep.content}, error = ${err}.`);
          this.imgArray[rep?.img_index] = img;
        }
      });
    });
  }

  async EnrollHelperControl(msg) {
    if (await msg.talker().id != ADMIN_WXID) return false;
    if (!await isRoom(msg)) return false;
    // enroll "set"|"rm" name:string [allowClockEvent:boolean(default:true)]
    var text = await msg.text();
    var cmd = text
      .toLowerCase()
      .split(" ")
      .filter((s) => {
        return s && s != '';
      });
    if (cmd[0] != "enroll") return false;
    console.log(text, cmd);
    if (!cmd[1] || !cmd[2]) {
      await Reply(msg, `Failed. Command invalid.`)
      return false;
    }
    var room = await msg.room().id;
    var allowRep;
    if (cmd[1] == "set") allowRep = true;
    else if (cmd[1] == "rm") allowRep = false;
    else {
      await Reply(msg, `Failed. Command invalid.`)
      return false;
    }
    var allowCE = true;
    if ((cmd[3] && cmd[3] != "true") || !allowRep) allowCE = false;
    var upd = false;
    this.EnrollRoom.forEach((obj, ind) => {
      if (obj.room == room && obj.university == cmd[2]) {
        this.EnrollRoom[ind].allowReply = allowRep;
        if ((cmd[1] == "set" && cmd[3]) || cmd[1] == "rm") this.EnrollRoom[ind].allowClockevent = allowCE;
        upd = true;
      }
    });
    if (!upd) this.EnrollRoom.push(new EnrollHelper_EnrollRoom(room, cmd[2], allowRep, allowCE));
    await this.EnrollRoomUpdate();
    if (cmd[1] == "set") {
      await Reply(msg, `OK. Successfully set "${cmd[2]}" in this group.`);
      EnrollReply.forEach(async (obj) => {
        if (obj.university == cmd[2]) {
          await this.EnrollHelperSend(obj.reply, msg);
        }
      });
    } else if (cmd[1] == "rm") {
      await Reply(msg, `OK. Successfully removed "${cmd[2]}" in this group.`);
    }
    return true;
  }

  async EnrollHelperSend(obj, msg, is_Room_Class) {
    var content;
    obj.forEach(async (rep) => {
      if (rep.type === "url") {
        content = this.imgArray[rep?.img_index];
      } else if (rep.type === "text") {
        content = rep.content;
      }
      // if (is_Room_Class) await Send(msg, content, false);
      // else await Reply(msg, content);
      await SendRoomMessage(msg, content);
    });
  }

  async EnrollHelperFunc(msg) {
    if (await this.EnrollHelperControl(msg)) return;
    if (!await isRoom(msg)) return;
    var text = await msg.text();
    var room = await msg?.room().id;
    var ok1 = false, ok2 = false, ok3;
    EnrollWord.forEach((word) => {
      if (text.indexOf(word) > -1) ok1 = true;
    });
    EnrollAskWord.forEach((word) => {
      if (text.indexOf(word) > -1) ok2 = true;
    });
    if (!ok2) return;
    var now = (new Date()) - 0;
    const DeltaTime = 1000 * 60 * 10;
    this.EnrollRoom.forEach(async (obj, ind) => {
      if (obj.allowReply && obj.lastSendTime + DeltaTime < now && room == obj.room) {
        EnrollReply.forEach(async (_obj) => {
          if (_obj.university == obj.university) {
            ok3 = false;
            _obj.keywords.forEach(async (word) => {
              if (text.indexOf(word) > -1) ok3 = true;
            })
            console.log(ok3, ok1, text);
            if (!ok3 && !ok1) return;
            this.EnrollRoom[ind].lastSendTime = now;
            await this.EnrollHelperSend(_obj.reply, msg);
          }
        });
      }
    });
    await this.EnrollRoomUpdate();
  }
  
  async EnrollClockSend() {
    var now = new Date();
    var h = now.getHours();
    var min = now.getMinutes();
    var ok = false;
    const DeltaTime = 1000 * 60 * 10;
    EnrollHelperClockTime.forEach((time) => {
      if (time.h == h && Math.abs(min - time.min) <= 2) ok = true;
    });
    if (!ok) return;
    this.EnrollRoom.forEach(async (obj, ind) => {
      if (!obj.allowClockevent || !obj.allowReply) return;
      if (obj.lastSendTime + DeltaTime > now) return;
      var _room = await Sun_bot.Room.load(obj.room);
      console.log(_room, await _room.topic());
      EnrollReply.forEach(async (_obj) => {
        if (_obj.university == obj.university) {
          await this.EnrollHelperSend(_obj.reply, _room, true);
          this.EnrollRoom[ind].lastSendTime = now - 0;
        }
      });
    });
    this.EnrollRoomUpdate();
  }
}
