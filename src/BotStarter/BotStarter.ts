#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
'use strict';

import { OnMessage } from '../Message/OnMessage';
import { LogError, LogInfo } from '../utils/logs';
import { Contact, WechatyBuilder } from 'wechaty';
import { WechatyInterface } from 'wechaty/impls';

export { Bot, Sunbot };

class Bot {
	private bot: WechatyInterface;
	public constructor(private _name: string) {
		this.bot = WechatyBuilder.build({
			name: _name,
		});
	}

	get name(): string {
		return this._name;
	}

	private onLogin(user: Contact): void {
		LogInfo(this, `Bot ${user.name()} login.`);
	}

	private onLogout(user: Contact): void {
		LogInfo(this, `Bot ${user.name()} logout.`);
	}

	public start(): void {
		this.bot.on('login', this.onLogin);
		this.bot.on('logout', this.onLogout);
		this.bot.on('message', OnMessage);

		this.bot
			.start()
			.then(() => LogInfo(this, `Bot started.`))
			.catch((err) => LogError(this, err));
	}
}

const Sunbot = new Bot('Sunbot');
