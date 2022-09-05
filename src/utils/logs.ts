#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
'use strict';

import { Bot } from '../BotStarter/BotStarter';
import { log } from 'wechaty';

export { LogDebug, LogInfo, LogWarn, LogError };

function LogDebug(bot: Bot, ...args: any[]): void {
	log.verbose(bot.name, args);
}

function LogInfo(bot: Bot, ...args: any[]): void {
	log.info(bot.name, args);
}

function LogWarn(bot: Bot, ...args: any[]): void {
	log.warn(bot.name, args);
}

function LogError(bot: Bot, ...args: any[]): void {
	log.error(bot.name, args);
}
