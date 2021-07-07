import { Card, Button, Form, Upload } from 'antd';
import api from '@/framework/axios';
import Util from '@/utils/util';
import BaseForm from '@/components/baseForm';
import BaseTable from '@/components/baseTable';
import Input from '@/components/baseInput';
import AuthButton from '@/components/authButton'

const FormItem = Form.Item;

class contrabandManagement extends React.Component {
  _isMounted = false
  state = {
    addloading: false,
    _loading: false,
    tableState: 0,
    fileList: [],
    _stop: false
  }

  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  formList = [
    {
      type: 'INPUT',
      field: 'forbiddenWords',
      label: '模糊查询',
      placeholder: '模糊查询'
    }
  ]
  handleFilter = (p, isSend = true) => {
    this.baseParams = {
      ...this.baseParams,
      ...p,
    }
    if (isSend) {
      this.reloadTableData();
    }
  }
  baseParams = {}
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
  handelToLoadTable = (state = 1, tableState = 'tableState') => {
    this.setState({
      [tableState]: state
    })
  }
  columns = () => {
    return [
      {
        title: '违禁词',
        dataIndex: 'forbiddenWords',
        key: 'forbiddenWords',
        sorter: true
      },
      {
        title: '创建人',
        dataIndex: 'username',
        key: 'username',
        witdh: 120,
        sorter: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        witdh: 200,
        render: (text, record) => (
          <span>
            {record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        witdh: 120,
        render: (text, record) => (
          <span>
            <AuthButton elmType="a" onClick={() => { this.handleToDel(record.uuids) }}>删除</AuthButton>
          </span>)
      }
    ]
  }
  handleToDel = (uuids) => {
    let _this = this;
    this.setState({
      loading: true,
    })
    api.ajax("PUT", "@/base/ecForbiddenWords/delete", [
      uuids
    ]).then(r => {
      if (!_this._isMounted) {
        return;
      }
      Util.alert(r.msg, { type: 'success' });
      this.reloadTableData();
    }).catch(r => {
      Util.alert(r.msg, { type: 'error' });
      this.setState({
        loading: false
      })
    })
  }
  handleToAdd = () => {
    if (this.state._stop) return
    this.setState({
      _stop: true
    })
    setTimeout(() => {
      this.setState({
        _stop: false
      })
    }, 800)
    let obj = this.props.form.getFieldValue('forbiddenWords');
    if (obj && obj != '') {
      let _this = this;
      this.setState({
        addloading: true,
      })
      api.ajax("POST", "@/base/ecForbiddenWords/save", {
        forbiddenWords: obj
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        this.setState({
          addloading: false
        })
        this.props.form.resetFields();
        this.reloadTableData();
        Util.alert(r.msg, { type: 'success' });
      }).catch(r => {
        this.props.form.resetFields();
        Util.alert(r.msg, { type: 'error' });
        this.setState({
          addloading: false
        })
      })
    } else {
      Util.alert('请输入违禁词', { type: 'error' });
    }
  }

  handleToDemo = () => {
    window.open('/api' + '/base/ecForbiddenWords/downForbiddenWordsFile')
  }

  //上传前禁止提交
  beforeUpload = (file) => {
    const isXls = file.type === 'application/x-excel';
    const isXlss = file.type === 'application/vnd.ms-excel';
    const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isXls && !isXlss && !isXlsx) {
      Util.alert('请上传xls/xlsx格式的文件', { type: "error" })
      return false;
    }
    if (file.size > (1048 * 1048 * 2)) {
      Util.alert('上传的文件不能大于2M，请拆分后上传', { type: "error" })
      return false;
    }

    // 澄清文件上传中禁止提交
    this.setState({
      _loading: true
    })
    return true;
  }

  //上传文件成功
  uploadProps = (info) => {
    let fileList = info.fileList;
    if (info.file.status === 'done') {
      Util.alert('违禁词汇导入成功', { type: "success" })
      // 说明材料上传中禁止提交
      this.setState({
        _loading: false
      })
      fileList = [];
      this.reloadTableData();
    } else if (info.file.status === 'error') {
      Util.alert('违禁词汇导入失败，请稍后再试', { type: "error" })
      this.setState({
        _loading: false
      })
    }
    this.setState({
      fileList: fileList
    })
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <Card bordered={false}>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter}></BaseForm>
          <div className='toolbar'>
            <Form inline>
              <AuthButton elmType="content" elmName="添加">
                <FormItem label="添加违禁词">
                  <Input
                    type='text'
                    maxLength='30'
                    onKeyDown={(e) => { if (e.keyCode == 13) { this.handleToAdd() } }}
                    {...getFieldProps('forbiddenWords')}
                    placeholder='请输入' />
                </FormItem>
              </AuthButton>
              <AuthButton type="primary" onClick={this.handleToAdd} loading={this.state.addloading}>添加</AuthButton>
              <Button type="primary" onClick={this.handleToDemo}>下载模版</Button>
              <Upload
                className="no_filelist"
                disabled={this.state._loading}
                key={'up'}
                name="file"
                headers={{ 'authorization': window.reduxState.token }}
                action={SystemConfig.configs.axiosUrl + '/base/ecForbiddenWords/importexcel'}
                fileList={this.state.fileList}
                beforeUpload={this.beforeUpload}
                onChange={(info) => {
                  this.uploadProps(info)
                }
                }
              >
                <AuthButton type="primary" loading={this.state._loading}>导入</AuthButton>
              </Upload>
            </Form>
          </div>
          <BaseTable
            url='@/base/ecForbiddenWords/page'
            tableState={this.state.tableState}
            resetTable={(state) => { this.resetTable(state, 'tableState') }}
            baseParams={this.baseParams}
            columns={this.columns()} />
        </Card>
      </div>
    )
  }
}
export default Form.create()(contrabandManagement);