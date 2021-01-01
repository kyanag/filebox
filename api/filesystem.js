const { dialog } = require('electron').remote;
const fs = require('fs-extra');
const path = require("path");
const os = require("os");
const shell = require("electron").shell;
const crypto = require("crypto");

String.prototype.md5 = function(){
    return crypto.createHash('md5').update(Buffer.from(this)).digest("hex");
}

const File = function(file){
    let fileinfo = path.parse(file);
    let stat = fs.statSync(file);

    for(let key in fileinfo){
        this[key] = fileinfo[key];
    }
    this.path = file;
    this.isFile = stat.isFile();
    this.state = {
        loaded: false,
        selected: false,
        opened: false,
        editing: false,
    };
    this.children = [];

    function *posterities(root, depth = 0){
        for(let i in root.children){
            let file = root.children[i];
            if(!file.isFile){
                yield* file.posterities(file, depth + 1);
            }
            file.depth = depth;
            yield file; //深度优先
        }
    }
    this.posterities = function(){
        return Array.from(posterities(this));
    };
};

class Filesystem {
    openFileDialog() {
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
            return new File(file);
        });
    }

    /** @var File dir */
    loadChildren(dir, recursionLevel = 0){
        console.log(`load ${dir.path} children!`);

        let files = fs.readdirSync(dir.path, { encoding: "utf-8", withFileTypes: true });
        dir.children = files.map(function (file) {
            file = new File(path.resolve(dir.path, file.name));
            file.parent = dir;
            return file;
        });
        dir.state.loaded = true;

        if(recursionLevel > 0){
            dir.children.forEach( file => {
                if(file.isFile === true){
                    return false;
                }
                this.loadChildren(file, recursionLevel - 1);
            });
        }
    }

    fileinfo(path){
        return new File(path);
    }

    //文件管理器打开
    show(file){
        let folder = file.path;
        if(file.isFile){
            folder = file.dir;
        }
        shell.showItemInFolder(folder);
    }

    //文件是否存在
    exists(file){
        return fs.existsSync(file);
    }

    //删除文件
    remove(file){
        return fs.remove(...arguments);
    }

    //移动文件
    move(src, target){
        return fs.move(...arguments);
    }

    moveTo(src, targetDir){
        let {
            base
        } = path.parse(src);
        let target = path.resolve(targetDir, base);
        return this.move(src, target);
    }

    //重命名
    rename(oldpath, newpath){
        return fs.rename(...arguments)
    }
}
console.log(path);
export default new Filesystem;