/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:46.3281988-07:00

import { CommonToken } from '../../CommonToken';
import { NotNull, Override } from '../../Decorators';

/**
 * A {@link Token} object representing a token of a particular type; e.g.,
 * {@code <ID>}. These tokens are created for {@link TagChunk} chunks where the
 * tag corresponds to a lexer rule or token type.
 */
export class TokenTagToken extends CommonToken {
	/**
	 * This is the backing field for {@link #getTokenName}.
	 */
	@NotNull
	private tokenName: string;
	/**
	 * This is the backing field for {@link #getLabel}.
	 */
	private label: string | undefined;

	/**
	 * Constructs a new instance of {@link TokenTagToken} with the specified
	 * token name, type, and label.
	 *
	 * @param tokenName The token name.
	 * @param type The token type.
	 * @param label The label associated with the token tag, or {@code null} if
	 * the token tag is unlabeled.
	 */
	constructor(@NotNull tokenName: string, type: number, label?: string) {
		super(type);
		this.tokenName = tokenName;
		this.label = label;
	}

	/**
	 * Gets the token name.
	 * @return The token name.
	 */
	@NotNull
	getTokenName(): string {
		return this.tokenName;
	}

	/**
	 * Gets the label associated with the rule tag.
	 *
	 * @return The name of the label associated with the rule tag, or
	 * {@code null} if this is an unlabeled rule tag.
	 */
	getLabel(): string | undefined {
		return this.label;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link TokenTagToken} returns the token tag
	 * formatted with {@code <} and {@code >} delimiters.</p>
	 */
	@Override
	getText(): string {
		if (this.label != null) {
			return "<" + this.label + ":" + this.tokenName + ">";
		}

		return "<" + this.tokenName + ">";
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link TokenTagToken} returns a string of the form
	 * {@code tokenName:type}.</p>
	 */
	@Override
	toString(): string {
		return this.tokenName + ":" + this.type;
	}
}
