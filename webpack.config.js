module.exports = {
    entry : './index.js',
    output : {
        path : __dirname,
        filename : '{name}.js'
    },
    module :{
        loaders: [{
            test: /\.js$/,
            loaders: ['babel?presets[]=es2015'],
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            loaders: ['style', 'css'],
            loader: 'style!css!autoprefixer?{browsers:["last 2 version", "> 1%"]}'
        }]
    }
};