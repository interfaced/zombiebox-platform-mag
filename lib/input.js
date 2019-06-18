/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import AbstractInput from 'zb/device/abstract-input';
import UnsupportedFeature from 'zb/device/errors/unsupported-feature';
import Keys from 'zb/device/input/keys';


/**
 */
export default class Input extends AbstractInput {
	/**
	 */
	constructor() {
		super();

		/**
		 * @const {number}
		 */
		this.GARBAGE_KEYDOWN_CODE = 0;
	}

	/**
	 * @override
	 */
	eventToKeyCode(e) {
		let result = super.eventToKeyCode(e);

		const keys = Keys;
		// NEXT/PREV have same keyCode, but different shiftKey state.
		if (result === keys.NEXT_CHAPTER || result === keys.PREV_CHAPTER) {
			if (e.shiftKey) {
				result = keys.PREV_CHAPTER;
			} else {
				result = keys.NEXT_CHAPTER;
			}
		}

		return result;
	}

	/**
	 * @override
	 */
	setKeyEventHandler(handler) {
		this._keyHandler = (keyboardEvent, ...args) => {
			if (this._isGarbageKeyDown(keyboardEvent)) {
				return true;
			}

			return handler(keyboardEvent, ...args);
		};
	}

	/**
	 * @override
	 */
	isPointingDeviceSupported() {
		return false;
	}

	/**
	 * @override
	 */
	disablePointingDevice() {
		throw new UnsupportedFeature('Pointing device disabled');
	}

	/**
	 * @override
	 */
	enablePointingDevice() {
		throw new UnsupportedFeature('Pointing device enabling');
	}

	/**
	 * @override
	 */
	_createKeysMap() {
		const map = {};

		map[82] = Keys.PLAY_PAUSE;
		map[83] = Keys.STOP;
		map[66] = Keys.REW;
		map[70] = Keys.FWD;

		map[27] = Keys.EXIT;
		map[8] = Keys.BACK;
		map[13] = Keys.ENTER;
		map[116] = Keys.BACKSPACE;
		map[85] = Keys.POWER;

		map[122] = Keys.MENU;
		map[89] = Keys.INFO;
		map[33] = Keys.PAGE_UP;
		map[34] = Keys.PAGE_DOWN;

		// Warn: NEXT/PREV_CHAPTER have same keyCode, but different shiftKey state.
		// Exception added in this.eventToKeyCode
		map[9] = Keys.NEXT_CHAPTER;
		map[9] = Keys.PREV_CHAPTER;

		map[109] = Keys.VOLUME_DOWN;
		map[107] = Keys.VOLUME_UP;
		map[192] = Keys.MUTE;

		map[112] = Keys.RED;
		map[113] = Keys.GREEN;
		map[114] = Keys.YELLOW;
		map[115] = Keys.BLUE;

		map[37] = Keys.LEFT;
		map[39] = Keys.RIGHT;
		map[38] = Keys.UP;
		map[40] = Keys.DOWN;

		map[48] = Keys.DIGIT_0;
		map[49] = Keys.DIGIT_1;
		map[50] = Keys.DIGIT_2;
		map[51] = Keys.DIGIT_3;
		map[52] = Keys.DIGIT_4;
		map[53] = Keys.DIGIT_5;
		map[54] = Keys.DIGIT_6;
		map[55] = Keys.DIGIT_7;
		map[56] = Keys.DIGIT_8;
		map[57] = Keys.DIGIT_9;

		map[117] = Keys.ASPECT_RATIO;

		return map;
	}

	/**
	 * @param {KeyboardEvent} keyboardEvent
	 * @return {boolean}
	 * @protected
	 */
	_isGarbageKeyDown(keyboardEvent) {
		return keyboardEvent.keyCode === this.GARBAGE_KEYDOWN_CODE;
	}
}
