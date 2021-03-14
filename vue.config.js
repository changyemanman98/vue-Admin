const path = require('path');
module.exports = {
    // - runtimecompiler:  template 解析 ast（抽象语法树）编译 render  —> v-dom —> ui
    // - runtimeonly: render  —> v-dom —> ui
    runtimeCompiler: true,
    // 配置快捷路径
    configureWebpack: (config) => {
        config.resolve = {
            // 省略文件名后缀
            extensions: ['.js', '.json', '.vue'],
            alias: {
                'vue': 'vue/dist/vue.js',
                '@': path.resolve(_dirname, './src'),
            }
        }
    },
    chainWebpack: config => {
        const svgRule = config.module.rule("svg");     
        svgRule.uses.clear();     
        svgRule       
          .use("svg-sprite-loader")       
          .loader("svg-sprite-loader")       
          .options({         
            symbolId: "icon-[name]",         
            include: ["./src/icons"]       
          });  
    },
    // 基本路径 baseURL已经过时
    // publicPath: process.env.NODE_ENV == "production" ? "./" : "/",
    // publicPath: './',
    // 输出文件目录
    // outputDir: 'dist',

    publicPath: process.env.NODE_ENV === "production" ? "" : "/",
    outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",

    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    configureWebpack: () => {},
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            sass: {
                prependData: '@import "./src/styles/main.scss";'
            }
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    lintOnSave: false,
    // webpack-dev-server 相关配置
    devServer: {
        open: true,
        disableHostCheck: true,
        host: '0.0.0.0', //如果是真机测试，就使用这个IP
        port: 8080,
        https: false,
        hotOnly: true,
        proxy: {
            '/devapi': {
                target: 'http://www.web-jshtml.cn/productapi/token', //API服务器的地址
                changeOrigin: true,
                pathRewrite: {
                    '^/devapi': ''
                }
            }
        },
        before: app => {}
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
}