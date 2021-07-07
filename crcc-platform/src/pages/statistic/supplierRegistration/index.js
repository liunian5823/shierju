import { Form, Card, Radio, Select, DatePicker, Row, Button, Table,Input } from "antd";
import api from '@/framework/axios';
import moment from 'moment';
import Util from '@/utils/util';
import BaseTable from '@/components/baseTable'
import less from  "./index.less";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
class SupplierRegistration extends React.Component {
        constructor(props) {
        super(props);
            this.state = {
                anyYears: [{"id" :2017,"anyYear": "2017"},{"id" :2018,"anyYear": "2018"},{"id" :2019,"anyYear": "2019"},{"id" :2020,"anyYear": "2020"}],
                tableState: 0,
                dataInfo: [],
                dataTotal: {},
                loading: true,
                radioValue: "",
                monthS: true,
                selS: true,
                timeS: true,
                dataCount:[]
            }
        }
        componentWillMount() {
            this.handelToLoadTable();
            this.getData();
        }

        //获取供应商注册数量
        getData = params => {
            api.ajax('GET',"@/statistics/payStatistic/regSupplyerStatisticeCount", {
                ...params
            }).then(r => {
                this.setState({
                    dataCount: r.data
                })
            });
        }



        //获取当前时间
        getCurTime = ( num, values) => {
            let currTimeO,currTimeT,currTimeTh,currTimeF,currTimeFo;
            let date = new Date();
            let _month;
            if(date.getMonth() >= 0 && date.getMonth() <10) {
                _month = `0${date.getMonth() + 1}`;
            }else {
                _month = date.getMonth();
            }
            // 本月
            currTimeO = {timeStart: `${date.getFullYear()}-${_month}-01`,timeEnd: `${date.getFullYear()}-${_month}-31`};
            // 本年
            currTimeT = {timeStart: `${date.getFullYear()}-01-01`,timeEnd: `${date.getFullYear()}-12-31`};
            if(values) {
                //任意月 
                currTimeTh = {timeStart: `${values}-01`,timeEnd: `${values}-31`};
                //任意年
                currTimeF = {timeStart: `${values}-01-01`,timeEnd: `${values}-12-31`};
                //时间区间
                currTimeFo = {timeStart: `${moment(values[0]).format("YYYY-MM-DD")}`,timeEnd: `${moment(values[1]).format("YYYY-MM-DD")}`};
            }
            switch(num) {
                case 1:
                    return currTimeO;
                case 2: 
                    return currTimeT;
                case 3: 
                    return currTimeTh;
                case 4: 
                    return currTimeF;
                case 5: 
                    return currTimeFo;
            }
        }
        // 提交查询
        handleSearch = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
              let params = {};
              let radioValue = this.state.radioValue;
              if(radioValue === "a") {
                params = this.getCurTime(1,null);
              }
              if(radioValue === "b") {
                params = this.getCurTime(2,null);
              }
              if(radioValue === "c") {
                let anyMonth = moment(values.anyMonth).format("YYYY-MM");
                if(values.anyMonth == null || values.anyMonth == '' || values.anyMonth=='undefined' ){
                    Util.alert("请选择搜索月份", {type: 'error'});
                    return;
                }
                params = this.getCurTime(3,anyMonth);
              }
              if(radioValue === "d") {
                let anyYear = values.anyYear;
                if(anyYear == null || anyYear == '' || anyYear=='undefined'){
                    Util.alert("请选择搜索年份", {type: 'error'});
                    return;
                }
                params = this.getCurTime(4,anyYear);
              }
              if(radioValue === "e") {
                let timeArr = values.timeArr;
                if(timeArr == null || timeArr == '' || timeArr=='undefined'){
                    Util.alert("请选择搜索时间", {type: 'error'});
                    return;
                }   
                params = this.getCurTime(5,timeArr);
              }

              if(values.searchName && values.searchName != null && values.searchName !='undefined'){
                  params.searchName = values.searchName;
              }
                console.log("params---------------",params);
                this.baseParams = {
                    ...this.baseParams,
                    ...params
                }
                this.handelToLoadTable();
                this.getData(params);
            });
        };


    columns = [
            {
                title: '公司名称',
                dataIndex: 'company_name',
                key: 'company_name',
                sorter: false,
                width: 250,
                render: (text, record)=>{
                    return <span title={text}>{text ? text : "-"}</span>
                }
            },
            {
                title: '营业执照号',
                dataIndex: 'social_credit_code',
                key: 'social_credit_code',
                sorter: false,
                width: 250,
                render: (text, record)=>{
                    return <span title={text}>{text ? text : "-"}</span>
                }
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                sorter: false,
                width: 250,
                render: (text, record)=>{
                    return <span title={text}>{text ? text : "-"}</span>
                }
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                sorter: false,
                width: 250,
                render: (text, record)=>{
                    return <span title={text}>{text ? text : "-"}</span>
                }
            }
        ]


    //加载table
    handelToLoadTable = (state = 1, tableState = 'tableState') => {
        this.setState({
            [tableState]: state
        })
    }

    resetTable = (state, tableState = 'tableState') => {
        if (state != this.state[tableState]) {
            this.setState({
                [tableState]: state
            });
        }
    }

    baseParams = {}



    onChange = e => {
        this.setState({
            radioValue: e.target.value,
        });
        if(e.target.value === "a" || e.target.value === "b") {
            this.setState({
                monthS: true,
                selS: true,
                timeS: true,
            })
        }else if(e.target.value === "c") {
            this.setState({
                monthS: false,
                selS: true,
                timeS: true,
            })
        }else if (e.target.value === "d") {
            this.setState({
                monthS: true,
                selS: false,
                timeS: true,
            })
        }else if(e.target.value === "e") {
            this.setState({
                monthS: true,
                selS: true,
                timeS: false,
            })
        }
    };


    //清空
    resetForm = () => {
        this.props.form.resetFields();
        this.setState({
            radioValue: "",
            monthS: true,
            selS: true,
            timeS: true,
        })

    }


        render(){
            const { getFieldProps } = this.props.form;
            const { anyYears, dataInfo, loading, monthS, selS, timeS } = this.state;
            return(
                <div>
                    <Card bordered={false} className="supplierRedistrationCard">
                        <Form onSubmit={this.handleSearch} style={{height: "90px"}}>
                        <Row className={less.baseForm} gutter={24} style={{display: "flex"}}>
                                <RadioGroup {...getFieldProps('danxuan')} style={{width: "86%",height: "50px"}} onChange={this.onChange} value={this.state.radioValue}>
                                    <Radio value="a" style={{width: "6%",marginTop: "-74px"}}>本月</Radio>
                                    <Radio value="b" style={{width: "9%",marginTop: "-74px"}}>本年</Radio>
                                    <Radio value="c" style={{width: "24%"}}>任意月:
                                        <FormItem style={{top: "-24px",left: "76px"}}>
                                            <MonthPicker {...getFieldProps('anyMonth')} format="yyyy/MM" disabled={monthS} />
                                        </FormItem>
                                    </Radio>
                                    <Radio value="d" style={{width: "18%"}}>任意年:
                                        <FormItem style={{top: "-24px",left: "76px",width: "110px"}}>
                                            <Select {...getFieldProps("anyYear")} placeholder="请选择" disabled={selS}>
                                                { anyYears.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.id}>
                                                            {item.anyYear}
                                                        </Option>
                                                    );
                                                }) }
                                            </Select>
                                        </FormItem>
                                    </Radio>
                                    <Radio value="e" style={{width: "25%"}}>时间区间: 
                                        <FormItem style={{top: "-24px",left: "76px"}}>   
                                            <RangePicker {...getFieldProps('timeArr')}  format="yyyy/MM/dd" disabled={timeS} />     
                                        </FormItem>     
                                    </Radio>
                                </RadioGroup>

                            </Row>
                            <Row className={less.baseForm} gutter={24} style={{display: "flex"}}>
                                <h3 style={{marginBottom: "15px",zIndex: 999, display : "inline-block", position:"relative"}}>供应商注册数量: {this.state.dataCount ? this.state.dataCount : "0" }</h3>

                                <div className={less.pageRight} style={{marginLeft:"85px"}} >
                                    <FormItem style={{top: "-6px"}}>
                                        <Input  placeholder="请输入公司名或手机号" style={{width: "300px"}}  {...getFieldProps('searchName')}  />
                                    </FormItem>
                                    <Button type="primary" onClick={this.handleSearch} className={less.topBtn}>查询</Button>
                                    <Button type="ghost" onClick={this.resetForm} className={less.resetForm}>清空</Button>
                                </div>
                            </Row>
                        </Form>

                        <BaseTable
                            url="@/statistics/payStatistic/regSupplyerStatistice"
                            tableState={this.state.tableState}
                            resetTable={(state) => { this.resetTable(state, 'tableState') }}
                            baseParams={this.baseParams}
                            columns={this.columns}
                            notInit={true}
                        />
                    </Card>
                </div>
            )
        }
}
export default Form.create()(SupplierRegistration);