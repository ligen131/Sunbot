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
import { Contact, Message, Room, types } from 'wechaty';

export { IMessage, Parser, InstanceOfIMessage };

interface IMessage {
	__INTERFACE_IMESSAGE_DISCRIMINATOR__: 'interface IMessage'; // Important: Remember to add discriminator when implement
	messageType: types.Message;
	message: Message;
	text: string;
	count: number;
	list: string[];
	isRoom: boolean;
	room?: Room;
	roomTopic?: string;
	roomID?: string;
	talker: Contact;
	talkerName: string;
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
	const messageType = message.type();
	const time = message.date();

	const isRoom: boolean = IsRoomMessage(message);
	const room = message.room();
	const roomTopic = await room?.topic();
	const roomID = room?.id;

	const talker = message.talker();
	const talkerName = talker.name();
	const talkerID = talker.id;

	const ret: IMessage = {
		__INTERFACE_IMESSAGE_DISCRIMINATOR__: 'interface IMessage',
		messageType: messageType,
		message: message,
		text: text,
		count: list.length,
		list: list,
		isRoom: isRoom,
		room: room,
		roomTopic: roomTopic,
		roomID: roomID,
		talker: talker,
		talkerName: talkerName,
		talkerID: talkerID,
		time: time,
	};
	return ret;
}
