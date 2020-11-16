const file_root_path = process.env.VUE_APP_PAGEURL;
const port = 7070;
const title = '西青区大气与水环境信息面板';
const publicPath = '';  //这个值可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
const outputDir = `E:/lvwenji/SVN/wisdomecology-web/theme/theme_3`;
const assetsDir = 'static';

const dev_extra_scripts = [
    `https://api.map.baidu.com/api?v=3.0&ak=mE0GRctNh8W2180rEH5g95FXsEwmhhlp&s=1`,
    `${file_root_path}common/commonUrl.js`,
].concat(process.env.NODE_ENV === 'development' ? [
    `${file_root_path}config/test.env.js`,
    `${file_root_path}config/config.js`,
] : [])


const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    publicPath,
    outputDir,
    assetsDir,
    devServer: {
        port,
        proxy: {
            '/wisdomecology-boot': {
                target: 'https://www.wisdomjyhc.com:19501',
                // target: 'https://xqhj.wisdom-spring.cn:19501',
                changeOrigin: true,
                pathRewrite: {
                  '^/wisdomecology-boot': '/wisdomecology-boot'
                }
            },
            '/wisdomecology': {
                target: 'https://www.wisdomjyhc.com:18091',
                // target: 'https://xqhj.wisdom-spring.cn:18091',
                changeOrigin: true,
                pathRewrite: {
                  '^/wisdomecology': '/bigdata/file/wisdomecology'
                }
            }
        }
    },
    productionSourceMap: false,
    // 这个字段下配置所有跟webpack相关的项，最后会跟vue-cli内置的webpack配置合并并覆盖内置配置
    configureWebpack: {
        // 向index.html注入标题
        name: title,
    },
    // 链式的方式配置
    chainWebpack: config => {
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

        // 3、scss、css规则配置修改
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => { 
            config.module.rule('scss')
                .oneOf(type)
                .use('style-resources-loader')
                    .loader('style-resources-loader')
                    .options({
                        patterns: [
                            path.resolve(__dirname, './src/assets/css/base.scss')
                        ]
                    })
                    .end()
                .use('postcss-loader')
                    .loader('postcss-loader')
                    .end()

            config.module.rule('css')
                .oneOf(type)
                .use('postcss-loader')
                    .loader('postcss-loader')
                    .end()
        });

        // plugins配置
        

        // 4、别名设置
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'))

        // 5、不压缩index.html文件、加载静态js资源
        config
            .plugin('html')
            .tap(args => {
                args[0].minify = false
                args[0].files = {
                    js: dev_extra_scripts
                }
                return args
            })
    }
}