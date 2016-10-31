/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// CONVERSTION complete, Burt Harris 10/14/2016

import { ANTLRErrorListener } from "../../ANTLRErrorListener";
import { Override } from "../../Decorators";
import { Recognizer } from "../../Recognizer";
import { RecognitionException } from "../../RecognitionException";

export class XPathLexerErrorListener implements ANTLRErrorListener<number> {
	@Override
	syntaxError<T extends number>(recognizer: Recognizer<T,any>, offendingSymbol: T,
							line: number, charPositionInLine: number, msg: string,
							e: RecognitionException): void
	{
	}
}
