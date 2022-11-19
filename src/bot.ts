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

import { InitMessage, OnMessage } from './message/message';
import { LogError, LogInfo, LogWarn } from './utils/logs';
import { Contact, OfficialPuppetNpmName, WechatyBuilder } from 'wechaty';
import { WechatyInterface } from 'wechaty/impls';
import type { GError } from 'gerror';
import { PluginHeartBeat, PluginRegister } from './message/plugins/plugins';
import * as Config from '../config/config.json';
import { Server } from './status/server';
import { db } from './db/db';
export { Bot };

class Bot {
	private bot: WechatyInterface;
	private _startTime: Date;
	private _dbUsed = false;
	public constructor(private _name: string) {
		this.bot = WechatyBuilder.build({
			name: _name,
			puppet: Config.bot.puppet as OfficialPuppetNpmName,
			puppetOptions: {
				token: Config.bot.puppetOptions.token,
			},
		});
		this._startTime = new Date(0);
	}

	name(): string {
		return this._name;
	}
	get startTime(): Date {
		return this._startTime;
	}
	get dbUsed(): boolean {
		return this._dbUsed;
	}

	private async onLogin(user: Contact): Promise<void> {
		LogInfo(this, `Bot ${user.name()} login.`);

		this._dbUsed = Config.database.enable;
		if (this._dbUsed) {
			const err = await db.connect(this);
			if (err) {
				LogWarn(
					this,
					'Failed to connect database. The databased-based plugins will automatically disabled.',
					err,
				);
				this._dbUsed = false;
			}
		}
		await PluginRegister(this);
		await InitMessage(this);

		this._startTime = new Date();
		if (Config.statusPage.enable) {
			Server(this, Config.statusPage.port);
		}
	}

	private onLogout(user: Contact): void {
		LogInfo(this, `Bot ${user.name()} logout.`);
	}

	private onError(err: GError): void {
		LogError(this, err);
	}

	public Start(): void {
		this.bot.on('login', this.onLogin.bind(this));
		this.bot.on('logout', this.onLogout);
		this.bot.on('error', this.onError);
		this.bot.on('heartbeat', () => PluginHeartBeat(this));
		this.bot.on('message', (message) => OnMessage(this, message));

		this.bot
			.start()
			.then(() => LogInfo(this, `Bot started.`))
			.catch((err) => LogError(this, err));
	}
}
