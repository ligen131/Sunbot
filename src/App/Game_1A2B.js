import { FileReadJSON, FileWriteJSON } from "../FileExe.js";
import { rand, TimeParser } from "../Random.js";
import { Reply } from "../Send.js";
import { App } from "./App.js";

export { Game_1A2B };

class Game_1A2B_Stat {
  constructor (_name, _wxid, _Time, _FinishTime, _Attempt, _Answer) {
    this.name = _name;
    this.wxid = _wxid;
    this.Time = _Time;
    this.FinishTime = _FinishTime;
    this.Attempt = _Attempt;
    this.Answer = _Answer;
  }
}

class Game_1A2B extends App {
  constructor () {
    super(3, "Game_1A2B");
    this.InitFunc = this.GameStatRead;
    this.ClockeventFunc = undefined;
    this.ExecuteFunc = this.Game;

    this.RunningGames = new Array();
    this.GameStat = undefined;
    this.GameStorageFile = "Game_1A2B.json"
    this.GameDictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.GameAnsLen = 4;
    this.GameAnsLetterRepeatable = false;
  }

  async GameStatAppend (obj) {
    this.GameStat.push(obj);
    await FileWriteJSON(this.GameStorageFile, this.GameStat);
    this.LogInfo("Game storaged.")
  }

  async GameStatRead () {
    this.GameStat = await FileReadJSON(this.GameStorageFile, this.GameStorageFile);
    if (undefined == this.GameStat) {
      this.GameStat = new Array();
    }
  }

  async RandGame () {
    var ans = "";
    var dicLen = this.GameDictionary.length;
    for (let i = 0; i < this.GameAnsLen; ++i) {
      let x = await rand(0, dicLen);
      while (!this.GameAnsLetterRepeatable && ans.includes(this.GameDictionary.substring(x, x + 1))) {
        x = await rand(0, dicLen);
      }
      ans += this.GameDictionary.substring(x, x + 1);
    }
    return ans;
  }

  async Game (msg) {
    var isRunning = false;
    var nowGame = undefined;
    var _fromId = await msg?.talker()?.id;
    var _from = await msg?.talker()?.name();
    var text = await msg?.text();
    var ans = undefined;
    var nowTime = Date.now();
    var nowGameIndex;
    if (text.length != this.GameAnsLen) return;
    for (let i in this.RunningGames) {
      if (this.RunningGames[i]?.wxid == _fromId) {
        isRunning = true;
        ++this.RunningGames[i].Attempt;
        nowGame = this.RunningGames[i];
        nowGameIndex = i;
        break;
      }
    }
    if (!isRunning && text == '1A2B') {
      ans = await this.RandGame();
      this.RunningGames.push({ wxid: _fromId, Attempt: 0, StartTime: nowTime, Answer: ans});
      Reply(msg, `[1A2B ${_from}]Game started. You can guess by sending ${this.GameAnsLen} characters (including numbers and upper case letters only) each time.`);
      this.LogInfo(`A new game started by ${_from}(${_fromId}). Answer = ${ans}.`);
    }
    if (!isRunning) return;
    ans = nowGame.Answer;
    if (text == ans) {
      var StatObj = new Game_1A2B_Stat(_from, _fromId, nowTime - nowGame.StartTime, nowTime, nowGame.Attempt, ans);
      var Ti = TimeParser(StatObj.Time);
      Reply(msg, `[1A2B ${_from}]Congratulation! Your answer is correct. Use time: ${Ti}. Attempts: ${StatObj.Attempt}.`);
      this.RunningGames.splice(nowGame, 1);
      this.GameStatAppend(StatObj);
      return;
    }
    var _A = 0, _B = 0;
    for (let i = 0; i < this.GameAnsLen; ++i) {
      if (!this.GameDictionary.includes(text.substring(i, i + 1))) {
        --this.RunningGames[nowGameIndex].Attempt;
        Reply(msg, `[1A2B ${_from}]You may send an invalid string.`);
        return;
      }
      if (ans.substring(i, i + 1) == text.substring(i, i + 1)) {
        ++_A;
      } else if (ans.includes(text.substring(i, i + 1))) {
        ++_B;
      }
    }
    Reply(msg, `[1A2B ${_from}]${_A}A${_B}B`);
  }
}