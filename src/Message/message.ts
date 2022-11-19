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
import { Contact, Message, Room, types } from 'wechaty';
import { LogInfo } from '../utils/logs';
import { Bot } from '../bot';
import { PluginPrivateAction, PluginRoomAction } from './plugins/plugins';
import { MessageStorage } from './storage';

export { IMessage, Parser, InstanceOfIMessage, OnMessage, InitMessage };

interface IMessage {
	__INTERFACE_IMESSAGE_DISCRIMINATOR__: 'interface IMessage'; // Important: Remember to add discriminator when implement
	messageType: types.Message;
	message: Message | undefined;
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

function parseTextToList(text: string): string[] {
	text = text.toLowerCase();
	text = text.replace(/\r/g, ' ');
	text = text.replace(/\n/g, ' ');
	text = text.replace(/\t/g, ' ');
	const list = text.split(' ');
	return list.filter((value) => {
		return value && value.trim();
	});
}

async function Parser(message: Message): Promise<IMessage> {
	const text: string = message.text();
	const list = parseTextToList(text);
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

async function InitMessage(bot: Bot): Promise<void> {
	if (bot.dbUsed) MessageStorage.init();
}

async function OnMessage(bot: Bot, message: Message): Promise<void> {
	LogInfo(bot, `Start to deal with message.`);
	const msg: IMessage = await Parser(message);
	if (bot.dbUsed) {
		MessageStorage.insertMessage(msg);
	}

	LogInfo(
		bot,
		`
======================= Message =======================
${
	msg.isRoom
		? `Room: ${msg.roomTopic}(${msg.roomID})
`
		: ``
}From: ${msg.talkerName}(${msg.talkerID})
Time: ${msg.time.toLocaleString()}
List length: ${msg.count}
${msg.list}
=======================================================
`,
	);

	if (msg.isRoom) {
		PluginRoomAction(bot, msg);
	} else {
		PluginPrivateAction(bot, msg);
	}
}
