<template>
    <div :class="`list-group list-group-flush ${depth > 0 ? 'collapse' : ''} ${ _open ? 'in' : ''}`" :id="root.path.md5()">
        <slot name='root'></slot>
        <template v-for="(file, index) in root.children">
            <li class="list-group-item file-item" 
                :key="file.path.md5()" 
                v-draggable.file="file" 
                v-dropmoveto.file="file" 
                v-rightclick="file"
                draggable="true"
            >
                <a 
                    role="button"
                    data-toggle="collapse"
                    class="icon"
                    :href="`#${file.path.md5()}`"
                    :aria-expanded="`${file.state.opened ? 'false' : 'true'}`"
                    @click="toggleChildren(file)"
                >
                    <span v-if="!file.isFile" :class="`glyphicon ${file.state.opened ? 'glyphicon-minus' : 'glyphicon-plus'}  ${file.state.opened ? 'collapsed' : ''}`"></span>
                </a>
                <input class="file-selector" type="checkbox" :value="file" v-model="file.state.selected">
                <Icon :file="file" ></Icon>
                <span class="file-name" :title="file.path">
                    [{{ depth }}] 
                    <input type="text" :value="file.name" v-if="file.state.editing">
                    <template v-else>{{ file.name }}</template>
                </span>
                <div class="file-toobar btn-group btn-group-xs" role="group">
                    <button type="button" class="btn btn-default" title="刷新子目录" @click="refreshChildren(file)">
                        <span class="glyphicon glyphicon-refresh"></span>
                    </button>
                    <button type="button" :class="`btn btn-default ${file.isFile ? '' : 'vision-hidden'}`">
                        {{ file.ext ? file.ext : "&nbsp;&nbsp;&nbsp;" }}
                    </button>
                </div>
            </li>
            <template v-if="file.isFile === false">
                <directory :root="file" :depth="depth + 1" :key="`${file.path.md5()}-children`" :open="file.state.opened"></directory>
            </template>
        </template>
    </div>
</template>
<script>
import Icon from "./Icon.vue";

export default {
    components: {
        Icon
    },
    name: "directory",
    props: {
        depth:Number,
        root:Object,
        open: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            _open: false,
        };
    },
    created: function(){
        this._open = this.open;
    },
    methods: {
        toggleChildren: function(file){
            file.state.opened = !file.state.opened;
            if(file.state.loaded === false && file.isFile === false){
                console.log(111);
                this.filesystem.loadChildren(file, 2);
            }
        },
        refreshChildren: function(file){
            this.filesystem.loadChildren(file, 2);
        }
    }
}
</script>
<style>
.icon{
  padding-right: 10px;
  width: 20px;
}

.list-group .list-group {
  padding-left: 15px;
  margin-bottom: -1px;
}
.file-item {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
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

.vision-hidden{
    visibility:hidden;
}
</style>