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
	PLUGIN_FOOD_HELPLIST_LONG,
	PLUGIN_FOOD_HELPLIST_SHORT,
} from '../../../constant/words';
import { IPlugins } from '../plugins';
import { types } from 'wechaty';
import { Bot } from 'bot';
import { CsvError, parse } from 'csv-parse';
import * as fs from 'fs';
import path from 'path';
import { LogError } from '../../../utils/logs';
import { Rand } from '../../../utils/common';

export { PluginFood };

interface IFoods {
	name: string;
	west: number | undefined;
	middle: number | undefined;
	east: number | undefined;
	featured: number | undefined;
	quick: number | undefined;
	regional: number | undefined;
	multipeople: number | undefined;
	note: string | undefined;
	address: string | undefined;
}

class PluginFood implements IPlugins {
	enable = false;
	plugin_name = 'food';
	plugin_id = 4;
	plugin_helplist_short: string = PLUGIN_FOOD_HELPLIST_SHORT;
	plugin_helplist_long: string = PLUGIN_FOOD_HELPLIST_LONG;
	is_database_used = false;
	command = `吃什么`;

	foods: IFoods[] = [];

	register(bot: Bot) {
		const foodFile = fs.readFileSync(path.join(__dirname, 'food.csv'), {
			encoding: 'utf-8',
		});
		parse(
			foodFile,
			{
				delimiter: ',',
				columns: [
					'name',
					'west',
					'middle',
					'east',
					'featured',
					'quick',
					'regional',
					'multipeople',
					'note',
					'address',
				],
			},
			((err: CsvError | undefined, result: IFoods[]) => {
				if (err) {
					LogError(bot, 'Parse food.csv failed.', err);
					return;
				}
				console.log(result);
				result.forEach((value, index) => {
					if (result[index].note?.indexOf('\\n')) {
						result[index].note = result[index].note?.replaceAll('\\n', '\n');
					}
				});
				this.foods = result;
			}).bind(this),
		);
	}

	async match(message: IMessage): Promise<boolean> {
		if (this.foods.length === 0) return false;
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
		const ind = Rand(0, this.foods.length - 1);
		Send(
			bot,
			message,
			`那就吃${this.foods[ind].address ? `${this.foods[ind].address}的` : ``}${
				this.foods[ind].name
			}吧！${this.foods[ind].note}`,
		);
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
