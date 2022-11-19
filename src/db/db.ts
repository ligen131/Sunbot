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

import mysql from 'mysql2';
import { GetError } from '../utils/common';
import * as Config from '../../config/config.json';
import { LogInfo } from '../utils/logs';
import { Bot } from 'bot';

export { DB, db };

class DB {
	db: mysql.Connection | undefined;

	async connect(bot: Bot): Promise<Error | undefined> {
		let ret: Error | undefined;
		try {
			const host = Config.database.host;
			const port = Config.database.port;
			const user = Config.database.user;
			const password = Config.database.password;
			const database = Config.database.database;
			this.db = mysql.createConnection({
				host: host,
				port: port,
				user: user,
				password: password,
				database: database,
			});
			LogInfo(
				bot,
				`Successfully connect to database ${database} using ${user}@${host}:${port}`,
			);
		} catch (err: unknown) {
			ret = GetError(err);
		}
		return ret;
	}

	async createTableIfNotExist(table: string): Promise<void> {
		const query = `CREATE TABLE IF NOT EXISTS ${table};`;
		this.db?.query(query);
	}
}

const db = new DB();
