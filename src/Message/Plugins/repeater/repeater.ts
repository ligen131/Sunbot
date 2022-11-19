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

import { IMessage } from '../../message';
import { Send } from '../../send';
import {
	PLUGIN_REPEATER_HELPLIST_LONG,
	PLUGIN_REPEATER_HELPLIST_SHORT,
} from '../../../constant/words';
import { IPlugins } from '../plugins';
import { types } from 'wechaty';
import { Bot } from 'bot';

export { PluginRepeater };

class PluginRepeater implements IPlugins {
	enable = false;
	plugin_name = 'repeater';
	plugin_id = 2;
	plugin_helplist_short: string = PLUGIN_REPEATER_HELPLIST_SHORT;
	plugin_helplist_long: string = PLUGIN_REPEATER_HELPLIST_LONG;
	is_database_used = false;
	command = undefined;

	messageMap: {
		[roomID: string]: {
			text: string;
			count: number;
		};
	} = {};
	repeatThreshold = 4;

	async match(bot: Bot, message: IMessage): Promise<boolean> {
		if (!message.isRoom || !message.roomID) return false;
		if (message.messageType != types.Message.Text) {
			this.messageMap[message.roomID] = {
				text: '',
				count: 0,
			};
			return false;
		}
		let ret = false;
		if (
			this.messageMap[message.roomID] &&
			this.messageMap[message.roomID].text === message.text
		) {
			this.messageMap[message.roomID].count++;
			if (this.messageMap[message.roomID].count >= this.repeatThreshold) {
				ret = true;
				this.messageMap[message.roomID] = {
					text: message.text,
					count: 0,
				};
			}
		} else {
			this.messageMap[message.roomID] = {
				text: message.text,
				count: 1,
			};
		}
		return ret;
	}
	action(bot: Bot, message: IMessage): void {
		Send(bot, message, message.text);
	}

	async is_match_private(bot: Bot, message: IMessage): Promise<boolean> {
		return await this.match(bot, message);
	}
	private_action(bot: Bot, message: IMessage): void {
		this.action(bot, message);
	}

	async is_match_room(bot: Bot, message: IMessage): Promise<boolean> {
		return await this.match(bot, message);
	}
	room_action(bot: Bot, message: IMessage): void {
		this.action(bot, message);
	}
}
