import React from 'react';
import Order from './mixins/order';

import { Form } from 'antd';

class SaleOrder extends Order {
    constructor(props) {
        super(props)
    }
    _type = null 

    componentWillMount() {
        this.handleInit()
    }
    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        let params = {
            businessId: this._uuids,
            source: 1
        }
        if(this._uuids) {
            this.getOrderInfo(params)
        }
    }

    render() {
        return super.render()
    }
}

export default Form.create()(SaleOrder)