'use strict';
var BaseNode = require('./base_node');


class VBNode extends BaseNode {
    constructor(nodes, tknId, level) {
        super(nodes, tknId, level, true);
        this.nd = this.process(tknId);
    }
    static getMatchToken() {
        return 'VB.*';
    }

    addChild (tkn, type) {
        /*
        if (type === 'auxpass') {
            let nd = this.nodes.process(tkn, this.level + 1);
            if (nd.getPOS().match(/VB.* /)) {
                if (this.dbg) {
                    console.log(this.tabs() + ' Merging the verbs ' + nd.getToken() + ' into current node');
                }
                this.value.push(nd.getToken());
                return;
            }
        }*/
        super.addChild(tkn, type);
    }

}

/*
 two VB nodes connected with "auxpass" can  be converted to be a single node with each
 verb as a list.
*/


module.exports = VBNode;