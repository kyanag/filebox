class Watcher{
    constructor(node, dataTarget, key){
        this.node = node;
        this.dataTarget = dataTarget;
        this.key = key;
    }

    //同步值 到 控件
    updateToInput(){
        let valueAttribute = this.valueAttribute();
        this.node[valueAttribute] = this.dataTarget[this.key];
    }

    //从控件 同步值
    syncFromInput(){
        let valueAttribute = this.valueAttribute();
        this.dataTarget[this.key] = this.node[valueAttribute];
    }

    valueAttribute(){
        let inputType = this.node.tagName == "input" ? this.node.getAttribute("type") : this.node.tagName;
        switch(inputType){
            case "checkbox":
                return "checked";
            default:
                return "value";
        }
    }
}


module.exports = {
    Watcher
}