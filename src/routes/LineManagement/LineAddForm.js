import React, {PureComponent} from 'react';
import {connect} from 'dva';
import Result from '../../components/Result';
import {
  Form, Input, Spin, Select, Button, Card, InputNumber, Popover,
  Icon, Tooltip, Row, Col, DatePicker
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import LineEditor from './LineLzEditor';
import ReactEditor from './ReactEditor';
import debounce from 'lodash.debounce';
import moment from 'moment';
import styles from './LineAddForm.less';

const {Option} = Select;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const formfieldLabels = {
  oxCode: '氧气线路编号',
  oxName: '氧气线路标题',
  keyword: '标签',
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

const operationTabList = [
  {
    key: 'tab1',
    tab: '路线说明',
  }, {
    key: 'tab2',
    tab: '预定须知',
  }, {
    key: 'tab3',
    tab: '费用说明',
  }, {
    key: 'tab4',
    tab: '使用说明',
  }, {
    key: 'tab5',
    tab: '退改规则',
  }, {
    key: 'tab6',
    tab: '售前说明',
  }
];

@connect(state => ({
  respone: state.line_add,
  countrydata: state.city,
  supplydata: state.supply,
}))
@Form.create()
export default class BasicForms extends PureComponent {

  constructor(props) {
    super(props);
    this.fetchCountry = debounce(this.fetchCountry, 800);
  }

  state = {
    value: null,
    fetching: false,
    operationkey: 'tab1',
  }

  handleSubmit = (e) => {
    //e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        if (values.country) {//以这种值提交容易编辑时取值

        }
        const {respone, dispatch} = this.props;
        if (respone.update) {
          values.id = respone.update.id;
        }

        if (values.country) {
          values.countryId = values.country.key;
        }
        if (values.city) {
          values.cityId = values.city.key;
          values.cityName = values.city.label;
        }
        if (values.supply) {
          values.supplyId = values.supply.key;
          values.supplyName = values.supply.label;
        }
        // let str = '';
        // if (values.keyword) {
        //   values.keyword.map(function (item) {
        //     str += (str ? ',' : '') + item.label;
        //     return str
        //   });
        // }
        if (values.activeDay) {
          if (values.activeDay.length != 0) {
            values.startDay = values.activeDay[0].format(dateFormat);
            values.endDay = values.activeDay[1].format(dateFormat);
          } else {
            values.startDay = '';
            values.endDay = '';
          }
        }

        // dispatch({
        //   type: 'line_add/formSubmit',
        //   payload: values,
        // });
      }
    });
  }

  handleChange = (value) => {
    // this.setState({value, fetching: false,});
    this.props.form.setFieldsValue({country: value});
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  componentDidMount() {
    const {respone, form, dispatch} = this.props;
    if (respone.update) {
      //form.setFieldsValue(respone.update);
    }
    //获取下拉的供应商
    dispatch({
      type: 'supply/fetch',
      payload: {pageSize: 200, rowStart: 0, pageIndex: 1}
    });
    //获取货币下拉
    dispatch({
      type: 'line_add/getSelectArray',
      payload: 'currency_type'
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'supply_add/clear',
    // });
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({operationkey: key});
  }

  fetchCountry = (value) => {
    if (value) {
      this.props.dispatch({
        type: 'city/findCountry',
        payload: value
      });
    }
  }

  fetchkeyword = (value) => {
    if (value) {
      this.props.dispatch({
        type: 'line_add/routetagfindbyname',
        payload: value
      });
    }
  }

  postKeyword(body) {
    this.props.dispatch({
      type: 'line_add/tagAdd',
      payload: body
    });
  }

  handlekeywordChange = (keywordvalue) => {
    const {respone} = this.props;
    const {tag} = respone;
    const value = keywordvalue[keywordvalue.length - 1];
    console.log(tag, value);
    if (value) {
      if(value.key === value.label){
        console.log('添加数据库');
        value.name = value.label;
        this.postKeyword(value);
      }
    }
  }

  render() {
    const {keywordfetching} = this.state;
    const {respone, form, countrydata, supplydata} = this.props;
    const {select, loading, tag} = respone;
    const {country, fetching} = countrydata;//国家搜索
    const {data} = supplydata;//供应商搜索

    const {getFieldDecorator, getFieldsError} = form;
    const validate = () => {
      this.handleSubmit()
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon}/>
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{formfieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle"/>
          </Popover>
          {errorCount}
        </span>
      );
    };

    const contentList = {
      tab1: <Form.Item>
        {getFieldDecorator('routetab', {
          initialValue: `<h1>Yankees, Peeking at the Red Sox, Will Soon Get an Eyeful</h1>`
        })(
          <LineEditor key="routetab"/>
        )}
      </Form.Item>,
      tab2: <Form.Item>
        {getFieldDecorator('knowtab', {
          initialValue: `<h1>Will Soon Get an Eyeful</h1>`
        })(
          <LineEditor key="knowtab"/>
        )}
      </Form.Item>,
      tab3: <ReactEditor />,
      tab4: <ReactEditor />,
      tab5: <ReactEditor />,
      tab6: <ReactEditor />,
    };

    const gutter = 16;//每栏间隔
    const colLayout1 = {
      sm: {span: 24},
      md: {span: 12},
      lg: {span: 6},
    };//第一列
    const colLayout2 = {
      xl: {span: 6, offset: 2},
      lg: {span: 8},
      md: {span: 12},
      sm: {span: 24},
    };//第二列
    const colLayout3 = {
      xl: {span: 8, offset: 2},
      lg: {span: 10},
      md: {span: 24},
      sm: {span: 24},
    };//第三列

    return (
      <PageHeaderLayout title="线路信息提交" content="表单页用于向后台添加路线信息。">
        <Card title="氧气线路基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Form.Item label={formfieldLabels.oxCode}>
                  {getFieldDecorator('oxCode', {
                    rules: [{required: true, message: `请输入${formfieldLabels.oxCode}`}],
                  })(
                    <Input placeholder={`请输入${formfieldLabels.oxCode}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.oxName}>
                  {getFieldDecorator('oxName', {
                    rules: [{required: true, message: `请输入${formfieldLabels.oxName}`}],
                  })(
                    <Input placeholder={`请输入${formfieldLabels.oxName}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>
                <Form.Item label={formfieldLabels.keyword}>
                  {getFieldDecorator('keyword', {
                    //rules: [{required: true, message: `请输入${formfieldLabels.keyword}`}],
                  })(
                    <Select
                      showSearch
                      labelInValue
                      mode="tags"
                      placeholder={`请输入${formfieldLabels.keyword}`}
                      notFoundContent={keywordfetching ?
                        <Spin size="small"/> : '没有搜索到内容...'}
                      filterOption={false}
                      onSearch={this.fetchkeyword}
                      onChange={this.handlekeywordChange}
                      style={{width: '100%'}}
                    >
                      {(tag || []).map(d =>
                        <Option key={d.id}>{d.name}</Option>
                      )}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Row gutter={gutter}>
                  <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                    <Form.Item label={formfieldLabels.country}>
                      {getFieldDecorator('country', {
                        //rules: [{ required: true, message: '请选择国家' }],
                      })(
                        <Select
                          showSearch
                          labelInValue
                          allowClear={true}
                          placeholder={`请选择${formfieldLabels.country}`}
                          notFoundContent={fetching ? <Spin size="small"/> : '没有搜索到内容'}
                          filterOption={false}
                          onSearch={this.fetchCountry}
                          style={{width: '100%'}}
                        >
                          {(country || []).map(d => <Option key={d.value}>{d.name}</Option>)}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                    <Form.Item label={formfieldLabels.city}>
                      {getFieldDecorator('city', {
                        //rules: [{ required: true, message: '请选择审批员' }],
                      })(
                        <Select placeholder={`请选择${formfieldLabels.city}`}>
                          {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.oxPrice}>
                  {getFieldDecorator('oxPrice', {
                    rules: [{required: true, message: `请输入${formfieldLabels.oxPrice}`}],
                  })(
                    <InputNumber style={{width: '100%'}} addonAfter="RMB"
                                 placeholder={`请输入${formfieldLabels.oxPrice}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>

              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="供应商信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Form.Item label={formfieldLabels.supply}>
                  {getFieldDecorator('supply', {
                    rules: [{required: true, message: `请选择${formfieldLabels.supply}`}],
                  })(
                    <Select
                      showSearch
                      labelInValue
                      placeholder="请选择供应商"
                      allowClear={true}
                      optionFilterProp="children"
                      //onChange={this.handleSupplyChange}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {(data.list || []).map(d => <Option
                        key={d.id}>{d.name}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.productCode}>
                  {getFieldDecorator('productCode', {
                    //rules: [{required: true, message: `请输入${formfieldLabels.productCode}`}],
                  })(
                    <Input placeholder={`请输入${formfieldLabels.productCode}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>
                <Form.Item label={formfieldLabels.productName}>
                  {getFieldDecorator('productName', {
                    //rules: [{required: true, message: `请输入${formfieldLabels.productName}`}],
                  })(
                    <Input placeholder={`请输入${formfieldLabels.productName}`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Row gutter={16}>
                  <Col xl={{span: 15}} lg={{span: 15}} md={{span: 15}} sm={15}>
                    <Form.Item label={formfieldLabels.productPrice}>
                      {getFieldDecorator('productPrice', {
                        rules: [{required: true, message: `请输入${formfieldLabels.productPrice}`}],
                      })(
                        <InputNumber style={{width: '100%'}} placeholder={`请输入${formfieldLabels.productPrice}`}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xl={{span: 9}} lg={{span: 9}} md={{span: 9}} sm={9}>
                    <Form.Item label={formfieldLabels.productCurrency}>
                      {getFieldDecorator('productCurrency', {
                        //rules: [{ required: true, message: `选择${formfieldLabels.productCurrency}` }],
                      })(
                        <Select style={{width: '100%'}} placeholder={`${formfieldLabels.productCurrency}`}>
                          {(select || []).map(d => <Option key={d.val}>{d.name}</Option>)}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.productUrl}>
                  {getFieldDecorator('productUrl', {
                    //rules: [{required: true, message: `请输入${formfieldLabels.productUrl}`}],
                  })(
                    <Input placeholder={`请输入${formfieldLabels.productUrl}`}/>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>

              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="活动信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Form.Item label={formfieldLabels.activeDay}>
                  {getFieldDecorator('activeDay', {
                    initialValue: [moment(), moment()]
                  })(
                    <RangePicker
                      //size="large"
                      format={dateFormat}
                      placeholder={['开团日期', '截止日期']}
                      ranges={{
                        '全年': [moment().startOf('year'), moment().endOf('year')],
                        '上半年': [moment().startOf('year'), moment(`${moment().year()}-06-30`)],
                        '下半年': [moment(`${moment().year()}-07-01`), moment().endOf('year')],
                        '夏季(6,7,8,9)': [moment(`${moment().year()}-06-01`), moment(`${moment().year()}-09-30`)],
                        '冬季': [moment(`${moment().year()}-10-01`), moment(`${moment().year() + 1}-04-30`)],
                        '本月': [moment(), moment().endOf('month')],
                        '今天': [moment(), moment()]
                      }}
                      style={{width: '100%'}}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.openTime}>
                  {getFieldDecorator('openTime')(
                    <Input placeholder={`请输入${formfieldLabels.openTime}`}/>)}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>
                <Form.Item label={formfieldLabels.ativityTime}>
                  {getFieldDecorator('ativityTime')(
                    <Input placeholder={`请输入${formfieldLabels.ativityTime}`}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Form.Item label={formfieldLabels.durationStr}>
                  {getFieldDecorator('durationStr')(
                    <Input placeholder={`请输入${formfieldLabels.durationStr}`}/>)}
                </Form.Item>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.ageStr}>
                  {getFieldDecorator('ageStr')(
                    <Input placeholder={`请输入${formfieldLabels.ageStr}`}/>)}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>
                <Form.Item label={formfieldLabels.bookingStr}>
                  {getFieldDecorator('bookingStr')(
                    <Input placeholder={`请输入${formfieldLabels.bookingStr}`}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Form.Item label={formfieldLabels.shuttleType}>
                  {getFieldDecorator('shuttleType', {
                    initialValue: '1'
                  })(
                    <Select placeholder={`请选择${formfieldLabels.shuttleType}`}>
                      <Option value='1'>不含接送</Option>
                      <Option value='2'>指定区域接送</Option>
                      <Option value='3'>指定酒店接送</Option>
                      <Option value='4'>集合点</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.address}>
                  {getFieldDecorator('address', {
                    //rules: [{ required: true, message: `请输入${formfieldLabels.address}` }],
                  })(
                    <Input placeholder={`请输入${formfieldLabels.address}`}/>)}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>
                <Row gutter={gutter}>
                  <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                    <Form.Item label={formfieldLabels.latitude}>
                      {getFieldDecorator('latitude')(
                        <Input placeholder={`请输入${formfieldLabels.latitude}`}/>)}
                    </Form.Item>
                  </Col>
                  <Col xl={{span: 12}} lg={{span: 12}} md={{span: 12}} sm={12}>
                    <Form.Item label={formfieldLabels.longitude}>
                      {getFieldDecorator('longitude')(
                        <Input placeholder={`请输入${formfieldLabels.longitude}`}/>)}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="其他补充信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={gutter}>
              <Col {...colLayout1}>
                <Form.Item label={formfieldLabels.fixedPeriod}>
                  {getFieldDecorator('fixedPeriod', {
                    initialValue: '0'
                  })(
                    <Select placeholder={`请输入${formfieldLabels.fixedPeriod}`}>
                      <Option value='0'>不是</Option>
                      <Option value='1'>是</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout2}>
                <Form.Item label={formfieldLabels.routeType}>
                  {getFieldDecorator('routeType', {
                    initialValue: '0'
                  })(
                    <Select placeholder={`请输入${formfieldLabels.routeType}`}>
                      <Option value='0'>非多日游</Option>
                      <Option value='1'>多日游</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colLayout3}>
                <Form.Item label={formfieldLabels.outId}>
                  {getFieldDecorator('outId', {
                    //rules: [{required: true, message: `请输入${formfieldLabels.outId}`}],
                  })(
                    <Input placeholder={`该输入框不懂的不要录入(没错,就是你)`}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}
        </Card>

        <FooterToolbar>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={loading}>
            提交
          </Button>
        </FooterToolbar>

      </PageHeaderLayout>
    );
  }
}
