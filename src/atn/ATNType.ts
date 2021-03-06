/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:27.6094030-07:00

/**
 * Represents the type of recognizer an ATN applies to.
 *
 * @author Sam Harwell
 */
export const enum ATNType {

	/**
	 * A lexer grammar.
	 */
	LEXER,

	/**
	 * A parser grammar.
	 */
	PARSER,

}
