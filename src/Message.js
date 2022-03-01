
import {
    log,
} from 'wechaty';

import {
  AppCodeforces,
  ContactAdmin,
  Sun_bot,
 } from './main.js';

import {
  Reply,
  Send,
} from './Send.js';

import fs from 'fs';

export {
  SunMessage,
};

// async function MessageStorage ()

async function SunMessage (msg) {
  log.info(Sun_bot.name(), msg.toString());

  if (msg.text() === 'ding') {
    Send(msg, "dong");
  }
  if (msg.text().length >= 2) {
    if (msg.text().substring(0,2) === 'cf') {
      AppCodeforces.ReplyUpcomingContest(msg);
    }
  }
  var msgfrom = await msg.talker().name();
  var msgfromid = await msg.talker().id;
  var mss = "From: " + msgfrom + '(' + msgfromid + ')\n';
  if (null == msg.to()) {
    var msgroom = await msg.room().topic();
    var msgroomid = await msg.room().id;
    mss += "Room: " + msgroom + '(' + msgroomid + ')\n';
  }
  mss += '----------------------------------------\n' + msg.text() + '\n----------------------------------------';
  await Send(ContactAdmin, mss, true);
}