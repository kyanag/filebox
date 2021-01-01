const {remote, shell} = require('electron');
const Menu = remote.Menu;

import toastr from "toastr";
const $ = jQuery = require("jquery")
const Vue = require("vue");
//const App = require("./components/App.vue").default;
import filesystem from "./api/filesystem.js";

import App from "./components/App.vue";

require("bootstrap");
require('bootstrap/dist/css/bootstrap.min.css')
require("toastr/build/toastr.css");


Vue.prototype.filesystem = filesystem;
Vue.prototype.toastr = toastr;
Vue.prototype.api = {
    showMenu:function(menus){
        let menu = Menu.buildFromTemplate(menus);
        menu.popup(remote.getCurrentWindow());
        return menu;
    }
};

Vue.prototype.$eventBus = new Vue();

let store = {};
Vue.prototype.getStore = function(){
    return store;
};

//可拖动得
Vue.directive('draggable', {
    bind: function (el, binding, vnode) {
        let store = vnode.context.getStore();

        let value = binding.value;
        let topics = Object.keys(binding.modifiers);
        
        if(topics.length == 0){
            topics = ["_"];
        }

        el.ondragstart = (event) => {
            topics.forEach( topic => {
                store[topic] = value;
            });
        };
        el.ondragend = (event) => {
            setTimeout( () => {
                console.log("ondragend");
                topics.forEach( topic => {
                    delete store[topic];
                });
            }, 10);
        }
    }
});
Vue.directive("rightclick", {
    bind: function (el, binding, vnode) {
        let file = binding.value;
        let app = vnode.context;
        
        console.log(vnode);

        el.oncontextmenu = function(e){
            e.preventDefault();
            let tpl = [
                {
                    label: "在文件资源管理器打开",
                    click: () => {
                        app.filesystem.show(file);
                    }
                },
                {
                    label: "刷新子目录",
                    click: () => {
                        app.filesystem.loadChildren(file);
                    },
                    enabled: file.isFile === false,
                },
                {
                    label: "删除",
                    click: () => {
                        app.$eventBus.$emit("run:remove", file)
                    }
                }
            ];
            app.api.showMenu(tpl);
        }
    }
})

Vue.directive("dropmoveto", {
    bind: function (el, binding, vnode) {
        let app = vnode.context;

        let target = binding.value;
        let topic = Object.keys(binding.modifiers)[0];

        el.ondragover = function(e){
            e.preventDefault();
        }
        el.ondrop = function(e){
            let file = app.getStore()[topic];
            if(target.isFile === false){
                app.$eventBus.$emit("run:move", file, target)
            }else{
                app.toastr.warning(`${target.path} 不是目录`);
            }
        }
    }
})

global.app = new Vue({
    el: '#app',
    template: '<App/>',
    components:{
        App
    }
})
