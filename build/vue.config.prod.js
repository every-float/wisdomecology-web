// 引入node api
const path = require('path');

// 引入插件
const CopyPlugin = require("copy-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = function constructConfig(process) {
    const pageUrl = process.env.VUE_APP_PAGEURL;

    //  模式及环境变量
    const nodeEnv = process.env.NODE_ENV;
    const appEnv = process.env.VUE_APP_ENV;
    console.log(`当前模式：${nodeEnv}`);
    console.log(`当前环境：${appEnv}`);
 
    function transformContentOfCommonUrl() {
        return Buffer.from(`var pageUrl= "${pageUrl}";
document.write('<script src="${pageUrl}config/${appEnv}.env.js" type="text/javascript"><\/script>');
document.write('<script src="${pageUrl}config/config.js" type="text/javascript"><\/script>');`);    
    }
    function pathResolve(dir) {
        return path.resolve(__dirname, dir);
    }
    function pathJoin(dir) {
        return path.join(__dirname, dir)
    }

    return {
        publicPath: pageUrl,
        outputDir: pathResolve('../dist/'),
        assetsDir: 'theme/theme_2/static',
        indexPath: 'theme/theme_2/index.html',
        pages: {
            index: {
                entry: pathResolve('../src_screen/main.js'),
                template: pathResolve('../src_screen/index.html'),
            }
        },
        productionSourceMap: false,
        configureWebpack: config => {
            // config.name = '西青区大气与水环境信息面板';
        },
        chainWebpack: config => {
            // src_screen/icons/目录下的svg文件特殊处理
            config.module.rule('svg')
                .exclude.add(pathResolve('../src_screen/icons/'));
            config.module.rule('icons')
                .test(/\.svg$/)
                .include.add(pathResolve('../src_screen/icons/'))
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
                                pathResolve('../src_screen/assets/css/base.scss')
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
                    .exclude.add(pathJoin('../src/'))
            }
    
            // 设置别名
            config.resolve.alias
                .set('@', pathResolve('../src_screen/'));
            
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
            config.plugins.delete('optimize-css');
            // 就是压缩css，用optimize-css-assets-webpack-plugin插件，借助cssnano就能实现
            config.plugin('optimize-css-assets')
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
                                to: pathResolve("../dist/common/commonUrl.js"),
                                context: pathResolve("../src/"),	//基于根目录的上下文
                                transform(content, absoluteFrom) {
                                    return transformContentOfCommonUrl();
                                },
                            },
                            {
                                from: "**/*",
                                to: pathResolve("../dist/"),
                                context: pathResolve("../src/"),
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
    
        },
    }
}