import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import {Link, withRouter,browserHistory} from 'react-router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Switch,
  Menu, InputNumber, DatePicker, Modal, message, Alert, Table, Tooltip, Pagination } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const width = window.innerWidth<1400;
// const a = width?{width:75}:{}

const fieldLabels = {
  status: '订单状态',
  customerName: '姓名',
  travelTime: '出行日期',
  orderCreatedAt: '下单日期',
  wechatName: '微信',
  source: '订单来源',
  customerMobile: '手机',
  operatorName: '售前',
  inputName: '录入',
};



@connect(state => ({
  response: state.order_list,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    tablecolumns: [
      {title: '序号', width: 50, dataIndex: 'id', key: 'id', fixed: 'left'},
      {title: '售前', width: 60, dataIndex: 'operatorName', key: 'operatorName', fixed: 'left'},
      {title: '订单状态', dataIndex: 'status', key: '1', width: 80, fixed: 'left',},
      {title: '出行日期和时间', dataIndex: 'travelTime', key: '2', width: 130},
      {title: '人数', dataIndex: 'travelersAmount', key: '3', width: 50},
      {title: '客户姓名', dataIndex: 'comment', key: '4', width: 80},
      {title: '联系方式', dataIndex: 'customerMobile', key: '5', width: 110},
      {title: '微信号', dataIndex: 'wechatName', key: '6', width: 100},
      {title: '旺旺号', dataIndex: 'aliwangwangName', key: '7', width: 100},
      {title: '目的地', dataIndex: 'destinationCity', key: '8', width: 80},
      {title: '线路名称', dataIndex: 'lineName', key: '9'},
      {title: '下单日期', dataIndex: 'orderCreatedAt', key: '10', width: 100},
      {title: '订单金额', dataIndex: 'payAmount', key: '11', width: 80},
      {title: '成本价', dataIndex: 'payCost', key: '12', width: 70},
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 70,
        render: (text, record, index) => (
          <div>
            <a onClick={()=>{
              //this.editorSupply(index);
            }}><Icon type="edit" style={{fontSize:'20px',marginLeft:'5px'}}/></a>
          </div>
        ),
      },
    ]
  };

  componentDidMount() {
    const {response} = this.props;
    this.fetchAction(response.searchBody);
    // this.props.dispatch({
    //   type: 'line_list/getSelectArray',
    //   payload: 'route_country'
    // });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'order_list/clear',
    });
  }

  searchText = (str) => {
    //获取要查找的字符串
    const {response} = this.props;
    const {data,loading,searchBody} = response;
    var searchVal = searchBody.oxName;
    var text = str;
    if(searchVal){
      searchVal.split(' ').map((item,index)=>{
        if(item){
          text.replace(/<b[^>]*>([^>]*)<\/b[^>]*>/ig,"$1");
          const reg = new RegExp("("+item +")","ig");
          text = text.replace(reg,"<b >$1</b>");
        }
      });
    }
    const custComment = <div dangerouslySetInnerHTML={{__html: text}}/>;
    return custComment
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form ,response} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        startDay: fieldsValue.startDay && fieldsValue.startDay.valueOf(),
      };
      this.setState({formValues: values});
      this.fetchAction(values);
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

  handleAdd = () => {
    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { select } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 12},
      },
    };
    const colLayout = {
      sm: {span: 12},
      md: {span: 8},
      lg: {span: 6},
    };
    const colLastLayout = {
      sm: {span: 24},
      md: {span: 8},
      lg: {span: 6},
      xl: {span: 6},
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={20} style={{ marginBottom: 5 }}>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label={fieldLabels.status}>
              {getFieldDecorator('status')(
                <Select placeholder={`请选择${fieldLabels.status}`} style={{ width: '100%' }}>
                  {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label={fieldLabels.customerName}>
              {getFieldDecorator('customerName')(
                <Input placeholder={`请输入${fieldLabels.customerName}`} />
              )}
            </FormItem>
          </Col>
          <Col {...colLastLayout}>
            <FormItem {...formItemLayout} label="出行日期">
              {getFieldDecorator('travelTime')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择出行日期" />
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const { select } = this.state;

    const formItemLayout = {
    };
    const colLayout = {
      sm: {span: 12},
      md: {span: 12},
      lg: {span: 6},
      xl: {span: 6},
    };
    const gutter = 20;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={gutter}>
          <Col {...colLayout}>
            <FormItem label="氧气标题">
              {getFieldDecorator('oxName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="国家">
              {getFieldDecorator('countryId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="标签">
              {getFieldDecorator('keyword')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="开团日期">
              {getFieldDecorator('startDay')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="氧气编号">
              {getFieldDecorator('oxCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="城市">
              {getFieldDecorator('city')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  // size={size}
                  allowClear={true}
                  placeholder="选择状态"
                  style={{ width: '100%' }}
                >
                  <Option key={1}>已经发布</Option>
                  <Option key={0}>未发布</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="产品名称">
              {getFieldDecorator('productName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" icon="search" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { response } = this.props;
    const {select} = response;
    return this.state.expandForm ? this.renderAdvancedForm(select) : this.renderSimpleForm(select);
  }

  render() {
    const {response} = this.props;
    const { modalVisible, addInputValue ,tablecolumns} = this.state;
    const {data,loading} = response;

    const message = (
      <Pagination
        showQuickJumper
        size="small"
        showTotal={total =>(
          <p>
            统计共 <a style={{ fontWeight: 600 }}>{total}</a> 项&nbsp;&nbsp;
            每页 <span style={{ fontWeight: 600 }}>{data.pageSize||0}</span> 项
            <Button icon="plus" size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => this.handleAdd()}>新建</Button>
            <a onClick={()=>{this.onPageChange(1)}} style={{ marginLeft: 24 }}>首页</a>
          </p>
        )}
        onChange={this.onPageChange}
        pageSize={data.pageSize || 0}
        current={data.pageIndex || 1}
        total={data.totalCount || 0}
      />
    );
    return (
      <PageHeaderLayout title="线路查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={message}
                type="info"
                showIcon
              />
            </div>
            <Table
              bordered
              loading={loading}
              columns={tablecolumns}
              dataSource={data.list}
              size="small"
              pagination={false}
              scroll={{x: width?'150%':'100%'}}
            />
            <div className={styles.pagination}>
              <Pagination
                showQuickJumper
                showSizeChanger
                pageSizeOptions={['15','30','50','100','200']}
                onShowSizeChange={this.onShowSizeChange}
                //size="large"
                showTotal={total => "共"+total+"条/"+"每页"+(data.pageSize||0)+"条"}
                onChange={this.onPageChange}
                pageSize={data.pageSize || 0}
                current={data.pageIndex || 1}
                total={data.totalCount || 0}
              />
            </div>
          </div>
        </Card>
        <Modal
          title="新建弹窗"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            <Input placeholder="请输入" onChange={this.handleAddInput} value={addInputValue} />
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }

  onPageChange = (page) => {
    const {response} = this.props;
    const { searchBody ,data} = response;
    const pageSize = data.pageSize,rowStart = (page - 1) * pageSize;
    searchBody.pageSize = pageSize;
    searchBody.rowStart = rowStart;
    searchBody.pageIndex = page;
    this.fetchAction(searchBody);
  }

  onShowSizeChange = (current, size) => {
    const {response} = this.props;
    const { searchBody } = response;
    searchBody.pageSize = size;
    searchBody.rowStart = 0;
    searchBody.pageIndex = 1;
    this.fetchAction(searchBody);
  }

  fetchAction = (body) => {
    this.props.dispatch({
      type: 'order_list/fetch',
      payload: body
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    this.fetchAction({});
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
}
