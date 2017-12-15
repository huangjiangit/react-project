import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Row, Col, Card, Form, Input, Select, Icon, Button, Spin, Tag,
  Modal, message, Table, Tooltip, Radio, InputNumber,
} from 'antd';

import styles from './CountryTableList.less';
import debounce from 'lodash.debounce';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

@connect(state => ({
  response: state.city,
}))
@Form.create()
export default class CityAddModal extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchCountry = debounce(this.fetchCountry, 800);
  }
  state = {
      modalVisible: this.props.modalVisible,
      formValues: {},
      formItem: {
        name: '名称',
        nameEn: '英文名称',
        pinYin: '拼音',
        country: '所属国家',
        longitude: '经度',
        latitude: '纬度',
        comment: '备注',
      }
  };

  componentDidMount() {
    // const {response} = this.props;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {form, response, onCancel} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        id:response.update.id,
        countryId: fieldsValue.countryId && fieldsValue.countryId.key,
        countryName: fieldsValue.countryId && fieldsValue.countryId.label,
      };
      this.fetchAction({...values,searchBody:response.searchBody});
      this.handleModalFormReset();
    });
  }

  fetchCountry = (value) => {
    if (value) {
      this.props.dispatch({
        type: 'city/findCountry',
        payload: value
      });
    }
  }

  renderSimpleForm(select) {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {response} = this.props;
    const {formItem} = this.state;
    const {country, fetching, loading, update} = response;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 15},
      },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        //hideRequiredMark
        style={{marginTop: 8}}
      >
        <FormItem
          {...formItemLayout}
          label={formItem.name}
        >
          {getFieldDecorator('name', {
            initialValue: update.name||null,
            rules: [{
              required: true, message: `${formItem.name}不能为空`,
            }],
          })(
            <Input placeholder={`请输入${formItem.name}`}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="英文名称"
        >
          {getFieldDecorator('nameEn', {
            initialValue: update.nameEn||null,
            rules: [{
              // required: true, message: `${formItem.nameEn}不能为空`,
            }],
          })(
            <Input placeholder={`请输入${formItem.nameEn}`}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<span>{formItem.pinYin}<em className={styles.optional}>（城市）</em></span>}
        >
          {getFieldDecorator('pinYin', {
            initialValue: update.pinYin||null,
          })(
            <Input placeholder={`请输入${formItem.pinYin}`}/>
          )}
        </FormItem>
        <Form.Item
          {...formItemLayout}
          label={
            <span>
              {formItem.country}
              <em className={styles.optional}>
                    <Tooltip title="城市所属的国家">
                      <Icon type="info-circle-o" style={{marginRight: 4,marginLeft: 8}}/>
                    </Tooltip>
                  </em>
                </span>
          }
        >
          {getFieldDecorator('countryId', {
             initialValue: update.countryId&&{key:`${update.countryId}`,label:`${update.countryName}`},
             rules: [{required: true, message: `请选择${formItem.country}`}],
          })(
            <Select
              showSearch
              labelInValue
              allowClear={true}
              placeholder={`请选择${formItem.country}`}
              notFoundContent={fetching ? <Spin size="small" /> : '没有搜索到内容'}
              filterOption={false}
              onSearch={this.fetchCountry}
              style={{ width: '100%' }}
            >
              {(country||[]).map(d => <Option key={d.value}>{d.name}</Option>)}
            </Select>
          )}
        </Form.Item>
        <FormItem
          {...formItemLayout}
          label={
            <span>
                  经度
                  <em className={styles.optional}>
                    （选填）
                    <Tooltip title="左边经度,右边纬度">
                      <Icon type="info-circle-o" style={{marginRight: 4}}/>
                    </Tooltip>
                  </em>
                </span>
          }
        >
            <Input.Group >
              <Col span={10}>
                {getFieldDecorator('longitude',{
                  initialValue: update.longitude||null,
                })(
                  <Input placeholder={`请输入${formItem.longitude}`}/>
                )}
              </Col>
              <Col span={10}>
                {getFieldDecorator('latitude',{
                  initialValue: update.latitude||null,
                })(
                  <Input placeholder={`请输入${formItem.latitude}`}/>
                )}
              </Col>
            </Input.Group>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
              <span>
                {formItem.comment}
                <em className={styles.optional}>
                      <Tooltip title="城市备注信息,还没此字段">
                        <Icon type="info-circle-o" style={{marginRight: 4,marginLeft: 8}}/>
                      </Tooltip>
                    </em>
                </span>
          }
        >
          {getFieldDecorator('comment',{
            initialValue: update.comment||null,
          })(
            <TextArea style={{minHeight: 32}} placeholder={`请输入${formItem.comment}`} rows={3}/>
          )}
        </FormItem>
      </Form>
    );
  }

  renderForm() {
    const {response} = this.props;
    const {select} = response;
    return this.renderSimpleForm(select);
  }

  render() {
    const {response , modalVisible, onCancel, onCreate,} = this.props;
    const {data, loading} = response;

    return (
      <Modal
        title="城市新增"
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={this.handleModalFormReset}
      >
        {this.renderForm()}
      </Modal>
    );
  }

  fetchAction = (body) => {
    this.props.dispatch({
      type: 'city/formSubmit',
      payload: body
    });
  }

  handleModalFormReset = () => {
    const {form, response, onCancel} = this.props;
    onCancel();
    this.props.form.resetFields();
  }
}
