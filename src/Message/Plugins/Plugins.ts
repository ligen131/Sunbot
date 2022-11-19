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

import { Bot } from '../../bot';
import { LogInfo } from '../../utils/logs';
import { IMessage } from '../message';
import { PluginDingdong } from './dingdong/dingdong';
import * as Config from '../../../config/config.json';
import { PluginRepeater } from './repeater/repeater';
import { PluginFromapi } from './fromapi/fromapi';

export {
	IPlugins,
	PluginRegister,
	PluginHeartBeat,
	PluginPrivateAction,
	PluginRoomAction,
};

interface IPlugins {
	enable: boolean;
	plugin_name: string;
	plugin_id: number;
	plugin_helplist_short: string;
	plugin_helplist_long: string;
	is_database_used: boolean;
	command: string | string[] | undefined;
	register?(bot?: Bot): void | Promise<void>;
	is_match_private(bot: Bot, message: IMessage): void | Promise<boolean>;
	private_action(bot: Bot, message: IMessage): void | Promise<void>;
	is_match_room(bot: Bot, message: IMessage): boolean | Promise<boolean>;
	room_action(bot: Bot, message: IMessage): void | Promise<void>;
	heart_beat_action?(bot: Bot): void | Promise<void>;
}

const Plugins: IPlugins[] = [
	new PluginDingdong(),
	new PluginRepeater(),
	new PluginFromapi(),
];
const PluginsEnable: boolean[] = [
	Config.plugins.dingdong.enable,
	Config.plugins.repeater.enable,
	true,
];

async function PluginRegister(bot: Bot): Promise<void> {
	LogInfo(bot, `Start to register plugins.`);

	Plugins.forEach((plugin, index) => {
		if (PluginsEnable[index] && (!plugin.is_database_used || bot.dbUsed)) {
			plugin.enable = true;
		}
	});

	Plugins.forEach((plugin) => {
		if (plugin.enable && plugin.register) {
			plugin.register(bot);
		}
	});
}

function PluginHeartBeat(bot: Bot): void {
	if (!Plugins) return;
	Plugins.forEach((plugin) => {
		if (plugin.enable && plugin.heart_beat_action) {
			plugin.heart_beat_action(bot);
		}
	});
}

function PluginPrivateAction(bot: Bot, message: IMessage): void {
	if (!Plugins) return;
	Plugins.forEach(async (plugin) => {
		if (plugin.enable && (await plugin.is_match_private(bot, message))) {
			plugin.private_action(bot, message);
		}
	});
}

function PluginRoomAction(bot: Bot, message: IMessage): void {
	if (!Plugins) return;
	Plugins.forEach(async (plugin) => {
		if (plugin.enable && (await plugin.is_match_room(bot, message))) {
			plugin.room_action(bot, message);
		}
	});
}
