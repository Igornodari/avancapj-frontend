/** @type {import('eslint').Linter.FlatConfig} */
module.exports = [
	{
		// Configuração para TypeScript
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: require('@typescript-eslint/parser'),
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
			},
			globals: {
				browser: 'readonly',
				es2021: 'readonly',
				node: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
			import: require('eslint-plugin-import'),
			jsdoc: require('eslint-plugin-jsdoc'),
			'prefer-arrow': require('eslint-plugin-prefer-arrow'),
		},
		rules: {
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'import/no-unresolved': 'off',
			'jsdoc/require-jsdoc': 'off',
			'prefer-arrow/prefer-arrow-functions': 'warn',
		},
		ignores: ['node_modules', 'dist', 'build'],
	},
	{
		// Configuração para JavaScript
		files: ['**/*.js'],
		languageOptions: {
			parser: require('espree'),
		},
		rules: {
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			'no-console': 'warn',
		},
		ignores: ['node_modules', 'dist', 'build'],
	},
];
