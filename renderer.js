const fs = require('fs')
const path = require("path");
const $ = require("jquery")
const {Addfile} = require("./src/readers")

let data = {
    "files": [],
};

class App{
    readers = [];
    filters = [];
    handlers = [];

    files = [];

    fileConcat(files){
        this.files = this.files.concat(files)
        this.onFilesChanges();
    }

    registerReader(Addfile){
        console.log("addfile registeed!")
        let addfile = new Addfile(this)
        this.readers.push(addfile)
    }

    start(){
        this.readers.forEach( reader => {
            reader.beforeStart()
        })
        this.filters.forEach( filter => {
            filter.beforeStart()
        })
        this.handlers.forEach( handler => {
            handler.beforeStart()
        })
    }

    onFilesChanges = function(){
        $("#filebox-filelist").html("");
        console.log(this.files);
        this.files.forEach( (file, index) => {
            file = file.replace("\\", "/")

            let element = $(`
<tr>
    <th scope="row">${index+1}</th>
    <td>${path.basename(file)}</td>
    <td>${file}</td>
    <td>@mdo</td>
</tr>
`);
            $(element).contextmenu(function(){

            });
            $("#filebox-filelist").append(element);
        })

        
    }

    statusBar(message){
        //pass
    }
};

$(() => {
    let app = new App();
    app.registerReader(Addfile)
    app.start();
});
