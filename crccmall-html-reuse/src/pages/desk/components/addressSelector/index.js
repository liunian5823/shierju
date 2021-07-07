import React from 'react';

import { Cascader } from 'antd';
import api from "@/framework/axios";

class LazyAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            def: [],
            noLoad: false
        };
    }
    componentDidMount() {
        this.initialization && this.initialization();
    }
    initialization() {
        if (this.state.noLoad)return;
        api.ajax('GET', '@/reuse/address/getProvinceList').then(res => {
            let options = res.data.data.rows.map(({provinceCode, provinceName}) => {
                return{
                    value: provinceCode,
                    label: provinceName,
                    isLeaf: false,
                    loading: false
                }
            });
            this.setState({
                options
            });

            this.initOption(options);
        })
    }
    // initOption
    initOption= (options) => {
        let value = this.props['data-__meta'].initialValue;
        if (!value.length)return;
        if (value[0]) {
            let selectedOptions = [];
            let selected = options.find(v => v.value === value[0]);
            selectedOptions.push(selected);
            this.loadData(selectedOptions, (data) => {
                if (value[1]) {
                    let selected = data.find(v => v.value === value[1]);
                    selectedOptions.push(selected);
                    this.loadData(selectedOptions)
                }
            })
        }
    };
    loadData = (selectedOptions, callback) => {
        this.setState({
            noLoad: !callback
        }, () => {
            if (selectedOptions.length >= 3)return;
            let isCity = selectedOptions.length > 1;
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            if (isCity) {
                api.ajax('GET', '@/reuse/address/getAreaList', {
                    cityCode: targetOption.value
                }).then(res => {
                    let children = res.data.data.rows.map(({areaCode, areaName}) => {
                        return{
                            value: areaCode,
                            label: areaName,
                        }
                    });
                    targetOption.loading = false;
                    targetOption.children = children;
                    this.setState({
                        options: [...this.state.options],
                    });
                    callback && callback(children)
                });
                return
            }
            api.ajax('GET', '@/reuse/address/getCityList', {
                provinceCode: targetOption.value
            }).then(res => {
                let children = res.data.data.rows.map(({cityCode, cityName}) => {
                    return{
                        value: cityCode,
                        label: cityName,
                        isLeaf: false,
                    }
                });
                targetOption.loading = false;
                targetOption.children = children;
                this.setState({
                    options: [...this.state.options],
                });
                callback && callback(children)
            })
        });
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.initialization();
        }
    }
    render() {
        let {options} = this.state;
        return (
            <Cascader
                {...this.props}
                options={options}
                loadData={this.loadData}
            />
        );
    }
}

export default LazyAddress
