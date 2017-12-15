import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Spin, Tag,
   Modal, message, Alert, Table, Tooltip, Pagination } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CountryTableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  response: state.country,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
    tablecolumns: [
      { title: '国家ID', dataIndex: 'id', key: 'id',  },
      { title: '名称',  dataIndex: 'name', key: 'name',  },
      { title: '英文名称',  dataIndex: 'nameEn', key: 'nameEn',  },
      { title: '国家编码', dataIndex: 'code', key: '2', },
      { title: '国家区号', dataIndex: 'phone', key: '3', },
      { title: '时差', dataIndex: 'gap', key: '5', },
      { title: '洲ID', dataIndex: 'continentId', key: '6',},
      { title: '经度', dataIndex: 'longitude', key: '7', },
      { title: '纬度', dataIndex: 'latitude', key: '8', },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 65,
        render: (text, record, index) => (
          <div>
            <a onClick={()=>this.editorCountry(index)}><Icon type="edit" style={{fontSize:'20px',marginLeft:'5px'}}/></a>
          </div>
        ),
      },
    ]
  };

  componentDidMount() {
    const {response} = this.props;
    this.fetchAction(response.searchBody);
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'country/clear',
    });
  }

  editorCountry = (index) =>{
    const {response} = this.props;
    const {data,loading} = response;
    // console.log(data.list[index]);
    // this.props.dispatch({
    //   type: 'supply/edit',
    //   payload: ''
    // });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form ,response} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        name: fieldsValue.name && fieldsValue.name.label,
      };
      this.setState({formValues: values});
      this.fetchAction(values);
    });
  }

  handleAdd = (e) => {
    this.setState({
      model: true,
    });
  }

  fetchCountry = (value) => {
    if(value){
      this.props.dispatch({
        type: 'country/findCountry',
        payload: value
      });
    }
  }

  renderSimpleForm(select) {
    const { getFieldDecorator } = this.props.form;
    const { response } = this.props;
    const {country,fetching} = response;
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
            <FormItem {...formItemLayout} label="国家">
              {getFieldDecorator('name')(
                <Select
                  showSearch
                  labelInValue
                  placeholder="选择国家"
                  notFoundContent={fetching ? <Spin size="small" /> : '没有搜索到内容...'}
                  filterOption={false}
                  onSearch={this.fetchCountry}
                  style={{ width: '100%' }}
                >
                  {(country||[]).map(d => <Option key={d.value}>{d.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colLastLayout}>
            <FormItem {...formItemLayout} label="国别码">
              {getFieldDecorator('code')(
                <Input placeholder="输入标签" />
              )}
            </FormItem>
          </Col>
          <Col {...colLayout}>
            <span className={styles.submitButtons}>
              <Button type="primary" icon="search" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {/*<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { response } = this.props;
    const {select} = response;
    return this.renderSimpleForm(select);
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
      <PageHeaderLayout title="国家查询">
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
              //scroll={{x: '180%'}}
            />
            <div className={styles.pagination}>
              <Pagination
                showQuickJumper
                showSizeChanger
                pageSizeOptions={['15','30','50','100','200']}
                onShowSizeChange={this.onShowSizeChange}
                // size="large"
                showTotal={total => "共"+total+"条/"+"每页"+(data.pageSize||0)+"条"}
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
    // console.log(body);
    this.props.dispatch({
      type: 'country/fetch',
      payload: body
    });
    message.success('查询成功.',1.5);
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
