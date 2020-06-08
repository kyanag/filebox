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

module.exports = {
    Addfile
}