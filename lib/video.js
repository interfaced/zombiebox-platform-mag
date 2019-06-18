/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {getCSS} from 'zb/html';
import {State} from 'zb/device/interfaces/i-video';
import {debug} from 'zb/console/console';
import AbstractVideo from 'zb/device/abstract-video';
import IStorage from 'zb/device/interfaces/i-storage';
import {
	MAG_RTP_ERROR,
	MAG_WRITE_ERROR,
	MAG_WRITE_OK,
	MAG_HDMI_DISCONNECT,
	MAG_HDMI_CONNECT,
	MAG_ERROR_LOAD_SUBTITLES,
	MAG_PLAYER_METADATA_UPDATED,
	MAG_PLAYER_START_AUDIO,
	MAG_ERROR_CONTENT_NOT_FOUND,
	MAG_START_PLAYING, MAG_PLAYER_GET_TRACK_INFO,
	MAG_END_OF_STREAM,
	MAG_SPEED_BWD_16X,
	MAG_SPEED_BWD_8X,
	MAG_SPEED_BWD_4X,
	MAG_SPEED_BWD_2X,
	MAG_SPEED_BWD_1X,
	MAG_SPEED_FWD_16X,
	MAG_SPEED_FWD_8X,
	MAG_SPEED_FWD_4X,
	MAG_SPEED_FWD_2X,
	MAG_SPEED_FWD_1X
} from './device-const';
import ViewPort from './view-port';


/**
 */
export default class Video extends AbstractVideo {
	/**
	 * @param {HTMLElement} videoContainer
	 * @param {MAGgSTB} plugin
	 * @param {IStorage} storage
	 * @param {boolean} hasOSDAlphaBlendingFeature
	 * @param {{
	 *     value: number,
	 *     isMute: boolean
	 * }} volume
	 */
	constructor(videoContainer, plugin, storage, hasOSDAlphaBlendingFeature, volume) {
		super(videoContainer);

		/**
		 * @type {MAGgSTB}
		 * @protected
		 */
		this._plugin = plugin;

		/**
		 * @type {Function}
		 * @protected
		 */
		this._updatePositionBinded = this._updatingPosition.bind(this);

		/**
		 * @type {IStorage}
		 * @protected
		 */
		this._storage = storage;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._hasOSDAlphaBlendingFeature = hasOSDAlphaBlendingFeature;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isDurationReady = false;

		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isPlayFromPosition = false;

		/**
		 * @type {number}
		 * @protected
		 */
		this._lastPosition;

		/**
		 * @type {number}
		 * @protected
		 */
		this._timeoutId;

		/**
		 * @type {string}
		 * @protected
		 */
		this._backgroundColor;

		/**
		 * @type {Object}
		 * @protected
		 */
		this._rateToSpeedMap;

		/**
		 * @type {Object}
		 * @protected
		 */
		this._speedToRateMap;

		/**
		 * @type {ViewPort}
		 * @protected
		 */
		this._viewport;

		/**
		 * @type {number}
		 * @protected
		 */
		this._startPosition;

		/**
		 * @type {?number}
		 * @protected
		 */
		this._resumedPositionAfterStandByOff;

		/**
		 * @type {{
		 *     value: number,
		 *     isMute: boolean
		 * }}
		 * @protected
		 */
		this._volume = volume;

		/**
		 * @type {string}
		 * @protected
		 */
		this._url = '';

		window['stbEvent'] = {};
		window['stbEvent']['onEvent'] = this._playbackEventCallback.bind(this);
		window['stbEvent']['event'] = 0;

		this._plugin.InitPlayer();
		this._initViewPort();
		this._buildSpeedsMaps();
		this.setVolume(this._volume.value);
		this.setMuted(this._volume.isMute);
	}

	/**
	 * @override
	 */
	play(url, opt_startFrom) {
		this._url = url;

		if (!this._hasOSDAlphaBlendingFeature) {
			this._createChromakeyBackground();
		}

		debug('url: ', url);
		this._plugin.Play(`auto ${url}`);
		if (opt_startFrom) {
			this._startPosition = opt_startFrom;
			this._isPlayFromPosition = true;
			this._lastPosition = opt_startFrom;
		} else {
			this._lastPosition = 0;
		}
	}

	/**
	 * @override
	 */
	getUrl() {
		return this._url;
	}

	/**
	 * @override
	 */
	resume() {
		if (this.getState() === State.PAUSED) {
			this._plugin.Continue();
			this._updatingPosition();
		}
		this._setState(State.PLAYING);
		this._fireEvent(this.EVENT_PLAY);
	}

	/**
	 * @override
	 */
	pause() {
		this._plugin.Pause();
		clearTimeout(this._timeoutId);

		this._setState(State.PAUSED);
		this._fireEvent(this.EVENT_PAUSE);
	}

	/**
	 * @override
	 */
	stop() {
		this._plugin.Stop();
		clearTimeout(this._timeoutId);
		this._setState(State.STOPPED);
		this._fireEvent(this.EVENT_STOP);
		this._fireEvent(this.EVENT_DURATION_CHANGE, 0);
		this._fireEvent(this.EVENT_TIME_UPDATE, 0);
	}

	/**
	 * @override
	 */
	forward() {
		const currentSpeed = this._plugin.GetSpeed();
		const nextSpeed = this._calculateNextSpeed(currentSpeed);
		this._plugin.SetSpeed(nextSpeed);

		this._fireEvent(this.EVENT_RATE_CHANGE, this.getPlaybackRate());
		this._setState(State.SEEKING);
		this._fireEvent(this.EVENT_PLAY);

		return this._plugin.GetSpeed() === nextSpeed;
	}

	/**
	 * @override
	 */
	rewind() {
		const currentSpeed = this._plugin.GetSpeed();
		const prevSpeed = this._calculatePreviousSpeed(currentSpeed);
		this._plugin.SetSpeed(prevSpeed);

		this._fireEvent(this.EVENT_RATE_CHANGE, this.getPlaybackRate());
		this._setState(State.SEEKING);
		this._fireEvent(this.EVENT_PLAY);

		return this._plugin.GetSpeed() === prevSpeed;
	}

	/**
	 * @override
	 */
	destroy() {
		this.stop();
		this._volume.value = this.getVolume();
		this._volume.isMute = this.isMuted();
		this._storage.setItem('default_volume', JSON.stringify(this._volume));
		this._plugin.DeinitPlayer();
		this._url = '';
	}

	/**
	 * @override
	 */
	setPlaybackRate(rate) {
		const isPositive = rate >= 0;
		const absRate = Math.abs(rate);
		let closestRate = 1;

		for (let pow = 4; pow > 0; pow--) {
			const value = Math.pow(2, pow);
			if (value < absRate) {
				closestRate = Math.pow(2, pow + 1);
				break;
			}
		}
		closestRate = (isPositive ? 1 : -1) * closestRate;
		this._plugin.SetSpeed(this._rateToSpeedMap[closestRate]);

		this._fireEvent(this.EVENT_RATE_CHANGE, this.getPlaybackRate());
		if (closestRate !== 1) {
			this._setState(State.SEEKING);
		} else {
			this._setState(State.PLAYING);
		}
		this._fireEvent(this.EVENT_PLAY);
	}

	/**
	 * @override
	 */
	getPlaybackRate() {
		return this._speedToRateMap[this._plugin.GetSpeed()];
	}

	/**
	 * @override
	 */
	setPosition(milliseconds) {
		this._plugin.SetPosTimeEx(milliseconds);

		const state = this.getState();
		if (state === State.PLAYING || state === State.INITED) {
			this._setState(State.PLAYING);
		} else if (state === State.PAUSED) {
			this._plugin.Pause();
		}
	}

	/**
	 * @override
	 */
	getPosition() {
		if (this._isDurationReady) {
			return this._plugin.GetPosTimeEx();
		}

		return 0;
	}

	/**
	 * @override
	 */
	getDuration() {
		return this._plugin.GetMediaLenEx();
	}

	/**
	 * @override
	 */
	setVolume(value) {
		this._plugin.SetVolume(value);

		this._fireEvent(this.EVENT_VOLUME_CHANGE, this.getVolume());
	}

	/**
	 * @override
	 */
	getVolume() {
		return this._plugin.GetVolume();
	}

	/**
	 * @override
	 */
	setMuted(value) {
		this._plugin.SetMute(value ? 1 : 0);
		this._fireEvent(this.EVENT_VOLUME_CHANGE, this.getVolume());
	}

	/**
	 * @override
	 */
	getMuted() {
		return !!this._plugin.GetMute();
	}

	/**
	 * Actions which must be run after StandByOff
	 */
	afterStandByOff() {
		if (this._resumedPositionAfterStandByOff) {
			this.play(this._url, this._resumedPositionAfterStandByOff);
			this._resumedPositionAfterStandByOff = null;
		}
	}

	/**
	 * Actions which must be run before StandByOn
	 */
	beforeStandByOn() {
		if (this._plugin.IsPlaying()) {
			this._resumedPositionAfterStandByOff = this.getPosition();
			this.pause();
		}
	}

	/**
	 * @override
	 */
	_createViewPort(containerRect) {
		return new ViewPort(containerRect, this._plugin);
	}

	/**
	 * @protected
	 */
	_buildSpeedsMaps() {
		this._speedToRateMap = {};
		this._rateToSpeedMap = {};

		this._speedToRateMap[MAG_SPEED_FWD_1X] = 1;
		this._speedToRateMap[MAG_SPEED_FWD_2X] = 2;
		this._speedToRateMap[MAG_SPEED_FWD_4X] = 4;
		this._speedToRateMap[MAG_SPEED_FWD_8X] = 8;
		this._speedToRateMap[MAG_SPEED_FWD_16X] = 16;
		this._speedToRateMap[MAG_SPEED_BWD_1X] = -1;
		this._speedToRateMap[MAG_SPEED_BWD_2X] = -2;
		this._speedToRateMap[MAG_SPEED_BWD_4X] = -4;
		this._speedToRateMap[MAG_SPEED_BWD_8X] = -8;
		this._speedToRateMap[MAG_SPEED_BWD_16X] = -16;

		this._rateToSpeedMap[1] = MAG_SPEED_FWD_1X;
		this._rateToSpeedMap[2] = MAG_SPEED_FWD_2X;
		this._rateToSpeedMap[4] = MAG_SPEED_FWD_4X;
		this._rateToSpeedMap[8] = MAG_SPEED_FWD_8X;
		this._rateToSpeedMap[16] = MAG_SPEED_FWD_16X;
		this._rateToSpeedMap[-1] = MAG_SPEED_BWD_1X;
		this._rateToSpeedMap[-2] = MAG_SPEED_BWD_2X;
		this._rateToSpeedMap[-4] = MAG_SPEED_BWD_4X;
		this._rateToSpeedMap[-8] = MAG_SPEED_BWD_8X;
		this._rateToSpeedMap[-16] = MAG_SPEED_BWD_16X;
	}

	/**
	 * @param {number} event
	 * @protected
	 */
	_playbackEventCallback(event) {
		switch (parseInt(event, 10)) {
			case MAG_END_OF_STREAM:
				this._fireEvent(this.EVENT_ENDED);
				clearTimeout(this._timeoutId);
				break;
			case MAG_PLAYER_GET_TRACK_INFO:
				this._setState(State.INITED);
				this._fireEvent(this.EVENT_LOAD_START);
				break;
			case MAG_START_PLAYING:
				if (!this._isPlayFromPosition) {
					this._setState(State.PLAYING);
					this._fireEvent(this.EVENT_RATE_CHANGE, this.getPlaybackRate());
					this._fireEvent(this.EVENT_PLAY);
					this._updatingPosition();
				}
				break;
			case MAG_ERROR_CONTENT_NOT_FOUND:
				this._setState(State.ERROR);
				this._fireEvent(this.EVENT_ERROR);
				break;
			case MAG_PLAYER_START_AUDIO:
				break;
			case MAG_PLAYER_METADATA_UPDATED:
				this._fireEvent(this.EVENT_LOADED_META_DATA);
				this._fireEvent(this.EVENT_DURATION_CHANGE, this._plugin.GetMediaLenEx());
				this._isDurationReady = true;
				if (this._isPlayFromPosition) {
					if (this._startPosition < this.getDuration()) {
						this._plugin.SetPosTimeEx(this._startPosition);
					}
					this._isPlayFromPosition = false;
				}
				break;
			case MAG_ERROR_LOAD_SUBTITLES:
				this._setState(State.ERROR);
				this._fireEvent(this.EVENT_ERROR);
				break;
			case MAG_HDMI_CONNECT:
				break;
			case MAG_HDMI_DISCONNECT:
				break;
			case MAG_WRITE_OK:
				break;
			case MAG_WRITE_ERROR:
				this._setState(State.ERROR);
				this._fireEvent(this.EVENT_ERROR);
				break;
			case MAG_RTP_ERROR:
				this._setState(State.ERROR);
				this._fireEvent(this.EVENT_ERROR);
				break;
		}
	}

	/**
	 * @protected
	 */
	_createChromakeyBackground() {
		const color = '#000003';
		this._backgroundColor = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		const rgb = getCSS(document.body, 'background-color');

		if (rgb) {
			const hex = this._rgb2hex(rgb);
			const mask = 0xffffff;
			this._plugin.SetChromaKey(hex, mask);
			this._plugin.SetMode(1);
		}
	}

	/**
	 * @param {string} strRGB
	 * @return {number}
	 * @protected
	 */
	_rgb2hex(strRGB) {
		const exp = /rgba?\((\d+), (\d+), (\d+)(, (\d+))?\)/;
		if (exp.test(strRGB)) {
			const hex = exp.exec(strRGB)
				.slice(1, 4)
				.map((v) => parseInt(v, 10).toString(16))
				.map((v) => v.length < 2 ? '0' + v : v)
				.join('');

			return parseInt(hex, 16);
		}

		return 0;
	}

	/**
	 * @param {number} currentSpeed
	 * @return {number}
	 * @protected
	 */
	_calculateNextSpeed(currentSpeed) {
		let nextSpeed;

		if (currentSpeed <= 0) {
			nextSpeed = MAG_SPEED_FWD_2X;
		} else {
			const nextRate = this._speedToRateMap[currentSpeed] * 2;
			if (nextRate >= 16) {
				nextSpeed = MAG_SPEED_FWD_16X;
			} else {
				nextSpeed = this._rateToSpeedMap[nextRate];
			}
		}

		return nextSpeed;
	}

	/**
	 * @param {number} currentSpeed
	 * @return {number}
	 * @protected
	 */
	_calculatePreviousSpeed(currentSpeed) {
		let prevSpeed;

		if (currentSpeed >= 0) {
			prevSpeed = MAG_SPEED_FWD_2X;
		} else {
			const prevRate = this._speedToRateMap[currentSpeed] * 2;
			if (prevRate <= -16) {
				prevSpeed = MAG_SPEED_FWD_16X;
			} else {
				prevSpeed = this._rateToSpeedMap[prevRate];
			}
		}

		return prevSpeed;
	}

	/**
	 * @protected
	 */
	_updatingPosition() {
		clearTimeout(this._timeoutId);
		this._checkBuffering();
		const state = this.getState();
		if (state === State.PLAYING || state === State.SEEKING) {
			this._fireEvent(this.EVENT_TIME_UPDATE, this.getPosition());
		}
		this._timeoutId = setTimeout(this._updatePositionBinded, 1000);
	}

	/**
	 * @protected
	 */
	_checkBuffering() {
		const currentPosition = this.getPosition();
		if (currentPosition === this._lastPosition) {
			this._setState(State.BUFFERING);
			this._fireEvent(this.EVENT_BUFFERING);
		} else {
			if (this.getState() === State.BUFFERING) {
				this._setState(State.PLAYING);
				this._fireEvent(this.EVENT_PLAY);
			}
			this._lastPosition = currentPosition;
		}
	}
}
