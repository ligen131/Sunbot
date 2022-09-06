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

import { IsRoomMessage } from '../utils/common';
import { Message } from 'wechaty';
import { Sunbot } from '../BotStarter/BotStarter';
import { LogInfo } from '../utils/logs';
import { IMessage, Parser } from './Parser/Parser';

export { OnMessage };

async function OnMessage(message: Message): Promise<void> {
	LogInfo(Sunbot, `Start to deal with message.`);
	const message_list: IMessage = await Parser(message);
	const isRoom: boolean = await IsRoomMessage(message);
	const roomTopic = message.room()?.topic(),
		roomId = message.room()?.id;
	const talkerName = message.talker().name(),
		talkerId = message.talker().id;
	const time = message.date().toLocaleString();
	LogInfo(
		Sunbot,
		`
======================= Message =======================
${
	isRoom ? `Room: ${roomTopic}(${roomId}) ` : ``
}From: ${talkerName}(${talkerId})
Time: ${time} List length: ${message_list.count}
${message_list.list}
=======================================================
`,
	);
}
