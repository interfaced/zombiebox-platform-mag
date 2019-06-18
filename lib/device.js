/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {decodeParams} from 'zb/http/http';
import {debug} from 'zb/console/console';
import AbstractDevice from 'zb/device/abstract-device';
import UnsupportedFeature from 'zb/device/errors/unsupported-feature';
import AbstractStorage from './abstract-storage';
import Env from './env';
import Info from './info';
import Input from './input';
import Storage from './storage';
import Storage256 from './storage-256';
import Video from './video';


/**
 */
export default class Device extends AbstractDevice {
	/**
	 * @param {HTMLElement} videoContainer
	 */
	constructor(videoContainer) {
		super();

		/**
		 * @type {Info}
		 */
		this.info;

		/**
		 * @type {Input}
		 */
		this.input;

		/**
		 * @type {AbstractStorage}
		 */
		this.storage;

		/**
		 * @type {HTMLElement}
		 * @protected
		 */
		this._videoContainer = videoContainer;

		/**
		 * @type {Video}
		 * @protected
		 */
		this._video;

		/**
		 * @type {MAGgSTB}
		 * @protected
		 */
		this._plugin = window.gSTB;

		/**
		 * @type {Env}
		 * @protected
		 */
		this._env = new Env(this._plugin);

		/**
		 * @type {{
		 *     value: number,
		 *     isMute: boolean
		 * }}
		 * @protected
		 */
		this._volume;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isOnStandBy = false;

		/**
		 * @type {number}
		 * @protected
		 */
		this._OSDOpacity = 0;

		this._plugin.EnableServiceButton(true);
		this._plugin.EnableAppButton(true);

		window.moveTo(0, 0);
		window.resizeTo(1280, 720);
	}

	/**
	 * @override
	 */
	init() {
		this.info = new Info(this._plugin, this._env);
		this.input = new Input();

		if (this.info.model() === 'MAG256') {
			this.storage = new Storage256(/** @type {MAG256STB} */(this._plugin));
		} else {
			this.storage = new Storage(this._plugin, this._env);
		}

		this.restoreVolume();

		this._fireEvent(this.EVENT_READY);
	}

	/**
	 * @override
	 */
	getLaunchParams() {
		return decodeParams(window.location.search.substring(1));
	}

	/**
	 * @override
	 */
	getEnvironment() {
		throw new UnsupportedFeature('Environment getting');
	}

	/**
	 * @override
	 */
	createVideo() {
		this._video = new Video(
			this._videoContainer,
			this._plugin,
			this.storage,
			this.hasOSDAlphaBlendingFeature(),
			this._volume
		);

		return this._video;
	}

	/**
	 * @override
	 */
	getMAC() {
		return this._plugin.GetDeviceMacAddress();
	}

	/**
	 * @override
	 */
	getIP() {
		return this._plugin.RDir('IPAddress').replace(/[/\n]/g, '');
	}

	/**
	 * @override
	 */
	exit() {
		this._plugin.Stop();
		let exitUrl = null;
		const query = window.location.search.substring(1);
		const vars = query.split('&');
		for (let i = 0; i < vars.length; i++) {
			const pair = vars[i].split('=');
			if (pair[0] === 'referrer') {
				exitUrl = decodeURIComponent(pair[1]);
				break;
			}
		}
		debug('this.exit::exitUrl = ', exitUrl);
		if (!exitUrl) {
			window.location = 'file:///home/web/services.html';
		} else {
			window.location = exitUrl;
		}
	}

	/**
	 * @override
	 */
	setOSDOpacity(value) {
		this._plugin.SetWinAlphaLevel(0, value * 255);
	}

	/**
	 * @override
	 */
	getOSDOpacity() {
		return parseFloat((this._plugin.GetWinAlphaLevel(0) / 255).toFixed(3));
	}

	/**
	 * @override
	 */
	hasOSDOpacityFeature() {
		return true;
	}

	/**
	 * @override
	 */
	hasOSDChromaKeyFeature() {
		return false;
	}

	/**
	 * @override
	 */
	hasOSDAlphaBlendingFeature() {
		return this.info.model() === 'MAG256';
	}

	/**
	 * @override
	 */
	isUHDSupported() {
		return false;
	}

	/**
	 * @override
	 */
	getOSDChromaKey() {
		throw new UnsupportedFeature('OSD chroma key getting');
	}

	/**
	 * @override
	 */
	setOSDChromaKey() {
		throw new UnsupportedFeature('OSD chroma key setting');
	}

	/**
	 * @override
	 */
	removeOSDChromaKey() {
		throw new UnsupportedFeature('OSD chroma key removing');
	}

	/**
	 * @return {MAGgSTB}
	 */
	getPluginObject() {
		return this._plugin;
	}

	/**
	 * Power video output on/off
	 */
	standby() {
		if (!this.isOnStandBy()) {
			this._video.beforeStandByOn();
		}

		this._isOnStandBy = !this._isOnStandBy;
		this._plugin.StandBy(this._isOnStandBy);

		if (!this.isOnStandBy()) {
			this._video.afterStandByOff();
		}
	}

	/**
	 * @return {boolean}
	 */
	isOnStandBy() {
		return this._isOnStandBy;
	}

	/**
	 * @return {void}
	 */
	restoreVolume() {
		let defaultVolume = {
			value: 25,
			isMute: false
		};
		try {
			defaultVolume = JSON.parse(this.storage.getItem('default_volume') || '');
		} catch (e) {
			/* Ignore */
		}
		this._volume = /** @type {{isMute: boolean, value: number}} */ (defaultVolume);
	}

	/**
	 * @return {boolean}
	 */
	static detect() {
		const result = /MAG200/.test(navigator.userAgent);
		debug('detect MAG', result ? 'true' : 'false', navigator.userAgent);

		return result;
	}
}
