
import { log } from 'wechaty';

import { AppCodeforces, AppGame_1A2B, AppWordcloud } from './main.js';

import { Reply } from './Send.js';

export { SunMessage };

async function SunMessage (msg) {
  if (msg.text() === 'ding') {
    Reply(msg, "dong");
  }

  AppCodeforces.ExecuteFunc(msg);
  AppWordcloud.ExecuteFunc(msg);
  AppGame_1A2B.ExecuteFunc(msg);

  var msgfrom = await msg.talker().name();
  var msgfromid = await msg.talker().id;
  var mss = "From: " + msgfrom + '(' + msgfromid + ')\n';
  if (null == msg.to()) {
    var msgroom = await msg.room().topic();
    var msgroomid = await msg.room().id;
    mss += "Room: " + msgroom + '(' + msgroomid + ')\n';
  }
  mss += "Time: " + await msg.date() + '\n';
  mss += '----------------------------------------\n' + msg.text() + '\n----------------------------------------';
  log.info(mss);
}