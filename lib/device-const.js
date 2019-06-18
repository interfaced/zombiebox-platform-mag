/*
 * This file is part of the ZombieBox package.
 *
 * Copyright © 2013-2019, Interfaced
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


/** @const */
export const MAG_SPEED_FWD_1X = 1;


/** @const */
export const MAG_SPEED_FWD_2X = 2;


/** @const */
export const MAG_SPEED_FWD_4X = 3;


/** @const */
export const MAG_SPEED_FWD_8X = 4;


/** @const */
export const MAG_SPEED_FWD_16X = 5;


/** @const */
export const MAG_SPEED_FWD_0_5X = 6;


/** @const */
export const MAG_SPEED_FWD_0_25X = 7;


/** @const */
export const MAG_SPEED_FWD_12X = 8;


/** @const */
export const MAG_SPEED_BWD_1X = -1;


/** @const */
export const MAG_SPEED_BWD_2X = -2;


/** @const */
export const MAG_SPEED_BWD_4X = -3;


/** @const */
export const MAG_SPEED_BWD_8X = -4;


/** @const */
export const MAG_SPEED_BWD_16X = -5;


/** @const */
export const MAG_SPEED_BWD_12X = -8;


/** @const {number} Плеер достиг окончания медиа контента или зафиксировал длительный разрыв потока. */
export const MAG_END_OF_STREAM = 1;


/** @const {number} Получена информация о аудио и видео дорожках медиа контента */
export const MAG_PLAYER_GET_TRACK_INFO = 2;


/** @const {number} Начало отображаться видео и/или воспроизводиться звук. */
export const MAG_START_PLAYING = 4;


/**
 * @const {number}
 * Ошибка открытия контента: нет такого контента на сервере или произошёл отказ при соединении с сервером.
 */
export const MAG_ERROR_CONTENT_NOT_FOUND = 5;


/** @const {number} Началось воспроизведение DualMono AC-3 звука. */
export const MAG_PLAYER_START_AUDIO = 6;


/** @const {number} Получена информация о видео контенте */
export const MAG_PLAYER_METADATA_UPDATED = 7;


/** @const {number} При загрузке субтитров из отдельного файла произошла ошибка. */
export const MAG_ERROR_LOAD_SUBTITLES = 8;


/** @const {number} Было подключено HDMI устройство. */
export const MAG_HDMI_CONNECT = 32;


/** @const {number} Было отключено HDMI устройство */
export const MAG_HDMI_DISCONNECT = 33;


/** @const {number} Задача записи завершилась успешно */
export const MAG_WRITE_OK = 34;


/** @const {number} Задача записи завершилась с ошибкой */
export const MAG_WRITE_ERROR = 35;


/** @const {number} При воспроизведении RTP-потока получен разрыв в нумерации RTP-пакетов. */
export const MAG_RTP_ERROR = 129;
