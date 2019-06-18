/**
 * Document revision 1.20 (http://soft.infomir.com.ua/mag250/Doc/)
 * JavaScript API version 325
 * STB API version 130
 * MAG200 player version 0x555
 * MAG100 player version 0x23
 */
class MAGgSTB {
	/**
	 * Initializes the player. Call this function before using the player.
	 */
	InitPlayer() {}

	/**
	 * De-initialize the player.
	 */
	DeinitPlayer() {}

	/**
	 * Start playing media content as specified in playStr
	 * @param {string} playStr - string in the form:
	 * "<solution> <URL> [atrack:<anum>] [vtrack:<vnum>] [strack:<snum>] [subURL:<subtitleUrl>]"
	 * <solution> is one of rtp, rtsp, mp3, auto, mpegps, mpegts, mp4
	 * @param {string=} proxyParams - string in the following form:
	 * "http://[username[:password]@]proxy_addr:proxy_port"
	 * Parameters in square brackets are optional and can be omitted.
	 * Note. Proxy server settings are valid till the next call of stb.Play().
	 * Note. Proxy server settings affect only http playback.
	 */
	Play(playStr, proxyParams) {}

	/**
	 * @param {string} solution
	 * @param {string} url
	 */
	PlaySolution(solution, url) {}

	/**
	 * Stops playing.
	 * Continue() shall begin playing from the beginning.
	 */
	Stop() {}

	/**
	 * Pauses current playback.
	 * Continue() continues playing from the current position.
	 */
	Pause() {}

	/**
	 * Continues playing (after Pause()) or begin anew (after Stop()).
	 */
	Continue() {}

	/**
	 * Sets the new position of playback in time
	 * @param {number} time Positive number. The position in seconds from the beginning of the content where the
	 * playback should start (positioning in the content).
	 */
	SetPosTime(time) {}

	/**
	 * Sets the current playback position in time, ms.
	 * @param {number} time Positive number. Position in ms from the beginning of the content where the
	 * playback should start (positioning in the content).
	 */
	SetPosTimeEx(time) {}

	/**
	 * Sets the current position in percent.
	 * @param {number} percent Number between 0..100 The position in percent of the total duration of the
	 * content where the playback should start.
	 */
	SetPosPercent(percent) {}

	/**
	 * Set the current position in percent.
	 * @param {number} percent Number between 0..10000 Position in hundredth fractions of percent of the
	 * total duration of the content, from which the playback should start.
	 */
	SetPosPercentEx(percent) {}

	/**
	 * Gets the current position in time.
	 * @return {number} Current position in second from the beginning of content.
	 */
	GetPosTime() {}

	/**
	 * Gets the current position in time in ms
	 * @return {number} The current position in ms from the beginning of content.
	 */
	GetPosTimeEx() {}

	/**
	 * Gets the current position in percent.
	 * @return {number} The current position in percent of the whole duration of the content.
	 */
	GetPosPercent() {}

	/**
	 * Gets the current position in hundredth fractions of percent.
	 * @return {number} The current position in percent of the whole duration of content.
	 */
	GetPosPercentEx() {}

	/**
	 * Gets the duration of the current content.
	 * @return {number} Total duration of the current content in seconds.
	 */
	GetMediaLen() {}

	/**
	 * Gets the duration of the current content in ms.
	 * @return {number} Total duration of the current content in ms.
	 */
	GetMediaLenEx() {}

	/**
	 * @param {number} speed
	 */
	SetSpeed(speed) {}

	/**
	 * @param {number} pid
	 */
	SetAudioPID(pid) {}

	/**
	 * @param {number} pid
	 */
	SetSubtitlePID(pid) {}

	/**
	 * @param {number} state
	 * @param {number} scale
	 * @param {number} x
	 * @param {number} y
	 */
	SetPIG(state, scale, x, y) {}

	/**
	 * @param {number} alpha
	 */
	SetAlphaLevel(alpha) {}

	/**
	 * @param {number} volume
	 */
	SetVolume(volume) {}

	/**
	 * @param {number} mode
	 */
	SetUserFlickerControl(mode) {}

	/**
	 * @param {number} state
	 * @param {number} flk
	 * @param {number} shp
	 */
	SetFlicker(state, flk, shp) {}

	/**
	 * @param {number} state
	 */
	SetDefaultFlicker(state) {}

	/**
	 * @param {number} loop
	 */
	SetLoop(loop) {}

	/**
	 * @param {number} mode
	 */
	SetVideoControl(mode) {}

	/**
	 * @param {number} state
	 */
	SetVideoState(state) {}

	/**
	 * @param {number} key
	 * @param {number} mask
	 */
	SetChromaKey(key, mask) {}

	/**
	 * @param {number} mode
	 */
	SetMode(mode) {}

	/**
	 * @param {number} winNum
	 * @param {number} mode
	 */
	SetWinMode(winNum, mode) {}

	/**
	 * @param {number} winNum
	 */
	SetTopWin(winNum) {}

	/**
	 * @param {number} winNum
	 * @param {number} alpha
	 */
	SetWinAlphaLevel(winNum, alpha) {}

	/**
	 * @param {number} aspect
	 */
	SetAspect(aspect) {}

	/**
	 * @param {number} angle
	 */
	Rotate(angle) {}

	/**
	 * @param {number} mute
	 */
	SetMute(mute) {}

	/**
	 * @param {number} micvol
	 */
	SetMicVolume(micvol) {}

	/**
	 * @return {number}
	 */
	GetMicVolume() {}

	/**
	 * @return {number}
	 */
	GetVolume() {}

	/**
	 * @return {number}
	 */
	GetMute() {}

	/**
	 *
	 */
	Step() {}

	/**
	 * @param {number} type
	 * @param {number} flags
	 */
	SetupRTSP(type, flags) {}

	/**
	 * @param {number} xsize
	 * @param {number} ysize
	 * @param {number} x
	 * @param {number} y
	 */
	SetViewport(xsize, ysize, x, y) {}

	/**
	 * @param {number} xSize
	 * @param {number} ySize
	 * @param {number} xPos
	 * @param {number} yPos
	 * @param {number} cXSize
	 * @param {number} cYSize
	 * @param {number} cXPos
	 * @param {number} cYPos
	 * @param {boolean} saveClip
	 */
	SetViewportEx(xSize, ySize, xPos, yPos, cXSize, cYSize, cXPos, cYPos, saveClip) {}

	/**
	 * @return {boolean}
	 */
	IsPlaying() {}

	/**
	 * @return {string}
	 */
	Version() {}

	/**
	 * @param {number} flags
	 */
	SetupSPdif(flags) {}

	/**
	 * @param {boolean} enable
	 */
	SetSubtitles(enable) {}

	/**
	 * @param {number} size
	 */
	SetSubtitlesSize(size) {}

	/**
	 * @param {string} font
	 */
	SetSubtitlesFont(font) {}

	/**
	 * @param {number} offs
	 */
	SetSubtitlesOffs(offs) {}

	/**
	 * @return {number}
	 */
	GetSpeed() {}

	/**
	 * @return {number}
	 */
	GetAudioPID() {}

	/**
	 * @return {number}
	 */
	GetSubtitlePID() {}

	/**
	 * @return {boolean}
	 */
	GetPIG() {}

	/**
	 * @return {number}
	 */
	GetAlphaLevel() {}

	/**
	 * @param {number} winNum
	 * @return {number}
	 */
	GetWinAlphaLevel(winNum) {}

	/**
	 * @param {number} color
	 */
	SetTransparentColor(color) {}

	/**
	 * @return {number}
	 */
	GetTransparentColor() {}

	/**
	 * @param {boolean} ignore
	 */
	IgnoreUpdates(ignore) {}

	/**
	 * @param {string} action
	 */
	ExecAction(action) {}

	/**
	 * @param {number} CASType
	 */
	SetCASType(CASType) {}

	/**
	 * @param {string} serverAddr
	 * @param {number} serverPort
	 * @param {string} companyName
	 * @param {number} opID
	 * @param {number} errorLevel
	 */
	SetCASParam(serverAddr, serverPort, companyName, opID, errorLevel) {}

	/**
	 * @param {string} paramName
	 * @param {string} paramValue
	 */
	SetAdditionalCasParam(paramName, paramValue) {}

	/**
	 * @param {string} iniFileName
	 */
	LoadCASIniFile(iniFileName) {}

	/**
	 * @param {number} isSoftware
	 */
	SetCASDescrambling(isSoftware) {}

	/**
	 * @return {number}
	 */
	GetAspect() {}

	/**
	 * @param {boolean} standby
	 */
	StandBy(standby) {}

	/**
	 * Выполнить скрипт /home/default/rdir.cgi с заданными параметрами, и вернуть
	 * стандартный вывод данного скрипта.
	 * В rdir.cgi, поставляемом с корневой файловой системой, уже предустановленны
	 * несколько команд:
	 * stb.RDir("SerialNumber",x) – в x вернёт серийный номер данного устройства.
	 * stb.RDir("MACAddress",x) – получить MAC адрес
	 * stb.RDir("IPAddress",x) – получить IP адрес
	 * stb.RDir("HardwareVersion",x) – получить версию аппаратного обеспечения
	 * stb.RDir("Vendor",x) – получить имя производителя STB
	 * stb.RDir("Model ",x) – получить имя модели STB
	 * stb.RDir("ImageVersion",x) – получить версию образа прошитого программного обеспечения
	 * stb.RDir("ImageDescription",x) – получить информацию о образе прошитого программного обеспечения
	 * stb.RDir("ImageDate",x) – получить дату создания образа прошитого программного обеспечения.
	 * vstb.RDir("getenv v_name",x) – получить значение переменной среды с именем v_name.
	 * stb.RDir("setenv v_name value") – установить переменную среды с именем v_name в значение value.
	 * vstb.RDir("ResolveIP hostname") – получить IP адрес по имени хоста.
	 *
	 * @param {string} par Строка содержит параметры, с которыми будет запускаться скрипт /home/default/rdi.cgi.
	 * @return {string}
	 */
	RDir(par) {}

	/**
	 * @param {string} priLang
	 * @param {string} secLang
	 */
	SetAudioLangs(priLang, secLang) {}

	/**
	 * @param {string} priLang
	 * @param {string} secLang
	 */
	SetSubtitleLangs(priLang, secLang) {}

	/**
	 * @return {string}
	 */
	GetAudioPIDs() {}

	/**
	 * @return {string}
	 */
	GetSubtitlePIDs() {}

	/**
	 * @return {string}
	 */
	ReadCFG() {}

	/**
	 * @param {string} cfg
	 */
	WriteCFG(cfg) {}

	/**
	 * @param {string} prefs
	 */
	WritePrefs(prefs) {}

	/**
	 * @param {string} debugString
	 */
	Debug(debugString) {}

	/**
	 * @param {string} fileExts
	 */
	SetListFilesExt(fileExts) {}

	/**
	 * @param {string} dirname
	 * @return {string}
	 */
	ListDir(dirname) {}

	/**
	 * @param {number} bri
	 */
	SetBrightness(bri) {}

	/**
	 * @param {number} sat
	 */
	SetSaturation(sat) {}

	/**
	 * @param {number} con
	 */
	SetContrast(con) {}

	/**
	 * @return {number}
	 */
	GetBrightness() {}

	/**
	 * @return {number}
	 */
	GetSaturation() {}

	/**
	 * @return {number}
	 */
	GetContrast() {}

	/**
	 *
	 */
	DeleteAllCookies() {}

	/**
	 * @param {number} mode
	 */
	SetAudioOperationalMode(mode) {}

	/**
	 * @param {number} type
	 */
	SetHDMIAudioOut(type) {}

	/**
	 * @param {number} high
	 * @param {number} low
	 */
	SetDRC(high, low) {}

	/**
	 * @param {number} mode
	 */
	SetStereoMode(mode) {}

	/**
	 * @param {boolean} enable
	 */
	EnableJavaScriptInterrupt(enable) {}

	/**
	 * @param {number} start
	 * @param {number} end
	 * @param {number} text
	 */
	ShowSubtitle(start, end, text) {}

	/**
	 *
	 */
	StartLocalCfg() {}

	/**
	 *
	 */
	ShowVirtualKeyboard() {}

	/**
	 *
	 */
	HideVirtualKeyboard() {}

	/**
	 * @param {boolean} enable
	 */
	EnableServiceButton(enable) {}

	/**
	 * @param {boolean} enable
	 */
	EnableVKButton(enable) {}

	/**
	 * @param {boolean} enable
	 */
	EnableSpatialNavigation(enable) {}

	/**
	 * @param {string} domain
	 * @param {boolean} enable
	 */
	EnableSetCookieFrom(domain, enable) {}

	/**
	 * @param {number} sizeInMs
	 * @param {number} maxSizeInBytes
	 */
	SetBufferSize(sizeInMs, maxSizeInBytes) {}

	/**
	 * @return {number}
	 */
	GetBufferLoad() {}

	/**
	 * @param {string} proxyAddr
	 * @param {number} proxyPort
	 * @param {string=} userName
	 * @param {string=} passwd
	 * @param {string=} excludeList
	 */
	SetWebProxy(proxyAddr, proxyPort, userName, passwd, excludeList) {}

	/**
	 * @return {string} Like: '{frameRate:23976,pictureWidth:1280,pictureHeight:544,hPAR:1,vPAR:1}'
	 * or '{}' or empty string.
	 */
	GetVideoInfo() {}

	/**
	 * @return {string} JSON string!!!
	 */
	GetMetadataInfo() {}

	/**
	 * @param {number} mode
	 */
	SetAutoFrameRate(mode) {}

	/**
	 * @param {number} forceDVI
	 */
	ForceHDMItoDV(forceDVI) {}

	/**
	 * @param {string} url
	 */
	LoadExternalSubtitles(url) {}

	/**
	 * @param {string} encoding
	 */
	SetSubtitlesEncoding(encoding) {}

	/**
	 * @param {string} args JSON string!!!
	 * @return {string} JSON string!!!
	 */
	GetEnv(args) {}

	/**
	 * @param {string} args JSON string!!!
	 * @return {boolean}
	 */
	SetEnv(args) {}

	/**
	 * @return {string}
	 */
	GetDeviceSerialNumber() {}

	/**
	 * @return {string}
	 */
	GetDeviceVendor() {}

	/**
	 * @return {string}
	 */
	GetDeviceModel() {}

	/**
	 * @return {string}
	 */
	GetDeviceVersionHardware() {}

	/**
	 * @return {string}
	 */
	GetDeviceMacAddress() {}

	/**
	 * @return {string}
	 */
	GetDeviceActiveBank() {}

	/**
	 * @return {string}
	 */
	GetDeviceImageVersion() {}

	/**
	 * @return {string}
	 */
	GetDeviceImageDesc() {}

	/**
	 * @return {string}
	 */
	GetDeviceImageVersionCurrent() {}

	/**
	 * @return {boolean}
	 */
	GetLanLinkStatus() {}

	/**
	 * @return {boolean}
	 */
	GetWifiLinkStatus() {}

	/**
	 * @param {string} passPhrase
	 * @return {string} JSON string!!!
	 */
	GetWepKey64ByPassPhrase(passPhrase) {}

	/**
	 * @param {string} passPhrase
	 * @return {string} JSON string!!!
	 */
	GetWepKey128ByPassPhrase(passPhrase) {}

	/**
	 * @return {string} JSON string!!!
	 */
	GetWifiGroups() {}

	/**
	 * @param {string} serviceName
	 * @param {string} action
	 * @return {string} JSON string!!!
	 */
	ServiceControl(serviceName, action) {}

	/**
	 * @return {string} JSON string!!!
	 */
	GetSmbGroups() {}

	/**
	 * @param {string} args JSON string!!!
	 * @return {string} JSON string!!!
	 */
	GetSmbServers(args) {}

	/**
	 * @param {string} args JSON string!!!
	 * @return {string} JSON string!!!
	 */
	GetSmbShares(args) {}

	/**
	 * @param {string} fileName
	 * @return {boolean}
	 */
	IsFolderExist(fileName) {}

	/**
	 * @param {string} fileName
	 * @return {boolean}
	 */
	IsFileExist(fileName) {}

	/**
	 * @param {string} pargs
	 */
	SendEventToPortal(pargs) {}

	/**
	 * @return {boolean}
	 */
	IsWebWindowExist() {}

	/**
	 * @return {boolean}
	 */
	IsInternalPortalActive() {}

	/**
	 * @param {boolean} enable
	 */
	EnableAppButton(enable) {}

	/**
	 * @param {string} httpHeader
	 */
	SetCustomHeader(httpHeader) {}
}


/**
 * @type {MAGgSTB}
 */
window.gSTB;
