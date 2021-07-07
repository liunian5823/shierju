import React from 'react';

import less from "./index.less";
import dd1 from "./img/icons/1.png";
import dd2 from "./img/icons/2.png";
import dd3 from "./img/icons/3.png";

export default class StatisticsStore extends React.Component{
    state = {}
    render() {
        const {evaluateObj} = this.props;
        return(
            <ul className={less.tongji}>
                <li>
                    <img src={dd1} />
                    <div className={less.statis_title}>
                        <h2>服务</h2>
                        <p>
                            <span>{
                                evaluateObj.serverScore>0?"高于均值":
                                evaluateObj.serverScore<0?"低于均值":
                                "行业平均水平"
                            }</span>
                            <strong style={{fontSize: '22px', marginLeft: 10 ,color: evaluateObj.serverScore>0?"#fe4d4d":
                                evaluateObj.serverScore<0?"#5cc060":
                                "#999"}}>
                                {
                                   evaluateObj.serverScore>0?evaluateObj.serverScore*100+'%'+"↑":
                                   evaluateObj.serverScore<0?evaluateObj.serverScore*100+'%'+"↓":
                                   "-"
                                }
                            </strong>
                        </p>
                    </div>
                </li>
                <li>
                    <img src={dd2} />
                    <div className={less.statis_title}>
                        <h2>质量</h2>
                        <p>
                            <span>{
                                evaluateObj.qualityScore>0?"高于均值":
                                evaluateObj.qualityScore<0?"低于均值":
                                "行业平均水平"
                            }</span>
                            <strong style={{fontSize: '22px', marginLeft: 10 ,color: evaluateObj.qualityScore>0?"#fe4d4d":
                                evaluateObj.qualityScore<0?"#5cc060":
                                "#999"}}>
                                {
                                   evaluateObj.qualityScore>0?evaluateObj.qualityScore*100+'%'+"↑":
                                   evaluateObj.qualityScore<0?evaluateObj.qualityScore*100+'%'+"↓":
                                   "-"
                                }
                            </strong>
                        </p>
                    </div>
                </li>
                <li>
                    <img src={dd3} />
                    <div className={less.statis_title}>
                        <h2>价格</h2>
                        <p>
                            <span>{
                                evaluateObj.pirceScore>0?"高于均值":
                                evaluateObj.pirceScore<0?"低于均值":
                                "行业平均水平"
                            }</span>
                            <strong style={{fontSize: '22px', marginLeft: 10 ,color: evaluateObj.pirceScore>0?"#fe4d4d":
                                evaluateObj.pirceScore<0?"#5cc060":
                                "#999"}}>
                                {
                                   evaluateObj.pirceScore>0?evaluateObj.pirceScore*100+'%'+"↑":
                                   evaluateObj.pirceScore<0?evaluateObj.pirceScore*100+'%'+"↓":
                                   "-"
                                }
                            </strong>
                        </p>
                    </div>
                </li>
                <li>
                    <b className={less.statis_level} >{
                        evaluateObj.supplierLevel==1?'S':
                        evaluateObj.supplierLevel==2?'A+':
                        evaluateObj.supplierLevel==3?'A':
                        evaluateObj.supplierLevel==4?'B+': 'B'
                    }级</b>
                    <div className={less.statis_title}>
                        <h2>综合评价</h2>
                        <p>
                            <b style={{fontSize: '22px',fontWeight: 800}}>{evaluateObj.supplierTotalScore?evaluateObj.supplierTotalScore:0}</b>
                            <span style={{marginLeft: 10}}>分</span>
                        </p>
                    </div>
                </li>
            </ul>
        )
    }
}


