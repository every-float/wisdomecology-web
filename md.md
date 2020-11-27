一、开发者本地环境：
    1、安装node环境：
        官方安装包地址：https://nodejs.org/zh-cn/;
        版本：node>=8.0;
        检查是否安装成功：node -v，打印出版本号说明已安装成功；
    2、npm相关说明：
        安装完node的同时会默认将npm一并装上，无须再次安装npm;
        检查是否安装成功：npm -v，打印出版本号说明已安装成功；
        设置国内淘宝镜像源（下载包的速度会快很多）：
            - 执行此命令设置淘宝源：npm config set registry https://registry.npm.taobao.org
            - 检查是否设置成功：npm config get registry，打印出https://registry.npm.taobao.org/说明设置成功
            - 如果想还原npm仓库地址的话，只需要在把地址配置成npm镜像就可以了：
                npm config set registry https://registry.npmjs.org/
    3、安装Git：
        官方安装包地址：https://git-scm.com/
    4、安装vue-cli：
        执行命令安装：npm install -g @vue/cli
        检查是否安装成功：执行vue -V，打印出版本号说明已安装成功
        安装了vue-cli，就无须再安装webpack了，vue-cli内置了webpack
        
二、获取项目：
    1、项目的git地址：https://gitee.com/jyhc/wisdomecology-web.git，克隆到本地，并新建一个自己的分支
        - src目录下是主项目源码，跟svn上的代码是一样的，只是把之前的theme2文件夹去掉了
        - src_screen目录下是大屏源码，就是之前theme2的源代码
    2、安装项目依赖：项目根目录执行命令npm install
    3、开发环境启动项目：项目根目录执行命令npm run dev
    4、打测试包：项目根目录执行命令npm run build:test
    5、打线上包：项目根目录执行命令npm run build:pro
    6、如果有其他线上环境，在项目根目录新建一个 (.env.[当前环境名]) 的文件，在文件中配置上对应的环境变量，并且在package.json文件的scripts字段中新增一条对应环境变量的命令行即可（还可以不用这么麻烦，直接修改env.pro文件中VUE_APP_ENV变量的值，然后直接执行这个命令打包即可：./node_modules/.bin/vue-cli-service build --mode [环境名]）
    7、打包后的代码在dist目录中

三、下面是一些笔记：
    1、路由切换的时候，被切换掉了的组件是走了 beforeDestroy钩子 和 destryed钩子 的。
