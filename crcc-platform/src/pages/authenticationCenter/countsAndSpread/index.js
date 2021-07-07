import React from "react";
import ReactDOM from "react-dom";

export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      iFrameHeight: "0px"
    };
  }

  render() {
    return (
      <iframe src="https://elk.crccmall.com/app/kibana#/dashboard/53e6c8f0-7fa0-11ea-8a0f-a96315047d61?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fd%2Cto%3Anow%2Fd))" height="100%" width="100%">

      </iframe>
      );
  }
}
