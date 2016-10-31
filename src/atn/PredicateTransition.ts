/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:35.2826960-07:00

import { AbstractPredicateTransition } from './AbstractPredicateTransition';
import { ATNState } from './ATNState';
import { NotNull, Override } from '../Decorators';
import { SemanticContext } from './SemanticContext';
import { TransitionType } from './TransitionType';

/** TODO: this is old comment:
 *  A tree of semantic predicates from the grammar AST if label==SEMPRED.
 *  In the ATN, labels will always be exactly one predicate, but the DFA
 *  may have to combine a bunch of them as it collects predicates from
 *  multiple ATN configurations into a single DFA state.
 */
export class PredicateTransition extends AbstractPredicateTransition {
	ruleIndex: number;
	predIndex: number;
	isCtxDependent: boolean;   // e.g., $i ref in pred

	constructor(@NotNull target: ATNState, ruleIndex: number, predIndex: number, isCtxDependent: boolean) {
		super(target);
		this.ruleIndex = ruleIndex;
		this.predIndex = predIndex;
		this.isCtxDependent = isCtxDependent;
	}

	@Override
	getSerializationType(): TransitionType {
		return TransitionType.PREDICATE;
	}

	@Override
	isEpsilon(): boolean { return true; }

	@Override
	matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean {
		return false;
	}

	getPredicate(): SemanticContext.Predicate {
		return new SemanticContext.Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
	}

	@Override
	@NotNull
	toString(): string {
		return "pred_" + this.ruleIndex + ":" + this.predIndex;
	}
}
