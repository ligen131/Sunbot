import {
    log,
} from 'wechaty'

import {
  Sun_bot,
 } from './main.js'

export {
  Send,
}

import { 
  rand,
  sleep,
} from './Random.js'

var LastSendTime
var MessageLock

async function SendMessage (msg, text) {
  let Receiver = msg.talker().name()

  if (Receiver === null) {
    Receiver = (await (msg.room()?.topic()))?.toString()
  }
  log.info(Sun_bot.name(), 'Send: %s, To %s.', text, Receiver)
  await msg.say(text)
}

async function Send (send, text) {
  while (MessageLock === true) await sleep(2000)
  MessageLock = true
  let rd = rand(1, 3000)
  let NowTime = Date.now()
  log.info(Sun_bot.name(), "ls = %d, now = %d.", LastSendTime, NowTime)
  if (NowTime - LastSendTime < 2000 + rd) {
    log.info(Sun_bot.name(), "Sleep %s ms.", 2000 + rd - (NowTime - LastSendTime))
    await sleep(2000 + rd - (NowTime - LastSendTime))
  }
  LastSendTime = Date.now()
  SendMessage(send, text) 
  MessageLock = false
}