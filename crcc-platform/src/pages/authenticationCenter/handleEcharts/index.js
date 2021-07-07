import { Select, Radio, Spin } from "antd";
import React, { Component } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import imgUrl from "../img/bgImg.jpg";
import ReactEcharts from "echarts-for-react";
import api from "@/framework/axios";
import Util from "@/utils/util";
import less from "./index.less"
const mytextStyle = {
  color: "#333",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: 12
};
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export default class EchartsRadar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refs: {},
      addCounts: [],
      values: 2020,
      option: {},
      allCounts: []
    };
  }
  componentDidMount() {
    this.getCounts(2020);
    this._getCounts(2020);
  }
  //总量拿到数据
  getCounts = yearValue => {
    api
      .ajax("GET", "@/statistics/supplerStatistic/userStatisticsCount", {
        year: yearValue
      })
      .then(r => {
        this.setState({
          allCounts: r.data.countMap,
          option: {
            title: {
              text: "总量及增长量",
              textStyle: {
                color: "#fff"
              }
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "cross",
                label: {
                  backgroundColor: "#6a7985"
                }
              }
            },
            legend: {
              data: ["总量", "增长量"],
              selected: {
                总量: true,
                增长量: true
              },
              textStyle: {
                color: "#fff"
              }
            },
            grid: {
              containLabel: true
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              show: true,
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
              ],
              axisLabel: {
                color: "#fff" //刻度线标签颜色
              }
            },
            yAxis: {
              type: "value",
              splitLine: { show: false },
              show: true,
              axisLabel: {
                color: "#fff" //刻度线标签颜色
              }
            },
            color: ["#1DB0B8", "#37C6C0", "#D0E9FF", "#c7353a", "#f5b91e"],
            series: [
              {
                name: "总量",
                type: "line",
                stack: "总量",
                data: r.data.countMap,
                itemStyle: {
                  normal: {
                    color: "red",
                    lineStyle: {
                      // 系列级个性化折线样式
                      width: 2,
                      type: "solid",
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "green"
                        },
                        {
                          offset: 1,
                          color: "red"
                        }
                      ]) //线条渐变色
                    }
                  },
                  emphasis: {
                    color: "red",
                    lineStyle: {
                      // 系列级个性化折线样式
                      width: 2,
                      type: "dotted",
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "green"
                        },
                        {
                          offset: 1,
                          color: "red"
                        }
                      ])
                    }
                  }
                }, //线条样式
                areaStyle: {
                  normal: {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(80,141,255,0.39)"
                      },
                      {
                        offset: 0.34,
                        color: "rgba(56,155,255,0.25)"
                      },
                      {
                        offset: 1,
                        color: "rgba(38,197,254,0.00)"
                      }
                    ])
                  }
                }
              },
              {
                name: "增长量",
                type: "line",
                stack: "增长量",
                data: this.state.addCounts,
                itemStyle: {
                  color: "#6A5ACD",
                  normal: {
                    lineStyle: {
                      // 系列级个性化折线样式
                      width: 2,
                      type: "solid",
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#0000FF"
                        },
                        {
                          offset: 1,
                          color: "#CD5C5C"
                        }
                      ]) //线条渐变色
                    }
                  },
                  emphasis: {
                    color: "#6A5ACD",
                    lineStyle: {
                      // 系列级个性化折线样式
                      width: 2,
                      type: "dotted",
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#1E90FF"
                        },
                        {
                          offset: 1,
                          color: "#0000FF"
                        }
                      ])
                    }
                  }
                }, //线条样式
                areaStyle: {
                  normal: {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(80,141,255,0.39)"
                      },
                      {
                        offset: 0.34,
                        color: "rgba(56,155,255,0.25)"
                      },
                      {
                        offset: 1,
                        color: "rgba(38,197,254,0.00)"
                      }
                    ])
                  }
                }
              }
            ]
          },
          loading: false
        });
      })
      .catch(r => {
        Util.alert("请求失败", { type: "error" });
      });
  };
  _getCounts = yearValue => {
    api
      .ajax("GET", "@/statistics/supplerStatistic/userStatisticsAdd", {
        year: yearValue
      })
      .then(r => {
        this.setState({
          addCounts: r.data.addMap,
          loading: false
        });
      })
      .catch(r => {
        Util.alert("请求失败", { type: "error" });
      });
  };
  //切换年份
  onChange = e => {
    this.setState({
      values: e.target.value,
      loading: true
    });
    this.getCounts(e.target.value);
    this._getCounts(e.target.value);
  };
  onChartClick = (param, echarts) => {};
  onChartLegendselectchanged(param, echarts) {}
  render() {
    let onEvents = {
      click: this.onChartClick.bind(this),
      legendselectchanged: this.onChartLegendselectchanged.bind(this)
    };
    let _allCounts = this.state.allCounts;
    let newArr = [];
    _allCounts.map(item => {
      if(item) {
        newArr.push(item)
      }
      return newArr;
    })
    let allCounts = newArr[newArr.length-1];
    let zAllCounts = newArr[newArr.length-1] - newArr[0];
    let bAllCounts = (zAllCounts / allCounts * 100).toFixed(2) + '%';
    let lAllCounts = (zAllCounts / 12).toFixed(0);
    let yAllCounts = ((zAllCounts / allCounts * 100) / 12).toFixed(2) + '%';
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img
          src={imgUrl}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <div
          style={{
            width: "90%",
            height: "643px",
            background: "rgba(0,0,0,0.4)",
            position: "absolute",
            left: "5%",
            top: "5%",
            zIndex: "99"
          }}
        >
          {/*年份选择*/}
          <div style={{display: "flex"}}>
            <RadioGroup
              buttonStyle="solid"
              onChange={this.onChange}
              defaultValue="2020"
              style={{paddingTop: "0.8%"}}
            >
              <RadioButton value="2020">2020</RadioButton>
              <RadioButton value="2019">2019</RadioButton>
              <RadioButton value="2018">2018</RadioButton>
              <RadioButton value="2017">2017</RadioButton>
            </RadioGroup>
            {/*<h3 className={less.title}>年度供应商总量:{allCounts}</h3>
            <h3 className={less.title}>年度供应商增长量:{zAllCounts}</h3>
            <h3 className={less.title}>年度供应商增长比例:{bAllCounts}</h3>
            <h3 className={less.title}>月均增长量:{lAllCounts}</h3>
            <h3 className={less.title}>月均增长比例:{yAllCounts}</h3>*/}
          </div>
          {/*图表*/}
          <div
            style={{
              marginTop: "10px",
              background: "rgba(128, 128, 128, 0.1)",
              position: "relative"
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
                width: "1600px",
                height: "600px",
                marginLeft: "1%",
                marginTop: "1%"
              }}
            >
              <ReactEcharts
                ref={e => {
                  this.state.refs.echartsReact = e;
                }}
                option={this.state.option}
                notMerge={true}
                lazyUpdate={true}
                onEvents={onEvents}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
