import {
    log,
} from 'wechaty';

import {
  Sun_bot,
 } from './main.js';

export {
  Send,
  Reply,
};

import { 
  rand,
  sleep,
} from './Random.js';

var LastSendTime;
var MessageLock;

async function SendPrivateMessage (send, text) {
  let Receiver = send.name();
  log.info(Sun_bot.name(), 'Send to %s:\n----------------------------------------\n%s\n----------------------------------------\n', Receiver, text);
  await send.say(text);
}

async function SendRoomMessage (send, text) {
  let Receiver = send.topic();
  log.info(Sun_bot.name(), 'Send to %s:\n----------------------------------------\n%s\n----------------------------------------\n', Receiver, text);
  await send.say(text);
}

async function Send (send, text, isPrivate) {
  while (MessageLock === true) await sleep(2000);
  MessageLock = true;
  let rd = rand(1, 3000);
  let NowTime = Date.now();
  // log.info(Sun_bot.name(), "ls = %d, now = %d.", LastSendTime, NowTime);
  if (NowTime - LastSendTime < 2000 + rd) {
    log.info(Sun_bot.name(), "Sleep %s ms to send next message, please wait.", 2000 + rd - (NowTime - LastSendTime));
    await sleep(2000 + rd - (NowTime - LastSendTime));
  }
  LastSendTime = Date.now();
  if (isPrivate) await SendPrivateMessage(send, text);
  else await SendRoomMessage(send, text);
  MessageLock = false;
}

async function Reply(msg, text) {
  if (null == msg.room())
    await Send(msg.talker(), text, true);
  else await Send(msg.room(), text, false);
}