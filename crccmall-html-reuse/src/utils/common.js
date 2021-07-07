/**
 * 左侧菜单[menuList]-start
 */
const menuList = [
    {
        icon: "shouye1",
        sort: 1,
        delFlag: 0,
        type: 4,
        uuid: 1112743,
        url: "#/sale/scene",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "竞价销售(销方)",
        id: 744,
        premesType: 1,
        uuids: "201811142222000001",
        children: [
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/desk/saleScene/add",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "发布场次",
                id: 747,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/sale/scene/epxort",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "导出",
                id: 748,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/sale/scene/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112748,
                url: "#/desk/saleScene/add",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "编辑场次",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112749,
                url: "#/sale/scene/del",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "删除场次",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112750,
                url: "#/sale/scene/cancle",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "撤销场次",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112751,
                url: "#/sale/scene/void",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "作废场次",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112752,
                url: "#/sale/scene/again",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "再次递交",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112753,
                url: "#/desk/saleScene/add/copy",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "发布相似",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112754,
                url: "#/sale/scene/bond",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "保证金管理",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112755,
                url: "#/sale/scene/fail",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "流标",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112756,
                url: "#/sale/sale/orderConfirm/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "确认订单",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112757,
                url: "#/sale/sale/orderConfirm/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看订单",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            }
        ]
    },
    {
        icon: "shouye1",
        sort: 1,
        delFlag: 0,
        type: 4,
        uuid: 1112743,
        url: "#/buy/scene",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "竞价销售(购方)",
        id: 743,
        premesType: 1,
        uuids: "201811142222000001",
        children: [
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/buy/scene/export",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "导出",
                id: 747,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/buy/scene/detail/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 748,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/buy/scene/del",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "删除场次",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112748,
                url: "#/desk/bidJoin/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "场次报名",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112749,
                url: "#/buy/scene/cancle",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "撤销报名",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112750,
                url: "#/desk/bidHall/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "报价",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112751,
                url: "#/desk/bidHall/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "预报价",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112752,
                url: "#/buy/sceneBond/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "保证金管理",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            }
        ]
    },
    {
        icon: "shouye1",
        sort: 2,
        delFlag: 1,
        type: 4,
        uuid: 1112744,
        url: "#/sale/bond",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "保证金管理(销方)",
        id: 745,
        premesType: 1,
        uuids: "201811142222000002",
        children: [
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/sale/bondDetail",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "导出",
                id: 746,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/sale/bondDetail",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 747,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/sale/bondManage",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "保证金管理",
                id: 748,
                premesType: 2,
                uuids: "201811122110000747",
            }
        ]
    },
    {
        icon: "shouye1",
        sort: 2,
        delFlag: 0,
        type: 4,
        uuid: 1112745,
        url: "#/verify",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "审批管理",
        id: 746,
        premesType: 1,
        uuids: "201811142222000003",
        children: [
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206771,
                url: "#/verify/setUp",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "线上审批设置",
                children: [
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "开关",
                        id: 746,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "新增审批模板",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "编辑",
                        id: 748,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 769,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "删除",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    }
                ]
            },
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206768,
                url: "#/verify/order",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "订单审批",
                children: [
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "查看订单",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "审核订单",
                        id: 748,
                        premesType: 2,
                        uuids: "201811122110000747",
                    }
                ]
            },
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206769,
                url: "#/verify/manage",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "竞价审批",
                children: [
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "导出",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "查看详情",
                        id: 748,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "审批",
                        id: 748,
                        premesType: 2,
                        uuids: "201811122110000747",
                    }
                ]
            },{
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206770,
                url: "#/verify/examine/",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "中标结果审核",
                children: [{
                    updateTime: "Nov 16, 2018 11:56:34 PM",
                    sort: 0,
                    delFlag: 0,
                    type: 4,
                    uuid: 1112747,
                    url: "#/examine/del",
                    parentId: 768,
                    createTime: "Nov 16, 2018 11:56:34 PM",
                    parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                    name: "导出",
                    id: 747,
                    premesType: 2,
                    uuids: "201811122110000747",
                },
                {
                    updateTime: "Nov 16, 2018 11:56:34 PM",
                    sort: 0,
                    delFlag: 0,
                    type: 4,
                    uuid: 1112747,
                    url: "#/examine/delVsrify",
                    parentId: 768,
                    createTime: "Nov 16, 2018 11:56:34 PM",
                    parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                    name: "查看详情",
                    id: 748,
                    premesType: 2,
                    uuids: "201811122110000747",
                },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "审核",
                        id: 748,
                        premesType: 2,
                        uuids: "201811122110000747",
                    }
                ]
            }
        ]
    },
    {
        icon: "shouye1",
        sort: 2,
        delFlag: 0,
        type: 4,
        uuid: 1112745,
        url: "#/supply/buy",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "供求信息管理(购方)",
        id: 747,
        premesType: 1,
        uuids: "201811142222000003",
        children: [
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 1232,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "递交",
                id: 1232,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand/add",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "发布供求信息",
                id: 747,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "导出",
                id: 748,
                premesType: 2,
                uuids: "201811122110000747",
            },
            // {
            //     updateTime: "Nov 16, 2018 11:56:34 PM",
            //     sort: 0,
            //     delFlag: 0,
            //     type: 4,
            //     uuid: 1112747,
            //     url: "#/supplyDemand",
            //     parentId: 768,
            //     createTime: "Nov 16, 2018 11:56:34 PM",
            //     parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
            //     name: "编辑",
            //     id: 749,
            //     premesType: 2,
            //     uuids: "201811122110000747",
            // },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supply/buyDetail",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "发布",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "删除",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "成交估值",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "撤销公告",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "再次发布",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supply/buy/createOrder",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "生成订单",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/supplyDemand",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看订单",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
        ]
    },
    {
        icon: "shouye1",
        sort: 2,
        delFlag: 0,
        type: 4,
        uuid: 1112746,
        url: "#/supply/sell",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "供求信息管理(销方)",
        id: 748,
        premesType: 1,
        uuids: "201811142222000003",
        children: [
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "发布供求信息",
                id: 747,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "导出",
                id: 748,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 1232,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "递交",
                id: 1232,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "发布",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "删除",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "成交估值",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "撤销公告",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "再次发布",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "生成订单",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看订单",
                id: 749,
                premesType: 2,
                uuids: "201811122110000747",
            },
        ]
    },
    {
        icon: "shouye1",
        sort: 2,
        delFlag: 0,
        type: 4,
        uuid: 11127999,
        url: "#/organization",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "组织管理",
        id: 7477,
        premesType: 1,
        uuids: "201811142222000008",
        children: [
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206768,
                url: "#/organization/auth",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "权限管理",
                children: [
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "详情",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "复制",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "修改",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "删除",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/examine/del",
                        parentId: 768,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "添加",
                        id: 747,
                        premesType: 2,
                        uuids: "201811122110000747",
                    }
                ]
            },
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206768,
                url: "#/organization/project",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "项目管理",
                children: [
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 725716128,
                        "url": "#/purchaser/organization/updateOrganization",
                        "parentId": 550,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322567_263911352784322565",
                        "name": "修改",
                        "id": 552,
                        "premesType": 2,
                        "uuids": "263911352783273987"
                    },
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 725716128,
                        "url": "#/purchaser/organization/updateOrganization",
                        "parentId": 550,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322567_263911352784322565",
                        "name": "修改",
                        "id": 552,
                        "premesType": 2,
                        "uuids": "263911352783273987"
                    },
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 860644908,
                        "url": "#/purchaser/organization/deleteOrganization",
                        "parentId": 550,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322567_263911352784322564",
                        "name": "删除",
                        "id": 553,
                        "premesType": 2,
                        "uuids": "263911352783273988"
                    },
                    {
                        "updateTime": "Oct 30, 2018 3:00:02 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 256864550,
                        "url": "#/purchaser/organization/getManagerList",
                        "parentId": 550,
                        "createTime": "Oct 30, 2018 3:00:02 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322567_263911352784322567",
                        "name": "查看",
                        "id": 570,
                        "premesType": 2,
                        "uuids": "263911352783273989"
                    },
                    {
                        "updateTime": "Oct 30, 2018 3:00:02 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 256864550,
                        "url": "#/purchaser/organization/getManagerList",
                        "parentId": 550,
                        "createTime": "Oct 30, 2018 3:00:02 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322567_263911352784322567",
                        "name": "查看",
                        "id": 570,
                        "premesType": 2,
                        "uuids": "263911352783273989"
                    },
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 219864550,
                        "url": "#/purchaser/organization/insertOrganization",
                        "parentId": 550,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322567_263911352784322566",
                        "name": "添加组织机构",
                        "id": 551,
                        "premesType": 2,
                        "uuids": "263911352783273986"
                    }
                ],
            },
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206768,
                url: "#/organization/user",
                parentId: 1112743,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "人员管理",
                children: [
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 465680324,
                        "url": "#/purchaser/user/insertUser",
                        "parentId": 554,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352784322562",
                        "name": "添加员工",
                        "id": 555,
                        "premesType": 2,
                        "uuids": "263911352783273990"
                    },
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 465680324,
                        "url": "#/purchaser/user/insertUser",
                        "parentId": 554,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352784322562",
                        "name": "添加员工",
                        "id": 555,
                        "premesType": 2,
                        "uuids": "263911352783273990"
                    },
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 677718267,
                        "url": "#/purchaser/user/updateUser",
                        "parentId": 554,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352784322561",
                        "name": "修改",
                        "id": 556,
                        "premesType": 2,
                        "uuids": "263911352783273991"
                    },
                    {
                        "updateTime": "Oct 30, 2018 2:56:03 PM",
                        "sort": 0,
                        "delFlag": 0,
                        "type": 4,
                        "uuid": 677718267,
                        "url": "#/purchaser/user/updateUser",
                        "parentId": 554,
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352784322561",
                        "name": "修改",
                        "id": 556,
                        "premesType": 2,
                        "uuids": "263911352783273991"
                    },
                    {
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352784322560",
                        "name": "删除",
                        "id": 557,
                        "sort": 2,
                        "delFlag": 0,
                        "type": 4,
                        "premesType": 2,
                        "uuid": 1255333029,
                        "url": "#/purchaser/user/deleteUser",
                        "parentId": 554,
                        "uuids": "263911352783273992"
                    },
                    {
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352783274007",
                        "name": "查看",
                        "id": 558,
                        "sort": 2,
                        "delFlag": 0,
                        "type": 4,
                        "premesType": 2,
                        "uuid": 110776511,
                        "url": "#/purchaser/user/getUserDetail",
                        "parentId": 554,
                        "uuids": "263911352783273993"
                    },
                    {
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352783274007",
                        "name": "查看",
                        "id": 558,
                        "sort": 2,
                        "delFlag": 0,
                        "type": 4,
                        "premesType": 2,
                        "uuid": 110776511,
                        "url": "#/purchaser/user/getUserDetail",
                        "parentId": 554,
                        "uuids": "263911352783273993"
                    },
                    {
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352783274006",
                        "name": "重置密码",
                        "id": 559,
                        "sort": 2,
                        "delFlag": 0,
                        "type": 4,
                        "premesType": 2,
                        "uuid": 1913391585,
                        "url": "#/purchaser/user/resetPwd",
                        "parentId": 554,
                        "uuids": "263911352783273994"
                    },
                    {
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352783274006",
                        "name": "重置密码",
                        "id": 559,
                        "sort": 2,
                        "delFlag": 0,
                        "type": 4,
                        "premesType": 2,
                        "uuid": 1913391585,
                        "url": "#/purchaser/user/resetPwd",
                        "parentId": 554,
                        "uuids": "263911352783273994"
                    },
                    {
                        "createTime": "Oct 30, 2018 2:56:03 PM",
                        "parentCode": "1234567890_263911352784322568_263911352784322563_263911352783274005",
                        "name": "启用/停用人员",
                        "id": 560,
                        "sort": 2,
                        "delFlag": 0,
                        "type": 4,
                        "premesType": 2,
                        "uuid": 337317526,
                        "url": "#/purchaser/user/changeState",
                        "parentId": 554,
                        "uuids": "263911352783273995"
                    }
                ],
            },
            
        ]
    }, {
        icon: "shouye1",
        sort: 2,
        delFlag: 0,
        type: 4,
        uuid: 1112777,
        url: "#/transaction",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "交易管理",
        id: 750,
        premesType: 1,
        uuids: "201811142222000003",
        children: [
            {
            sort: 1,
            delFlag: 0,
            type: 4,
            uuid: 1206779,
            url: "#/transaction/delivery",
            parentId: 1112744,
            createTime: "Dec 10, 2018 5:19:45 PM",
            parentCode: "1234567890_201811122110300001_201811206110000011",
            name: "提货单管理-买家",
            children: [{
                createTime: "Oct 30, 2018 2:56:03 PM",
                parentCode: "1234567890_263911352784322568_263911352784322563_263911352783274005",
                name: "导出",
                id: 561,
                sort: 2,
                delFlag: 0,
                type: 4,
                premesType: 2,
                uuid: 110776511,
                url: "#/purchaser/user/changeState",
                parentId: 852,
                uuids: "263911352783273995"
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/transactin/trandelDetil/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 777,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 769,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "受理",
                id: 766,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 770,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "释放",
                id: 767,
                premesType: 2,
                uuids: "201811122110000747",
            }]
        },{
            sort: 1,
            delFlag: 0,
            type: 4,
            uuid: 1206779,
            url: "#/transaction/deliverySeller",
            parentId: 1112744,
            createTime: "Dec 10, 2018 5:19:45 PM",
            parentCode: "1234567890_201811122110300001_201811206110000011",
            name: "提货单管理-卖家",
            children: [{
                createTime: "Oct 30, 2018 2:56:03 PM",
                parentCode: "1234567890_263911352784322568_263911352784322563_263911352783274005",
                name: "导出",
                id: 561,
                sort: 2,
                delFlag: 0,
                type: 4,
                premesType: 2,
                uuid: 110776511,
                url: "#/purchaser/user/changeState",
                parentId: 852,
                uuids: "263911352783273995"
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                url: "#/transactin/trandelDetil/:uuids",
                parentId: 768,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "查看详情",
                id: 777,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 769,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "受理",
                id: 766,
                premesType: 2,
                uuids: "201811122110000747",
            },
            {
                updateTime: "Nov 16, 2018 11:56:34 PM",
                sort: 0,
                delFlag: 0,
                type: 4,
                uuid: 1112747,
                parentId: 770,
                createTime: "Nov 16, 2018 11:56:34 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                name: "释放",
                id: 767,
                premesType: 2,
                uuids: "201811122110000747",
            }]
        }
    ]
    },{
        icon: "shouye1",
        sort: 2,
        delFlag: 0,
        type: 4,
        uuid: 1112777,
        url: "#/capitalAccoun",
        parentId: -1,
        createTime: "Nov 15, 2018 5:27:04 PM",
        parentCode: "1234567890_201810100926181350_201811142222000001",
        name: "财务管理",
        id: 751,
        premesType: 1,
        uuids: "201811142222000003",
        children: [
            {
            sort: 1,
            delFlag: 0,
            type: 4,
            uuid: 1206779,
            url: "#/capitalAccoun/account",
            parentId: 1112744,
            createTime: "Dec 10, 2018 5:19:45 PM",
            parentCode: "1234567890_201811122110300001_201811206110000011",
            name: "资金账户",
            children: [{
                createTime: "Oct 30, 2018 2:56:03 PM",
                parentCode: "1234567890_263911352784322568_263911352784322563_263911352783274005",
                name: "导出",
                id: 571,
                sort: 2,
                delFlag: 0,
                type: 4,
                premesType: 2,
                uuid: 110776511,
                url: "#/purchaser/user/changeState",
                parentId: 852,
                uuids: "263911352783273995"
            },
                {
                    updateTime: "Nov 16, 2018 11:56:34 PM",
                    sort: 0,
                    delFlag: 0,
                    type: 4,
                    uuid: 1112747,
                    url: "#/capitalAccoun/accountDetail/:uuids",
                    parentId: 769,
                    createTime: "Nov 16, 2018 11:56:34 PM",
                    parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                    name: "查看详情",
                    id: 770,
                    premesType: 2,
                    uuids: "201811122110000747",
                },
                {
                    updateTime: "Nov 16, 2018 11:56:34 PM",
                    sort: 0,
                    delFlag: 0,
                    type: 4,
                    uuid: 1112747,
                    parentId: 771,
                    createTime: "Nov 16, 2018 11:56:34 PM",
                    parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                    name: "开通",
                    id: 766,
                    premesType: 2,
                    uuids: "201811122110000747",
                },
                {
                    updateTime: "Nov 16, 2018 11:56:34 PM",
                    sort: 0,
                    delFlag: 0,
                    type: 4,
                    uuid: 1112747,
                    parentId: 772,
                    createTime: "Nov 16, 2018 11:56:34 PM",
                    parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                    name: "绑卡",
                    id: 769,
                    premesType: 2,
                    uuids: "201811122110000747",
                }]
        },
            {
                sort: 1,
                delFlag: 0,
                type: 4,
                uuid: 1206779,
                url: "#/capitalAccoun/statementCont",
                parentId: 1112744,
                createTime: "Dec 10, 2018 5:19:45 PM",
                parentCode: "1234567890_201811122110300001_201811206110000011",
                name: "结算单管理",
                children: [{
                    createTime: "Oct 30, 2018 2:56:03 PM",
                    parentCode: "1234567890_263911352784322568_263911352784322563_263911352783274005",
                    name: "导出",
                    id: 571,
                    sort: 2,
                    delFlag: 0,
                    type: 4,
                    premesType: 2,
                    uuid: 110776511,
                    url: "#/purchaser/user/changeState",
                    parentId: 852,
                    uuids: "263911352783273995"
                },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        url: "#/capitalAccoun/statementDetails/:uuids",
                        parentId: 769,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "查看详情",
                        id: 770,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112750,
                        url: "#/capitalAccoun/buildDetails/:uuids",
                        parentId: 770,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "支付单详情",
                        id: 771,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        parentId: 771,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "付款",
                        id: 766,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        parentId: 772,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "查看收款账户",
                        id: 769,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        parentId: 775,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "查看收款账户",
                        id: 884,
                        premesType: 2,
                        uuids: "201811122110000747",
                    },
                    {
                        updateTime: "Nov 16, 2018 11:56:34 PM",
                        sort: 0,
                        delFlag: 0,
                        type: 4,
                        uuid: 1112747,
                        parentId: 776,
                        createTime: "Nov 16, 2018 11:56:34 PM",
                        parentCode: "1234567890_201811122110300001_201811206110000011_201811122110000747",
                        name: "重新支付",
                        id: 885,
                        premesType: 2,
                        uuids: "201811122110000747",
                    }]
            }
        ]
    }
];
/**
 * 左侧菜单[menuList]-end
 */

/**
 * 业务流程状态[baseService]-start
 *
 * value：主状态
 * id：value对应的key
 * note：附属状态
 * style：样式
 */
function serviceReform(obj) {
    let list = {};
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        obj.forEach(v => {
            list[v.id] = v;
        })
    } else if (Object.prototype.toString.call(obj) === '[object Object]') {
        for (const key in obj) {
            const ele = obj[key];
            const newKey = `_${key}_obj`;
            list[`_${key}`] = ele;
            list[newKey] = {};

            ele.forEach(v => {
                list[newKey][v.id] = v
            });
        }
    }
    return list;
}
const serviceStyle = {
    style1: {
        color: "#2db7f5",//蓝色
    },
    style2: {
        color: "#fa9b13",//橙色
    },
    style3: {
        color: "#0cba5e",//绿色
    },
    style4: {
        color: "#f15557",//红色
    },
    style5: {
        color: "#e96c47",//红色
    },
    style6: {
        color: "#999",//灰色
    },
}
/**
 * 主状态只为提供：teb切换、搜索、列表状态的颜色;
 * 列表状态的文字显示以后台提供数据为准;
 */
//销方主状态
const saleMainBid = [
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '待发布',
        id: '10',
        style: serviceStyle.style2
    },
    {
        value: '审核中',
        id: '20',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '待审核',
        id: '21',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '已驳回',
        id: '22',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '报名中',
        id: '30',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '保证金',
        id: '40',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '未确认',
        id: '41',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '已确认',
        id: '42',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '竞价中',
        id: '50',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '待开标',
        id: '60',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待确认',
        id: '61',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待审核',
        id: '62',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已驳回',
        id: '63',
        note: '',
        style: serviceStyle.style2
    },
    ,
    {
        value: '开标待审核',
        id: '64',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '开标已驳回',
        id: '65',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '开标审核',
        id: '66',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已完成',
        id: '70',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '已成交',
        id: '71',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '已流标',
        id: '72',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '失效/作废',
        id: '100',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '参与企业不足',
        id: '101',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '中止',
        id: '102',
        note: '',
        style: serviceStyle.style4
    }
]
// 保证金纠纷
const custmargin=[
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },{
        value: '待受理',
        id: '15',
        style: serviceStyle.style2
    },{
        value: '处理中',
        id: '20',
        style: serviceStyle.style2
    },{
        value: '已完成',
        id: '25',
        style: serviceStyle.style2
    }
]
// 结算单管理
const statement=[
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },{
        value: '待结算',
        id: '15',
        style: serviceStyle.style2
    },{
        value: '结算中',
        id: '20',
        style: serviceStyle.style2
    },{
        value: '结算完成',
        id: '25',
        style: serviceStyle.style2
    },{
        value: '失效作废',
        id: '30',
        style: serviceStyle.style2
    }
]
// 结算单管理
const accclear=[
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },{
        value: '待受理',
        id: '15',
        style: serviceStyle.style2
    },{
        value: '待处理',
        id: '20',
        style: serviceStyle.style2
    },{
        value: '处理中',
        id: '25',
        style: serviceStyle.style2
    },{
        value: '审核中',
        id: '30',
        style: serviceStyle.style2
    },{
        value: '清算中',
        id: '35',
        style: serviceStyle.style2
    },{
        value: '已完成',
        id: '40',
        style: serviceStyle.style2
    }
]
//出入金明细
const Cash=[
    {
        value: '出金账户',
        id: '151',
        note: '',
        style: serviceStyle.style4
    },{
        value: '入金账户',
        id: '152',
        note: '',
        style: serviceStyle.style4
    }
]
// 交易管理-提货单管理
const delivery=[
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },{
        value: '待确认',
        id: '15',
        style: serviceStyle.style2
    },{
        value: '已驳回',
        id: '20',
        style: serviceStyle.style2
    },{
        value: '已完成',
        id: '25',
        style: serviceStyle.style2
    },{
        value: '失效作废',
        id: '30',
        style: serviceStyle.style2
    }
]
//购方主状态
const buyMainBid = [
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '待报名',
        id: '10',
        style: serviceStyle.style2
    },
    {
        value: '保证金',
        id: '20',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '未缴纳',
        id: '21',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '无需缴纳',
        id: '22',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '已缴纳未确认',
        id: '23',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '已缴纳已确认',
        id: '24',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '竞价中',
        id: '30',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '待开标',
        id: '40',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '已中标',
        id: '50',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '未中标',
        id: '60',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '失效/作废',
        id: '100',
        note: '',
        style: serviceStyle.style4
    },
];
// 供应需求状态
// 10 草稿，20 待审核，25 已驳回，30 发布中，40 已失效，50 已成交，60 已过期
const supplyMainBid = [
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '草稿',
        id: '10',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '审核中',
        id: '20',
        style: serviceStyle.style1
    },
    {
        value: '已驳回',
        id: '25',
        note: '',
        style: serviceStyle.style5
    },
    {
        value: '发布中',
        id: '30',
        note: '',
        style: serviceStyle.style1
    },
    {
        value: '已失效',
        id: '40',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '已成交',
        id: '50',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '已过期',
        id: '60',
        note: '',
        style: serviceStyle.style4
    }
];
// 保证金管理主状态
const bondMain = [
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '未缴纳',
        id: '10',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '未确认',
        id: '20',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已确认',
        id: '30',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '未退还',
        id: '40',
        note: '',
    },
    {
        value: '已退还',
        id: '50',
        note: '',
        style: serviceStyle.style3
    },
    {
        value: '已没收',
        id: '60',
        note: '',
        style: serviceStyle.style3
    }
];
// 订单管理主状态
// 采购方订单管理主状态
const orderMainStatus = [
    {
        value: '全部',
        id: '0',
        note: '',
        style: serviceStyle.style4
    },
    {
        value: '待确认',
        id: '10',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待确认',
        id: '15',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '待确认',
        id: '20',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '执行中',
        id: '30',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '已完成',
        id: '50',
        note: '',
        style: serviceStyle.style2
    },
    {
        value: '失效作废',
        id: '100',
        note: '',
        style: serviceStyle.style2
    }
];




// TODO 临时解决方案
const statusStyle = { "全部": { "value": "全部", "id": "0", "note": "", "style": { "color": "#2db7f5" } }, "待发布": { "value": "待发布", "id": "10", "style": { "color": "#fa9b13" } }, "审核中": { "value": "审核中", "id": "20", "note": "", "style": { "color": "#2db7f5" } },
    "待审核": { "value": "待审核", "id": "21", "note": "", "style": { "color": "#2db7f5" } },
    "已驳回": { "value": "已驳回", "id": "22", "note": "", "style": { "color": "#2db7f5" } },
    "报名中": { "value": "报名中", "id": "30", "note": "", "style": { "color": "#2db7f5" } },
    "保证金": { "value": "保证金", "id": "40", "note": "", "style": { "color": "#2db7f5" } },
    "未确认": { "value": "未确认", "id": "41", "note": "", "style": { "color": "#2db7f5" } },
    "已确认": { "value": "已确认", "id": "42", "note": "", "style": { "color": "#2db7f5" } },
    "竞价中": { "value": "竞价中", "id": "50", "note": "", "style": { "color": "#2db7f5" } },
    "待开标": { "value": "待开标", "id": "60", "note": "", "style": { "color": "#fa9b13" } },
    "待确认": { "value": "待确认", "id": "61", "note": "", "style": { "color": "#fa9b13" } },
    "待审核": { "value": "待审核", "id": "62", "note": "", "style": { "color": "#fa9b13" } },
    "已驳回": { "value": "已驳回", "id": "63", "note": "", "style": { "color": "#fa9b13" } },
    "已完成": { "value": "已完成", "id": "70", "note": "", "style": { "color": "#0cba5e" } },
    "已成交": { "value": "已成交", "id": "71", "note": "", "style": { "color": "#0cba5e" } },
    "已流标": { "value": "已流标", "id": "72", "note": "", "style": { "color": "#0cba5e" } },
    "失效/作废": { "value": "失效/作废", "id": "100", "note": "", "style": { "color": "#f15557" } },
    "参与企业不足": { "value": "参与企业不足", "id": "101", "note": "", "style": { "color": "#f15557" } },
    "中止": { "value": "中止", "id": "102", "note": "", "style": { "color": "#f15557" } } }
const commission = 0.5
const service = {
    //审批管理-审批方式
    approvalGroup: [
        { id: 1, value: '依次审批' },
        { id: 2, value: '会签' },
        { id: 3, value: '或签' },
    ],
    //流标理由
    failGroup: [
        { id: '1', value: '参与企业不足' },
        { id: '2', value: '销售计划有变' },
        { id: '3', value: '价格过低' },
        { id: '4', value: '其他' },
    ],
    //销售对象1仅限本局  2仅限中铁建成员单位  3仅限本处  4不限制
    saleTargetGroup: [
        { id: '4', value: '不限制' },
        { id: '2', value: '仅限中铁建成员单位' },
        { id: '1', value: '仅限本局' },
        { id: '3', value: '仅限本处' },
    ],
    //应用领域
    useAreaGroup: [
        { id: '1', value: '房建类' },
        { id: '2', value: '公路类' },
        { id: '3', value: '铁路类' },
        { id: '4', value: '桥梁隧道类' },
        { id: '5', value: '市政类' },
    ],
    //存储方式
    storageWayGroup: [
        { id: '1', value: '室内' },
        { id: '2', value: '室外' },
        { id: '3', value: '其它' },
    ],
    //保证金缴纳方式
    bondTypeGroup: [
        { id: '1', value: '无需缴纳保证金' },
        { id: '2', value: '线上缴纳' },
        { id: '3', value: '线下缴纳' },
    ],
    //付款方式
    payWayGroup: [
        { id: '1', value: '现金' },
        { id: '2', value: '票据' },
        { id: '3', value: '无要求' },
    ],
    //隐私
    privacyGroup: [
        { id: '1', value: '报名后可见' },
        { id: '2', value: '公开联系人' },
    ],
    //成交公告
    noticeGroup: [
        { id: '2', value: '成交后不公开' },
        { id: '1', value: '成交后自动发布' },
    ],
    //成交后发布公告
    noticeListGroup: [
        { id: '1', value: '公开中标企业名称及金额' },
        { id: '2', value: '不公开中标企业名称及金额' },
    ],
    //调价方式
    modifyPriceGroup: [
        { id: '1', value: '按比例调整' },
        { id: '2', value: '按金额调整' },
    ],
    //竞价方式
    bidTypeGroup: [
        { id: '1', value: '公开竞价' },
        { id: '2', value: '邀请竞价' },
    ],
    // 竞价方式
    bidType: [
        { id: '1', value: '公开竞价' },
        { id: '2', value: '邀请竞价' }
    ],
    //竞价销售(销方)
    saleBid: saleMainBid.filter(v => {
        if (['0', '10', '20', '30', '40', '50', '60', '70', '100'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    //竞价销售(销方)-新
    saleBidNew: saleMainBid.filter(v => {
        if (['0', '10', '30', '40', '50', '60','66','70', '100'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    //保证金状态(销方)
    bondDealBid: bondMain.filter(v => {
        if (['0', '10', '20', '30', '40', '50', '60'].indexOf(v.id) !== -1) {
            return v
        }
    }),
    // 竞价销售(购方)
    buyBid: buyMainBid.filter(v => {
        if (['0', '10', '20', '30', '40', '50', '60', '100'].indexOf(v.id) !== -1) {
            return v
        }
    }),
    // 竞价销售(购方)
    sellBid: supplyMainBid.filter(v => {
        if (['0', '10', '20', '30', '40', '50'].indexOf(v.id) !== -1) {
            return v
        }
    }),
    //订单状态
    orderStatusNew: orderMainStatus.filter(v => {
        if (['0', '10', '20', '30', '40', '50', '100'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    //订单采购方状态
    orderStatusBuyerNew: orderMainStatus.filter(v => {
        if (['0', '10', '40', '50', '100'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    cusetomerMargin:custmargin.filter(v=>{
        if (['0', '15', '20', '25'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    statementCont:statement.filter(v=>{
        if (['0', '15', '20', '25', '30'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    accClear:accclear.filter(v=>{
        if (['0', '15', '20', '25', '30', "35", "40"].indexOf(v.id) !== -1) {
            return v
        }
    }),

    CashDetail:Cash.filter(v=>{
        if (['151', '152'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    teansactionDelivery:delivery.filter(v=>{
        if (['0', '15', '20', '25','30'].indexOf(v.id) !== -1) {
            return v
        }
    }),

    //竞价审批状态
    approvalManageGroup: [
        { id: '0', value: '全部' },
        { id: '1', value: '待审核', status: '21', style: serviceStyle.style2 },
        { id: '2', value: '已通过', style: serviceStyle.style3 },
        { id: '3', value: '已驳回', status: '22', style: serviceStyle.style5 },

    ],
    //订单审批搜索状态
    approvalStatusGroup: [
        { id: '10', value: '待确认', style: serviceStyle.style2 },
        { id: '20', value: '待审批', style: serviceStyle.style2 },
        { id: '50', value: '已完成', style: serviceStyle.style3 },
        { id: '15', value: '已驳回', style: serviceStyle.style5 },
    ],
    //订单审批订单来源
    approvalSourceGroup: [
        { id: '1', value: '竞价' },
        { id: '2', value: '供求' },
    ],
    //处置/计价方式
    pricingMethodGroup: [
        { id: 1, value: '按批次计价' },
        { id: 2, value: '按重量计价' },
    ],
    //处置/计价方式
    pricingMethod: [
        { id: '1', value: '按批次计价' },
        { id: '2', value: '按重量计价' },
    ],
    //竞买人企业类型
    biddersTypeGroup: [
        { id: 1, value: '个体工商户' },
        { id: 2, value: '企业主体' },
        { id: 3, value: '无要求' },
    ],
    //竞买人资质许可
    biddersQualificationGroup:[
        {id: '1', value: '危险废物经营许可证'},
        {id: '2', value: '报废汽车回收（拆解）企业资格'},
        {id: '3', value: '特种行业许可证'},
        {id: '4', value: '爆破作业单位许可证'},
        {id: '5', value: '其他'},
    ],
    //竞买人是否包含报价税率
    biddersTaxFlagGroup:[
        {id: 1, value: '报价不含税'},
        {id: 2, value: '报价含税'},
    ],
    //拆卸情况
    disassembleFlagGroup:[
        {id: 1, value: '需买方自行拆卸'},
        {id: 2, value: '无需拆卸可直接清运'},
    ],
}

const obj = serviceReform({
    saleMainBid,
    buyMainBid,
    supplyMainBid,
    bondMain,
    custmargin,
    statement,
    accclear,
    delivery
})

const baseService = { ...service, ...obj, statusStyle }
/**
 * 业务流程状态[baseService]-end
 // */


export {
    menuList,
    baseService,
    commission
}
