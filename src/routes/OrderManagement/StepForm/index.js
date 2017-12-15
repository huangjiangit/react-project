import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Steps, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import styles from '../style.less';

const { Step } = Steps;

@Form.create()
class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'step1-form': return 0;
      case 'step2-form': return 1;
      case 'step3-form': return 2;
      default: return 0;
    }
  }
  getCurrentComponent() {
    const componentMap = {
      0: Step1,
      1: Step2,
      2: Step3,
    };
    return componentMap[this.getCurrentStep()];
  }
  render() {
    const { form, stepFormData, submitting, dispatch } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const CurrentComponent = this.getCurrentComponent();
    return (
      <PageHeaderLayout title="下单操作" content="将客户信息提交给计调人员，请根据指导完成操作。">
        <Card bordered={false}>
          <div>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="基本信息" />
              <Step title="收款信息" />
              <Step title="完成" />
            </Steps>
            <CurrentComponent
              formItemLayout={formItemLayout}
              form={form}
              dispatch={dispatch}
              data={stepFormData}
              submitting={submitting}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
  stepFormData: state.order_add.step,
  submitting: state.order_add.stepFormSubmitting,
}))(StepForm);
