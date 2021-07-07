import { Spin } from "antd";
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

export default class EchartsRadar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      goodsCountFrist: [],
      refs: {},
      _option: {
        title: {
          text: "二级类目",
          left: "center",
          top: 2,
          textStyle: {
            color: "#fff"
          }
        }
      },
      goodsCountParam: []
    };
  }
  componentDidMount() {
    this.handleOneSpread();
  }
  //一级
  getOption = () => {
    let arr = this.state.goodsCountFrist;
    let countsArr = JSON.parse(
      JSON.stringify(arr).replace(/goodsCount/g, "value")
    );
    return {
      title: {
        text: "商城一级类目分布",
        left: "center",
        top: 2,
        textStyle: {
          color: "#fff"
        }
      },
      series: {
        type: "pie",
        radius: "70%",
        itemStyle: {
          normal: {
            label: {
              formatter: '{b}({d}%)',
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
    };
  };
  //一级类目分布数据
  handleOneSpread = () => {
    let _this = this;
    api
      .ajax("GET", "@/statistics/goodsStatistic/goodsStatisticsCount", {})
      .then(r => {
        this.setState({
          goodsCountFrist: r.data.goodsCountFrist
        });
      })
      .catch(r => {
        Util.alert("请求失败", { type: "error" });
      });
  };
  onChartClick = (param, echarts) => {
    this.setState({
      loading: true
    });
    api
      .ajax("GET", "@/statistics/goodsStatistic/goodsStatisticsCount", {
        classId: param.data.id
      })
      .then(r => {
        // let arr = goodsCountParam == undefined ? [] : goodsCountParam;
        let countsArr = JSON.parse(
          JSON.stringify(r.data.goodsCountParam).replace(/goodsCount/g, "value")
        );
        this.setState({
          _option: {
            title: {
              text: "二级类目",
              left: "center",
              top: 2,
              textStyle: {
                color: "#fff"
              }
            },
            series: {
              type: "pie",
              radius: "70%",
              itemStyle: {
                normal: {
                  label: {
                    formatter: '{b}({d}%)',
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
        this.state.refs.echartsReact
          .getEchartsInstance()
          .setOption(this.state._option);
        //this._getOption(r.data.goodsCountParam);
      })
      .catch(r => {
        this.setState({ loading: false });
      });
  };
  //
  onChartClicks = (param, echarts) => {};
  onChartLegendselectchanged(param, echarts) {
    console.log(param, 11);
  }
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
            width: "98%",
            height: "666px",
            background: "rgba(0,0,0,0.4)",
            position: "absolute",
            left: "1%",
            top: "5%",
            zIndex: "99",
            display: "flex"
          }}
        >
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
              option={this.getOption()}
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
                this.state.refs.echartsReact = e;
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
    );
  }
}
