let constructConfig = require("./build/vue.config.prod.js");

if("development" === process.env.NODE_ENV){
    constructConfig = require("./build/vue.config.dev.js");
}

module.exports = constructConfig(process);