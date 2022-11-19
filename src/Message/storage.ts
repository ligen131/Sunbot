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

import { RowDataPacket } from 'mysql2';
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query';
import { db } from '../db/db';
import { IMessage } from './message';

export { MessageStorage };

interface IDBMessage {
	type: number;
	txt: string;
	isRoom: boolean;
	roomTopic?: string;
	roomID?: string;
	talkerName: string;
	talkerID: string;
	time: number; // millisecond timestamp
}

class _MessageStorage {
	tableName = 'messages';

	init() {
		db.createTableIfNotExist(`${this.tableName}(
      type INT,
      txt TEXT,
      is_room BOOLEAN,
      room_topic VARCHAR(255),
      room_ID VARCHAR(255),
      talker_name VARCHAR(255),
      talker_ID VARCHAR(255),
      time BIGINT
    )`);
	}

	insertMessage(
		message: IMessage,
		callback?: (err: Query.QueryError | null) => any,
	) {
		const query = `INSERT INTO ${this.tableName} VALUES(?,?,?,?,?,?,?,?);`;
		db.db?.query(
			query,
			[
				message.messageType as number,
				message.text,
				message.isRoom,
				message.roomTopic,
				message.roomID,
				message.talkerName,
				message.talkerID,
				message.time.getTime(),
			],
			(err: Query.QueryError | null) => {
				if (err && callback) {
					callback(err);
				}
			},
		);
	}

	findMessageByRoomID(
		roomID: string,
		callback?: (
			err: Query.QueryError | null,
			results: IDBMessage[] | undefined,
		) => any,
		limit?: number,
	) {
		const query = `SELECT * FROM ${
			this.tableName
		} WHERE room_ID=? ORDER BY time${
			limit && limit > 0 ? ` LIMIT ${limit}` : ``
		};`;
		db.db?.query(query, [roomID], (err, results) => {
			if (callback) {
				if (err) {
					callback(err, undefined);
				} else {
					const r = <RowDataPacket>results;
					const resultList: IDBMessage[] = [];
					r.forEach((result: any) => {
						resultList.push({
							type: result.type,
							txt: result.txt,
							isRoom: result.is_room,
							roomTopic: result.room_topic,
							roomID: result.room_ID,
							talkerName: result.talker_name,
							talkerID: result.talker_ID,
							time: result.time,
						});
						callback(err, resultList);
					});
				}
			}
		});
	}
}

const MessageStorage = new _MessageStorage();
