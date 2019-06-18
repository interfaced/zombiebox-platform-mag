/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import AbstractStorage from './abstract-storage';


/**
 */
export default class Storage256 extends AbstractStorage {
	/**
	 * @param {MAG256STB} plugin
	 */
	constructor(plugin) {
		super(plugin);

		/**
		 * @type {MAG256STB}
		 * @protected
		 */
		this._plugin;
	}

	/**
	 * @override
	 */
	getItem(key) {
		try {
			const raw = this._plugin.LoadUserData(key);

			return /** @type {string} */ (JSON.parse(raw));
		} catch (e) {
			return null;
		}
	}

	/**
	 * @override
	 */
	setItem(key, value) {
		this._plugin.SaveUserData(key, JSON.stringify(value));
	}

	/**
	 * @override
	 */
	removeItem(key) {
		this._plugin.SaveUserData(key, '');
	}
}
