
import {
    log,
} from 'wechaty'
import { CodeforcesRecentContest } from './Codeforces.js'

import {
  Sun_bot,
 } from './main.js'

import {
  Send,
} from './Send.js'

export {
  SunMessage,
}

async function SunMessage (msg) {
    log.info(Sun_bot.name(), msg.toString())
  
    if (msg.text() === 'ding') {
      Send(msg, "dong")
    }
    if (msg.text().length >= 2) {
      if (msg.text().substring(0,2) === 'cf') {
        CodeforcesRecentContest(msg)
      }
    }
  }