/**
 * 组件的公共定义
 * Created by zhouby on 2018/4/20/020.
 */
const row_ = {
    gutter: 42
};
const antModal_ = {
    maskClosable: false,
    mask: true
};
const select_={
    allowClear:true
}
const table_ = {
    locale: {
        emptyText: require('react').createElement('div', {className: "tableNoData iconfont icon-bukaixin"}, [
            require('react').createElement('span', {}, "暂无数据")
        ])
    },
    bordered: false,
    rowSelection: {}
};
const tablePagination_ = {
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
    showQuickJumper:true,
    showTotal:total => `共 ${total}条`,
};
const btnName_ = {
    search: "搜索",
    reset: "清空"
}

const upload_suntray = {
    uploadProps: {
        name: 'file',
        action: SystemConfig.configs.uploadUrl + '/uploadFile',
    },
    uploadForm: {
        valuePropName: 'fileList',
        normalize(e) {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.aa;
        },
    }
}

const upload_ = {
    uploadProps: {
        name: 'file',
        action: SystemConfig.configs.uploadUrl+'?maxSize=5',
    },
    uploadForm: {
        valuePropName: 'fileList',
        normalize (e) {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.aa;
        },
    }
}


const form_ = {
    layout: {
        style: {
            display: "table",
            lineHeight: "22px"
        },
        labelCol: {
            style: {
                float: "left",
                width: 98
            }
        },
        wrapperCol: {
            style: {
                display: "table-cell",
                width: "100%",
                verticalAlign: "middle"
            }
        }
    }
}

const getPagination_ = function (pagination, onChange=function(){}, onShowSizeChange=function(){}) {
    return {
        ...tablePagination_,
        total: pagination && pagination.total != undefined ? pagination.total : 0,
        defaultCurrent: pagination && pagination.pageNum != undefined ? pagination.pageNum : 1,
        pageSize: pagination && pagination.pageSize != undefined ? pagination.pageSize : tablePagination_.defaultPageSize,
        current: pagination && pagination.pageNum != undefined ? pagination.pageNum : 1,
        onShowSizeChange(current, pageSize) {
            if (onShowSizeChange) {
                onShowSizeChange(1, pageSize);
            } else {
                onChange(1, pageSize);
            }
        },
        onChange(current) {
            onChange(current, pagination !== undefined ? pagination.pageSize : tablePagination_.defaultPageSize);
        }
    };
};

module.exports = {
    antModal_, table_, tablePagination_, getPagination_, btnName_, row_, form_, upload_,select_,upload_suntray
}
