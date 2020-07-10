const $ = require("jquery")

class ValueWatcher{
    constructor(node, data, key) {
        this.node = node;
        this.data = data;
        this.key = key;

        this.bindElement();
    }

    elementType(){
        let tagName = this.node.tagName;
        
        return (tagName != "INPUT" ? tagName : this.node.getAttribute("type")).toLowerCase();
    }

    bindElement(){
        let node = this.node;
        let that = this;
        
        switch(this.elementType()){
            case "checkbox":
                console.log(node);
                $(node).change(function(){
                    console.log(this);
                    that.data[that.key] = this.checked;
                });
                break;
            default:
                $(node).change(function(){
                    that.data[that.key] = $(this).val();
                });
        }
    }
    
    update(){
        $(this.node).val(this.data[this.key]);
    }
}

module.exports = {
    ValueWatcher
}