/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {Common, Proportion} from 'zb/device/aspect-ratio/proportion';
import AbstractViewPort from 'zb/device/abstract-view-port';
import {Transferring} from 'zb/device/aspect-ratio/aspect-ratio';
import Point from 'zb/geometry/point';
import Rect from 'zb/geometry/rect';


/**
 */
export default class ViewPort extends AbstractViewPort {
	/**
	 * @param {Rect} containerRect
	 * @param {MAGgSTB} plugin
	 */
	constructor(containerRect, plugin) {
		super(containerRect);

		/**
		 * @type {MAGgSTB}
		 * @protected
		 */
		this._plugin = plugin;

		/**
		 * Multipliers of standart resolutions
		 * @type {Object<Proportion, number>}
		 * @protected
		 */
		this._aspectRatioMultiplierMap = this._buildAspectRatioMultiplierMap();

		/**
		 * @type {number}
		 * @protected
		 */
		this._coefficient = this._getPlatformVideoMode() / containerRect.getSizeY();

		/**
		 * @type {{
		 *     width: number,
		 *     height: number
		 * }}
		 * @protected
		 */
		this._videoInfo;
	}

	/**
	 * @override
	 */
	hasAspectRatioFeature() {
		return true;
	}

	/**
	 * @override
	 */
	hasAreaChangeFeature() {
		return true;
	}

	/**
	 * @override
	 */
	isAspectRatioSupported(ratio) {
		const commonProportions = [
			Common.AUTO,
			Common.KEEP,
			Common.X4X3,
			Common.X16X9
		];
		const proportion = ratio.getProportion();

		return commonProportions.indexOf(proportion) !== -1;
	}

	/**
	 * @override
	 */
	updateViewPort() {
		this._resetPlatformAspectRatio();
		const clippingArea = this._calculateClippingArea();
		const coefficient = this._coefficient;

		const area = this._calculateScreenArea()
			.scale(Point.create(coefficient, coefficient));

		this._plugin.SetViewportEx(
			area.getSizeX(), area.getSizeY(), area.x0, area.y0,
			clippingArea.getSizeX(), clippingArea.getSizeY(), clippingArea.x0, clippingArea.y0,
			true
		);
	}

	/**
	 * @protected
	 */
	_resetPlatformAspectRatio() {
		this._plugin.SetAspect(0);
	}

	/**
	 * @return {number}
	 * @protected
	 */
	_getPlatformVideoMode() {
		return parseInt(this._plugin.RDir('vmode'), 10);
	}

	/**
	 * @protected
	 */
	_updateVideoInfo() {
		let videoWidth = 0;
		let videoHeight = 0;
		const videoInfoStr = this._plugin.GetVideoInfo();
		if (videoInfoStr) {
			const videoInfo = videoInfoStr.split(',');
			if (videoInfo.length > 2) {
				videoWidth = parseInt(videoInfo[1].split(':')[1], 10);
				videoHeight = parseInt(videoInfo[2].split(':')[1], 10);
			}
		}

		const area = this.getCurrentArea();

		this._videoInfo = {
			width: videoWidth || area.getSizeX(),
			height: videoHeight || area.getSizeY()
		};
	}

	/**
	 * @return {Rect}
	 * @protected
	 */
	_calculateClippingArea() {
		const transferring = this._aspectRatio.getTransferring();
		const area = this.getCurrentArea();
		const screenMultiplier = area.getSizeY() / area.getSizeX();
		const multiplier = this._getAspectRatioMultiplier(this._aspectRatio.getProportion());
		let width = this._videoInfo.width;
		let height = this._videoInfo.height;
		const isCropMode = transferring === Transferring.CROP;

		if (isCropMode) {
			if (multiplier > screenMultiplier) {
				height = width * screenMultiplier;
			} else {
				width = height / screenMultiplier;
			}
		}

		const x = (this._videoInfo.width - width) / 2;
		const y = (this._videoInfo.height - height) / 2;

		return Rect.createByNumbers(...[x, y, width, height].map((v) => Math.floor(v)));
	}

	/**
	 * @return {Rect}
	 * @protected
	 */
	_calculateScreenArea() {
		const area = this.getCurrentArea();
		const transferring = this._aspectRatio.getTransferring();
		const screenMultiplier = area.getSizeY() / area.getSizeX();
		const multiplier = this._getAspectRatioMultiplier(this._aspectRatio.getProportion());
		const isLetterBoxMode = transferring === Transferring.LETTERBOX;
		const maxHeight = area.getSizeY();
		const maxWidth = area.getSizeX();
		let width = maxWidth;
		let height = maxHeight;

		let letterBoxOffsetX = 0;
		let letterBoxOffsetY = 0;

		if (isLetterBoxMode) {
			if (multiplier > screenMultiplier) {
				width = maxHeight / multiplier;
			} else {
				height = maxWidth * multiplier;
			}
			letterBoxOffsetX = (maxWidth - width) / 2;
			letterBoxOffsetY = (maxHeight - height) / 2;
		}

		return Rect.createByNumbers(
			area.x0 + letterBoxOffsetX,
			area.y0 + letterBoxOffsetY,
			width,
			height
		);
	}

	/**
	 * @return {Object<Proportion, number>}
	 * @protected
	 */
	_buildAspectRatioMultiplierMap() {
		const map = {};
		map[Common.X16X9] = 9 / 16;
		map[Common.X4X3] = 3 / 4;

		return map;
	}

	/**
	 * @param {Proportion} proportion
	 * @return {number}
	 * @protected
	 */
	_getAspectRatioMultiplier(proportion) {
		if (proportion === Common.KEEP || proportion === Common.AUTO) {
			this._updateVideoInfo();

			return this._videoInfo.height / this._videoInfo.width;
		}

		return this._aspectRatioMultiplierMap[proportion];
	}
}
