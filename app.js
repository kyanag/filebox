const fs = require('fs')
const path = require("path")
const $ = require("jquery")
const { Grid } = require("ag-grid")

const { Addfile, Finder } = require("./src/readers")

require("bootstrap");
require('bootstrap/dist/css/bootstrap.min.css')
require("ag-grid/dist/styles/ag-grid.css");
require("ag-grid/dist/styles/ag-theme-bootstrap.css");


class App{
    constructor(){
        this.readers = [];
        this.filters = [];
        this.handlers = [];

        this.files = [];

        this.config = {};
    }

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
        const gridOptions = {
            columnDefs: [
                {headerName: '#', field: 'index'},
                {headerName: '文件名', field: 'basename'},
                {headerName: '路径', field: 'path'},
                {headerName: '操作', field: 'action'}
            ],
            rowData: [
                
            ]
        };
        this.grid = new Grid(document.querySelector("#filebox-files"), gridOptions);
        console.log(this.grid, gridOptions);

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

    onFilesChanges(){
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
