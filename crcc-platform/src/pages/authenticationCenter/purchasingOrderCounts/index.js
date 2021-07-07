import { Select, Radio, Spin } from "antd";
import React, { Component } from "react";
import echarts from "echarts/lib/echarts";
import ReactEcharts from "echarts-for-react";
import api from "@/framework/axios";
import Util from "@/utils/util";
import imgUrl from "../img/bgImg.jpg";
const mytextStyle = {
  color: "#333",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: 12
};
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export default class EchartsRadar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      conpanyCountsArr: [],
      refs: {},
      sass: {},
      values: "2018",
      _option: {
        title: {
          text: "采购单位处级订单统计",
          left: "left",
          textStyle: {
            color: "#fff"
          }
        }
      },
      option: {
        title: {
          text: "采购单位局级订单统计",
          left: "center",
          top: 20,
          textStyle: {
            color: "#fff"
          }
        }
      }
    };
  }
  componentDidMount() {
    this.handleOneSpread(2018);
  }
  //切换年份
  onChange = e => {
    this.setState({
      values: e.target.value,
      loading: true
    });
    this.handleOneSpread(e.target.value);
  };
  handleChange = value => {};
  handleBlur = () => {};
  handleFocus = () => {};
  //一级请求
  handleOneSpread = values => {
    api
      .ajax("GET", "@/statistics/transactionStatistic/selectBureauOrder", {
        year: values
      })
      .then(r => {
        let newArrName = [];
        let newArrPrice = [];
        r.data.map((item, index) => {
          newArrName.push(item.companyName);
          newArrPrice.push(item.coun);
          return newArrName;
          return newArrPrice;
        });
        this.setState({
          conpanyCountsArr: r.data,
          loading: false,
          option: {
            title: {
              text: "采购单位局级订单统计",
              textStyle: {
                color: "#fff"
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            legend: {
              data: [],
              selected: {
                "2018年": true,
                "2019年": false,
                "2017年": false
              },
              textStyle: {
                color: "#fff"
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            xAxis: {
              type: "value",
              boundaryGap: [0, 0.01],
              axisLabel: {
                color: "#fff" //刻度线标签颜色
              }
            },
            yAxis: {
              type: "category",
              //triggerEvent:true,
              data: newArrName,
              axisLabel: {
                color: "#fff" //刻度线标签颜色
              }
            },
            series: [
              {
                name: "2018年",
                type: "bar",
                itemStyle: {
                  emphasis: {
                    barBorderRadius: 7
                  },
                  normal: {
                    barBorderRadius: 7,
                    label: {
                      show: true,
                      position: 'right',
                      textStyle: {
                        color: '#fff',
                        fontSize: 12
                      }
                    },
                    color: function(params) {
                      var colorList = [
                        "#9900FF",
                        "#B5C334",
                        "#FCCE10",
                        "#E87C25",
                        "#27727B",
                        "#FE8463",
                        "#9BCA63",
                        "#FAD860",
                        "#F3A43B",
                        "#60C0DD",
                        "#D7504B",
                        "#C6E579",
                        "#F4E001",
                        "#F0805A",
                        "#26C0C0"
                      ];
                      return colorList[params.dataIndex];
                    }
                  }
                },
                barMaxWidth: 50,
                barMinHeight: 20,
                data: newArrPrice
              },
              {
                name: "2019年",
                type: "bar",
                data: newArrPrice
              },
              {
                name: "2017年",
                type: "bar",
                data: newArrPrice
              }
            ],
            tooltip: {
              position: "bottom",
              formatter: function(params) {
                var toolTiphtml = "";
                toolTiphtml += params.name + ": <br>";
                toolTiphtml += values + "年:" + params.value;
                return toolTiphtml;
              },
              backgroundColor: "rgba(0,0,0,0.6)",
              textStyle: {
                color: "#fff",
                fontSize: 16
              }
            }
          }
        });
        this.state.refs.echartsReact
          .getEchartsInstance()
          .setOption(this.state.option);
      })
      .catch(r => {
        Util.alert("请求失败", { type: "error" });
      });
  };
  //二级点击事件
  onChartClick = (param, echarts) => {
    this.setState({
      loading: true
    });
    let comName = param.name;
    let newList = this.state.conpanyCountsArr;
    let _newList = [];
    newList.map(item => {
      _newList.push(item.id);
      return _newList;
    });
    let index = param.dataIndex;
    api
      .ajax("GET", "@/statistics/transactionStatistic/selectOrder", {
        companyId: _newList[index],
        year: this.state.values
      })
      .then(r => {
        let newsArr = r.data;
        let countsArr = JSON.parse(
          JSON.stringify(newsArr)
            .replace(/coun/g, "value")
            .replace(/companyName/g, "name")
        );
        this.setState({
          _option: {
            title: {
              text: comName,
              left: "left",
              textStyle: {
                color: "#fff"
              }
            },
            series: {
              type: "pie",
              radius: "65%",
              label: {
                align: "left",
                normal: {
                  formatter(v) {
                    let text = '(' + Math.round(v.percent)+'%' + ')' + v.name;
                    if (text.length <= 8) {
                      return text;
                    } else if (text.length > 8 && text.length <= 16) {
                      return (text = `${text.slice(0, 8)}\n${text.slice(8)}`);
                    } else if (text.length > 16 && text.length <= 24) {
                      return (text = `${text.slice(0, 8)}\n${text.slice(
                        8,
                        16
                      )}\n${text.slice(16)}`);
                    } else if (text.length > 24 && text.length <= 30) {
                      return (text = `${text.slice(0, 8)}\n${text.slice(
                        8,
                        16
                      )}\n${text.slice(16, 24)}\n${text.slice(24)}`);
                    } else if (text.length > 30) {
                      return (text = `${text.slice(0, 8)}\n${text.slice(
                        8,
                        16
                      )}\n${text.slice(16, 24)}\n${text.slice(
                        24,
                        30
                      )}\n${text.slice(30)}`);
                    }
                  },
                  textStyle: {
                    fontSize: 12
                  }
                }
              },
              itemStyle: {
                normal: {
                  label: {
                    textStyle: {
                      color: "#fff"
                    }
                  }
                }
              },
              data: countsArr
            },
            tooltip: {
              position: "bottom",
              formatter: function(params) {
                var toolTiphtml = "";
                toolTiphtml += params.name + ": <br>";
                toolTiphtml += params.value;
                return toolTiphtml;
              },
              backgroundColor: "rgba(0,0,0,0.6)",
              textStyle: {
                color: "#fff",
                fontSize: 16
              }
            }
          },
          loading: false
        });
        this.state.sass.echartsReact
          .getEchartsInstance()
          .setOption(this.state._option);
      })
      .catch(r => {
        this.setState({ loading: false });
      });
  };
  //清除饼图点击事件
  onChartClicks = (param, echarts) => {};
  onChartLegendselectchanged(param, echarts) {}
  //渲染
  render() {
    let onEvents1 = {
      click: this.onChartClick.bind(this),
      legendselectchanged: this.onChartLegendselectchanged.bind(this)
    };
    let onEvents2 = {
      click: this.onChartClicks.bind(this),
      legendselectchanged: this.onChartLegendselectchanged.bind(this)
    };
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img
          src={imgUrl}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <div
          style={{
            width: "90%",
            height: "666px",
            background: "rgba(0,0,0,0.4)",
            position: "absolute",
            left: "5%",
            top: "5%",
            zIndex: "99"
          }}
        >
          {/*年份选择框*/}
          <div>
            <RadioGroup
              buttonStyle="solid"
              onChange={this.onChange}
              defaultValue="2018"
            >
              <RadioButton value="2017">2017</RadioButton>
              <RadioButton value="2018">2018</RadioButton>
              <RadioButton value="2019">2019</RadioButton>
            </RadioGroup>
          </div>
          {/*表格*/}
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              background: "rgba(128, 128, 128, 0.1)",
              position: "relative"
            }}
          >
            {/*表格1*/}
            <Spin
              spinning={this.state.loading}
              size="large"
              style={{
                textAlign: "center",
                background: "rgba(0,0,0,0.9)",
                borderRadius: "4px",
                position: "absolute",
                zIndex: "999",
                width: "100%",
                height: "100%",
                padding: "300px 50%"
              }}
            />
            <div
              className="echartsRadar"
              style={{
                width: "50%",
                height: "600px",
                marginLeft: "1%",
                marginTop: "2%"
              }}
            >
              <ReactEcharts
                ref={e => {
                  this.state.refs.echartsReact = e;
                }}
                option={this.state.option}
                notMerge={true}
                lazyUpdate={true}
                onEvents={onEvents1}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div
              style={{
                width: "50%",
                height: "600px",
                marginLeft: "1%",
                marginTop: "2%"
              }}
            >
              <ReactEcharts
                ref={e => {
                  this.state.sass.echartsReact = e;
                }}
                option={this.state._option}
                notMerge={true}
                lazyUpdate={true}
                onEvents={onEvents2}
                style={{ width: "100%", height: "100%", marginLeft: "-5%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
