#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  // Contact,
  // ScanStatus,
  WechatyBuilder,
  log
} from 'wechaty';
import { Codeforces } from './App/Codeforces.js';
import { AdminName, WechatyPuppet, WechatyPuppetToken } from './config.js';

// import qrcodeTerminal from 'qrcode-terminal'

import { 
  SunMessage,
 } from './Message.js';

export { 
  Sun_bot,
  ContactAdmin,
  AppCodeforces,
};
var ContactAdmin;
var AppCodeforces = new Codeforces();

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

async function init () {
  log.info(`${Sun_bot.name()} started.`);
  var ContactList = await Sun_bot.Contact.findAll({ name: AdminName });
  ContactAdmin = ContactList[0];

  await AppCodeforces.InitFunc();
}

/*************** main ***************/
const Sun_bot = WechatyBuilder.build({
  name: 'Sun-bot',
  puppet: WechatyPuppet,
  puppetOptions: {
    token: WechatyPuppetToken,
  }
});

// Sun_bot.on('scan',    onScan);
Sun_bot.on('login',   onLogin);
Sun_bot.on('logout',  onLogout);
Sun_bot.on('message', SunMessage);

Sun_bot.start()
  .then(init)
  .catch(e => log.error(Sun_bot.name(), e));