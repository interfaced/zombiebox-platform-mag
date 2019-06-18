const path = require('path');
const patchHTMLFile = require('./patch-identifiers');
const {AbstractPlatform} = require('zombiebox');


/**
 */
class PlatformMAG extends AbstractPlatform {
	/**
	 * @override
	 */
	getName() {
		return 'mag';
	}

	/**
	 * @override
	 */
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {
			include: [
				{
					name: 'MAG',
					externs: [

						path.join(__dirname, 'externs', 'mag250-stb.js'),
						path.join(__dirname, 'externs', 'mag256-stb.js')
					]
				}
			]
		};
	}

	/**
	 * @override
	 */
	async buildApp(application, distDir) {
		const buildHelper = application.getBuildHelper();

		const {name} = application.getConfig().project;
		const {version} = application.getAppPackageJson();

		const fileName = name + '-' + this.getName() + '-index_' + version + '.html';
		const filePath = path.join(distDir, fileName);

		const warnings = await buildHelper.writeIndexHTML(filePath);
		await buildHelper.copyStaticFiles(distDir);
		await patchHTMLFile(filePath);

		return warnings;
	}

	/**
	 * @override
	 */
	buildCLI(yargs, application) {
		super.buildCLI(yargs, application);
	}
}


module.exports = PlatformMAG;
