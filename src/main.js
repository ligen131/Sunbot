#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  // Contact,
  // ScanStatus,
  WechatyBuilder,
  log
} from 'wechaty'
import { CodeforcesRecentContest } from './Codeforces.js'
import { httpGET } from './HttpRequest.js'

// import qrcodeTerminal from 'qrcode-terminal'

import { 
  SunMessage,
 } from './Message.js'

export { 
  Sun_bot,
}

function onLogout (user) {
  log.info(Sun_bot.name(), '%s logout', user)
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
  log.info(Sun_bot.name(), '%s login', user)
}

async function init () {
  await httpGET("https://codeforces.com/api/contest.list", (obj) => {} )
}

/*************** main ***************/
const Sun_bot = WechatyBuilder.build({
  name: 'Sun-bot',
  puppet: 'wechaty-puppet-xp',
  puppetOptions: {
    token: 'edb1d77d-4c12-4c30-b5d0-69b1884bb7cc'
  }
})

// Sun_bot.on('scan',    onScan)
Sun_bot.on('login',   onLogin)
Sun_bot.on('logout',  onLogout)
Sun_bot.on('message', SunMessage)

Sun_bot.start()
  .then(() => log.info(Sun_bot.name(), 'Sun-bot Started.'))
  .catch(e => log.error(Sun_bot.name(), e))
init()