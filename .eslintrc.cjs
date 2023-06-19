module.exports = {
    env: {
        es2021: true,
        browser: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    overrides: [],
    ignorePatterns: [
        '.eslintrc.cjs',
        'build',
        'dist',
        'node_modules',
        'webpack.config.cjs',
        'webext-types.d.ts'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: '2021',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    settings: {},
    rules: {
        'no-warning-comments': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/ban-ts-comment': 1,
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ]
    }
};
