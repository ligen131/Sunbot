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
	PLUGIN_FROMAPI_HELPLIST_LONG,
	PLUGIN_FROMAPI_HELPLIST_SHORT,
} from '../../../constant/words';
import { IPlugins } from '../plugins';
import { types } from 'wechaty';
import { Bot } from '../../../bot';
import * as Config from '../../../../config/config.json';
import { FileBox } from 'file-box';
import { LogError, LogWarn } from '../../../utils/logs';

export { PluginFromapi };

/**
 *
 * @todo(ligen131): FileBox.fromUrl interface is unstable
 *
 */
class PluginFromapi implements IPlugins {
	enable = false;
	plugin_name = 'fromapi';
	plugin_id = 2;
	plugin_helplist_short: string = PLUGIN_FROMAPI_HELPLIST_SHORT;
	plugin_helplist_long: string = PLUGIN_FROMAPI_HELPLIST_LONG;
	is_database_used = false;
	command = undefined;

	apis: {
		enable: boolean;
		url: string;
		command: string;
		dealFunc: (...args: any[]) => Promise<void>;
	}[] = [];

	register(): void {
		this.apis.push({
			enable: Config.plugins.cats.enable,
			url: 'https://cataas.com',
			command: '发猫猫',
			dealFunc: this.catsDealFunc,
		});
		this.apis.push({
			enable: Config.plugins.dogs.enable,
			url: 'https://dog.ceo/api/breeds/image/random',
			command: '发狗狗',
			dealFunc: this.dogsDealFunc,
		});
	}

	count = 0;

	/* {
    "tags": [
      "sleepy",
      "mad",
      "cute",
      "small"
    ],
    "createdAt": "2021-01-27T00:37:36.893Z",
    "updatedAt": "2022-10-11T07:52:32.506Z",
    "validated": true,
    "owner": "null",
    "file": "6010b5d147d128001b7bbb8a.jpeg",
    "mimetype": "image/jpeg",
    "size": 324750,
    "_id": "ivriXZDf9c3wVJ5v",
    "url": "/cat/ivriXZDf9c3wVJ5v"
  } */
	async catsDealFunc(bot: Bot, message: IMessage): Promise<void> {
		this.count++;
		let ok = 0;
		let json;
		do {
			ok++;
			try {
				const rep = await fetch(
					this.apis[0].url + `/cat/cute?json=true&type=sm`,
				);
				json = (await rep.json()) as {
					url: string;
					mimetype: string;
				};
				if (json?.mimetype != 'image/gif') {
					ok = 10;
				}
			} catch (err) {
				LogWarn(bot, 'Fetch failed', err);
			}
		} while (ok < 10);
		if (json && json?.mimetype != 'image/gif') {
			const file = FileBox.fromUrl(this.apis[0].url + json.url);
			console.log(file);
			// Send(bot, message, file);
			Send(
				bot,
				message,
				'[WIP] 图片发送接口暂时不稳定，请点击链接查看：' +
					this.apis[0].url +
					json.url,
			);
		} else {
			LogError(bot, "Get cats' photo failed.");
		}
	}

	async dogsDealFunc(bot: Bot, message: IMessage): Promise<void> {
		this.count++;
		let ok = 0;
		let json;
		do {
			ok++;
			try {
				const rep = await fetch(this.apis[1].url);
				json = (await rep.json()) as {
					message: string;
				};
				if (json?.message) {
					ok = 10;
				}
			} catch (err) {
				LogWarn(bot, 'Fetch failed', err);
			}
		} while (ok < 10);
		if (json?.message) {
			const file = FileBox.fromUrl(json.message);
			console.log(file);
			// Send(bot, message, file);
			Send(
				bot,
				message,
				'[WIP] 图片发送接口暂时不稳定，请点击链接查看：' + json.message,
			);
		} else {
			LogError(bot, "Get dogs' photo failed.");
		}
	}

	async match(message: IMessage): Promise<boolean> {
		if (message.messageType != types.Message.Text) return false;
		let ret = false;
		this.apis.forEach((api) => {
			if (!api.enable) return;
			message.list.forEach((value) => {
				if (value.indexOf(api.command) >= 0) ret = true;
			});
		});
		return ret;
	}
	async action(bot: Bot, message: IMessage): Promise<void> {
		const match: boolean[] = [];
		this.apis.forEach(() => match.push(false));
		this.apis.forEach((api, index) => {
			if (!api.enable) return;
			message.list.forEach((value) => {
				if (value.indexOf(api.command) >= 0) match[index] = true;
			});
		});
		this.apis.forEach((api, index) => {
			if (match[index]) {
				api.dealFunc.bind(this, bot, message)();
			}
		});
	}

	async is_match_private(bot: Bot, message: IMessage): Promise<boolean> {
		return await this.match(message);
	}
	async private_action(bot: Bot, message: IMessage): Promise<void> {
		this.action(bot, message);
	}

	async is_match_room(bot: Bot, message: IMessage): Promise<boolean> {
		return await this.match(message);
	}
	async room_action(bot: Bot, message: IMessage): Promise<void> {
		this.action(bot, message);
	}
}
