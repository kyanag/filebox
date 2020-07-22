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
                
            ],
            rowSelection: 'single',
            //onSelectionChanged: onSelectionChanged,
        };
        new Grid(document.querySelector("#filebox-files"), gridOptions);
        this.gridApi = gridOptions.api;

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
        this.gridApi.setRowData(this.files.map((file, index) => {
            return {
                index: index+1,
                basename: path.basename(file),
                path: file
            };
        }));
    }

    statusBar(message, delay = 2000) {
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
