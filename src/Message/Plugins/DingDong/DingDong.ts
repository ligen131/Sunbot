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
	PLUGIN_DINGDONG_HELPLIST_LONG,
	PLUGIN_DINGDONG_HELPLIST_SHORT,
} from '../../../constant/words';
import { IPlugins } from '../plugins';
import { types } from 'wechaty';
import { Bot } from 'bot';

export { PluginDingdong };

class PluginDingdong implements IPlugins {
	enable = false;
	plugin_name = 'dingdong';
	plugin_id = 1;
	plugin_helplist_short: string = PLUGIN_DINGDONG_HELPLIST_SHORT;
	plugin_helplist_long: string = PLUGIN_DINGDONG_HELPLIST_LONG;
	is_database_used = false;
	command = `ding`;

	async match(message: IMessage): Promise<boolean> {
		if (message.messageType != types.Message.Text) return false;
		let ret = false;
		message.list.forEach(
			((value: string) => {
				if (value.indexOf(this.command) >= 0) ret = true;
			}).bind(this),
		);
		return ret;
	}
	action(bot: Bot, message: IMessage): void {
		Send(bot, message, `dong`);
	}

	async is_match_private(bot: Bot, message: IMessage): Promise<boolean> {
		return await this.match(message);
	}
	private_action(bot: Bot, message: IMessage): void {
		this.action(bot, message);
	}

	async is_match_room(bot: Bot, message: IMessage): Promise<boolean> {
		return await this.match(message);
	}
	room_action(bot: Bot, message: IMessage): void {
		this.action(bot, message);
	}
}
