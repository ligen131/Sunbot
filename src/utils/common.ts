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

import { Contact, Message, Room } from 'wechaty';

export { IsRoomMessage, InstanceOfContact, InstanceOfRoom };

function IsRoomMessage(message: Message): boolean {
	return null != message.room();
}

function InstanceOfContact(object: any): object is Contact {
	return object?.name() != undefined;
}

function InstanceOfRoom(object: any): object is Room {
	return object?.topic() != undefined;
}
