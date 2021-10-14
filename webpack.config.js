const fs = require('fs');
const path = require('path');

const nodeModules = {};

fs.readdirSync('node_modules')
    .filter(x => {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(mod => {
        return (nodeModules[mod] = 'commonjs ' + mod);
    });

const parseEntryPoints = () => {
    const ENTRY_POINT_DIR = './src/entry-points';
    const entryPoints = {};
    const searchDirForEntryPoints = (dirName, depth) => {
        if (depth > 2) {
            throw new Error('max depth reached');
        }
        fs.readdirSync(dirName)
        .forEach(entryPoint => {
            if (fs.lstatSync(dirName + '/' + entryPoint).isDirectory()) {
                searchDirForEntryPoints(dirName + '/' + entryPoint, depth + 1);
            } else {
                const name = (dirName + '/' + entryPoint.split('.')[0]).replace(ENTRY_POINT_DIR + '/', '');
                entryPoints[name] = dirName + '/' + entryPoint
            }
        });
    }
    searchDirForEntryPoints(ENTRY_POINT_DIR, 0);
    console.log('Found entry points: ' + JSON.stringify(entryPoints, null, 2));
    return entryPoints;
}

module.exports = {

    entry: parseEntryPoints(),

    target: 'node',

    mode: 'development',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                // include: __dirname,
                options: require('./tslint.config'),
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },

    plugins: [],

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    externals: nodeModules,

    devtool: 'source-map',
};
