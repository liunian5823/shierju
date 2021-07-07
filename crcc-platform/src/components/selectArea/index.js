import { Row, Col, Tree, Spin, Button } from 'antd'
import api from '@/framework/axios'//请求接口的封装
import Util from '@/utils/util'
import less from './index.less'

const TreeNode = Tree.TreeNode;

class details extends React.Component {

  _isMounted = false
  areaData = []
  arrStr = ''
  loadAreaArr = []
  _isInitRegion = false//区域数据是否显示完成

  state = {
    style: null,
    _loading: false,

    region: [],
    prov: [],
    city: [],
    area: [],

    // 选择树
    treeChecked: { checked: [], halfChecked: [] },
    treeSelect_region: [],
    treeSelect_prov: [],
    treeSelect_city: [],
    treeSelect_area: [],
  }

  componentWillMount() {
    this._isMounted = true;
    // this.initData()
    this.getRegionList();
  }

  componentDidMount() {
    let _this = this;
    document.addEventListener("click", function () {
      _this.hideSelect()
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.areaData && (this.arrStr != nextProps.areaData)) {
      let that = this;
      that.arrStr = nextProps.areaData;
      if (that.arrStr.length > 0) {
        //仅触发第一次赋值操作
        that.initData(nextProps.areaData.split(','));
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initData = (data, region = []) => {
    if (!this._isInitRegion) { return }
    data = data || []
    let halfCheckedData = this.computedDataSplit(data);
    this.loadAreaArr = halfCheckedData;

    //确定是否渲染不限
    region = region.length > 0 ? region : this.state.region;
    let obj = this.initFullArea(data, halfCheckedData, region)

    this.initDataAjax();
    this.setState({
      treeChecked: { checked: obj.data, halfChecked: obj.halfCheckedData },
    })
  }

  initDataAjax = () => {
    let list = [];
    if (this.loadAreaArr.length == 0) {
      return
    }
    this.loadAreaArr.map(item => {
      let obj = this.getObjFromData(item);
      if (!obj) {
        list.push(item);
      } else {
        let itemArr = item.split('_');
        let fncName = ''
        if (itemArr.length == 1) {
          fncName = 'getProvinceList'
        } else if (itemArr.length == 2) {
          fncName = 'getCityList'
        } else if (itemArr.length == 3) {
          fncName = 'getAreaList'
        }
        this[fncName](item, 0, () => {
          this.initDataAjax();
        });
      }
    })
    this.loadAreaArr = list;
  }

  initFullArea = (data, halfCheckedData, region) => {
    let num = 0;
    region.map(item => {
      let index = data.indexOf(item.code);
      if (index > -1) {
        num++;
      }
    })
    if (num >= (region.length - 1)) {
      data.push('-1')
    } else if (num > 0 || data.length > 0) {
      halfCheckedData.push('-1')
    }
    return {
      data,
      halfCheckedData
    }
  }

  //拆分节点
  computedDataSplit = (arr) => {
    let haflArr = []
    arr.map(item => {
      let strArr = item.split('_');
      if (strArr.length > 2) {
        let code = '';
        for (let i = 0; i < (strArr.length - 1); i++) {
          if (i == 0) {
            code = strArr[i];
          } else {
            code += '_' + strArr[i];
          }
          haflArr.push(code)
        }
      }
    })
    haflArr = Array.from(new Set([...haflArr]));
    //根据不全的去加载数据
    haflArr.forEach(item => {
      let strLength = item.split('_').length;
    })
    return haflArr
  }

  // 计算集合拼接json
  computedData = (arr, key, parentCode) => {
    let titleK = key + 'Name';
    let keyK = key + 'Code';
    arr.map(item => {
      let codeBefore = parentCode ? parentCode + '_' : '';
      item.title = item[titleK];
      item.code = codeBefore + item[keyK];
      item.parentCode = parentCode || null;
    })
    return arr;
  }

  computedCode = (code) => {
    let codeStrArr = code.split('_');
    return codeStrArr[codeStrArr.length - 1]
  }

  filterArr = (arr, data) => {
    let list = []
    if (typeof (data) == "string") {
      arr.map(item => {
        let index = item.indexOf(data);
        if (index == -1) {
          list.push(item)
        }
        return
      })
    } else {
      arr.map(item => {
        for (let i = 0; i < data.length; i++) {
          if (data[i] == item) {
            return;
          }
        }
        list.push(item)
        return
      })
    }
    return list
  }

  //从缓存数据中获得当前对象
  getObjFromData = (code) => {
    let data = this.areaData;
    return this.deepQuery(data, code)
  }
  //深度非递归计算节点
  deepQuery = (tree, code) => {
    var stark = [];

    stark = stark.concat(tree);

    while (stark.length) {
      var temp = stark.shift();
      if (temp.children) {
        stark = temp.children.concat(stark);
      }
      let key = 'code'
      if (code === temp[key]) {
        return temp;
      }
    }
  }

  // 获得晟
  getRegionList = () => {
    let _this = this;
    this.setState({
      _loading: true
    })
    api.ajax("GET", "@/base/ecProvince/selectArea", {
    }).then(r => {
      if (!_this._isMounted) {
        return;
      }
      r.data.rows = this.computedData(r.data.rows, 'area');
      this.areaData = [{ code: '-1', title: '不限', children: [] }, ...r.data.rows]
      this.setState({
        _loading: false,
        region: this.areaData,
      })
      if (!this._isInitRegion) {
        this._isInitRegion = true;
        if (this.arrStr.length > 0) {
          this.initData(this.arrStr.split(','))
        }
      }
    }).catch(r => {
      this.setState({
        _loading: false,
      })
    })
  }
  // 获取省数据
  getProvinceList = (areaCode, checkStatus, callback) => {
    let obj = this.getObjFromData(areaCode);
    if (obj.children) {
      this.setState({
        prov: obj.children,
        city: [],
        area: []
      })
      this.changeTreeStatusForArr(obj.children, checkStatus);
    } else {
      let _this = this;
      this.setState({
        _loading: true,
        prov: [],
        city: [],
        area: []
      })
      api.ajax("GET", "@/base/ecProvince/selectProvince", {
        areaCode: this.computedCode(areaCode)
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        r.data.rows = this.computedData(r.data.rows, 'province', areaCode);
        obj.children = r.data.rows;
        this.changeTreeStatusForArr(obj.children, checkStatus);
        this.setState({
          _loading: false,
          prov: r.data.rows,
        })
        if (callback) {
          callback()
        }
      }).catch(r => {
        this.setState({
          _loading: false,
        })
      })
    }
  }
  // 获取市数据
  getCityList = (provinceCode, checkStatus, callback) => {
    let obj = this.getObjFromData(provinceCode);
    if (obj.children) {
      this.setState({
        city: obj.children,
        area: []
      })
      this.changeTreeStatusForArr(obj.children, checkStatus);
    } else {
      let _this = this;
      this.setState({
        _loading: true,
        city: [],
        area: []
      })
      api.ajax("GET", "@/base/ecCity/selectProvinceCode", {
        provinceCode: this.computedCode(provinceCode)
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        r.data.rows = this.computedData(r.data.rows, 'city', provinceCode);
        obj.children = r.data.rows;
        this.changeTreeStatusForArr(obj.children, checkStatus);
        this.setState({
          _loading: false,
          city: r.data.rows,
        })
        if (callback) {
          callback()
        }
      }).catch(r => {
        this.setState({
          _loading: false,
        })
      })
    }
  }
  // 获取县数据
  getAreaList = (cityCode, checkStatus, callback) => {
    let obj = this.getObjFromData(cityCode);
    if (obj.children) {
      this.setState({
        area: obj.children
      })
      this.changeTreeStatusForArr(obj.children, checkStatus);
    } else {
      let _this = this;
      this.setState({
        _loading: true,
        area: []
      })
      api.ajax("GET", "@/base/ecArea/selectCityCode", {
        cityCode: this.computedCode(cityCode)
      }).then(r => {
        if (!_this._isMounted) {
          return;
        }
        r.data.rows = this.computedData(r.data.rows, 'area', cityCode);
        obj.children = r.data.rows;
        this.changeTreeStatusForArr(obj.children, checkStatus);
        this.setState({
          _loading: false,
          area: r.data.rows
        })
        if (callback) {
          callback()
        }
      }).catch(r => {
        this.setState({
          _loading: false,
        })
      })
    }
  }

  // 异步加载省市县
  asyncLoadData = (code, type, checkStatus) => {
    if (code == '-1') {
      return;
    }
    if (type === 'region') {
      this.getProvinceList(code, checkStatus)
    } else if (type === 'prov') {
      this.getCityList(code, checkStatus)
    } else if (type == 'city') {
      this.getAreaList(code, checkStatus)
    }
  }

  //触发节点点击
  handleSelect = (selectedKeys, e, type) => {
    let stateKey = 'treeSelect_' + type;
    if (selectedKeys.length > 0 && this.state[stateKey] != selectedKeys) {
      this.changeTreeSelect(selectedKeys[0], type)
      let index = this.state.treeChecked.checked.indexOf(selectedKeys[0])
      let checkStatus = index > -1 ? 1 : 0;
      this.asyncLoadData(selectedKeys[0], type, checkStatus)
    }
  }

  //处理节点点击
  changeTreeSelect = (code, type) => {
    let stateKey = 'treeSelect_' + type;
    this.setState({
      [stateKey]: [code]
    })
  }

  //触发节点选中
  handleCheck = (checkedKeys, e, type) => {
    // 控制select选中
    this.changeTreeSelect(e.node.props.eventKey, type)
    if (e.node.props.eventKey != '-1') {
      // 根据子节点选择判断是否执行不限选中
      if(!this.isCheckAll(e.node.props.eventKey, e.checked)){
        return;
      };
      // 加载下一级
      let checkStatus = e.checked ? 1 : 2;
      this.asyncLoadData(e.node.props.eventKey, type, checkStatus)
      //控制checkboox
      this.changeTreeStatus(e.node.props.eventKey, e.checked)
      //处理父节点的checkbox
      this.manageTreeStatus(e.node.props.eventKey, false)
      // //单独处理取消选中的子节点
      if (!e.checked) {
        this.changeTreeIncloudCode(e.node.props.eventKey);
      }
    } else {
      //点击不限触发
      this.checkTreeAll(e.checked);
    }
  }

  //根据区域状态是否选择不限
  isCheckAll = (code, checked) => {
    let treeChecked = this.state.treeChecked;
    let num = checked ? 1 : 0;
    this.state.region.map(item => {
      if (item.code == '-1' || (!checked&&item.code == code.split('_')[0])) { return }
      let index = treeChecked.checked.indexOf(item.code);
      if (index > -1) {
        num++;
      }
    })
    if (num == (this.state.region.length - 1)) {
      let halfIndex = treeChecked.halfChecked.indexOf('-1')
      if (halfIndex > -1) {
        treeChecked.halfChecked.splice(halfIndex, 1);
      }
      treeChecked.checked = Array.from(new Set([...treeChecked.checked, '-1']));
    } else if (num > 0) {
      let fullIndex = treeChecked.checked.indexOf('-1')
      if (fullIndex > -1) {
        treeChecked.checked.splice(fullIndex, 1);
      }
      treeChecked.halfChecked = Array.from(new Set([...treeChecked.halfChecked, '-1']));
    } else {
      treeChecked = { checked: [], halfChecked: [] }
    }
    this.setState({
      treeChecked
    })
    if (num > 0) {
      return true
    } else {
      return false
    }
  }

  //选择树
  checkTreeAll = (checked) => {
    if (checked) {
      let list = [];
      // 将菜单数据扁平化为一级
      function flatList(arr) {
        arr.map((v) => {
          if (v.children && v.children.length) {
            flatList(v.children);
          }
          list.push(v.code);
        });
      }
      flatList(this.areaData)

      this.setState({
        treeChecked: { checked: list, halfChecked: [] },
      })
    } else {
      this.setState({
        treeChecked: { checked: [], halfChecked: [] },
      })
    }
  }

  //处理节点选中
  changeTreeStatus = (code, checked) => {
    let treeCheckedKey = 'treeChecked';
    let treeChecked = this.state[treeCheckedKey]
    // 首先如果半选中有他则删除
    let halfIndex = treeChecked.halfChecked.indexOf(code)
    if (halfIndex > -1) {
      treeChecked.halfChecked.splice(halfIndex, 1);
    }
    if (checked) {
      // 将该元素去重添加到当前选中列表
      treeChecked.checked = Array.from(new Set([...treeChecked.checked, code]));
    } else {
      let checkedIndex = treeChecked.checked.indexOf(code)
      if (checkedIndex > -1) {
        treeChecked.checked.splice(checkedIndex, 1);
      }
    }

    this.setState({
      [treeCheckedKey]: treeChecked
    })
  }

  // 
  changeTreeStatusHalf = (code) => {
    let treeCheckedKey = 'treeChecked';
    let treeChecked = this.state[treeCheckedKey]

    // 首先如果全选中有他则删除
    let fullIndex = treeChecked.checked.indexOf(code)
    if (fullIndex > -1) {
      treeChecked.checked.splice(fullIndex, 1);
    }
    // 将该元素去重添加到当前选中列表
    treeChecked.halfChecked = Array.from(new Set([...treeChecked.halfChecked, code]));

    this.setState({
      [treeCheckedKey]: treeChecked
    })
  }


  //1选中，2取消，0不变
  changeTreeStatusForArr = (arr, checkStatus) => {
    if (!checkStatus) {
      return;
    }
    let treeCheckedKey = 'treeChecked';
    let treeChecked = this.state[treeCheckedKey];
    let codeList = [];
    arr.map(item => {
      codeList.push(item.code)
    })
    if (checkStatus == 1) {
      treeChecked.checked = Array.from(new Set([...treeChecked.checked, ...codeList]));
      treeChecked.halfChecked = this.filterArr(treeChecked.halfChecked, codeList)
    }
    this.setState({
      [treeCheckedKey]: treeChecked
    })
  }

  //取消子节点
  changeTreeIncloudCode = (code) => {
    let treeCheckedKey = 'treeChecked';
    let treeChecked = this.state[treeCheckedKey];

    treeChecked.checked = this.filterArr(treeChecked.checked, code)
    treeChecked.halfChecked = this.filterArr(treeChecked.halfChecked, code)

    this.setState({
      [treeCheckedKey]: treeChecked
    })
  }

  //checkedStatus   0,未选中  1选中，  2，半选
  manageTreeStatus = (code, notInit = true) => {
    let obj = this.getObjFromData(code);
    //如果有子节点就循环--从递归第二次开始
    if (notInit && obj.children) {
      let stateChecked = this.state.treeChecked.checked;
      let stateCheckedHalf = this.state.treeChecked.halfChecked;
      let arr = obj.children;
      let arrItemCheckNum = 0;
      arr.map(item => {
        let i = stateChecked.indexOf(item.code);
        let j = stateCheckedHalf.indexOf(item.code);
        if (i > -1) {
          arrItemCheckNum++;
        }
        if (j > -1) {
          arrItemCheckNum += .5
        }
      })


      if (arrItemCheckNum == arr.length) {
        //当前节点全部选中
        this.changeTreeStatus(obj.code, true);
      } else if (arrItemCheckNum > 0) {
        //半个节点
        this.changeTreeStatusHalf(obj.code);
      } else {
        //子节点没有选中 移除本节点
        this.changeTreeStatus(obj.code, false);
      }
    }
    // 是否继续寻找上级
    if (obj.parentCode) {
      this.manageTreeStatus(obj.parentCode)
    }
  }

  getElemPos = (obj) => {
    var pos = { "top": 0, "left": 0 };
    if (obj.offsetParent) {
      while (obj.offsetParent) {
        pos.top += obj.offsetTop;
        pos.left += obj.offsetLeft;
        obj = obj.offsetParent;
      }
    } else if (obj.x) {
      pos.left += obj.x;
    } else if (obj.y) {
      pos.top += obj.y;
    }
    return { x: pos.left, y: pos.top };
  }


  showSelect = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    let obj = this.getElemPos(this.refs.areabox)
    let style = {
      display: 'block',
      width: this.refs.areabox.offsetWidth,
      top: obj.y + this.refs.areabox.offsetHeight + 1,
      left: obj.x,
    }
    this.setState({
      style
    })
  }

  hideSelect = () => {
    this.setState({
      style: null
    })
    let arrStr = this.state.treeChecked.checked.join(',');
    if (arrStr == this.arrStr) {
      return;
    }
    this.arrStr = arrStr;
    this.props.onOK(arrStr);
  }

  renderText = () => {
    let arr = this.state.treeChecked.checked;
    let allSelectIndex = arr.indexOf('-1');
    if (allSelectIndex > -1) {
      return '不限'
    }
    let filterArr = [];
    arr.map(item => {
      let indexO = item.lastIndexOf("_");
      if (indexO > -1) {
        let str = item.substring(0, indexO);
        let indexJ = arr.indexOf(str);
        if (indexJ == -1) {
          filterArr.push(item)
        }
      } else {
        filterArr.push(item)
      }
    })
    filterArr = Array.from(new Set([...filterArr]));
    let strArr = "";
    filterArr.forEach(item => {
      let obj = this.getObjFromData(item)
      if (obj) {
        // let tip = obj.children ? '(全部)' : '';
        if (strArr.length > 0) {
          strArr += ',' + obj.title
        } else {
          strArr = obj.title
        }
      }
    })
    return strArr
  }

  renderTree = (data) => {
    return data.map((item) => {
      return <TreeNode title={item['title']} key={item['code']} />
    });
  }

  render() {
    return (
        <div className={less.area_box} ref="areabox">
          <div className={less.area_wrapper}>
            <div className={less.area_text}>
              {this.renderText()}
            </div>
            <div className={less.area_wrapper_right}>
              <Button type="primary" onClick={this.showSelect}>选择区域</Button>
            </div>
          </div>
          <div className={less.area_pop} style={this.state.style} onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation() }}>
            <Spin spinning={this.state._loading}>
              <Row className={[less.table_area, 'select_area_tree'].join(' ')}>
                <Col span="6" className={less.table_box}>
                  <div className={less.table_box_list}>
                    <Tree
                        checkable={true}
                        checkStrictly={true}
                        onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 'region') }}
                        checkedKeys={this.state.treeChecked}
                        onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 'region') }}
                        selectedKeys={this.state.treeSelect_region}
                    >
                      {this.renderTree(this.state.region)}
                    </Tree>
                  </div>
                </Col>
                <Col span="6" className={less.table_box}>
                  <div className={less.table_box_list}>
                    <Tree
                        checkable={true}
                        checkStrictly={true}
                        onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 'prov') }}
                        checkedKeys={this.state.treeChecked}
                        onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 'prov') }}
                        selectedKeys={this.state.treeSelect_prov}
                    >
                      {this.renderTree(this.state.prov)}
                    </Tree>
                  </div>
                </Col>
                <Col span="6" className={less.table_box}>
                  <div className={less.table_box_list}>
                    <Tree
                        checkable={true}
                        checkStrictly={true}
                        onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 'city') }}
                        checkedKeys={this.state.treeChecked}
                        onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 'city') }}
                        selectedKeys={this.state.treeSelect_city}
                    >
                      {this.renderTree(this.state.city)}
                    </Tree>
                  </div>
                </Col>
                <Col span="6" className={less.table_box}>
                  <div className={less.table_box_list}>
                    <Tree
                        checkable={true}
                        checkStrictly={true}
                        onCheck={(checkedKeys, e) => { this.handleCheck(checkedKeys, e, 'area') }}
                        checkedKeys={this.state.treeChecked}
                        onSelect={(selectedKeys, e) => { this.handleSelect(selectedKeys, e, 'area') }}
                        selectedKeys={this.state.treeSelect_area}
                    >
                      {this.renderTree(this.state.area)}
                    </Tree>
                  </div>
                </Col>
              </Row>
            </Spin>
            <div className={less.area_btn}>
              <Button type="primary" onClick={this.hideSelect}>确定</Button>
            </div>
          </div>
        </div>
    )
  }
}

export default details