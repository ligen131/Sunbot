import { Reply } from "../Send.js";
import { ChatGPTClient } from '@waylaidwanderer/chatgpt-api';
import { KeyvFile } from 'keyv-file';
import { App } from "./App.js";
import * as Config from "../config.js";

export { Chatgpt };

class Chatgpt extends App {
  constructor() {
    super(7, "Chatgpt");
    this.InitFunc = this.initApi;
    this.ClockeventFunc = undefined;
    this.ExecuteFunc = this.exec;

    this.chatgptClient = undefined;
    this.lastQueryTime = 0;
    this.conversation = new Array();
    this.chatgptModel = 'gpt-3.5-turbo';
  }

  async initApi() {
    const clientOptions = {
      // (Optional) Support for a reverse proxy for the completions endpoint (private API server).
      // Warning: This will expose your `openaiApiKey` to a third party. Consider the risks before using this.
      reverseProxyUrl: 'https://openai.labixiaoxing.cn/v1/chat/completions',
      // (Optional) Parameters as described in https://platform.openai.com/docs/api-reference/completions
      modelOptions: {
        // You can override the model name and any other parameters here, like so:
        model: this.chatgptModel,
        // I'm overriding the temperature to 0 here for demonstration purposes, but you shouldn't need to override this
        // for normal usage.
        temperature: 0,
        // Set max_tokens here to override the default max_tokens of 1000 for the completion.
        max_tokens: 1000,
      },
      // (Optional) Davinci models have a max context length of 4097 tokens, but you may need to change this for other models.
      // maxContextTokens: 4097,
      // (Optional) You might want to lower this to save money if using a paid model like `text-davinci-003`.
      // Earlier messages will be dropped until the prompt is within the limit.
      // maxPromptTokens: 3097,
      // (Optional) Set custom instructions instead of "You are ChatGPT...".
      // promptPrefix: 'You are Bob, a cowboy in Western times...',
      // (Optional) Set a custom name for the user
      // userLabel: 'User',
      // (Optional) Set a custom name for ChatGPT
      chatGptLabel: 'Sunbot',
      // (Optional) Set to true to enable `console.debug()` logging
      debug: false,
    };

    const cacheOptions = {
      // Options for the Keyv cache, see https://www.npmjs.com/package/keyv
      // This is used for storing conversations, and supports additional drivers (conversations are stored in memory by default)
      // For example, to use a JSON file (`npm i keyv-file`) as a database:
      store: new KeyvFile({ filename: 'chatgpt-cache.json' }),
    };

    this.chatGptClient = new ChatGPTClient(Config.OPENAI_API_KEY, clientOptions, cacheOptions);
    this.LogInfo("[ChatGPT] Completed init ChatGPT API.");
  }

  async getResponse(text, user) {
    console.log("Send to ChatGPT: ", text);
    var res = "";
    const now = new Date() - 0;
    const limit = 10000;
    var con;
    if (now - this.lastQueryTime < limit) {
      res = `Requests are too frequent, please try again in ${Math.ceil(limit - (now - this.lastQueryTime))} seconds.`
    }
    else if (text.includes("/reset")) {
      this.conversation[user] = undefined;
      console.log(user, this.conversation[user]);
      res = `Successfully reset conversation.`;
    } else {
      try {
        let resp;
        if (!this.conversation[user]) {
          resp = await this.chatGptClient.sendMessage(text);
        } else {
          resp = await 
            this.chatGptClient.sendMessage(text, {
              conversationId: this.conversation[user].conversationId,
              parentMessageId: this.conversation[user].messageId,
              // If you want streamed responses, you can set the `onProgress` callback to receive the response as it's generated.
              // You will receive one token at a time, so you will need to concatenate them yourself.
              // onProgress: token => process.stdout.write(token),
          })
        }
        this.lastQueryTime = now;
        this.conversation[user] = resp;
        res = resp.response;
      } catch (err) {
        res = "Failed to send message to ChatGPT. Please try again later. err = " + err.toString();
      }
    }
    return `[OpenAI ${this.chatgptModel}]
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