#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
'use strict';

import { Sunbot } from '../BotStarter/BotStarter';
import { LogInfo } from '../utils/logs';

export { OnMessage };

async function OnMessage(): Promise<void> {
	LogInfo(Sunbot, `Start to deal with message.`);
}
