import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Spin, Tag,
   Modal, message, Alert, Table, Tooltip, Pagination, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import CityAddModal from './CityAddModal';
import styles from './CountryTableList.less';

import { Link } from 'dva/router';
import Exception from '../../components/Exception';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  response: state.city,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    modalVisible: false,
    formValues: {},
    tablecolumns: [
      { title: '城市ID',width: 60, dataIndex: 'id', key: 'id',  },
      { title: '名称',  dataIndex: 'name', key: 'name',  },
      { title: '城市英文', dataIndex: 'nameEn', key: 'nameEn', },
      { title: '国家', dataIndex: 'countryName', key: 'countryName', },
      { title: '经度', dataIndex: 'longitude', key: 'longitude', },
      { title: '纬度', dataIndex: 'latitude', key: 'latitude', },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 70,
        render: (text, record, index) => (
          <div>
            <Popconfirm
              title="确认删除吗?"
              onConfirm={()=>this.deleteCity(record.id)}
              // onCancel={cancel}
              okText="确认"
              cancelText="取消"
            >
              <a ><Icon type="delete" style={{fontSize:'20px'}}/></a>
            </Popconfirm>
            <a onClick={()=>{
              this.editorCity(index)
            }}><Icon type="edit" style={{fontSize:'20px',marginLeft:'5px'}}/></a>
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
      type: 'city/clear',
    });
  }

  editorCity = (index) =>{
    const {response, dispatch} = this.props;
    const {data} = response;
    this.setState({modalVisible: !this.state.modalVisible});

    dispatch({
      type: 'city/save',
      payload: {update:data.list[index]}
    });
  }

  deleteCity = (id) =>{
    const {response, dispatch} = this.props;
    dispatch({
      type: 'city/deleteCity',
      payload: {id:id,searchBody:response.searchBody}
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form ,response} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        countryId: fieldsValue.countryId && fieldsValue.countryId.key,
      };
      this.setState({formValues: values});
      this.fetchAction(values);
    });
  }

  handleModalVisible = (e) => {
    if(this.state.modalVisible){
      this.props.dispatch({
        type: 'city/save',
        payload: {update:{}}
      });
    }
    this.setState({modalVisible: !this.state.modalVisible});
  }

  fetchCountry = (value) => {
    if(value){
      this.props.dispatch({
        type: 'city/findCountry',
        payload: value
      });
    }
  }

  renderSimpleForm() {
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
              {getFieldDecorator('countryId')(
                <Select
                  showSearch
                  labelInValue
                  allowClear={true}
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
            <FormItem {...formItemLayout} label="城市">
              {getFieldDecorator('name')(
                <Input placeholder="输入城市" />
              )}
            </FormItem>
          </Col>
          <Col {...colLastLayout}>
            <FormItem {...formItemLayout} label="英文">
              {getFieldDecorator('nameEn')(
                <Input placeholder="输入英文" />
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
    return this.renderSimpleForm();
  }

  render() {
    const status = 5;
    const {response} = this.props;
    const { modalVisible,tablecolumns} = this.state;
    const {data,loading} = response;
    const message = (
      <Pagination
        showQuickJumper
        size="small"
        showTotal={total =>(
          <p>
            统计共 <a style={{ fontWeight: 600 }}>{total}</a> 项&nbsp;&nbsp;
            每页 <span style={{ fontWeight: 600 }}>{data.pageSize||0}</span> 项
            <Button icon="plus" size="small" style={{ marginLeft: 20 }} type="primary" onClick={() => this.handleModalVisible()}>新建</Button>
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
      <PageHeaderLayout title="城市查询">
        {status<5?
          <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
          :
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
                size="middle"
                pagination={false}
              />
              <div className={styles.pagination}>
                <Pagination
                  showQuickJumper
                  showSizeChanger
                  pageSizeOptions={['15','30','50','100','200']}
                  onShowSizeChange={this.onShowSizeChange}
                  showTotal={total => "共"+total+"条/"+"每页"+(data.pageSize||0)+"条"}
                  onChange={this.onPageChange}
                  pageSize={data.pageSize || 0}
                  current={data.pageIndex || 1}
                  total={data.totalCount || 0}
                />
              </div>
            </div>
          </Card>
        }

        <CityAddModal
          modalVisible={modalVisible}
          onCancel={this.handleModalVisible}
          onCreate=""
        />
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
      type: 'city/fetch',
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
