/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:48.3187865-07:00

import { Arrays } from "../misc/Arrays";
import { ATN } from '../atn/ATN';
import { CommonToken } from "../CommonToken";
import { ErrorNode } from "./ErrorNode";
import { Interval } from "../misc/Interval";
import { NotNull, Nullable } from "../Decorators";
import { Parser } from '../Parser';
import { ParserRuleContext } from "../ParserRuleContext";
import { ParseTree } from "./ParseTree";
import { RuleContext } from "../RuleContext";
import { RuleNode } from "./RuleNode";
import { TerminalNode } from "./TerminalNode";
import { Token } from "../Token";
import * as Utils from "../misc/Utils";

/** A set of utility routines useful for all kinds of ANTLR trees. */
export class Trees {
	/** Print out a whole tree in LISP form. {@link #getNodeText} is used on the
	 *  node payloads to get the text for the nodes.  Detect
	 *  parse trees and extract data appropriately.
	 */

    /** Print out a whole tree in LISP form. {@link #getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */

    /** Print out a whole tree in LISP form. {@link #getNodeText} is used on the
     *  node payloads to get the text for the nodes.
     */
    static toStringTree( @NotNull t: ParseTree, arg2?: Parser | string[] ): string {
        let ruleNames: string[];
        if (arg2 instanceof Parser) {ruleNames = arg2.getRuleNames();}
        else {ruleNames = arg2 as string[];}

        let s: string = Utils.escapeWhitespace(this.getNodeText(t, ruleNames), false);
        if (t.getChildCount() == 0) return s;
        let buf = "";
        buf += ("(");
        s = Utils.escapeWhitespace(this.getNodeText(t, ruleNames), false);
        buf += (s);
        buf += (' ');
        for (let i = 0; i < t.getChildCount(); i++) {
            if (i > 0) buf += (' ');
            buf += (this.toStringTree(t.getChild(i), ruleNames));
        }
        buf += (")");
        return buf;
    }

    static getNodeText(t: ParseTree, arg2: Parser | string[] ): string {
        let ruleNames: string[] | undefined;
        if (arg2 instanceof Parser) {
            ruleNames = arg2.getRuleNames();
        } else if (arg2) {
            ruleNames = arg2;
        } else {
            // no recog or rule names
            let payload = t.getPayload();
            if (typeof payload.getText === 'function') {
                return payload.getText();
            }
            return t.getPayload().toString();;
        }

		if ( t instanceof RuleNode ) {
			let ruleContext: RuleContext =  t.getRuleContext();
			let ruleIndex: number =  ruleContext.getRuleIndex();
			let ruleName: string =  ruleNames[ruleIndex];
			let altNumber: number =  ruleContext.getAltNumber();
			if ( altNumber !== ATN.INVALID_ALT_NUMBER ) {
				return ruleName + ":" + altNumber;
			}
			return ruleName;
		}
		else if ( t instanceof ErrorNode ) {
			return t.toString();
		}
		else if ( t instanceof TerminalNode) {
			let symbol = t.getSymbol() as any;
		    return symbol.getText();
        }
        throw new TypeError("Unexpected node type");
    }



	/** Return ordered list of all children of this node */
	static getChildren(t: ParseTree): ParseTree[] {
	    let kids = [] as ParseTree[];
		for (let i=0; i<t.getChildCount(); i++) {
			kids.push(t.getChild(i));
		}
		return kids;
	}

	/** Return a list of all ancestors of this node.  The first node of
	 *  list is the root and the last is the parent of this node.
	 *
	 *  @since 4.5.1
	 */
    @NotNull
    static getAncestors(@NotNull t: ParseTree): ParseTree[] {
        let ancestors = [] as ParseTree[];
        let p = t.getParent();
        while (p) {
            ancestors.unshift(p); // insert at start
            p = p.getParent();
        }
        return ancestors;
    }

    /** Return true if t is u's parent or a node on path to root from u.
     *  Use == not equals().
     *
     *  @since 4.5.1
     */
	static isAncestorOf(t: ParseTree, u: ParseTree): boolean {
		if ( !t || !u || !t.getParent() ) return false;
		let p = u.getParent();
		while ( p ) {
			if ( t === p ) return true;
			p = p.getParent();
		}
		return false;
	}

	static findAllTokenNodes(t: ParseTree, ttype: number): Array<ParseTree> {
		return Trees.findAllNodes(t, ttype, true);
	}

	static findAllRuleNodes(t: ParseTree, ruleIndex: number): Array<ParseTree> {
        return Trees.findAllNodes(t, ruleIndex, false);
	}

	static findAllNodes(t: ParseTree, index: number, findTokens: boolean): Array<ParseTree> {
		let nodes =  [] as ParseTree[];
        Trees._findAllNodes(t, index, findTokens, nodes);
		return nodes;
	}

    static _findAllNodes(t: ParseTree, index: number, findTokens: boolean, nodes: Array<ParseTree> ) {
		// check this node (the root) first
		if ( findTokens && t instanceof TerminalNode ) {
			if ( t.getSymbol().getType()===index ) nodes.push(t);
		}
		else if ( !findTokens && t instanceof ParserRuleContext ) {
			if ( t.getRuleIndex() === index ) nodes.push(t);
		}
		// check children
		for (let i = 0; i < t.getChildCount(); i++) {
			Trees._findAllNodes(t.getChild(i), index, findTokens, nodes);
		}
	}

	/** Get all descendents; includes t itself.
	 *
	 * @since 4.5.1
	 */
	static getDescendants(t: ParseTree): ParseTree[] {
		let nodes: ParseTree[] = [];

		function recurse(e: ParseTree): void {
			nodes.push(e);
			const n = e.getChildCount();
			for (let i = 0; i < n; i++) {
				recurse(e.getChild(i));
			}
		}

		recurse(t);
		return nodes;
	}

	/** Find smallest subtree of t enclosing range startTokenIndex..stopTokenIndex
	*  inclusively using postorder traversal.  Recursive depth-first-search.
	*
	*  @since 4.5
	*/
	@Nullable
	static getRootOfSubtreeEnclosingRegion(@NotNull t: ParseTree,
											 startTokenIndex: number, // inclusive
											stopTokenIndex: number // inclusive
											): ParserRuleContext | undefined
	{
		let n: number =  t.getChildCount();
		for (let i = 0; i<n; i++) {
			let child: ParseTree =  t.getChild(i);
			let r = Trees.getRootOfSubtreeEnclosingRegion(child, startTokenIndex, stopTokenIndex);
			if ( r ) return r;
		}
		if ( t instanceof ParserRuleContext ) {
			let stopToken = t.getStop();
			if ( startTokenIndex>=t.getStart().getTokenIndex() && // is range fully contained in t?
				 (stopToken==null || stopTokenIndex <= stopToken.getTokenIndex()) )
			{
				// note: r.getStop()==null likely implies that we bailed out of parser and there's nothing to the right
				return t;
			}
		}
		return undefined;
	}

	/** Replace any subtree siblings of root that are completely to left
	*  or right of lookahead range with a CommonToken(Token.INVALID_TYPE,"...")
	*  node. The source interval for t is not altered to suit smaller range!
	*
	*  WARNING: destructive to t.
	*
	*  @since 4.5.1
	*/
	static stripChildrenOutOfRange(t: ParserRuleContext,
											   root: ParserRuleContext,
											   startIndex: number,
											   stopIndex: number): void
	{
        if (!t) return;
	    let count = t.getChildCount();
		for (let i = 0; i < count; i++) {
			let child = t.getChild(i);
			let range: Interval =  child.getSourceInterval();
			if ( child instanceof ParserRuleContext && (range.b < startIndex || range.a > stopIndex) ) {
				if ( Trees.isAncestorOf(child, root) ) { // replace only if subtree doesn't have displayed root
					let abbrev: CommonToken =  new CommonToken(Token.INVALID_TYPE, "...");
					t.children![i] = new TerminalNode(abbrev); // HACK access to private
				}
			}
		}
	}

	///** Return first node satisfying the pred
	// *
 //	 *  @since 4.5.1
	// */
	//static findNodeSuchThat(t: ParseTree, pred: Predicate<ParseTree>): ParseTree {
	//	if ( pred.eval(t) ) return t;

	//	let n: number =  t.getChildCount();
	//	for (let i = 0 ; i < n ; i++){
	//		let u: ParseTree =  findNodeSuchThat(t.getChild(i), pred);
	//		if ( u!=null ) return u;
	//	}
	//	return null;
	//}

	// constructor()  {
	//}
}
