<template>
  <span :class="`icon glyphicon ${icon}`"></span>
</template>

<script>
let icons = {
    "@dir": "glyphicon-folder-open",
    "@" : "glyphicon-file",
};

export default {
  props: {
    file: Object,
  },
  data() {
    return {
      icon: "glyphicon glyphicon-file",
    };
  },
  created: function(){
    let ext;
    if(this.file.isFile === false){
        ext = "@dir";
    }else if(icons[ext] === undefined){
        ext = "@";
    }
    this.icon = icons[ext]
  },
};
</script>

<style scoped>

</style>