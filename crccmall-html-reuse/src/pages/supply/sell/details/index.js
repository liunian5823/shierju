import React from 'react';
import Detail from '../../mixins/details'
class SupplyDetail extends Detail {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // 详情接口
    initUrl = '@/reuse/supplyDemand/info';
    // 撤销公告接口
    cancellationNoticeUrl = '@/reuse/supplyDemand/back';
    render() {
        return super.render();
    }
}
export default SupplyDetail
