/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import AbstractStorage from './abstract-storage';
import Env from './env';


/**
 */
export default class Storage extends AbstractStorage {
	/**
	 * @param {MAGgSTB} plugin
	 * @param {Env} env
	 */
	constructor(plugin, env) {
		super(plugin);

		/**
		 * @type {Env}
		 * @protected
		 */
		this._env = env;
	}

	/**
	 * @override
	 */
	getItem(key) {
		const encodedKey = this._prefix + key;
		const encodedValue = /** @type {string} */ (this._env.get([encodedKey])[encodedKey]);

		try {
			return atob(encodedValue);
		} catch (e) {/* Ignore all */}

		return null;
	}

	/**
	 * @override
	 */
	setItem(key, value) {
		const obj = {
			[this._prefix + key]: btoa(value === null ? '' : value)
		};

		this._env.set(obj);
	}

	/**
	 * @override
	 */
	removeItem(key) {
		this._env.remove([key]);
	}
}
