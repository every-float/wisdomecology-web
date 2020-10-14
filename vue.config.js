const port = 7070;
const title = '西青区大气与水环境信息面板';
const publicPath = '/wisdomecology-web/theme/theme_2';

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    publicPath,
    devServer: {
        port,
    },
    productionSourceMap: false,
    // 这个字段下配置所有跟webpack相关的项，最后会跟vue-cli内置的webpack配置合并并覆盖内置配置
    configureWebpack: {
        // 向index.html注入标题
        name: title,
        
    },
    // 链式的方式配置
    chainWebpack(config) {
        // 1、修改当前项目中默认svg配置：排除icons目录
        config.module.rule('svg')
            .exclude.add(resolve('./src/icons'))

        // 2、新增一个rule：添加icons里面的svg
        config.module.rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('./src/icons')).end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: 'icon-[name]' })

        // 3、添加全局scss文件
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => { //匹配到所有需要导入的文件
            config.module.rule('scss')
                .oneOf(type)
                .use('style-resources-loader')
                .loader('style-resources-loader')
                .options({
                    patterns: [
                        path.resolve(__dirname, './src/assets/css/base.scss')
                    ]
                })
        })

        // 4、别名设置
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'))

        // 5、不压缩index.html文件
        config
            .plugin('html')
            .tap(args => {
                args[0].minify = false
                return args
            })
    }
}