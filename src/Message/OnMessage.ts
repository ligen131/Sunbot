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

import { Message } from 'wechaty';
import { Sunbot } from '../bot';
import { LogInfo } from '../utils/logs';
import { IMessage, Parser } from './parser/parser';
import { PluginPrivateAction, PluginRoomAction } from './plugins/plugins';

export { OnMessage };

async function OnMessage(message: Message): Promise<void> {
	LogInfo(Sunbot, `Start to deal with message.`);
	const msg: IMessage = await Parser(message);

	LogInfo(
		Sunbot,
		`
======================= Message =======================
${
	msg.isRoom
		? `Room: ${msg.roomTopic}(${msg.roomID})
`
		: ``
}From: ${msg.talker}(${msg.talkerID})
Time: ${msg.time.toLocaleString()}
List length: ${msg.count}
${msg.list}
=======================================================
`,
	);

	if (msg.isRoom) {
		PluginRoomAction(msg);
	} else {
		PluginPrivateAction(msg);
	}
}
