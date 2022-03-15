import { FileAppend } from "../../FileExe.js";
import { Sun_bot } from "../../main.js";
import { Reply } from "../../Send.js";
import { App } from "../App.js";
import child_process from 'child_process';
import { FileBox } from 'file-box';
import { isRoom } from "../../Message.js";
import { sleep } from "../../Random.js";
import { existsSync } from "fs";

export { Wordcloud };

class GroupMessage {
  constructor (_room, _date, _text) {
    this.room = _room;
    this.date = _date;
    this.text = _text;
  }
}

class Wordcloud extends App {
  constructor () {
    super(2, "Wordcloud");
    this.InitFunc = undefined;
    this.ClockeventFunc = this.MessageCacheStorage;
    this.ExecuteFunc = this.WordcloudParser;

    this.MessageCache = new Array();
    this.MessageCacheLock = false;
  }

  async AddMessageCache (gmsg) {
    for (var i in this.MessageCache) {
      if (this.MessageCache[i].room === gmsg.room && this.MessageCache[i].date === gmsg.date) {
        this.MessageCache[i].text += ' ' + gmsg.text;
        return;
      }
    }
    this.MessageCache.push(gmsg);
  }

  async MessageCacheStorage () {
    this.MessageCacheLock = true;
    for (var i in this.MessageCache) {
      FileAppend(this.MessageCache[i].room + '.' + this.MessageCache[i].date + '.txt', this.MessageCache[i].text);
    }
    this.MessageCache.length = 0;
    this.MessageCacheLock = false;
  }

  async ReplyWordcloud (msg) {
    if (!isRoom(msg)) {
      Reply(msg, "Wordcloud is only available in a room.");
      return;
    }
    var _date = new Date();
    var _month = _date.getMonth() + 1;
    var date = _date.getFullYear() + "." + _month + "." + _date.getDate();
    var roomid = await msg.room().id;
    var fileExist = existsSync(`./data/${roomid}.${date}.txt`);
    if (!fileExist) {
      Reply(msg, "No message cached yet. Wordcloud failed to generate.");
      return;
    }
    var _command = `python ./src/App/Wordcloud/Wordcloud.py ./data/${roomid}.${date}.txt ./data/${roomid}.${date}.png`;
    try{
      child_process.execSync(_command);
      _command = `upgit ./data/${roomid}.${date}.png`;
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
    if (isRoom(msg) && await msg.type() === Sun_bot.Message.Type.Text) {
      var roomid = await msg.room().id;
      var date = await msg.date();
      var _month = date.getMonth() + 1;
      var _date = date.getFullYear() + "." + _month + "." + date.getDate();
      var gmsg = new GroupMessage(roomid, _date, text);
      while(this.MessageCacheLock) await sleep(1000);
      this.AddMessageCache(gmsg);
    }
  }
}