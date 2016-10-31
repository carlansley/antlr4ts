/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:30.7737978-07:00

import { ATNState } from './ATNState';
import { ATNStateType } from './ATNStateType';
import { Override } from '../Decorators';

/** Mark the end of a * or + loop. */
export class LoopEndState extends ATNState {
	loopBackState: ATNState;

	@Override
	getStateType(): ATNStateType {
		return ATNStateType.LOOP_END;
	}
}
