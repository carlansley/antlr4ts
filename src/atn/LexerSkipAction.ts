/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:30.2324460-07:00

import { Lexer } from '../Lexer';
import { LexerAction } from './LexerAction';
import { LexerActionType } from './LexerActionType';
import { MurmurHash } from '../misc/MurmurHash';
import { NotNull, Override } from '../Decorators';

/**
 * Implements the {@code skip} lexer action by calling {@link Lexer#skip}.
 *
 * <p>The {@code skip} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link #INSTANCE}.</p>
 *
 * @author Sam Harwell
 * @since 4.2
 */
export class LexerSkipAction implements LexerAction {
	/**
	 * Constructs the singleton instance of the lexer {@code skip} command.
	 */
	constructor() {
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@link LexerActionType#SKIP}.
	 */
	@Override
	getActionType(): LexerActionType {
		return LexerActionType.SKIP;
	}

	/**
	 * {@inheritDoc}
	 * @return This method returns {@code false}.
	 */
	@Override
	isPositionDependent(): boolean {
		return false;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>This action is implemented by calling {@link Lexer#skip}.</p>
	 */
	@Override
	execute(@NotNull lexer: Lexer): void {
		lexer.skip();
	}

	@Override
	hashCode(): number {
		let hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.getActionType());
		return MurmurHash.finish(hash, 1);
	}

	@Override
	equals(obj: any): boolean {
		return obj === this;
	}

	@Override
	toString(): string {
		return "skip";
	}
}

export namespace LexerSkipAction {
	/**
	 * Provides a singleton instance of this parameterless lexer action.
	 */
	export const INSTANCE: LexerSkipAction = new LexerSkipAction();
}
