#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 *   Sunbot - https://github.com/ligen131/Sunbot
 *
 *   @copyright 2022 ligen131 <1353055672@qq.com>
 *
 *   Licensed under the GNU General Public License, Version 3.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       https://www.gnu.org/licenses/gpl-3.0.html
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
'use strict';

import { Bot } from '../bot';
import { LogError, LogInfo, LogWarn } from '../utils/logs';
import { Contact, Room, Sayable } from 'wechaty';
import * as Config from '../../config/config.json';
import { IMessage, InstanceOfIMessage } from './message';
import { InstanceOfContact } from '../utils/common';

export { Send };

/**
 *
 * @todo(ligen131): find Contact or Room while IMessage.message === undefined
 *
 **/
async function Send(bot: Bot, tmp: Contact | Room | IMessage, text: Sayable) {
	let send: Contact | Room | undefined;
	let roomTopic, roomID, talkerName, talkerID: string | undefined;
	let isRoom = false;
	if (InstanceOfIMessage(tmp)) {
		if (tmp.isRoom) {
			send = tmp.room;
			roomTopic = tmp.roomTopic;
			roomID = tmp.roomID;
			isRoom = true;
		} else {
			send = tmp.talker;
			talkerName = tmp.talkerName;
			talkerID = tmp.talkerID;
		}
	} else if (InstanceOfContact(tmp)) {
		send = tmp;
		talkerName = tmp?.name();
		talkerID = tmp.id;
	} else {
		send = tmp;
		roomTopic = await tmp.topic();
		roomID = tmp.id;
		isRoom = true;
	}
	const now = new Date();
	LogInfo(
		bot,
		`
========================= Send ========================
To: ${isRoom ? `Room: ${roomTopic}(${roomID})` : `${talkerName}(${talkerID})`}
Time: ${now.toLocaleString()}
${text.toString()}
=======================================================
`,
	);
	try {
		if (Config.bot.enableSendingMessage) send?.say(text);
		else LogWarn(bot, 'Sending messages is disabled.');
	} catch (err) {
		LogError(bot, 'Sending message failed.', err);
	}
}
