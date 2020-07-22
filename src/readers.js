const $ = require("jquery")
const { ValueWatcher } = require("./binding")
const { dialog } = require('electron').remote

class Addfile{
    constructor(app){
        this.app = app;
        console.log("addfile created!");
    }

    beforeStart() {
        let btn = $('<button type="button" class="btn btn-secondary btn-sm">添加目录</button>')
        $(btn).click((e) => {
            this.run();
        });
        $("#filebox-readbar").append(btn);
    }

    run() {
        let files = dialog.showOpenDialogSync({
            title: "选择文件或者目录",
            properties: [
                "openFile",
                'openDirectory',
                'multiSelections'
            ],
        });
        if(Array.isArray(files)){
            this.app.statusBar(`选择 ${files.length} 项`)
            this.app.fileConcat(files);
        }else{
            this.app.statusBar(`没有选择文件！`)
        }
    }
}

class Finder{
    constructor(app){
        this.app = app;

        this.data = {
            depth: 1,
            showFile: true,
            showDir: true
        };

        this.$proxy = this.createObserver(this.data);//
        this._bindings = {};
    }

    beforeStart() {
        let ele = `
<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
    <button type="button" class="btn btn-secondary btn-sm">获取下属文件/目录</button>
    <div class="btn-group" role="group">
        <button id="btnGroupDrop1" type="button" class="btn btn-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
        <div class="dropdown-menu dropdown-menu-right mt-0" aria-labelledby="btnGroupDrop1">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <input type="text" class="form-control form-control-sm" id="filebox-reader-finder-depth" placeholder="深度" value="${this.$proxy.depth}">
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input type="checkbox" name="filebox-reader-finder-showfile" class="form-check-input" ${this.$proxy.showFile ? "checked" : ""}>文件
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input type="checkbox" name="filebox-reader-finder-showdir"  class="form-check-input" ${this.$proxy.showDir ? "checked" : ""}>目录
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>        
`
        $("#filebox-readbar").append(ele);

        this.pushWatcher(
            new ValueWatcher(
                document.querySelector("#filebox-reader-finder-depth"), 
                this.$proxy,
                "depth"
            )
        );
        this.pushWatcher(
            new ValueWatcher(
                document.querySelector("[name=filebox-reader-finder-showfile]"),
                this.$proxy,
                "showFile"
            )
        );
        this.pushWatcher(
            new ValueWatcher(
                document.querySelector("[name=filebox-reader-finder-showdir]"),
                this.$proxy,
                "showDir"
            )
        );
    }

    createObserver(datas) {
        const me = this;
        const handler = {
            set(target, key, value) {
                const rets = Reflect.set(target, key, value);
                me._bindings[key].map(item => {
                    item.update();
                });
                return rets;
            },
            get(target, key){
                return Reflect.get(target, key);
            }
        };
        return new Proxy(datas, handler);
    }

    pushWatcher(watcher) {
        if (!this._bindings[watcher.key]) {
            this._bindings[watcher.key] = [];
        }
        this._bindings[watcher.key].push(watcher);
    }

    run() {
        return;
        let files = dialog.showOpenDialogSync({
            title: "选择文件或者目录",
            properties: [
                "openFile",
                'openDirectory',
                'multiSelections'
            ],
        });
        this.app.statusBar(`选择 ${files.length} 项`)

        this.app.fileConcat(files);
    }
}

module.exports = {
    Addfile,
    Finder,
}