import { Form, Card, Table } from "antd";
import api from '@/framework/axios';
import "./index.css";
export default class AmountOfArrears extends React.Component {
        constructor(props) {
        super(props);
            this.state = {
                dataInfo: [],
                loading: true,
                sumPrice: 0
            }
        }
        componentWillMount() {
            this.getData();
        }
        //获取欠款金额
        getData = params => {
            api.ajax('GET',"@/statistics/purchaseStatistic/amountOwedStatistic", {
                ...params
            }).then(r => {
                this.setState({
                    dataInfo: r.data.rows,
                    sumPrice: r.data.sum.totalAmount,
                    loading: false
                })
            });
        }

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
                    title: '欠款金额',
                    dataIndex: 'amountOwed',
                    key: 'amountOwed',
                    sorter: false,
                    width: 250,
                    render: (text, record)=>{
                        return <span title={text}>{text ? text : "-"}</span>
                    }
                }
            ]
        }

        render(){
            const {dataInfo, loading, sumPrice} = this.state;
            return(
                <div>
                    <Card bordered={false} className="cards">
                        <h3 style={{marginBottom: "15px",zIndex: 999, display : "inline-block", position:"relative"}}>欠款总金额: {sumPrice}</h3>
                        <Table
                            dataSource={dataInfo}
                            columns={this.columns()}
                            loading={loading}
                            scroll={{ x: 1000 }}
                            pagination={ false }
                        />
                    </Card>
                </div>
            )
        }
}
