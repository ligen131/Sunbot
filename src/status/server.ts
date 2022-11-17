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

import express, { Express, Request, Response, NextFunction } from 'express';
import jsdom from 'jsdom';
import path from 'path';
import { LogInfo } from '../utils/logs';
import { Bot } from '../bot';

export { Server };

async function Server(bot: Bot, port: number | undefined): Promise<void> {
	port = port || 4721;
	const app: Express = express();

	app.all('*', (req: Request, res: Response, next: NextFunction) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	});

	const html: jsdom.JSDOM = await jsdom.JSDOM.fromFile(
		path.join(__dirname, 'index.html'),
	);
	const htmlPrefix = '<!DOCTYPE html>\n<html lang="en">\n';
	const htmlSuffix = '\n</html>';
	const startTime: Date = bot.startTime;

	app.get('/', (req: Request, res: Response) => {
		res.set('Content-Type', 'text/html');
		const now = new Date();
		html.window.document
			.querySelector('.running-time')
			?.setAttribute(
				'data-running-time',
				`${Math.floor((now.getTime() - startTime?.getTime()) / 1000)}`,
			);
		html.window.document
			.querySelector('.time')
			?.setAttribute('data-time', `${Math.floor(now.getTime() / 1000)}`);
		const text =
			htmlPrefix + html.window.document.documentElement.innerHTML + htmlSuffix;
		res.send(text);
	});

	app.listen(port, () => {
		LogInfo(bot, `Bot status page listening at http://localhost:${port}`);
	});
}
