# 2.0.0 (16.06.2019)

* Code base migrated to ES6 modules
* Support ZombieBox 2.0

# v0.4.1 (17.10.2017)

## Features
* **#6083** Implemented getting locale (Info#locale). 
* **#6146** Added eslint. 

## Fixes
* **#0000 Fixed GCC warnings (pull request #8)

# v0.4.0 (31.03.2017)

## Features
* **#0000** Renamed NPM package to `zombiebox-platform-mag`. :BREAKING:
* **#0000** Renamed namespace `zb.device.platforms.mag250` to `zb.device.platforms.mag`. :BREAKING:
* **#0000** Renamed namespace `mag250.consts` to `zb.device.platforms.mag.consts`. :BREAKING:
* **#0000** Removed `setHttpHeaders`, `getHttpHeaders` from `zb.device.platforms.mag.Video` as unused and backend specific code.
  Use `app.device.getPluginObject().SetCustomHeader('Header: value');` directly instead. :BREAKING:
* **#0000** Removed `zb.device.platforms.mag.base64` helper. :BREAKING:

## Improvements
* **#5026** Added MAG 256 support

# v0.3.0 (17.03.2017)

## Fixes
* **#5998** Fixed aspect ratio namespace.

# v0.2.1 (17.03.2017)

## Features
* **#5043** Added factory method `zb.device.platforms.mag250.factory.createDevice` for create Device instances.
  All global dependencies now located in factory method.
* **#5043** All *.es6 files renamed to *.js

# v0.2.0 (27.07.2016)

## Features
* **#3905** Add ViewPort class which is responsible for managing display area sizes and aspect ratio
* **#4246** Implement getting current video url
* **#4417** Rename abstract Video class (zb.device.Video) to AbstractVideo (zb.device.AbstractVideo)
* **#4491** Transpiled client-side files to ES6

## Improvements
* **#4316** Removed call `_createViewPort()` method from Video constructor
* **#4499** Move calling parent class constructor to the top of child constructors
