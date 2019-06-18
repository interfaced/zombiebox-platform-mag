/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {error as logError} from 'zb/console/console';


/**
 */
export default class Env {
	/**
	 * @param {MAGgSTB} plugin
	 */
	constructor(plugin) {
		/**
		 * @type {MAGgSTB}
		 * @protected
		 */
		this._plugin = plugin;
	}

	/**
	 * @param {Array<string>} keys
	 * @return {Object<string, *>}
	 */
	get(keys) {
		const obj = {
			'varList': keys
		};
		let result = {};
		let error = null;

		try {
			const response = this._plugin.GetEnv(JSON.stringify(obj));
			result = JSON.parse(response);
			error = result['errMsg'];
		} catch (e) {
			error = e;
		}

		if (error) {
			logError(`[Env]::[get] ${error}`);
			result = {};
		} else {
			result = result['result'];
		}

		return result;
	}

	/**
	 * @param {Object<string, *>} map
	 * @throws {string|Error}
	 */
	set(map) {
		let status = false;

		try {
			status = this._plugin.SetEnv(JSON.stringify(map));
		} catch (error) {
			logError(`[Env]::[set] Something went wrong: ${error}`);

			throw error;
		}

		if (status === false) {
			throw new Error('[gSTB]::[SetEnv] Returned false status');
		}
	}

	/**
	 * @param {Array<string>} keys
	 */
	remove(keys) {
		const removeMap = keys.reduce((obj, key) => {
			obj[key] = '';

			return obj;
		}, {});

		this.set(removeMap);
	}
}
