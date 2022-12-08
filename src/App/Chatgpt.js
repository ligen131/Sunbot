import { Reply } from "../Send.js";
import { ChatGPTAPI } from 'chatgpt';
import { App } from "./App.js";
import * as Config from "../config.js";

export { Chatgpt };

class Chatgpt extends App {
  constructor () {
    super(7, "Chatgpt");
    this.InitFunc = this.initApi;
    this.ClockeventFunc = undefined;
    this.ExecuteFunc = this.exec;

    this.api = undefined;
    this.lastQueryTime = 0;
    this.conversation = new Array();
  }
  
  async initApi() {
    this.api = new ChatGPTAPI({
      sessionToken: Config.CHATGPT_TOKEN
    });
    await this.api.ensureAuth();
    this.LogInfo("[ChatGPT] Completed init ChatGPT API.");
  }

  async getResponse(text, user) {
    console.log("Send to ChatGPT: ", text);
    var res = "";
    const now = new Date() - 0;
    const limit = 20000;
    var con;
    if (now - this.lastQueryTime < limit) {
      res = `Requests are too frequent, please try again in ${Math.ceil(limit - (now - this.lastQueryTime))} seconds.`
    }
    else if (text.includes("/reset")) {
      this.conversation[user] = this.api.getConversation();
      console.log(user, this.conversation[user]);
      res = `Successfully reset conversation.`;
    } else {
      try {
        if (!this.conversation[user]) {
          this.conversation[user] = this.api.getConversation();
        }
        con = this.conversation[user];
        this.lastQueryTime = now;
        res = await con.sendMessage(text);
      } catch (err) {
        res = "Failed to send message to ChatGPT. Please try again later." + err.toString();
      }
    }
    return `[OpenAI ChatGPT]
Q: ${text}

A: ${res}`;
  }

  async exec(msg) {
    var txt = await msg.text();
    if (await msg.mentionSelf()) {
      txt = txt.replaceAll(`@${Config.BOT_NAME} `, '')
      txt = txt.replaceAll(`@${Config.BOT_NAME}`, '')
      const ans = await this.getResponse(txt, await msg.talker().id);
      Reply(msg, ans);
    }
  }

}