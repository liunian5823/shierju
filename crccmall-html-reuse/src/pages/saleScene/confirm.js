import React from 'react';
import Order from './mixins/order';

import { Form } from 'antd';

class SaleOrderConfirm extends Order {
    constructor(props) {
        super(props)
    }
    _type = 'confirm'

    componentWillMount() {
        this.handleInit()
    }
    handleInit = () => {
        this._uuids = this.props.match.params.uuids;
        if (this._uuids) {
            this.getApprovalStas().then(() => {
                let params = {
                    businessId: this._uuids,
                    source: 1
                }
                this.getOrderInfo(params)
            })

        }
    }

    render() {
        return super.render()
    }
}

export default Form.create()(SaleOrderConfirm)