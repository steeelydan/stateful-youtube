const path = require('path');

module.exports = (env, argv) => {
    return {
        mode: env.MODE === 'production' ? 'production' : 'development',
        devtool: env.MODE === 'production' ? false : 'source-map',
        entry: {
            content: './src/content.ts',
            popup: './src/popup.ts',
            options: './src/options.ts'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'build'),
            clean: true
        },
        optimization: {
            minimize: false
        }
    };
};
