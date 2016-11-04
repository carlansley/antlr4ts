/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:38.3567094-07:00

import { Array2DHashSet } from '../misc/Array2DHashSet';
import { ATN } from '../atn/ATN';
import { ATNConfigSet } from '../atn/ATNConfigSet';
import { ATNState } from '../atn/ATNState';
import { ATNType } from '../atn/ATNType';
import { DFASerializer } from './DFASerializer';
import { DFAState } from './DFAState';
import { LexerATNSimulator } from '../atn/LexerATNSimulator';
import { LexerDFASerializer } from './LexerDFASerializer';
import { NotNull } from '../Decorators';
import { ObjectEqualityComparator } from '../misc/ObjectEqualityComparator';
import { StarLoopEntryState } from '../atn/StarLoopEntryState';
import { Token } from '../Token';
import { Vocabulary } from '../Vocabulary';
import { VocabularyImpl } from '../VocabularyImpl';

export class DFA {
	/**
	 * A set of all states in the `DFA`.
	 */
	@NotNull
	readonly states: Array2DHashSet<DFAState> = new Array2DHashSet<DFAState>(ObjectEqualityComparator.INSTANCE);

	s0: DFAState | undefined;

	s0full: DFAState | undefined;

	readonly decision: number;

	/** From which ATN state did we create this DFA? */
	@NotNull
	atnStartState: ATNState;
	/**
	 * Note: this field is accessed as `atnStartState.atn` in other targets. The TypeScript target keeps a separate copy
	 * to avoid a number of additional null/undefined checks each time the ATN is accessed.
	 */
	@NotNull
	atn: ATN;

	private nextStateNumber: number = 0;

	/**
	 * {@code true} if this DFA is for a precedence decision; otherwise,
	 * {@code false}. This is the backing field for {@link #isPrecedenceDfa}.
	 */
	private precedenceDfa: boolean;

	constructor(@NotNull atnStartState: ATNState, decision: number = 0)  {
		if (!atnStartState.atn) {
			throw new Error("The ATNState must be associated with an ATN");
		}

		this.atnStartState = atnStartState;
		this.atn = atnStartState.atn;
		this.decision = decision;

		let isPrecedenceDfa: boolean =  false;
		if (atnStartState instanceof StarLoopEntryState) {
			if (atnStartState.precedenceRuleDecision) {
				isPrecedenceDfa = true;
				this.s0 = new DFAState(new ATNConfigSet());
				this.s0full = new DFAState(new ATNConfigSet());
			}
		}

		this.precedenceDfa = isPrecedenceDfa;
	}

	/**
	 * Gets whether this DFA is a precedence DFA. Precedence DFAs use a special
	 * start state {@link #s0} which is not stored in {@link #states}. The
	 * {@link DFAState#edges} array for this start state contains outgoing edges
	 * supplying individual start states corresponding to specific precedence
	 * values.
	 *
	 * @return {@code true} if this is a precedence DFA; otherwise,
	 * {@code false}.
	 * @see Parser#getPrecedence()
	 */
	isPrecedenceDfa(): boolean {
		return this.precedenceDfa;
	}

	/**
	 * Get the start state for a specific precedence value.
	 *
	 * @param precedence The current precedence.
	 * @return The start state corresponding to the specified precedence, or
	 * {@code null} if no start state exists for the specified precedence.
	 *
	 * @ if this is not a precedence DFA.
	 * @see #isPrecedenceDfa()
	 */
	getPrecedenceStartState(precedence: number, fullContext: boolean): DFAState | undefined {
		if (!this.isPrecedenceDfa()) {
			throw new Error("Only precedence DFAs may contain a precedence start state.");
		}

		// s0 and s0full are never null for a precedence DFA
		if (fullContext) {
			return (<DFAState>this.s0full).getTarget(precedence);
		}
		else {
			return (<DFAState>this.s0).getTarget(precedence);
		}
	}

	/**
	 * Set the start state for a specific precedence value.
	 *
	 * @param precedence The current precedence.
	 * @param startState The start state corresponding to the specified
	 * precedence.
	 *
	 * @ if this is not a precedence DFA.
	 * @see #isPrecedenceDfa()
	 */
	setPrecedenceStartState(precedence: number, fullContext: boolean, startState: DFAState): void {
		if (!this.isPrecedenceDfa()) {
			throw new Error("Only precedence DFAs may contain a precedence start state.");
		}

		if (precedence < 0) {
			return;
		}

		if (fullContext) {
			// s0full is never null for a precedence DFA
			(<DFAState>this.s0full).setTarget(precedence, startState);
		}
		else {
			// s0 is never null for a precedence DFA
			(<DFAState>this.s0).setTarget(precedence, startState);
		}
	}

	isEmpty(): boolean {
		if (this.isPrecedenceDfa()) {
			// s0 and s0full are never null for a precedence DFA
			return this.s0!.getEdgeMap().size === 0 && this.s0full!.getEdgeMap().size === 0;
		}

		return this.s0 == null && this.s0full == null;
	}

	isContextSensitive(): boolean {
		if (this.isPrecedenceDfa()) {
			// s0full is never null for a precedence DFA
			return (<DFAState>this.s0full).getEdgeMap().size > 0;
		}

		return this.s0full != null;
	}

	addState(state: DFAState): DFAState {
		state.stateNumber = this.nextStateNumber++;
		return this.states.getOrAdd(state);
	}

	toString(): string;
	toString(/*@NotNull*/ vocabulary: Vocabulary): string;
	toString(/*@NotNull*/ vocabulary: Vocabulary, ruleNames: string[] | undefined): string;
	toString(vocabulary?: Vocabulary, ruleNames?: string[]): string {
		if (!vocabulary) {
			vocabulary = VocabularyImpl.EMPTY_VOCABULARY;
		}

		if (!this.s0) {
			return "";
		}

		let serializer: DFASerializer;
		if (ruleNames) {
			serializer = new DFASerializer(this, vocabulary, ruleNames, this.atnStartState.atn);
		} else {
			serializer = new DFASerializer(this, vocabulary);
		}

		return serializer.toString();
	}

	toLexerString(): string {
		if ( !this.s0 ) {
			return "";
		}

		let serializer: DFASerializer =  new LexerDFASerializer(this);
		return serializer.toString();
	}
}
