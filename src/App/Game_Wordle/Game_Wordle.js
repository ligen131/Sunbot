import { ADMIN_WXID } from "../../config.js";
import { FileReadJSON, FileWriteJSON } from "../../FileExe.js";
import { isRoom } from "../../Message.js";
import { Reply } from "../../Send.js";
import { App } from "../App.js";
import { VALID_GUESSES } from "./validGuesses.js";
import { WORDS } from "./wordlist.js";

export { Game_Wordle };

class Game_Wordle_Stat {
  constructor (_name, _wxid, _roomid, _answer, _user_answer, _trial) {
    this.name = _name;
    this.wxid = _wxid;
    this.roomid = _roomid;
    this.answer = _answer;
    this.user_answer = _user_answer;
    this.trial = _trial;
  }
}

const WORDLE_WRONG_WORD = "⬛";
const WORDLE_WRONG_PLACE = "🟨";
const WORDLE_CORRECT = "🟩";
const WORDLE_ALL_CORRECT = "🟩🟩🟩🟩🟩";

class Game_Wordle extends App {
  constructor () {
    super(4, "Game_Wordle");
    this.InitFunc = this.GameStatRead;
    this.ClockeventFunc = undefined;
    this.ExecuteFunc = this.Game;

    this.Rule = `Rule: Every day has a different word and one people can guess only one time per day. For common wordle rule, please visit https://wd.ligen131.com\nHow to guess: send "wordle[words]".`;
    this.GameStat = undefined;
    this.GameStorageFile = "Game_Wordle.json";
    this.WordLen = 5;
  }

  async GameStatAppend (obj) {
    this.GameStat.push(obj);
    await FileWriteJSON(this.GameStorageFile, this.GameStat);
    this.LogInfo("Game storaged.")
  }

  async GameStatRead () {
    this.GameStat = await FileReadJSON(this.GameStorageFile);
    if (undefined == this.GameStat) {
      this.GameStat = new Array();
    }
  }

  async GetTodayWord (msg) {
    const now = Date.now() + 8 * 1000 * 60 * 60;
    const msInDay = 86400000;
    const _roomid = await msg?.room()?.id;
    var roomid = parseInt(_roomid);
    const index = Math.floor(now / msInDay) % WORDS.length * roomid % WORDS.length;
    this.LogInfo(`In ${_roomid} ${now} ${Math.floor(now / msInDay)} ${index} ${WORDS[index]}`);
    return WORDS[index];
  }

  async GetDiff (answer, user_answer) {
    var text = "";
    var x, y;
    for (var i = 0; i < this.WordLen; ++i) {
      x = await answer.substring(i, i + 1);
      y = await user_answer.substring(i, i + 1);
      if (x === y) text += WORDLE_CORRECT;
      else if (answer.indexOf(y) >= 0) text += WORDLE_WRONG_PLACE;
      else text += WORDLE_WRONG_WORD;
    }
    return text;
  }

  async Game (msg) {
    var user_answer = undefined;
    var text = await msg.text();
    var reply_text = "Wordle\n";
    var stat_text = "";
    var answer = "";
    var roomid;
    var wxid = await msg?.talker()?.id;
    var name = await msg?.talker()?.name();
    var have_guess = 0;
    var result;
    var have_finished = false;
    var user_have_guess = false;
    var isValid = undefined;
    if (text.length >= 6) {
      text = await text.toLowerCase();
      if (await text.substring(0, 6) === "wordle") {
        if (!await isRoom(msg)) {
          Reply(msg, "Wordle is only available in a group.");
          return;
        }
        roomid = await msg?.room()?.id;
        answer = await this.GetTodayWord(msg);

        stat_text = "Today Status: \n";
        for (var i in this.GameStat) if (this.GameStat[i].answer === answer && this.GameStat[i].roomid === roomid) {
          if (have_guess) stat_text += "\n\n";
          result = await this.GetDiff(answer, this.GameStat[i].user_answer);
          stat_text += `${this.GameStat[i].trial}. ${this.GameStat[i].name}\n${this.GameStat[i].user_answer}\n${result}`;
          ++have_guess;
          if (result === WORDLE_ALL_CORRECT) have_finished = true;
          if (this.GameStat[i].wxid === wxid) user_have_guess = true;
        }

        if (text.length >= 12) {
          // wordle[78901]
          user_answer = text.substring(7, 12);
        }
        if (user_answer === undefined) reply_text += this.Rule;
        else if (have_finished) reply_text += "Wordle has been finished today.";
        else if (user_have_guess && (true || wxid != ADMIN_WXID)) reply_text += "You have guessed today.";
        else {
          isValid = VALID_GUESSES.find((word) => {return (word === user_answer);});
          if (isValid === undefined) reply_text += "Word not found.";
          else {
            ++have_guess;
            this.GameStatAppend((new Game_Wordle_Stat(name, wxid, roomid, answer, user_answer, have_guess)));
            result = await this.GetDiff(answer, user_answer);
            if (have_guess > 1) stat_text += "\n\n";
            stat_text += `${have_guess}. ${name}\n${user_answer}\n${result}`;
            if (result === WORDLE_ALL_CORRECT) have_finished = true;
          }
        }
        if (!have_guess) stat_text += "No one have guessed yet.";
        if (have_finished) stat_text += "\nCongratulation! Wordle has been finished today.";
        reply_text += `\n\n${stat_text}\n`;
        for(var i = 0; i < have_guess; ++i) reply_text += "====";
        Reply(msg, reply_text);
      }
    }
  }
}