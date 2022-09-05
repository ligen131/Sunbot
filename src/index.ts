#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
'use strict';

import { Sunbot } from './BotStarter/BotStarter';

function main() {
	Sunbot.start();
}

main();
