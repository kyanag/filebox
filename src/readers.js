const $ = require("jquery")
const { dialog } = require('electron').remote

class Addfile{
    app

    constructor(app){
        this.app = app;
        console.log("addfile created!");
    }

    beforeStart(){
        let btn = $('<button type="button" class="btn btn-secondary btn-sm">添加目录</button>')
        $(btn).click((e) => {
            this.run();
        })
        console.log(window.document);
        $("#filebox-readbar").append(btn);
    }

    run(){
        let files = dialog.showOpenDialogSync({
            title:"选择文件或者目录",
            properties:[
                "openFile",
                'openDirectory',
                'multiSelections'
            ],
        });
        this.app.statusBar(`选择 ${files.length} 项`)

        this.app.fileConcat(files);
    }
}

class Finder{
    
    constructor(app){
        this.app = app;
        console.log("finder created!");
    }

    beforeStart(){
        let ele = `
<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
    <button type="button" class="btn btn-secondary btn-sm">获取下属文件/目录</button>
    <div class="btn-group" role="group">
        <button id="btnGroupDrop1" type="button" class="btn btn-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
        <div class="dropdown-menu dropdown-menu-right mt-0" aria-labelledby="btnGroupDrop1">
            <div class="dropdown-item">
                <input type="text" class="form-control form-control-sm" id="usr" placeholder="深度">
            </div>
            <div class="dropdown-item">
                <div class="form-check form-check-inline">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value="0">文件
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value="1">目录
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>        
`
        $("#filebox-readbar").append(ele);
    }

    run(){
        return;
        let files = dialog.showOpenDialogSync({
            title:"选择文件或者目录",
            properties:[
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