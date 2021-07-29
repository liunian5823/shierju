/**
 * 组件的公共定义
 * Created by zhouby on 2018/4/20/020.
 */
const row_ = {
    gutter: 48
};
const antModal_ = {
    maskClosable: false,
    mask: true
};
const table_ = {
    // locale: {
    //     emptyText: require('react').createElement('div', {className: "tableNoData iconfont icon-bukaixin",key:"empty"}, [
    //         require('react').createElement('span', {}, "暂无数据")
    //     ])
    // },
    rowKey: "uuids",
    bordered: false,
};
const tablePagination_ = {
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true
};
const btnName_ = {
    search: "查询",
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
        action: SystemConfig.systemConfigPath.axiosUrlGaoda('/common/upload/file?maxSize=5'),
    },
    uploadForm: {
        valuePropName: 'fileList',
        normalize(e) {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.aa;
        },
    },
    uploadLimitSize: (size) => {
        return {
            name: 'file',
            action: SystemConfig.systemConfigPath.axiosUrlGaoda('/common/upload/file?maxSize=' + size),
        }
    }
}

const getPagination_ = function (pagination, onChange, onShowSizeChange) {
    return {
        ...tablePagination_,
        total: pagination !== undefined ? pagination.total : 0,
        defaultCurrent: pagination !== undefined ? pagination.pageNum : 1,
        rows: pagination !== undefined ? pagination.rows : tablePagination_.defaultPageSize,
        current: pagination !== undefined ? pagination.pageNum : 1,
        onShowSizeChange(current, rows) {
            if (onShowSizeChange) {
                onShowSizeChange(1, rows);
            } else {
                onChange(1, rows);
            }
        },
        onChange(current, rows) {
            onChange(current, rows);
        }
    };
};

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

module.exports = {
    antModal_, table_, tablePagination_, getPagination_, btnName_, row_, upload_, upload_suntray, form_
}
