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

import { IsRoomMessage } from '../../utils/common';
import { Message } from 'wechaty';

export { IMessage, Parser, InstanceOfIMessage };

interface IMessage {
	__INTERFACE_IMESSAGE_DISCRIMINATOR__: 'interface IMessage'; // Important: Remember to add discriminator when implement
	message: Message;
	count: number;
	list: string[];
	isRoom: boolean;
	roomTopic?: string;
	roomID?: string;
	talker: string;
	talkerID: string;
	time: Date;
}

function InstanceOfIMessage(object: any): object is IMessage {
	return '__INTERFACE_IMESSAGE_DISCRIMINATOR__' in object;
}

async function Parser(message: Message): Promise<IMessage> {
	let text: string = message.text();
	text = text.toLowerCase();
	text = text.replace(/\r/g, ' ');
	text = text.replace(/\n/g, ' ');
	let list = text.split(' ');
	list = list.filter((value) => {
		return value && value.trim();
	});

	const isRoom: boolean = await IsRoomMessage(message);
	const roomTopic = await message.room()?.topic(),
		roomID = message.room()?.id;
	const talkerName = message.talker().name(),
		talkerID = message.talker().id;
	const time = message.date();

	return {
		__INTERFACE_IMESSAGE_DISCRIMINATOR__: 'interface IMessage',
		message: message,
		count: list.length,
		list: list,
		isRoom: isRoom,
		roomTopic: roomTopic,
		roomID: roomID,
		talker: talkerName,
		talkerID: talkerID,
		time: time,
	} as IMessage;
}
