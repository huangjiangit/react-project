import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Result from '../../components/Result';
import {
  Form, Input, Spin, Select, Button, Card, InputNumber,
  Radio, Icon, Tooltip, Row, Col, Alert
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import debounce from 'lodash.debounce';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

const fieldLabels = {
  name: '供应商名称',
  shortName: '简称',
  country: '供应商区域',
  officialWebsite: '官网地址',
  phone: '联系电话',
  mobile: '移动电话',
  email: '联系邮箱',
  agentWebsite: '代理商系统入口',
  account: '登陆账号',
  password: '登陆密码',
  paymentTypeArray: '付款方式',
  comment: '备注',
};

@connect(state => ({
  respone:state.supply_add
}))
@Form.create()
export default class BasicForms extends PureComponent {

  state = {
    value:null,
    fetching: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.country){//以这种值提交容易编辑时取值
          values.supplyArea = values.country.key + '@' + values.country.label;
        }
        const { respone } = this.props;
        if(respone.update){
          values.id = respone.update.id;
        }
        this.props.dispatch({
          type: 'supply_add/formSubmit',
          payload: values,
        });
      }
    });
  }

  fetchCountry = (value) => {
    if(value){
      this.props.dispatch({
        type: 'supply_add/getCountryArray',
        payload: value,
      });
    }
  }

  handleChange = (value) => {
    // this.setState({value, fetching: false,});
    this.props.form.setFieldsValue({country:value});
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  componentDidMount() {
    const {respone, form} = this.props;
    this.props.dispatch({
      type: 'supply_add/getSelectArray',
      payload: 'supply_pay_type'
    });
    if(respone.update){
      form.setFieldsValue(respone.update);
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'supply_add/clear',
    });
  }

  render() {
    const {fetching} = this.state;
    const {respone, form} = this.props;
    const {select , loading, country} = respone;
    const {getFieldDecorator} = form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 13},
      },
    };
    const colLayout = {
      sm: {span: 24},
      md: {span: 12},
      lg: {span: 12},
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const errorFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 13, offset: 7 },
      },
    };
    const actions = (
      <div>
        <Button type="primary">返回列表</Button>
        <Button>查看项目</Button>
        <Button>打 印</Button>
      </div>
    );
    return (
      <PageHeaderLayout
        title={`供应商${respone.update?'编辑':'新增'}`}
        content={`表单用于${respone.update?'更新':'添加'}供应商信息。`}
      >
        <Card title="供应商基本信息" className={styles.card} bordered={false}>
          <Spin size="large" spinning={loading} >
          <Form
            onSubmit={this.handleSubmit}
            // hideRequiredMark
            style={{marginTop: 8}}
          >
            <Row gutter={16}>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{required: true, message: `请输入${fieldLabels.name}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.name}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={<span>{`${fieldLabels.shortName}`}<em className={styles.optional}>(两位英文)</em></span>}>
                  {getFieldDecorator('shortName', {
                    rules: [{required: true, message: `请输入${fieldLabels.shortName}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.shortName}`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.country}>
                  {getFieldDecorator('country', {
                    // rules: [{required: true, message: `请选择${fieldLabels.country}`}],
                  })(
                    <Select
                      showSearch
                      labelInValue
                      placeholder={`请选择${fieldLabels.country}`}
                      notFoundContent={fetching ? <Spin size="small" /> : '没有搜索到内容'}
                      filterOption={false}
                      onSearch={debounce(this.fetchCountry,800)}
                      // onChange={this.handleChange}
                      style={{ width: '100%' }}
                    >
                      {(country||[]).map(d => <Option key={d.id}>{d.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.officialWebsite}>
                  {getFieldDecorator('officialWebsite', {
                    // rules: [{required: true, message: `请输入${fieldLabels.officialWebsite}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.officialWebsite}`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.phone}>
                  {getFieldDecorator('phone', {
                    // rules: [{required: true, message: `请输入${fieldLabels.phone}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.phone}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.mobile}>
                  {getFieldDecorator('mobile', {
                    // rules: [{required: true, message: `请输入${fieldLabels.mobile}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.mobile}`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.email}>
                  {getFieldDecorator('email', {
                    // rules: [{required: true, message: `请输入${fieldLabels.email}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.email}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.agentWebsite}>
                  {getFieldDecorator('agentWebsite', {
                    // rules: [{required: true, message: `请输入${fieldLabels.agentWebsite}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.agentWebsite}`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.account}>
                  {getFieldDecorator('account', {
                    // rules: [{required: true, message: `请输入${fieldLabels.account}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.account}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.password}>
                  {getFieldDecorator('password', {
                    // rules: [{required: true, message: `请输入${fieldLabels.password}`}],
                  })(
                    <Input placeholder={`请输入${fieldLabels.password}`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col  {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.comment}>
                  {getFieldDecorator('comment', {
                    // rules: [{required: true, message: `请输入${fieldLabels.comment}`}],
                  })(
                    <TextArea style={{minHeight: 32}} placeholder={`请输入${fieldLabels.comment}`} rows={4}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout}>
                <Form.Item {...formItemLayout} label={fieldLabels.paymentTypeArray}>
                  {getFieldDecorator('paymentTypeArray', {
                    rules: [{required: true, message: `请选择至少一种${fieldLabels.paymentTypeArray}`}],
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder={`请选择至少一种${fieldLabels.paymentTypeArray}`}
                    >
                      {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                      {/*<Option key='1'>信用卡</Option>
                      <Option key='2'>paypal</Option>
                      <Option key='3'>对公账号</Option>
                      <Option key='4'>月结</Option>
                      <Option key='5'>预付</Option>*/}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col  {...colLayout}>
                <FormItem {...errorFormLayout}>
                  <Alert
                    message={'提交失败!'}
                    type="error"
                    showIcon
                  />
                </FormItem>
                <FormItem
                  {...submitFormLayout}
                  //style={{marginTop: 12}}
                >
                  <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                  </Button>
                  <Button style={{marginLeft: 10}} onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          </Spin>
        </Card>

        <Card bordered={false}>
          <Result
            type="success"
            title="提交成功"
            description="提交结果页用于反馈一系列操作任务的处理结果，
                  如果仅是简单操作，使用 Message 全局提示反馈即可。
                  本文字区域可以展示简单的补充说明，如果有类似展示
                  “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"
            actions={actions}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>

      </PageHeaderLayout>
    );
  }
}
