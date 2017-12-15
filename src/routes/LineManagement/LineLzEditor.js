import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Tooltip,
  Menu, Dropdown, Switch, Pagination, Alert, message
} from 'antd';
import LzEditor from 'react-lz-editor';
import styles from './LineList.less';
import findIndex from "lodash/findIndex";
import uniqBy from "lodash/uniqBy";
import {BaseImageUrl} from "../../services/BaseUrl";

@connect(state => ({
  response: state.line_list,
}))
export default class Analysis extends Component {

  constructor(props) {
    super(props);
    this.receiveHtml=this.receiveHtml.bind(this);
    this.state = {
      htmlContent: props.value,
      responseList: [],
    };
  }

  // state = {
  //   htmlContent: `<h1>Yankees, Peeking at the Red Sox, Will Soon Get an Eyeful</h1>
  //               <p>Whenever Girardi stole a glance, there was rarely any good news for the Yankees. While Girardi’s charges were clawing their way to a split of their four-game series against the formidable Indians, the Boston Red Sox were plowing past the rebuilding Chicago White Sox, sweeping four games at Fenway Park.</p>`,
  //   responseList: [],
  // }

  receiveHtml(content) {
    // console.log("recieved HTML content", content);
    this.setState({responseList:[]});
  }

  componentDidMount() {
    const {response} = this.props;
    //this.fetchAction(response.searchBody);
    // console.log(response.searchBody);
  }

  componentWillUnmount() {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'line_list/clear',
    // });
  }

  onChange = (info)=> {
    let currFileList = info.fileList;
    currFileList = currFileList.filter((f) => (!f.length));
    //Read remote address and display.
    //读取远程路径并显示链接
    currFileList = currFileList.map((file) => {
      if (file.response) {
        // concat url
        // 组件会将 file.url 作为链接进行展示
        var res = file.response.files[0];
        var name = decodeURIComponent(res.name);//name是编码状态 避免中文字符
        var url = res.relativeUrl;
        var lastUrl= url.slice(0,url.lastIndexOf('/')+1)+name;
        // console.log('test1',BaseImageUrl+lastUrl);
        message.success(`${name} 上传成功`);
        file.url = BaseImageUrl + lastUrl;
      }

      if (!file.length) {
        return file;
      }
    });
    let _this = this;

    // filtering successed files
    //按照服务器返回信息筛选成功上传的文件
    currFileList = currFileList.filter((file,index) => {
      //multiple uploading?
      //根据多选选项更新添加内容
      let hasNoExistCurrFileInUploadedList = !~findIndex(_this.state.responseList, item => item.name === file.name)
      if (hasNoExistCurrFileInUploadedList) {
        if (true) {
          _this.state.responseList.push(file);
        } else {
          _this.state.responseList = [file];
        }
      }
      return !!file.response || (!!file.url && file.status == "done") || file.status == "uploading";
    });
    currFileList = uniqBy(currFileList, "name");
    if (!!currFileList && currFileList.length != 0) {
      this.setState({responseList: currFileList});
    }
    _this.forceUpdate();
  }

  render() {
    let policy = "";

    const uploadProps = {
      action: "https://back.o2lx.com/o2travel/image/upload",
      onChange: this.onChange,
      listType: 'picture',
      fileList: this.state.responseList,
      data: {type: 7,routeId:6},
      multiple: true,
      //beforeUpload: this.beforeUpload,
      showUploadList: true
    }

    return (
      <Card bordered={false}>
        <LzEditor
          active={true}
          importContent={this.state.htmlContent}
          cbReceiver={this.receiveHtml}
          uploadProps={uploadProps}
          video={false}
          audio={false}
        />
      </Card>
    );
  }
}
