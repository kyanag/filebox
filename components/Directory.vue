<template>
    <div :class="`list-group ${depth > 0 ? 'collapse' : ''} ${root.state.opened ? 'in' : ''}`" :id="root.id">
        <template v-for="(file, index) in files">
            <li class="list-group-item file-item" :key="file.id">
                <input class="file-selector" type="checkbox" :value="file" v-model="file.state.selected">
                <a :class="`file-name ${file.state.opened ? 'collapsed' : ''}`" data-toggle="collapse" :href="`#${file.id}`" @click="check(file)" :aria-expanded="`${file.state.opened ? 'false' : 'true'}`">
                    <span :class="`glyphicon ${file.isFile ? 'glyphicon-file' : 'glyphicon-folder-open'}`"></span>[{{ depth }}] {{ file.name }}
                </a>
                <div class="file-toobar btn-group btn-group-xs" role="group">
                    <div role="button" :class="`btn btn-default ${file.isFile ? 'vision-hidden' : ''}`" title="刷新子目录" @click="refreshChildren(file)"><i class="glyphicon glyphicon-refresh"></i></div>
                    <button type="button" :class="`btn btn-default ${file.isFile ? '' : 'vision-hidden'}`" title="预览" @click="previewFile(file)">{{ file.ext ? file.ext : "&nbsp;&nbsp;&nbsp;" }}
                    </button>
                    <div role="button" class="btn btn-default" title="打开上级文件夹" @click="showFolder(file)">打开</div>
                </div>
            </li>
            <template v-if="file.isFile === false">
                <directory :root="file" :files="file.children" :depth="depth + 1" :key="`${file.id}-children`"></directory>
            </template>
        </template>
    </div>
</template>
<script>
export default {
    name: "directory",
    props: {
        files:Array,
        depth:Number,
        root:Object
    },
    data() {
        return {

        };
    },
    methods: {
        refreshChildren: function(file){
            let children = this.filesystem.getChildren(file);
            file.children = children;
            file.state.loaded = true;

            console.log(`刷新 ${file.path} 的子目录`);
        },
        check: function(file){
            if(file.state.loaded === false && file.isFile === false){
                this.refreshChildren(file);
            }
        },
        showFolder: function(file){
            this.filesystem.show(file);
        },
        previewFile: function(file){

        }
    }
}
</script>
<style>
.list-group .list-group {
  padding-left: 15px;
  margin-bottom: -1px;
}
.file-item {
  display: flex !important;
  justify-content: space-between;
  padding: 2px 10px!important;
  height: 28px;
}
.file-item .file-selector {
  width: 15px;
  margin-right: 15px!important;
}
.file-item .file-name {
  width: calc((100% - 115px));
  margin-right: 15px!important;
}
.file-item .file-toobar {
  width: 100px;
}
.file-item .file-toobar .btn{
  width:33.33%;
  overflow: hidden;
}

span.glyphicon {
  width: 20px;
}

.vision-hidden{
    visibility:hidden;
}
</style>