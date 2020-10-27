const $ = jQuery = require("jquery")
const Vue = require("vue");
//const App = require("./components/App.vue").default;
import filesystem from "./filesystem.js";

import App from "./components/App.vue";

require("bootstrap");
require('bootstrap/dist/css/bootstrap.min.css')

Vue.prototype.filesystem = filesystem;

//console.log(Vue);
//Vue.component("app", App);
global.app = new Vue({
    el: '#app',
    template: '<App/>',
    components:{
        App
    }
})
