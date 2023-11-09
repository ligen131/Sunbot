import { Reply } from "../Send.js";
import { ChatGPTClient } from '@waylaidwanderer/chatgpt-api';
import { KeyvFile } from 'keyv-file';
import { App } from "./App.js";
import * as Config from "../config.js";
import { isRoom } from "../Message.js";
import { rand } from "../Random.js";

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
    this.tips = [
      '发送 /reset 可以重置您与 ChatGPT 的对话，但请注意重置后就无法恢复之前的上下文继续对话了哦。',
      '每次向 ChatGPT 询问都有字数限制，大约 500 个汉字或 1000 个英文单词左右。',
      '如果他使用了英文回答你的问题，不妨直接跟他说"请用中文回答"，或者发送 /reset 来重置对话吧。',
      '如果你发现 ChatGPT 话说一半，可以发送"请继续"让他继续往下说。',
      'AI 模型可能会生成有害或不准确的内容，请仔细甄别。',
      'ChatGPT 支持连续对话。如果你觉得他回答有误，可以纠正他。',
      '每个人都有独立的上下文对话，所以在群聊中你是无法继续其他人的上下文和他对话的。',
      '你可以把机器人拉到你想要的群，然后 @他 就可以使用啦。添加机器人好友，私聊他也是可以的。',
      '如果觉得机器人有用的话，请在 GitHub 上给我一个 Star 吧 https://github.com/ligen131/Sunbot/tree/js-version'
    ];
  }

  async initApi() {
    const clientOptions = {
      // (Optional) Support for a reverse proxy for the completions endpoint (private API server).
      // Warning: This will expose your `openaiApiKey` to a third party. Consider the risks before using this.
      reverseProxyUrl: 'https://api.openai.com/v1/chat/completions',
      // (Optional) Parameters as described in https://platform.openai.com/docs/api-reference/completions
      modelOptions: {
        // You can override the model name and any other parameters here, like so:
        model: this.chatgptModel,
        // I'm overriding the temperature to 0 here for demonstration purposes, but you shouldn't need to override this
        // for normal usage.
        temperature: 1,
        // Set max_tokens here to override the default max_tokens of 1000 for the completion.
        max_tokens: 1000,
      },
      // (Optional) Davinci models have a max context length of 4097 tokens, but you may need to change this for other models.
      // maxContextTokens: 4097,
      // (Optional) You might want to lower this to save money if using a paid model like `text-davinci-003`.
      // Earlier messages will be dropped until the prompt is within the limit.
      // maxPromptTokens: 3097,
      // (Optional) Set custom instructions instead of "You are ChatGPT...".
      promptPrefix: '你是微信聊天机器人 Sunbot，你正处于一个微信群或微信私聊对话中，以下是群成员或私聊对象向你提的问题...',
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
      res = `请求太过频繁，请稍后再试试吧。`
    }
    else if (text.includes("/reset")) {
      this.conversation[user] = undefined;
      console.log(user, this.conversation[user]);
      res = `已重置您的对话。`;
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
        res = "向 ChatGPT 发送信息失败，请稍后再试。错误信息：" + err.toString();
      }
    }
    return `[OpenAI ${this.chatgptModel}]
Q: ${text}

A: ${res}

小提示: ${this.tips[await rand(0, this.tips.length - 1)]}`;
  }

  async exec(msg) {
    var txt = await msg.text();
    if (!(await isRoom(msg)) || await msg.mentionSelf()) {
      txt = txt.replaceAll(`@${Config.BOT_NAME} `, '');
      txt = txt.replaceAll(`@${Config.BOT_NAME}`, '');
      const ans = await this.getResponse(txt, await msg.talker().id);
      Reply(msg, ans);
    }
  }

}