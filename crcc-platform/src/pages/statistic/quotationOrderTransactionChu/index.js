import {Form, Card, Radio, Select, DatePicker, Row, Button, Table, Pagination} from "antd";
import api from '@/framework/axios';
import "./index.css";
import moment from 'moment';
import Util from '@/utils/util';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
class QuotationOrderTransaction extends React.Component {
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
                totalCount: 0,
                currentPage: 1,
                pageSize: 20,
                data:[],
                sumPrice: 0,
            }
        }
        componentWillMount() {
            this.getData();
            // this.getTotalM();
        }
        //询报价业务总金额（处）
        getData = params => {
            api.ajax('GET',"@/statistics/inquiryStatistic/queryInqAndQuoOrderTotalPriceChu", {
                ...params
            }).then(r => {
                var data =[];
                data = r.data.rows;
                var total = r.data.rows.length;
                this.setState({
                    sumPrice: r.data.sum ? r.data.sum.price : 0,
                    data: r.data.rows,
                    dataInfo: data.slice(0, this.state.currentPage * this.state.pageSize),
                    totalCount: total,
                    currentPage:1,
                    pageSize: 20,
                    loading: false
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
            //   if(!radioValue) {
            //     Util.alert("请选择搜索条件", {type: 'error'});
            //     return;
            //   }
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
              this.getData(params);
            //   this.getTotalM(params);
            });
        };
        columns = () => {
            return [
                {
                    title: '序号',
                    key: 'indexkey',
                    width: 100,
                    render: (text, record, index) => (
                        <span>{index+1}</span>
                      ),
                },
                {
                    title: '局级公司名称',
                    dataIndex: 'name',
                    key: 'name',
                    sorter: false,
                    width: 350,
                    render: (text, record)=>{
                        return <span title={text}>{text ? text : "-"}</span>
                    }
                },
                {
                    title: '订单金额',
                    dataIndex: 'price',
                    key: 'price',
                    sorter: false,
                    width: 250,
                    render: (text, record)=>{
                        return <span title={text}>{text ? text : "-"}</span>
                    }
                }
            ]
        }
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
            // this.getData();
        }

        //pageSize变化函数
        onShowSizeChange = (current, pageSize) => {
            this.setState({
                currentPage: 1,
                pageSize: pageSize,
                dataInfo: this.state.data.slice(0, pageSize)
            })
        }

        //page变化函数
        onPageChange = (current, pageSize) => {
            //页码变化
            this.setState({
                dataInfo: this.state.data.slice((current-1) * this.state.pageSize, current * this.state.pageSize)
            })
        }

        render(){
            const { getFieldProps } = this.props.form;
            const { anyYears, dataInfo, loading, monthS, selS, timeS } = this.state;
            let isShow = dataInfo.length > 0 ? "block" : "none";
            return(
                <div>
                    <Card bordered={false} className="cards">
                        <Form onSubmit={this.handleSearch} style={{height: "50px"}}>
                        <Row className="baseForm" gutter={24} style={{display: "flex"}}>
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
                                <div className="pageRight">
                                    <Button type="primary" onClick={this.handleSearch} className="topBtn">查询</Button>
                                    <Button type="ghost" onClick={this.resetForm} className="resetForm">清空</Button>
                                </div>
                            </Row>
                        </Form>
                         <h3 style={{marginBottom: "15px",zIndex: 999, display : "inline-block", position:"relative"}}>订单总金额: { this.state.sumPrice }</h3>
                        <Table
                            dataSource={dataInfo}
                            columns={this.columns()}
                            loading={loading}
                            scroll={{ x: 1000 }}
                            pagination={ false }
                        />
                        <div style={{margin: "16px 0",float: "right",display: isShow}}>
                            <Pagination
                                showSizeChanger
                                defaultCurrent={this.state.currentPage}
                                total={this.state.totalCount}
                                pageSizeOptions={['20', '100', '500', '1000']}
                                defaultPageSize={20}
                                onShowSizeChange={this.onShowSizeChange}
                                onChange={this.onPageChange}
                            />
                        </div>
                    </Card>
                </div>
            )
        }
}
export default Form.create()(QuotationOrderTransaction);