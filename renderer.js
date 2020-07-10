const fs = require('fs')
const path = require("path")
const bootstrap = require("bootstrap");
const $ = require("jquery")
const { Addfile, Finder } = require("./src/readers")

class App {
    readers = [];
    filters = [];
    handlers = [];

    files = [];

    config = {};

    fileConcat(files) {
        this.files = this.files.concat(files)
        this.onFilesChanges();
    }

    registerReader(reader) {
        console.log(reader);
        console.log("reader registeed!")
        let instance = new (reader)(this)
        this.readers.push(instance)
    }

    start() {
        this.readers.forEach(reader => {
            reader.beforeStart()
        })
        this.filters.forEach(filter => {
            filter.beforeStart()
        })
        this.handlers.forEach(handler => {
            handler.beforeStart()
        })
    }

    onFilesChanges = function () {
        $("#filebox-filelist").html("");
        console.log(this.files);
        this.files.forEach((file, index) => {
            file = file.replace("\\", "/")

            let element = $(`
<tr>
    <th scope="row">${index + 1}</th>
    <td>${path.basename(file)}</td>
    <td>${file}</td>
    <td>@mdo</td>
</tr>
`);
            $(element).contextmenu(function () {

            });
            $("#filebox-filelist").append(element);
        })
    }

    statusBar(message) {
        //pass
    }
};

$(() => {
    let app = new App();
    app.registerReader(Addfile)
    app.registerReader(Finder)
    app.start();

    global.app = app;
});
