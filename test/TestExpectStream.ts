/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

import * as es from './runtime/ExpectStream';

describe("expectConsole()", () => {
	it('should capture console.log()', () => {
		es.expectConsole( "Testing 1,2,3\nbye\n", "", ()=> {
			console.log("Testing 1,2,3");
			console.log("bye");
		})
	});
	it('should capture console.error()', ()=> {
		es.expectConsole( "", "pseudo-error\n", ()=>{
			console.error("pseudo-error");
		});
	});
})
