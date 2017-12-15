import React from 'react';
import { Form, Input, Button, Select, Divider,Badge,
  Card, Row, Col, InputNumber, DatePicker, TimePicker } from 'antd';
import { routerRedux } from 'dva/router';
import TableForm from '../TableForm';
import styles from './style.less';
import moment from 'moment';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DD HH:mm';
const timeFormat = 'HH:mm';
const Today = moment().format(dateFormat);

const formfieldLabels = {
  oxCode: '氧气线路编号',
  oxName: '氧气线路标题',
  travelDate: '出行日期',
  travelTime: '出行时间点',
  adultNum: '成人',
  youthNum: '青年',
  childNum: '儿童',
  travelersAmount: '总人数',
  comment: '备注',
  pickupType: '接送信息',
  pickupAddress: '接地址',
  dropoffAddress: '送地址',

  country: '国家',
  city: '城市',
  oxPrice: '氧气报价',
  supply: '供应商',
  productCode: '供应商产品编号',
  productName: '供应商产品名称',
  productUrl: '供应商产品地址',
  productPrice: '供应商报价',
  productCurrency: '货币',
  activeDay: '开团日期',
  openTime: '开放时间备注',
  ativityTime: '活动时间',
  durationStr: '活动时长',
  ageStr: '年龄限制',
  shuttleType: '接送方式',
  bookingStr: '预订系统',
  address: '地点',
  latitude: '经度',
  longitude: '纬度',
  fixedPeriod: '是否固定团期',
  routeType: '路线类型',
  outId: 'OUTID',
};

const tableData = [{
  key: '1',
  name: 'John Brown',
  mobile: '18100000001',
  email: 'test@example.com',
  sex: '男',
}, {
  key: '2',
  name: 'Jim Green',
  mobile: '18100000002',
  email: 'test@example.com',
  sex: '女',
}];

export default ({ formItemLayout, form,data, dispatch }) => {
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
  const total = (getFieldValue('adultNum')||0) + (getFieldValue('youthNum')||0) + (getFieldValue('childNum')||0);

  const onValidateForm = () => {
    validateFields((err, values) => {
      console.log(values);
      if (!err) {

        values.travelDate = values.travelDate && values.travelDate.format(dateFormat);
        values.travelTime = values.travelTime && values.travelTime.format(timeFormat);
        values.travelersAmount = total||data.travelersAmount;

        dispatch({
          type: 'order_add/saveStepFormData',
          payload: values,
        });
        dispatch(routerRedux.push('/order_management/step1-form/step2-form'));
      }
    });
  };

  const gutter = 16;//每栏间隔
  const colLayout1 = {
    lg: {span: 7},
    md: {span: 12},
    sm: {span: 24},
  };//第一列
  const colLayout2 = {
    xl: {span: 6, offset: 2},
    lg: {span: 8},
    md: {span: 12},
    sm: {span: 24},
  };//第二列
  const colLayout3 = {
    xl: {span: 7, offset: 2},
    lg: {span: 10},
    md: {span: 24},
    sm: {span: 24},
  };//第三列

  return (
    <div>
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={gutter}>
            <Col {...colLayout1}>
              <Form.Item label={formfieldLabels.oxCode}>
                {getFieldDecorator('oxCode', {
                  initialValue: data.oxCode||null,
                  rules: [{required: true, message: `请输入${formfieldLabels.oxCode}`}],
                })(
                  <Input placeholder={`请输入${formfieldLabels.oxCode}`}/>
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout2}>
              <Form.Item label={formfieldLabels.oxName}>
                {getFieldDecorator('oxName', {
                  initialValue: data.oxName||null,
                  rules: [{required: true, message: `请输入${formfieldLabels.oxName}`}],
                })(
                  <Input placeholder={`请输入${formfieldLabels.oxName}`}/>
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout3}>
              <Row gutter={gutter}>
                <Col xl={{span: 14}} lg={{span: 14}} md={{span: 14}} sm={14}>
                  <Form.Item label={formfieldLabels.travelDate}>
                    {getFieldDecorator('travelDate', {
                      initialValue: data.travelDate&&moment(data.travelDate),
                      rules: [{required: true, message: `请选择${formfieldLabels.travelDate}`}],
                    })(
                      <DatePicker
                        format={dateFormat}
                        style={{width: '100%'}}
                        disabledDate={(current)=>current && current.valueOf() < Date.now()}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 10}} lg={{span: 10}} md={{span: 10}} sm={10}>
                  <Form.Item label={formfieldLabels.travelTime}>
                    {getFieldDecorator('travelTime', {
                      initialValue: data.travelTime&&moment(data.travelTime,timeFormat),
                    })(
                      <TimePicker
                        format={timeFormat}
                        style={{width: '100%'}}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={gutter}>
            <Col {...colLayout1}>
              <Row gutter={gutter}>
                <Col xl={{span: 8}} lg={{span: 8}} md={{span: 8}} sm={8}>
                  <Form.Item label={formfieldLabels.adultNum}>
                    {getFieldDecorator('adultNum', {
                      initialValue: data.adultNum||null,
                    })(
                      <InputNumber style={{width: '100%'}} min={0} placeholder={`${formfieldLabels.adultNum}`}/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8}} lg={{span: 8}} md={{span: 8}} sm={8}>
                  <Form.Item label={formfieldLabels.youthNum}>
                    {getFieldDecorator('youthNum', {
                      initialValue: data.youthNum||null,
                    })(
                      <InputNumber style={{width: '100%'}} min={0} placeholder={`${formfieldLabels.youthNum}`}/>
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8}} lg={{span: 8}} md={{span: 8}} sm={8}>
                  <Form.Item label={formfieldLabels.childNum}>
                    {getFieldDecorator('childNum', {
                      initialValue: data.childNum||null,
                    })(
                      <InputNumber style={{width: '100%'}} min={0} placeholder={`${formfieldLabels.childNum}`}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col {...colLayout2}>
              <Form.Item label={formfieldLabels.travelersAmount}>
                <Badge status="processing" text={`总共 ${total||(data.travelersAmount||0)} 人出行`} />
              </Form.Item>
            </Col>
            <Col {...colLayout3}>

            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="联系人信息" className={styles.card} bordered={false}>
        {getFieldDecorator('members', {
          initialValue: tableData,
        })(<TableForm />)}
      </Card>
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={gutter}>
            <Col {...colLayout1}>
              <Form.Item label={formfieldLabels.pickupType}>
                {getFieldDecorator('pickupType',{
                  initialValue: data.pickupType||'1'
                })(
                  <Select
                    placeholder={`请选择${formfieldLabels.pickupType}`}
                  >
                    <Option value={'1'}>不含接送</Option>
                    <Option value={'2'}>酒店接送</Option>
                    <Option value={'3'}>接机</Option>
                    <Option value={'4'}>送机</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout2}>
              <Form.Item
                label={formfieldLabels.pickupAddress}
                style={{
                  display: getFieldValue('pickupType') === '2' ? 'block' : 'none',
                }}
              >
                {getFieldDecorator('pickupAddress')(
                  <Input
                    placeholder={`请输入${formfieldLabels.pickupAddress}`}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout3}>
              <Form.Item
                label={formfieldLabels.dropoffAddress}
                style={{
                  display: getFieldValue('pickupType') === '2' ? 'block' : 'none',
                }}
              >
                {getFieldDecorator('dropoffAddress')(
                  <Input
                    placeholder={`请输入${formfieldLabels.dropoffAddress}`}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={gutter}>
            <Col >
              <Form.Item label={formfieldLabels.comment}>
                {getFieldDecorator('comment', {
                  initialValue: data.comment||null
                })(
                  <Input.TextArea placeholder={`请输入${formfieldLabels.comment}`}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            // wrapperCol={{
            //   xs: { span: 24, offset: 0 },
            //   sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            // }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        <h4>转账到银行卡</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      </div>
    </div>
  );
};
