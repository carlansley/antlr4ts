/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:59.7015751-07:00

import {Token} from './Token';

export interface WritableToken extends Token {
	setText(text: string): void;

	setType(ttype: number): void;

	setLine(line: number): void;

	setCharPositionInLine(pos: number): void;

	setChannel(channel: number): void;

	setTokenIndex(index: number): void;
}
