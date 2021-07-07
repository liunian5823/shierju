import { Card, Button, Tabs, Alert } from 'antd';
import api from '@/framework/axios';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import {systemConfig, systemConfigPath} from '@/utils/config/systemConfig';
import {getUrlByParam} from '@/utils/urlUtils';
import Util from '@/utils/util'
import less from './index.less';


export default class thirdGoodsStatistics extends React.Component {
  _isMounted = false;

  state = {
    loading: false,
    tableState: 0,
    goodsClassList:[],  //商品分类
  }


  componentWillMount() {
    this._isMounted = true;
    this.getGoodsClassData(-1);
    // 进入页面加载数据
    this.handelToLoadTable();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  importantFilter = [ 'goodsClass', 'status']

  renderFormList = () => {
    let options = this.state.goodsClassList;
    return [
      {
        type: 'SELECT',
        field: 'status',
        label: '商品状态',
        placeholder: '请输入商品状态',
        list: [{ id: '0', value: '上架中' }, { id: '4', value: '审核中' }, { id: '1', value: '下架' }, { id: '3', value: '违规下架' }]
      },{
        type: 'LINKAGE',
        field: 'goodsClass',
        label: '商品分类',
        placeholder: '请输入分类名称',
        options,
        loadData:this.loadLinkageData,
      },
    ]
  }

  loadLinkageData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let pId = targetOption.value;
    let level = targetOption.level;
    if(level<3){
      api.ajax('GET', '@/merchandise/ecGoodsClass/all', {
        pId,
        display:1
      }).then(r => {
        if (!this._isMounted) {
          return;
        }
        targetOption.loading = false;
        let goodsClassList = r.data.rows;
        if(goodsClassList!=null && goodsClassList.length>0){
          if(level==2){
            targetOption.children = Util.getLinkageOptionList(goodsClassList,"id","name","yes");
          }else{
            targetOption.children = Util.getLinkageOptionList(goodsClassList,"id","name");
          }
        }else{
          targetOption.isLeaf = true;
        }
        this.setState({
          goodsClassList: [...this.state.goodsClassList],
        });

      }).catch(r => {
      })
    }
  }

  //获取商品分类
  getGoodsClassData = (pId) =>(
      api.ajax('GET', '@/merchandise/ecGoodsClass/all', {
        pId,
        display:1
      }).then(r => {
        if (!this._isMounted) {
          return;
        }
        let rowsList = r.data.rows;
        let goodsClassList = [];
        if(rowsList==null || rowsList.length<=0){
          goodsClassList = Util.getLinkageOptionList(rowsList,"id","name","yes");
        }else{
          goodsClassList = Util.getLinkageOptionList(rowsList,"id","name");
        }
        this.setState({
          loading: false,
          goodsClassList,
        });
      }).catch(r => {
        this.setState({
          loading: false
        })
      })
  )

  handleFilter = (param, isSend = true) => {
    let topClassId, parentClassId, goodsClassId, status;
    let goodsClass = param.goodsClass;
    if(goodsClass){
      if(goodsClass.length == 1){
        topClassId = goodsClass[0];
      }
      if(goodsClass.length == 2){
        parentClassId = goodsClass[1];
      }
      if(goodsClass.length == 3){
        goodsClassId = goodsClass[2];
      }
    }
    status = param.status;
    this.baseParams = {
      ...this.baseParams,
      topClassId,
      parentClassId,
      goodsClassId,
      status
    }
    if (isSend) {
      this.handelToLoadTable();
    }
  }

  baseParams = {}
  columns = [
        {
          title: '公司名称',
          dataIndex: 'storeName',
          key: 'storeName'
        },
        {
          title: '商品数量',
          dataIndex: 'num',
          key: 'num'
        }]
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
  reloadTableData(state = 1) {
    this.handelToLoadTable(state, 'tableState');
  }

  render() {
    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.renderFormList()} importantFilter={this.importantFilter} filterSubmit={this.handleFilter} />
          <BaseTable
            notInit={true}
            url='@/statistics/goodsStatistic/officeGoodsStatistics'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns} />
        </Card>
      </div>
    )
  }
}