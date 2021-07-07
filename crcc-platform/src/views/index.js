import React from "react";
import ReactDOM from 'react-dom';
import App from "./app";
import { Provider } from 'react-redux';
import configureStore from '@/redux/store/configureStore';
import "antd/dist/antd.less"
import '@/style/reset_antd.css';
import '@/style/index.css';
import '../../node_modules/wangeditor/release/wangEditor.css'

const store = configureStore();

window.reduxState = store.getState();

store.subscribe(() => {
  window.reduxState = store.getState();   //这就是你获取到的数据state tree，由于使用了subscribe，当数据更改时会重新获取
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
if (!(process.env.NODE_ENV === 'development')) {
  // console.log=function () {

  // }
}
