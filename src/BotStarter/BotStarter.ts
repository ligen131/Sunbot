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

import { OnMessage } from '../Message/OnMessage';
import { LogError, LogInfo } from '../utils/logs';
import { Contact, WechatyBuilder } from 'wechaty';
import { WechatyInterface } from 'wechaty/impls';
import type { GError } from 'gerror';
import { PluginHeartBeat, PluginRegister } from '../Message/Plugins/Plugins';

export { Bot, Sunbot };

class Bot {
	private bot: WechatyInterface;
	public constructor(private _name: string) {
		this.bot = WechatyBuilder.build({
			name: _name,
		});
	}

	name(): string {
		return this._name;
	}

	private onLogin(user: Contact): void {
		LogInfo(this, `Bot ${user.name()} login.`);
		PluginRegister();
	}

	private onLogout(user: Contact): void {
		LogInfo(this, `Bot ${user.name()} logout.`);
	}

	private onError(err: GError): void {
		LogError(this, err);
	}

	public start(): void {
		this.bot.on('login', this.onLogin);
		this.bot.on('logout', this.onLogout);
		this.bot.on('error', this.onError);
		this.bot.on('heartbeat', PluginHeartBeat);
		this.bot.on('message', OnMessage);

		this.bot
			.start()
			.then(() => LogInfo(this, `Bot started.`))
			.catch((err) => LogError(this, err));
	}
}

const Sunbot = new Bot('Sunbot');
