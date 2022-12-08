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
  }
  
  async initApi() {
    this.api = new ChatGPTAPI({
      sessionToken: Config.CHATGPT_TOKEN
    });
    await this.api.ensureAuth();
  }

  async getResponse(text) {
    console.log("Send to ChatGPT: ", text);
    var res = "";
    const now = new Date() - 0;
    if (now - this.lastQueryTime < 30000) {
      res = "Requests are too frequent, please try again later."
    }
    else {
      try {
        this.lastQueryTime = now;
        res = await this.api.sendMessage(text);
      } catch (err) {
        res = "Failed to send message to ChatGPT. Please try again later." + err.toString();
      }
    }
    return "[OpenAI ChatGPT]\n\n" + res;
  }

  async exec(msg) {
    var txt = await msg.text();
    if (await msg.mentionSelf()) {
      txt = txt.replaceAll(`@${Config.BOT_NAME}`, '')
      const ans = await this.getResponse(txt);
      Reply(msg, ans);
    }
  }

}