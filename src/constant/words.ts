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

export const PLUGIN_DINGDONG_HELPLIST_SHORT = `ding  -  监测 bot 状态`;
export const PLUGIN_DINGDONG_HELPLIST_LONG = `ding
在 bot 状态正常运行下，会默认回复 dong。
  -h, -H  打开该帮助列表
`;
export const PLUGIN_REPEATER_HELPLIST_SHORT = `[repeat_words]  -  复读功能`;
export const PLUGIN_REPEATER_HELPLIST_LONG = `[repeat_words]
在当前会话下检测到连续 4 条相同的文本信息，会自动复读该信息。
`;
