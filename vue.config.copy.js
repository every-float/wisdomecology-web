// 开发时常用配置
const devConfigs = {
    port: 9000,
    open: true,
    // openPage: "theme/theme_2/index.html",
    openPage: "index.html",
};

/**
 * 部署目录
 * '/' 表示根目录下
 */ 	
const pageUrl = process.env.VUE_APP_PAGEURL;

//  模式及环境变量
const nodeEnv = process.env.NODE_ENV;
const appEnv = process.env.VUE_APP_ENV;
console.log(`当前模式：${nodeEnv}`);
console.log(`当前环境：${appEnv}`);
console.log("copy++++++++++++++++++++++++++++++++++++++++++");

// 引入node api
const path = require('path');

// 引入插件
const CopyPlugin = require("copy-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const FileManagerPlugin = require('filemanager-webpack-plugin');

// Function
/**
 * 转化common/commonUrl.js的代码为本环境下对应代码
 */ 
function transformContentOfCommonUrl() {
	return Buffer.from(`var pageUrl= "${pageUrl}";
document.write('<script src="${pageUrl}config/${appEnv}.env.js" type="text/javascript"><\/script>');
document.write('<script src="${pageUrl}config/config.js" type="text/javascript"><\/script>');`);
}
/**
 * path.resolve
 * @param {*} dir 
 */
function pathResolve(dir) {
    return path.resolve(__dirname, dir);
}
/**
 * path.join
 * @param {*} dir 
 */
function pathJoin(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: pageUrl,
    // outputDir: path.resolve(__dirname, './dist/theme/theme_2'),
    outputDir: path.resolve(__dirname, './dist/'),
    // assetsDir: 'static',
    assetsDir: 'theme/theme_2/static',
    indexPath: 'theme/theme_2/index.html',
    // 该字段生产环境下无效
    devServer: {
        ...devConfigs,
        proxy: {
            '/wisdomecology-boot': {
                target: process.env.VUE_APP_ROOTBASE,
                changeOrigin: true,
                pathRewrite: {
                  '^/wisdomecology-boot': '/wisdomecology-boot'
                }
            },
            '/wisdomecology': {
                target: process.env.VUE_APP_ROOTJSON,
                changeOrigin: true,
                pathRewrite: {
                  '^/wisdomecology': '/bigdata/file/wisdomecology'
                }
            }
        }
    },
    pages: {
        index: {
            entry: './src_screen/main.js',
            template: path.resolve(__dirname, './src_screen/index.html'),
        }
    },
    productionSourceMap: false,
    configureWebpack: config => {
        // config.name = '西青区大气与水环境信息面板';
    },
    chainWebpack: config => {
        // src_screen/icons/目录下的svg文件特殊处理
        config.module.rule('svg')
            .exclude.add(pathResolve('./src_screen/icons/'));
        config.module.rule('icons')
            .test(/\.svg$/)
            .include.add(pathResolve('./src_screen/icons/'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: 'icon-[name]' })

        // 已有loader的额外处理
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => { 
            config.module.rule('scss')
                .oneOf(type)
                .use('style-resources-loader')
                    .loader('style-resources-loader')
                    .options({
                        patterns: [
                            pathResolve('./src_screen/assets/css/base.scss')
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

        // 禁止使用eslint loader，检查太严格了，有一些定义的变量没有被调用就编译不过去，暂且禁用掉
        delete(config.module.rule('eslint'));

        // 所有的内置loader均exclude掉/src目录
        for(let key of config.module.rules.store.keys()){
            config.module.rule(key)
                .exclude.add(pathJoin('./src/'))
        }

        // 设置别名
        config.resolve.alias
            .set('@', pathResolve('./src_screen/'));
        
        // src_screen的index.html额外处理
        const dev_extra_scripts = [
            `https://api.map.baidu.com/api?v=3.0&ak=mE0GRctNh8W2180rEH5g95FXsEwmhhlp&s=1`,
            `${pageUrl}common/commonUrl.js`,
        ]
        config.plugin('html-index')
            .tap(args => {
                args[0].minify = false;
                args[0].files = {
                    js: dev_extra_scripts
                };
                return args;
            });
        
        // vuecli内置的OptimizeCssnanoPlugin插件文档不好，不能限定处理范围，删除之
        nodeEnv==='production' && config.plugins.delete('optimize-css');
        // 就是压缩css，用optimize-css-assets-webpack-plugin插件，借助cssnano就能实现
        nodeEnv==='production' && config.plugin('optimize-css-assets')
            .use(OptimizeCSSAssetsPlugin, [
                {
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require("cssnano"), //引入cssnano配置压缩选项
                    cssProcessorOptions: {
                        discardComments: { removeAll: true }
                    },
                    cssProcessorPluginOptions: {
                        preset: ['default', { discardComments: { removeAll: true } }],
                    },
                    canPrint: true
                }
            ]);
        
        // src目录下的复制及相关处理，需要创建一个copy-webpack-plugin插件
        config.plugin('copy-main')
            .use(CopyPlugin, [
                {
                    patterns: [
                        {
                            from: "./common/commonUrl.js",
                            to: pathResolve("./dist/common/commonUrl.js"),
                            context: pathResolve("./src/"),	//基于根目录的上下文
                            transform(content, absoluteFrom) {
                                return transformContentOfCommonUrl();
                            },
                        },
                        {
                            from: "**/*",
                            to: pathResolve("./dist/"),
                            context: pathResolve("./src/"),
                            globOptions: {
                                ignore: [
                                    "**/src/config/!(" + appEnv + ").env.js",
                                    "**/src/common/commonUrl.js"
                                ],
                            },
                            // toType: 'dir',
                            noErrorOnMissing: true,
                        },
                    ],
                    options: {
                        concurrency: 100,
                    },
                }
            ]);

        
        
            /**
         * 开发模式下，打包之后，也移动index.html到theme_2目录下
         * MovePlugin不好使
         */
        // config.plugin('file-manager')
        //     .use(FileManagerPlugin, [
        //         {
        //             events: {
        //                 onEnd: [
        //                     {
        //                         move: [
        //                             { source: './dist/index.html', destination: './dist/theme/theme_2/index.html' },
        //                         ],
        //                     },
        //                 ]
        //             }
        //         }
        //     ]);

    },
}