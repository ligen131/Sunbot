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

import { Sunbot } from '../bot';
import { LogError, LogInfo } from '../utils/logs';
import { Contact, Room } from 'wechaty';
import * as Config from '../../config/config.json';
import { IMessage, InstanceOfIMessage } from './parser/parser';

export { Send };

async function Send(tmp: Contact | IMessage, text: string) {
	let send: Contact | Room | undefined;
	let roomTopic, roomID, talker, talkerID: string | undefined;
	let isRoom = false;
	if (InstanceOfIMessage(tmp)) {
		if (tmp.isRoom) {
			send = tmp.message.room();
			roomTopic = tmp.roomTopic;
			roomID = tmp.roomID;
			isRoom = true;
		} else {
			send = tmp.message.talker();
			talker = tmp.talker;
			talkerID = tmp.talkerID;
		}
	} else {
		send = tmp;
		talker = tmp.name();
		talkerID = tmp.id;
	}
	const now = new Date();
	LogInfo(
		Sunbot,
		`
========================= Send ========================
To: ${isRoom ? `Room: ${roomTopic}(${roomID})` : `${talker}(${talkerID})`}
Time: ${now.toLocaleString()}
${text}
=======================================================`,
	);
	try {
		if (Config.bot.enableSendingMessage) send?.say(text);
	} catch (err) {
		LogError(Sunbot, 'Sending message failed.', err);
	}
}
