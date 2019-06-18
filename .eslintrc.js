const {join, dirname} = require('path');

function resolveModulePath(packageName) {
	const packageInfoPath = require.resolve(`${packageName}/package.json`);
	return join(dirname(packageInfoPath), require(packageInfoPath).module);
}

module.exports = {
	extends: 'interfaced',
	rules: {
		'new-cap': 'off'
	},
	overrides: [
		{
			files: ['lib/**/*.js'],
			rules: {
				'import/no-unresolved': ['error', {ignore: ['^generated/']}]
			},
		},
		{
			files: ['lib/**/*.js'],
			settings: {
				'import/resolver': {
					alias: [
						['zb', resolveModulePath('zombiebox')],
					]
				}
			},
			...require('eslint-config-interfaced/overrides/esm')
		},
		{
			files: ['index.js', 'patch-identifiers.js'],
			...require('eslint-config-interfaced/overrides/node')
		},
		{
			files: ['index.js'],
			rules: {
				'node/no-unsupported-features/es-builtins': ["error", { "version": ">=8.9" }],
				'node/no-unsupported-features/es-syntax': ["error", { "version": ">=8.9" }],
				'node/no-unsupported-features/node-builtins': ["error", { "version": ">=8.9" }]
			}
		},
		{
			files: ['externs/**/*.js'],
			...require('eslint-config-interfaced/overrides/externs')
		}
	]
};
