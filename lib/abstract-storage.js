/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import IStorage from 'zb/device/interfaces/i-storage';


/**
 * @implements {IStorage}
 */
export default class AbstractStorage {
	/**
	 * @param {MAGgSTB} plugin
	 */
	constructor(plugin) {
		/**
		 * @type {string}
		 * @protected
		 */
		this._prefix = '';

		/**
		 * @type {MAGgSTB}
		 * @protected
		 */
		this._plugin = plugin;
	}

	/**
	 * @override
	 */
	setKeyPrefix(prefix) {
		this._prefix = prefix;
	}

	/**
	 * @override
	 */
	getItem(key) {
		throw new Error('not implemented');
	}

	/**
	 * @override
	 */
	setItem(key, value) {
		throw new Error('not implemented');
	}

	/**
	 * @override
	 */
	removeItem(key) {
		throw new Error('not implemented');
	}
}
