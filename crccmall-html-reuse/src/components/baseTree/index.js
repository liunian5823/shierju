import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class BaseTree extends React.Component {
    constructor(props) {
        super(props)
    }

    getTreeNode = (arr) => {
        let data = arr || [];
        if(!data.length) return null;
        
        let nodes = data.map(v => {
            let label = '', value = '';
            let { 
                labelKey = 'id', 
                valueKey = 'value', 
                childKey = 'children' 
            } = this.props;

            label = v[labelKey];
            if(Object.prototype.toString.call(valueKey) === '[object Array]') {
                valueKey.map(k => {
                    if(v[k]) {
                        value += v[k] + ' '
                    }
                })
            } else {
                value = v[valueKey];
            }
            
            return (
                <TreeNode 
                    key={label} 
                    title={value}>
                    { (v[childKey] && v[childKey].length) ? this.getTreeNode(v[childKey]) : null }
                </TreeNode>
            )
        })

        return nodes
    }

    render() {
        let data = this.props.data;
        return (
            <Tree {...this.props}>{this.getTreeNode(data)}</Tree>
        )
    }
}