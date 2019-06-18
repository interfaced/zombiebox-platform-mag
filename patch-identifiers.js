const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const cheerio = require('cheerio');

/**
 * @param {Object} ast
 * @return {Object}
 */
const patchAST = (ast) => {
	const KEYWORDS = [
		'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for',
		'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
		'void', 'while', 'with', 'abstract', 'boolean', 'byte', 'char', 'class', 'const', 'debugger', 'double', 'enum',
		'export', 'extends', 'final', 'float', 'goto', 'implements', 'import', 'int', 'interface', 'long', 'native',
		'package', 'private', 'protected', 'public', 'short', 'static', 'super', 'synchronized', 'throws', 'transient',
		'volatile'
	];

	let inheritsPatched = false;
	return estraverse.replace(ast, {
		/**
		 * @param {Object} node
		 * @param {Object} parent
		 * @return {Object|undefined}
		 */
		'enter': (node, parent) => {
			// Patch goog.inherits for prevent iteration over 'prototype' property on WebKit 533.3
			if (
				!inheritsPatched &&
				node['type'] === 'IfStatement' &&
				node['test']['type'] === 'MemberExpression' &&
				node['test']['object']['name'] === 'Object' &&
				node['test']['property']['name'] === 'defineProperties' &&
				node['alternative'] !== undefined
			) {
				const iterablePropertyVariable = node['alternate']['body'][0]['expression']['left']['property']['name'];
				inheritsPatched = true;
				return esprima.parse(`if (${iterablePropertyVariable} !== "prototype") ${escodegen.generate(parent)}`);
			}

			// Escape reserved words
			if (node['type'] !== 'Identifier' || KEYWORDS.indexOf(node['name']) === -1) {
				return undefined;
			}

			if (parent['type'] === 'MemberExpression') {
				parent['computed'] = true;
			} else if (parent['type'] !== 'Property') {
				return undefined;
			}

			node['value'] = node['name'];

			node['type'] = 'Literal';

			delete node['name'];
			return undefined;
		}
	});
};

/**
 * JS interpreter supplied by vendor interprets all keywords-like properties
 * (`myObject.delete` for example) as a keyword even if it's not
 * The following patch replaces every usage of keywords-like properties
 * @param {string} codeString
 * @return {string}
 */
const patchIdentifiers = (codeString) => {
	const outputFormat = {
		format: {
			indent: {
				style: '',
				newline: '',
				space: ''
			},
			compact: true
		}
	};

	const ast = esprima.parse(codeString);

	return escodegen.generate(patchAST(ast), outputFormat);
};

/**
 * @param {string} filepath
 */
const patchHTMLFile = (filepath) => {
	const src = fs.readFileSync(filepath);
	const $ = cheerio.load(src);

	$('script').each((index, script) => {
		const scriptTag = $(script);
		scriptTag.text(patchIdentifiers(scriptTag.text()));
	});

	fs.writeFileSync(filepath, $.html(), 'utf-8');
};

module.exports = patchHTMLFile;
