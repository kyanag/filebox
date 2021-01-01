<template>
  <div class="application container-fluid">
    <div class="panel panel-default" id="tree">
      <div class="panel-heading">
        <div class="input-group">
          <span class="input-group-btn">
            <button class="btn btn-primary" @click="selectDirectory">选择文件夹</button>
          </span>
          <input type="text" class="form-control" :value="root ? root.path : '请选择'" readonly />
          <span class="input-group-btn">
            <button class="btn btn-primary" @click="selectDirectory"><i class="glyphicon glyphicon-refresh"></i></button>
          </span>
        </div>
      </div>
      <div class="panel-body">
        <div>筛选</div>
        <div class="col-md-12" id="toolbar">
          
        </div>
        <div class="divider"></div>

        <div>操作</div>
        <div class="col-md-12" id="actionbar">
          <div class="form-inline">
            <button class="btn btn-danger btn-sm" @click="selectDirectory">删除</button>
            <div class="input-group input-group-sm">
              <span class="input-group-btn">
                <button class="btn btn-warning" type="button" @click="runMove">移动到</button>
              </span>
              <input type="text" class="form-control" :value="config.moveTarget" readonly @click="selectMoveTarget" title="点击选择目标文件夹">
            </div>
          </div>
        </div>
      </div>
      <div class="panel-attach">
        <ul class="nav nav-tabs nav-justified">
          <li role="presentation" class="active"><a href="#tab-all" role="tab" data-toggle="tab">全部</a></li>
          <li role="presentation"><a href="#tab-selected" role="tab" data-toggle="tab">已选择</a></li>
        </ul>
        <div class="tab-content">
          <div role="tabpanel" class="tab-pane fade in active" id="tab-all" aria-labelledby="tab-all">
            <template v-if="root">
              <directory :depth="0" :root="root">
                <li slot="root" class="list-group-item file-item text-primary text-center" v-dropmoveto.file="root">
                    <span class="file-name" :title="root.path">{{ root.path }}</span>
                </li>
              </directory>
            </template>
          </div>
          <div role="tabpanel" class="tab-pane fade" id="tab-selected" aria-labelledby="tab-selected">
            <template v-if="root">
              <div :class="`list-group list-group-flush`">
                 <li class="list-group-item file-item" :key="file.path.md5()" v-for="(file, index) in selectedFiles">
                   <div class="pull-left">
                    <input class="file-selector" type="checkbox" v-model="file.state.selected">
                    <Icon :file="file" ></Icon>
                    <template>{{ file.name }}</template>
                   </div>
                   <div class="pull-right">

                   </div>
                 </li>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-success" id="status-bar">
      <div class="panel-heading panel-heading-sm">
          任务栏 <a aria-hidden="true" class="glyphicon glyphicon-menu-up pull-right" data-toggle="collapse" data-target="#statusbar-info"></a>
      </div>
      <div class="panel-body collapse py-0" id="statusbar-info">
        <table class="table table-condensed my-0">
        <thead>
          <tr>
            <th>序号</th>
            <th>文件</th>
            <th>结果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in results" :key="index">
            <th scope="row">{{ index }}</th>
            <td v-html="result.info"></td>
            <td>
              <span class="text-success" v-if="result.state === 0">成功</span>
              <span class="text-error" v-else-if="result.state === -1">失败</span>
              <span class="text-warning" v-else-if="result.state === 1">运行中</span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script>
import Directory from "./Directory.vue";
import Icon from "./Icon.vue";

export default {
  components: {
    Directory,
    Icon
  },
  data() {
    return {
      version: 0,
      root: null,
      files: [],
      config: {
        moveTarget:null,
        autoOpenDepth: 3, //自动打开的深度
        showHidden: false,
      },
      results:[],
    };
  },
  computed:{
    selectedFiles:function(){
      if(!this.root){
        return [];
      }
      return this.filterSelectedFiles();
    }
  },
  mounted:function(){
    this.$eventBus.$on("run:moveTo", async (file, targetDir) => {
      let result = {
        info: `移动 <span title="${file.path}">${file.base}</span> 到 <span title="${targetDir.path}">[${targetDir.base}]</span> 下`,
        state: 1,
        err: null,
      };
      this.results.push(result);

      let _ = await this.filesystem.moveTo(file, targetDir).catch( err => {
        result.state = -1;
        result.err = err;
      });
      result.state = 0;
      //同步树状态

    })
    this.$eventBus.$on("run:remove", async (file) => {
      let result = {
        info: `删除 <span title="${file.path}">${file.base}</span>`,
        state: 1,
        err: null,
      };
      this.results.push(result);

      let _ = await this.filesystem.remove(file).catch( err => {
        result.state = -1;
        result.err = err;
      });
      result.state = 0;
    });
  },
  methods: {
    refreshDir(dir){
      
    },
    selectDirectory: function () {
      let dirs = this.filesystem.openFileDialog();
      console.log(dirs);
      if (dirs.length > 0) {
        let root = dirs[0];
        this.filesystem.loadChildren(root);
        this.version++;

        this.root = root;
      }
    },
    selectMoveTarget:function(){
      let dirs = this.filesystem.openFileDialog();
      console.log(dirs);
      if (dirs.length > 0) {
        this.config.moveTarget = dirs[0].path;
      }
    },


    runMove:function(){
      let selectedFiles = this.filterSelectedFiles();
      let moveTarget = this.filesystem.fileinfo(this.config.moveTarget);
      if(!this.config.moveTarget){
        return this.toastr.error("请选择目标文件夹！");
      }
      if(selectedFiles.length <= 0){
        return this.toastr.warning("没有选中的文件！");
      }
      selectedFiles.forEach( (file, index) => {
        this.$eventBus.$emit("run:moveTo", file, moveTarget);
      })
    },
    filterSelectedFiles: function(){
      return this.root.posterities().filter( (file, index) => {
          return file.state.selected;
      });
    },
  },
};
</script>

<style>
#status-bar{
  width: auto;
  left: 15px;
  right: 15px;
  position: fixed;
  bottom: 0;
  margin-bottom: 0px;
  border-bottom: 2px solid #3c763d;
}

.py-0{
  padding-top: 0!important;
  padding-bottom: 0!important;
}

.my-0{
  margin-top: 0!important;
  margin-bottom: 0!important;
}

#tree{
  padding-bottom: 30px;
}

.panel > .panel-attach .tab-content{
  border-top: 1px solid #ddd;
  margin-top: -1px;
}
.panel > .panel-attach .nav{
  padding: 0 20px 0 20px;
}

.panel-heading-sm{
  padding-top: 5px!important;
  padding-bottom: 5px!important;
}

.panel-attach .tab-pane{
  min-height: 200px;
}

.list-group-flush > .list-group-item {
    border-width: 0 0 1px;
    margin-bottom: 0px;
}
.list-group-flush > .list-group-flush {
    margin-bottom: 0px;
}
.list-group-flush > .list-group-item:last-child {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.w-100{
  width: 100%;
}

.application {
  padding-top: 15px;
  /* height: 100%; */
}
* {
  /* border: solid 1px #777777; */
}

.divider {
  height: 1px;
  margin: 9px 0;
  overflow: hidden;
  background-color: #e5e5e5;
}
</style>