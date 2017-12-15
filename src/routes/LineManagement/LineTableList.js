import React, {PureComponent} from 'react';
import {connect} from 'dva';
// import {Link, withRouter,browserHistory} from 'react-router';
import {
  Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Switch,
  Menu, InputNumber, DatePicker, Modal, message, Alert, Table, Tooltip, Pagination
} from 'antd';
import { routerRedux, Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';
import moment from 'moment';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const width = window.innerWidth < 1100;
// const a = width?{width:75}:{}

@connect(state => ({
  response: state.line_list,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
    tablecolumns: [
      {title: '序号', dataIndex: 'id', key: 'id', width: 50, fixed: 'left'},
      {title: '编号', dataIndex: 'oxCode', key: 'oxCode', width: 80, fixed: 'left'},
      {
        title: '氧气标题', dataIndex: 'oxName', key: 'oxName', width: width ? 200 : 200, fixed: 'left',
        render: (text, record, index) => (
          <a onClick={()=>{this.titleClick()}}>{this.searchText(text)}</a>
        ),
      },
      {title: '城市', dataIndex: 'cityName', key: 'cityName', width: width ? 60 : 80},
      {title: '供应商', dataIndex: 'supplyName', key: 'supplyName', width: width ? 100 : 120},
      {
        title: '产品名', dataIndex: 'productName', key: 'productName',
        render: (text, record, index) => (
          <Tooltip placement="topLeft" title={text}>
            {text ?
              width ? <span>{text.length > 30 ? text.substring(0, 30) + '...' : text}</span> : text
              : null
            }
          </Tooltip>
        ),
      },
      // { title: '产品编号', dataIndex: 'productCode', key: 'productCode',width:55, },
      {
        title: '供应商网址', dataIndex: 'productUrl', key: 'productUrl', width: width ? 120 : 150,
        render: (text, record, index) => (
          <Tooltip placement="bottomLeft" title={text}>
            {text ?
              width ? <a href={text.indexOf('http') ? 'http://' + text : text}
                         target="_blank">{text.length > 30 ? text.substring(0, 25) + '...' : text}</a>
                : <a href={text.indexOf('http') ? 'http://' + text : text}
                     target="_blank">{text.length > 45 ? text.substring(0, 45) + '...' : text}</a>
              : null
            }
          </Tooltip>
        ),
      },
      {
        title: '开放时间', dataIndex: 'openTime', key: 'openTime',
        render: (text, record, index) => (
          <Tooltip placement="bottomLeft" title={text}>
            {text ?
              <span>{text.length > 22 ? text.substring(0, 22) + '...' : text}</span>
              : null
            }
          </Tooltip>
        ),
      },
      {
        title: '活动时间', dataIndex: 'ativityTime', key: 'ativityTime',
        render: (text, record, index) => (
          <Tooltip placement="bottomLeft" title={text}>
            {text ?
              <span>{text.length > 22 ? text.substring(0, 22) + '...' : text}</span>
              : null
            }
          </Tooltip>
        ),
      },
      // { title: '接送方式', dataIndex: 'shuttleType', key: 'shuttleType',
      //     render: (text, record, index) => (
      //         <a >{changeShuttleType(record.shuttleType)}</a>
      //     ),
      // },
      // { title: '供应商货币', dataIndex: 'productCurrency', key: 'productCurrency',
      //     render: (text, record, index) => (
      //         <a >{changeProductCurrency(record.productCurrency)}</a>
      //     ),
      // },
      {title: '标签', dataIndex: 'keyword', key: '9',},
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        width: 65,//100,
        fixed: 'right',
        render: (text, record, index) => (
          <div>
            <p>
              {/*<span className={styles.splitLine} />*/}
              <Dropdown overlay={
                <Menu>
                  <Menu.Item>
                    <Tooltip placement="top" title={'发布'}>
                      <Switch
                        size="small" checkedChildren="是" unCheckedChildren="否"
                        checked={record.status ? true : false}
                        onChange={(checked) => this.switchChange(record.id, checked)}
                      />
                    </Tooltip>
                  </Menu.Item>
                  <Menu.Item>
                    编辑
                  </Menu.Item>
                  <Menu.Item>
                    下单
                  </Menu.Item>
                </Menu>
              }>
                <a>选项 <Icon type="down"/></a>
              </Dropdown>
            </p>
            {/*<Tooltip placement="top" title={'发布'}>
              <Switch size="small" checkedChildren="是" unCheckedChildren="否" onChange={(checked)=>this.switchChange(record.id,checked)} checked={record.status?true:false}/>
            </Tooltip>
            <Tooltip placement="top" title={'编辑'}>
              <a ><Icon type="edit" style={{fontSize:'16px',marginLeft:'5px'}}/></a>
            </Tooltip>
            <Tooltip placement="top" title={'下单,还在开发当中...'}>
              <a  >
                <Icon type="file-text" style={{fontSize:'16px',marginLeft:'10px'}}/>
              </a>
            </Tooltip>*/}
          </div>
        ),
      },
    ]
  };

  componentDidMount() {
    const {response, form} = this.props;
    // form.setFieldsValue(response.searchBody);
    // console.log('searchBody',response.searchBody);
    this.fetchAction(response.searchBody);
    this.props.dispatch({
      type: 'line_list/getSelectArray',
      payload: 'route_country'
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'line_list/clear',
    });
  }

  titleClick = (index) =>{
    this.props.dispatch(routerRedux.push('/line_management/lineAdvancedProfile'));
  }

  searchText = (str) => {
    //获取要查找的字符串
    const {response} = this.props;
    const {data, loading, searchBody} = response;
    var searchVal = searchBody.oxName;
    var text = str;
    if (searchVal) {
      searchVal.split(' ').map((item, index) => {
        if (item) {
          text.replace(/<b[^>]*>([^>]*)<\/b[^>]*>/ig, "$1");
          const reg = new RegExp("(" + item + ")", "ig");
          text = text.replace(reg, "<b >$1</b>");
        }
      });
    }
    const custComment = <div dangerouslySetInnerHTML={{__html: text}}/>;
    return custComment
  }

  switchChange = (id, checked) => {
    const {response, form} = this.props;
    let body = {id: id};
    checked ? body.status = 1 : body.status = 0;
    body.searchBody = response.searchBody;
    this.props.dispatch({
      type: 'line_list/changestatus',
      payload: body,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form, response} = this.props;
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

  handleAdd = () => {
    this.props.dispatch(routerRedux.push('/line_management/line_add'));
  }

  renderSimpleForm() {
    const {response, form} = this.props;
    const {select, searchBody} = response;
    const {getFieldDecorator} = form;
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
        <Row gutter={20} style={{marginBottom: 5}}>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="氧气标题">
              {getFieldDecorator('oxName',{
                initialValue: searchBody.oxName,
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="国家">
              {getFieldDecorator('countryId',{
                initialValue:searchBody.countryId||undefined
                // ...searchBody.countryId?{initialValue:searchBody.countryId}:null
              })(
                <Select placeholder="请选择国家" allowClear={true} style={{width: '100%'}}>
                  {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLastLayout}>
            <FormItem {...formItemLayout} label="标签">
              {getFieldDecorator('keyword',{
                initialValue: searchBody.keyword,
              })(
                <Input placeholder="输入标签"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {response} = this.props;
    const {select, searchBody} = response;
    const {getFieldDecorator} = this.props.form;
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
              {getFieldDecorator('oxName',{
                initialValue: searchBody.oxName||null,
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="国家">
              {getFieldDecorator('countryId',{
                initialValue:searchBody.countryId||undefined
                // ...searchBody.countryId?({initialValue:searchBody.countryId}):null
              })(
                <Select placeholder="请选择" allowClear={true} style={{width: '100%'}}>
                  {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="标签">
              {getFieldDecorator('keyword',{
                initialValue: searchBody.keyword||null,
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="开团日期">
              {getFieldDecorator('startDay',{
                initialValue: searchBody.startDay&&moment(searchBody.startDay)||null,
              })(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="氧气编号">
              {getFieldDecorator('oxCode',{
                initialValue: searchBody.oxCode||null,
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="城市">
              {getFieldDecorator('city',{
                initialValue: searchBody.city||null,
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem label="状态">
              {getFieldDecorator('status',{
                initialValue: searchBody.status,
              })(
                <Select
                  // size={size}
                  allowClear={true}
                  placeholder="选择状态"
                  style={{width: '100%'}}
                >
                  <Option key={1}>已经发布</Option>
                  <Option key={0}>未发布</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="产品名称">
              {getFieldDecorator('productName',{
                initialValue: searchBody.productName,
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" icon="search" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {response} = this.props;
    const {tablecolumns} = this.state;
    const {data, loading} = response;

    const message = (
      <Pagination
        showQuickJumper
        size="small"
        showTotal={total => (
          <p>
            统计共 <a style={{fontWeight: 600}}>{total}</a> 项&nbsp;&nbsp;
            每页 <span style={{fontWeight: 600}}>{data.pageSize || 0}</span> 项
            <Button icon="plus" size="small" style={{marginLeft: 20}} type="primary"
                    onClick={() => this.handleAdd()}>新建</Button>
            <a onClick={() => {
              this.onPageChange(1)
            }} style={{marginLeft: 24}}>首页</a>
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
            {/*<div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
            </div>*/}
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
              scroll={{x: width ? '150%' : '100%'}}
            />
            <div className={styles.pagination}>
              <Pagination
                showQuickJumper
                showSizeChanger
                pageSizeOptions={['15', '30', '50', '100', '200']}
                onShowSizeChange={this.onShowSizeChange}
                //size="large"
                showTotal={total => "共" + total + "条/" + "每页" + (data.pageSize || 0) + "条"}
                onChange={this.onPageChange}
                pageSize={data.pageSize || 0}
                current={data.pageIndex || 1}
                total={data.totalCount || 0}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }

  onPageChange = (page) => {
    const {response} = this.props;
    const {searchBody, data} = response;
    const pageSize = data.pageSize, rowStart = (page - 1) * pageSize;
    searchBody.pageSize = pageSize;
    searchBody.rowStart = rowStart;
    searchBody.pageIndex = page;
    this.fetchAction(searchBody);
  }

  onShowSizeChange = (current, size) => {
    const {response} = this.props;
    const {searchBody} = response;
    searchBody.pageSize = size;
    searchBody.rowStart = 0;
    searchBody.pageIndex = 1;
    this.fetchAction(searchBody);
  }

  fetchAction = (body) => {
    // console.log('fetchAction',body);
    this.props.dispatch({
      type: 'line_list/fetch',
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
