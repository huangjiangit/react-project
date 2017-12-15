import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Switch, Tag,
  Modal, message, Alert, Table, Tooltip, Pagination
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const FormItem = Form.Item;
const {Option} = Select;

@connect(state => ({
  response: state.supply,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    tablecolumns: [
      {title: '序号', width: 50, dataIndex: 'id', key: 'id', fixed: 'left'},
      {title: '供应商名称', width: 100, dataIndex: 'name', key: 'name', fixed: 'left'},
      {title: '编号', dataIndex: 'shortName', key: '1', width: 80},
      {title: '区域', dataIndex: 'supplyArea', key: '2', width: 60},
      {
        title: '官方网址', dataIndex: 'officialWebsite', key: '3', width: 150,
        render: (text, record, index) => (
          <a target="_blank" href={(text && text.indexOf("http") ? 'http://' : '') + text}>{text}</a>
        ),
      },
      {title: '联系电话', dataIndex: 'phone', key: '4', width: 110},
      {title: '联系邮箱', dataIndex: 'email', key: '5', width: 150},
      {
        title: '对接系统', dataIndex: 'agentWebsite', key: '6', width: 100,
        render: (text, record, index) => (
          <a target="_blank" href={(text && text.indexOf("http") ? 'http://' : '') + text}>{text}</a>
        )
      },
      {
        title: '付款方式', dataIndex: 'paymentType', key: '9', width: 200,
        render: (text, record, index) => (
          text.split(',').map((s, index) => {
            if (s) {
              return <Tag key={index}> {s} </Tag>
            }
          })
        ),
      },
      {title: '账号', dataIndex: 'account', key: '7', width: 120,},
      {title: '密码', dataIndex: 'password', key: '8', width: 110},
      {title: '备注', dataIndex: 'comment', key: '10'},
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 70,
        render: (text, record, index) => (
          <div>
            <Tooltip placement="top" title={'查看云文档'}>
              <a onClick={() => this.viewCloudDocuments(index)}>
                <Icon type="file-text" style={{fontSize: '20px'}}/>
              </a>
            </Tooltip>
            <Tooltip placement="top" title={'编辑'}>
              <a onClick={() => {
                this.editorSupply(index)
              }}>
                <Icon type="edit" style={{fontSize: '20px', marginLeft: '5px'}}/>
              </a>
            </Tooltip>
          </div>
        ),
      },
    ],
  };

  componentDidMount() {
    const {response} = this.props;
    this.fetchAction(response.searchBody);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'supply/clear',
    });
  }

  editorSupply = (index) => {
    const {response} = this.props;
    const {data, loading} = response;
    console.log(data.list[index]);
    this.props.dispatch({
      type: 'supply_add/save',
      payload: {update: data.list[index]}
    });
    this.props.dispatch({
      type: 'supply/edit',
      payload: ''
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const {dispatch, form, response} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({formValues: fieldsValue});
      this.fetchAction(fieldsValue);
    });
  }

  handleAdd = (e) => {
    this.props.dispatch({
      type: 'supply/edit',
      payload: ''
    });
  }

  renderSimpleForm(select) {
    const {getFieldDecorator} = this.props.form;
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={20} style={{marginBottom: 5}}>
          <Col {...colLayout}>
            <FormItem {...formItemLayout} label="供应商名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const {response} = this.props;
    const {select} = response;
    return this.renderSimpleForm(select);
  }

  render() {
    const {response} = this.props;
    const {modalVisible, addInputValue, tablecolumns} = this.state;
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
      <PageHeaderLayout title="供应商查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            {/*<div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>新建</Button>
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
              size="middle"
              pagination={false}
              scroll={{x: '150%'}}
            />
            <div className={styles.pagination}>
              <Pagination
                showQuickJumper
                showSizeChanger
                pageSizeOptions={['15', '30', '50', '100', '200']}
                onShowSizeChange={this.onShowSizeChange}
                // size="large"
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
    // console.log(body);
    this.props.dispatch({
      type: 'supply/fetch',
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
