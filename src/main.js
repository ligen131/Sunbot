#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  // Contact,
  // ScanStatus,
  WechatyBuilder,
  log
} from 'wechaty';
import { Codeforces } from './App/Codeforces.js';
import { Wordcloud } from './App/Wordcloud/Wordcloud.js';
import { WECHATY_PUPPET, WECHATY_PUPPET_TOKEN } from './config.js';
import fs from 'fs';

// import qrcodeTerminal from 'qrcode-terminal'

import { SunMessage } from './Message.js';
import { Game_1A2B } from './App/Game_1A2B.js';
import { Game_Wordle } from './App/Game_Wordle/Game_Wordle.js';

export { Sun_bot, ContactAdmin, AppCodeforces, AppWordcloud, AppGame_1A2B, AppGame_Wordle };
var ContactAdmin;
var AppCodeforces = new Codeforces();
var AppWordcloud = new Wordcloud();
var AppGame_1A2B = new Game_1A2B();
var AppGame_Wordle = new Game_Wordle();

var Sun_bot;

function onLogout (user) {
  log.info(Sun_bot.name(), '%s logout', user);
}

// function onScan (qrcode: string, status: ScanStatus) {
//   if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
//     const qrcodeImageUrl = [
//       'https://wechaty.js.org/qrcode/',
//       encodeURIComponent(qrcode),
//     ].join('')
//     log.info(Sun_bot.name(), 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

//     qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

//   } else {
//     log.info(Sun_bot.name(), 'onScan: %s(%s)', ScanStatus[status], status)
//   }
// }

function onLogin (user) {
  log.info(Sun_bot.name(), '%s login', user);
}

async function clockEvent () {
  log.info(`Clock Event started.`);
  AppCodeforces.ClockeventFunc();
  AppWordcloud.ClockeventFunc();
}

async function init () {
  var dirExist = fs.existsSync('data/');
  if(!dirExist) fs.mkdirSync('data/');
  log.info(`${Sun_bot.name()} started.`);

  AppCodeforces.InitFunc();
  AppGame_1A2B.InitFunc();
  AppGame_Wordle.InitFunc();
  setInterval(clockEvent, 1000 * 30);
}

async function main () {
  Sun_bot = WechatyBuilder.build({
    name: 'Sun-bot',
    puppet: WECHATY_PUPPET,
    puppetOptions: {
      token: WECHATY_PUPPET_TOKEN,
    }
  });
  
  // Sun_bot.on('scan',    onScan);
  Sun_bot.on('login',   onLogin);
  Sun_bot.on('logout',  onLogout);
  Sun_bot.on('message', SunMessage);
  
  Sun_bot.start()
    .then(init)
    .catch(e => log.error(Sun_bot.name(), e));
}

try {
  main();
} catch (err) { console.log(err); }