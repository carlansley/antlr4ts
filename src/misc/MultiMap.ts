/*!
 * Copyright 2016 Terence Parr, Sam Harwell, and Burt Harris
 * All rights reserved.
 * Licensed under the BSD-3-clause license. See LICENSE file in the project root for license information.
 */

// ConvertTo-TS run at 2016-10-04T11:26:42.1346951-07:00

export class MultiMap<K, V> extends Map<K, V[]> {
	constructor() {
		super();
	}

	map(key: K, value: V): void {
		let elementsForKey = super.get(key);
		if (!elementsForKey) {
			elementsForKey = [] as V[];
			super.set(key, elementsForKey);
		}
		elementsForKey.push(value);
	}

	getPairs(): [K, V][] {
		let pairs: [K, V][] = [];
		this.forEach((values: V[], key: K) => {
			values.forEach(v => {
				pairs.push([key, v])
			});
		});
		return pairs;
	}
}
