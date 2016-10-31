/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:38.1172076-07:00

import { LexerActionExecutor } from '../atn/LexerActionExecutor';

/**
 * Stores information about a {@link DFAState} which is an accept state under
 * some condition. Certain settings, such as
 * {@link ParserATNSimulator#getPredictionMode()}, may be used in addition to
 * this information to determine whether or not a particular state is an accept
 * state.
 *
 * @author Sam Harwell
 */
export class AcceptStateInfo {
	private prediction: number;
	private lexerActionExecutor?: LexerActionExecutor;

	constructor(prediction: number);
	constructor(prediction: number, lexerActionExecutor: LexerActionExecutor | undefined);
	constructor(prediction: number, lexerActionExecutor?: LexerActionExecutor) {
		this.prediction = prediction;
		this.lexerActionExecutor = lexerActionExecutor;
	}

	/**
	 * Gets the prediction made by this accept state. Note that this value
	 * assumes the predicates, if any, in the {@link DFAState} evaluate to
	 * {@code true}. If predicate evaluation is enabled, the final prediction of
	 * the accept state will be determined by the result of predicate
	 * evaluation.
	 */
	getPrediction(): number {
		return this.prediction;
	}

	/**
	 * Gets the {@link LexerActionExecutor} which can be used to execute actions
	 * and/or commands after the lexer matches a token.
	 */
	getLexerActionExecutor(): LexerActionExecutor | undefined {
		return this.lexerActionExecutor;
	}
}
