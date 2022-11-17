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

import { Sunbot } from '../../bot';
import { LogInfo } from '../../utils/logs';
import { IMessage } from '../parser/parser';
import { PluginDingdong } from './dingdong/dingdong';
import * as Config from '../../../config/config.json';
import { PluginRepeater } from './repeater/repeater';

export {
	IPlugins,
	PluginRegister,
	PluginHeartBeat,
	PluginPrivateAction,
	PluginRoomAction,
};

interface IPlugins {
	plugin_name: string;
	plugin_id: number;
	plugin_helplist_short: string;
	plugin_helplist_long: string;
	is_database_used: boolean;
	command: string | string[] | undefined;
	register?(): void | Promise<void>;
	is_match_private(message: IMessage): void | Promise<boolean>;
	private_action(message: IMessage): void | Promise<void>;
	is_match_room(message: IMessage): boolean | Promise<boolean>;
	room_action(message: IMessage): void | Promise<void>;
	heart_beat_action?(): void | Promise<void>;
}

let Plugins: IPlugins[];

async function PluginRegister(): Promise<void> {
	LogInfo(Sunbot, `Start to register plugins.`);
	Plugins = [];

	if (Config.plugins.dingdong.enable) Plugins.push(new PluginDingdong());
	if (Config.plugins.repeater.enable) Plugins.push(new PluginRepeater());

	Plugins.forEach((plugin) => {
		if (plugin.register) {
			plugin.register();
		}
	});
}

function PluginHeartBeat(): void {
	if (!Plugins) return;
	Plugins.forEach((plugin) => {
		if (plugin.heart_beat_action) {
			plugin.heart_beat_action();
		}
	});
}

function PluginPrivateAction(message: IMessage): void {
	if (!Plugins) return;
	Plugins.forEach(async (plugin) => {
		if (await plugin.is_match_private(message)) {
			plugin.private_action(message);
		}
	});
}

function PluginRoomAction(message: IMessage): void {
	if (!Plugins) return;
	Plugins.forEach(async (plugin) => {
		if (await plugin.is_match_room(message)) {
			plugin.room_action(message);
		}
	});
}
