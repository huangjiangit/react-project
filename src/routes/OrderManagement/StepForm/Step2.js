import React from 'react';
import { Form, Input, Button, Select, Divider,Badge,
  Card, Row, Col, InputNumber, Alert } from 'antd';
import {routerRedux} from 'dva/router';
import {digitUppercase} from '../../../utils/utils';
import DescriptionList from '../../../components/DescriptionList';
import styles from './style.less';

const { Description } = DescriptionList;
const { Option } = Select;

const formfieldLabels = {
  oxCode: '下单线路编号',
  oxName: '下单线路标题',
  travelDate: '出行日期',
  travelTime: '出行时间',
  adultNum: '成人',
  youthNum: '青年',
  childNum: '儿童',
  travelersAmount: '总人数',
  comment: '备注',
  pickupType: '接送信息',
  pickupAddress: '接地址',
  dropoffAddress: '送地址',
};

export default ({formItemLayout, form, data, dispatch, submitting}) => {
  const {getFieldDecorator, validateFields} = form;
  const onPrev = () => {
    dispatch(routerRedux.push('/order_management/step1-form'));
  };
  const onValidateForm = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'order_add/submitStepForm',
          payload: {
            ...data,
            ...values,
          },
        });
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

  const formItemLayout2 = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 10},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 14},
      md: {span: 13},
    },
  };

  return (
    <div>
      <Card className={styles.card} bordered={false}>
        <DescriptionList size="large" title="出行信息" style={{ marginBottom: 32 }}>
          <Description term={formfieldLabels.oxCode}>{data.oxCode}</Description>
          <Description term={formfieldLabels.oxName}>{data.oxName}</Description>
          <Description term={formfieldLabels.travelDate}>{data.travelDate}</Description>
          <Description term={formfieldLabels.travelersAmount}>{data.travelersAmount}</Description>
          <Description term={'人数分布'}>{`${data.adultNum||0}成人,${data.youthNum||0}青年,${data.childNum||0}儿童`}</Description>
          <Description term={formfieldLabels.travelTime}>{data.travelTime}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="联系人信息" style={{ marginBottom: 32 }}>
          <Description term={'姓名'}>{data.members[0].name}</Description>
          <Description term={'联系方式'}>{data.members[0].mobile}</Description>
          <Description term={'邮箱'}>{data.members[0].email}</Description>
          <Description term={'性别'}>{data.members[0].sex}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="接送信息" style={{ marginBottom: 32 }}>
          <Description term={formfieldLabels.pickupType}>{data.pickupType}</Description>
          {/*<Description term="接地址">18100000000</Description>
          <Description term="送地址">菜鸟仓储</Description>
          <Description term="取货地址">浙江省杭州市西湖区万塘路18号浙江省杭州市西湖区万塘路18号</Description>*/}
          <Description term={formfieldLabels.comment}>{data.comment}</Description>
        </DescriptionList>
        {/*<Form layout="horizontal">
          <Row gutter={gutter}>
            <Col {...colLayout1}>
              <Form.Item {...formItemLayout2} label={formfieldLabels.oxCode}>
                {data.oxCode}
              </Form.Item>
            </Col>
            <Col {...colLayout2}>
              <Form.Item {...formItemLayout2} label={formfieldLabels.oxName}>
                {data.oxName}
              </Form.Item>
            </Col>
            <Col {...colLayout3}>
              <Row gutter={gutter}>
                <Col xl={{span: 14}} lg={{span: 14}} md={{span: 14}} sm={14}>
                  <Form.Item {...formItemLayout2} label={formfieldLabels.travelDate}>
                    {data.travelDate}
                  </Form.Item>
                </Col>
                <Col xl={{span: 10}} lg={{span: 10}} md={{span: 10}} sm={10}>
                  <Form.Item {...formItemLayout2} label={formfieldLabels.travelTime}>
                    {data.travelTime}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={gutter}>
            <Col {...colLayout1}>
              <Form.Item {...formItemLayout2} label={formfieldLabels.travelersAmount}>
                <Badge status="processing" text={`总共 ${3} 人出行`}/>
              </Form.Item>
            </Col>
            <Col {...colLayout2}>
              <Row gutter={gutter}>
                <Col xl={{span: 8}} lg={{span: 8}} md={{span: 8}} sm={8}>
                  <Form.Item {...formItemLayout2} label={formfieldLabels.adultNum}>
                    {data.adultNum}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8}} lg={{span: 8}} md={{span: 8}} sm={8}>
                  <Form.Item {...formItemLayout2} label={formfieldLabels.youthNum}>
                    {data.youthNum}
                  </Form.Item>
                </Col>
                <Col xl={{span: 8}} lg={{span: 8}} md={{span: 8}} sm={8}>
                  <Form.Item {...formItemLayout2} label={formfieldLabels.childNum}>
                    {data.childNum}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col {...colLayout3}>
              <Form.Item {...formItemLayout2} label={'联系人'}>
                {data.members[0].name}
              </Form.Item>
            </Col>
          </Row>
        </Form>*/}
      </Card>

      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Alert
          closable
          showIcon
          message="填写收款信息，慎重操作。"
          style={{marginBottom: 24}}
        />
        <Form.Item
          {...formItemLayout}
          label="收款方式"
        >
          {getFieldDecorator('payAccount', {
            initialValue: '支付宝',
            rules: [{ required: true, message: '请选择付款账户' }],
          })(
            <Select placeholder="请选择一个收款方式">
              <Option value='淘宝'>淘宝</Option>
              <Option value='支付宝'>支付宝</Option>
              <Option value='银行转账'>银行转账</Option>
              <Option value='现金'>现金</Option>
              <Option value='微信'>微信</Option>
              <Option value='马蜂窝'>马蜂窝</Option>
              <Option value='飞猪(探驰)'>飞猪(探驰)</Option>
              <Option value='飞猪(和平)'>飞猪(和平)</Option>
              <Option value='其他'>其他</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="收款账户"
        >
          <Input.Group compact>
            <Select defaultValue="alipay" style={{ width: 80 }}>
              <Option value="alipay">支付宝</Option>
              <Option value="bank">银行账户</Option>
            </Select>
            {getFieldDecorator('receiverAccount', {
              initialValue: 'test@example.com',
              rules: [
                { required: true, message: '请输入收款人账户' },
                { type: 'email', message: '账户名应为邮箱格式' },
              ],
            })(
              <Input style={{ width: 'calc(100% - 80px)' }} placeholder="test@example.com" />
            )}
          </Input.Group>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="收款人姓名"
        >
          {getFieldDecorator('receiverName', {
            initialValue: 'Alex',
            rules: [{ required: true, message: '请输入收款人姓名' }],
          })(
            <Input placeholder="请输入收款人姓名" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="实收金额"
        >
          {getFieldDecorator('amount', {
            initialValue: '500',
            rules: [
              { required: true, message: '请输入转账金额' },
              { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' },
            ],
          })(
            <Input prefix="￥" placeholder="请输入金额" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('comment')(
            <Input.TextArea placeholder={`请输入${'备注'}`}/>
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{marginLeft: 8}}>
            上一步
          </Button>
        </Form.Item>
      </Form>
      {/*<Divider style={{margin: '40px 0 24px'}}/>
      <div className={styles.desc}>
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        <h4>转账到银行卡</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      </div>*/}

      {/*<Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{marginBottom: 24}}
        />
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="付款账户"
        >
          {data.payAccount}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="收款账户"
        >
          {data.receiverAccount}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="收款人姓名"
        >
          {data.receiverName}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="转账金额"
        >
          <span className={styles.money}>{data.amount}</span>
          <span className={styles.uppercase}>（{digitUppercase(data.amount)}）</span>
        </Form.Item>
        <Divider style={{margin: '24px 0'}}/>
        <Form.Item
          {...formItemLayout}
          label="支付密码"
          required={false}
        >
          {getFieldDecorator('password', {
            initialValue: '123456',
            rules: [{
              required: true, message: '需要支付密码才能进行支付',
            }],
          })(
            <Input type="password" autoComplete="off" style={{width: '80%'}}/>
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: 8}}
          wrapperCol={{
            xs: {span: 24, offset: 0},
            sm: {span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span},
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{marginLeft: 8}}>
            上一步
          </Button>
        </Form.Item>
      </Form>*/}
    </div>
  );
};
