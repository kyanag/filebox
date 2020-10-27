<template>
  <div class="application container-fluid">
    <div class="col-sm-9">
      <div class="panel panel-default" id="left-tree">
        <div class="panel-heading">文件树</div>
        <div class="panel-body">
          <template v-if="root">
            <directory :files="files" :depth="0" :root="root"></directory>
          </template>
          <template v-else>
            <button class="btn btn-primary" @click="selectDirectory">选择文件夹</button>
          </template>
        </div>
      </div>
    </div>

    <div class="col-sm-3" id="right-panel">
      <h3>打开</h3>
      <div class="row">
        <button class="btn btn-primary btn-sm" @click="selectDirectory">选择文件</button>
      </div>
      

      <h3>选择</h3>
      <div class="row">
        <button class="btn btn-primary btn-sm" @click="selectDirectory">选择文件</button>
      </div>

      <h3>操作</h3>
      <div class="row">
        <button class="btn btn-primary btn-sm" @click="selectDirectory">选择文件</button>
      </div>
    </div>
  </div>
</template>

<script>
import Directory from "./Directory.vue";

export default {
  components: {
    Directory
  },
  data() {
    console.log(this);
    return {
      version:0,
      root: null,
      files: [],
      config:{
        autoOpenDepth: 3, //自动打开的深度
        showHidden: false,
      },
    };
  },
  methods: {
    selectDirectory: function() {
      let dirs = this.filesystem.openFileDialog();
      console.log(dirs);
      if (dirs.length > 0) {
        let root = dirs[0];
        let files = this.filesystem.getChildren(root);
        this.files = files;
        this.root = root;

        this.version++;

        setTimeout(() => {
          this.jobLoadChildren();
        }, 500);
      }
    },
    loadChildren:function(file, depth, version){
      if(version !== this.version){
        return;
      }
      if(file.isFile === false && file.state.loaded === false){
        console.log(`子目录 ${file.path}`);
        let files = this.filesystem.getChildren(file);
        if(file.state.loaded === false){
          file.state.loaded = true;
          if(depth >= this.config.autoOpenDepth){
            file.state.opened = false;
          }
          file.children = files;

          this.$nextTick( () => {
            files.forEach(file => {
              this.loadChildren(file, depth+1, version);
            });
          });
        }
      }
    },
    jobLoadChildren:function(){
        let version = this.version;
        this.files.forEach( file => {
          this.loadChildren(file, 0, version);
        })
    }
  }
};
</script>

<style>
.application {
  margin-top: 15px;
  /* height: 100%; */
}
* {
  /* border: solid 1px #777777; */
}
html {
  height: 100%;
}
body {
  height: 100%;
}
#left-tree,
#right-panel {
  height: 100%;
  /* text-align: center; */
}

#right-panel{
  text-align: center
}

#right-panel > h3{
  padding-top:20px;
}
</style>