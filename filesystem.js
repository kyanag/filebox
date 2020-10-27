const { dialog } = require('electron').remote
const fs = require('fs');
const path = require("path");
const os = require("os");
const shell = require("electron").shell;

function parse_path(file) {
    let fileinfo = path.parse(file);
    let stat = fs.statSync(file);

    fileinfo.path = file;
    fileinfo.ext = fileinfo.ext.replace(".", "");
    fileinfo.name = fileinfo.base;
    fileinfo.isFile = stat.isFile();
    fileinfo.state = {
        loaded: false,
        selected: false,
        opened:true,
    };
    fileinfo.id = file.replace(/[\\\:/\.]/g, "-");
    fileinfo.children = [];
    // { 
    //   path: String,
    //   root: String,
    //   dir: String,
    //   base: String,
    //   ext: String,
    //   name: String,
    //   isFile: Bool,
    //   children: Array<self>
    //   state: {
    //      loaded:Bool,
    //      selected: Bool,
    //      opened: Bool
    //   }
    // }
    return fileinfo;
}

class Filesystem {

    openFileDialog() {
        console.log(dialog);
        let files = dialog.showOpenDialogSync({
            title: "选择目录",
            properties: [
                'openDirectory',
            ],
        });
        if (!Array.isArray(files)) {
            files = [];
        }

        return files.map(function (file) {
            return parse_path(file);
        });
    }

    getChildren(dir) {
        let files = fs.readdirSync(dir.path, { encoding: "utf-8", withFileTypes: true });
        return files.map(function (file) {
            file = path.resolve(dir.path, file.name)
            return parse_path(file);
        });
    }

    show(file){
        let folder = file.path;
        if(file.isFile){
            folder = file.dir;
        }
        shell.showItemInFolder(folder);
    }
}

let filesystem = new Filesystem;

export default filesystem;