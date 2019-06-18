/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import AbstractInfo from 'zb/device/abstract-info';
import {Resolution} from 'zb/device/resolutions';
import UnsupportedFeature from 'zb/device/errors/unsupported-feature';
import Env from './env';


/**
 */
export default class Info extends AbstractInfo {
	/**
	 * @param {MAGgSTB} plugin
	 * @param {Env} env
	 */
	constructor(plugin, env) {
		super();


		/**
		 * @type {MAGgSTB}
		 * @protected
		 */
		this._plugin = plugin;

		/**
		 * @type {Env}
		 * @protected
		 */
		this._env = env;
	}

	/**
	 * @override
	 */
	type() {
		return 'mag';
	}

	/**
	 * @override
	 */
	version() {
		throw new UnsupportedFeature('Version getting');
	}

	/**
	 * @override
	 */
	manufacturer() {
		return this._plugin.GetDeviceVendor();
	}

	/**
	 * @override
	 */
	model() {
		return this._plugin.GetDeviceModel();
	}

	/**
	 * @override
	 */
	serialNumber() {
		return this._plugin.GetDeviceSerialNumber();
	}

	/**
	 * @override
	 */
	softwareVersion() {
		return this._plugin.GetDeviceImageVersionCurrent();
	}

	/**
	 * @override
	 */
	hardwareVersion() {
		return this._plugin.GetDeviceVersionHardware();
	}

	/**
	 * @override
	 */
	osdResolutionType() {
		const resolutions = this._getResolutionsByScreenSize(window.outerWidth, window.outerHeight);

		return resolutions[0] || Resolution.HD;
	}

	/**
	 * @override
	 */
	_getLocale() {
		const languageKey = 'language';
		const language = /** @type {string} */ (this._env.get([languageKey])[languageKey]);

		return language || '';
	}
}
