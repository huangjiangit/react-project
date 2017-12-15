import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import BlankLayout from '../layouts/BlankLayout';

import Analysis from '../routes/Dashboard/Analysis';
import Monitor from '../routes/Dashboard/Monitor';
import Workplace from '../routes/Dashboard/Workplace';

import TableList from '../routes/List/TableList';
import CoverCardList from '../routes/List/CoverCardList';
import CardList from '../routes/List/CardList';
import FilterCardList from '../routes/List/FilterCardList';
import SearchList from '../routes/List/SearchList';
import BasicList from '../routes/List/BasicList';

import BasicProfile from '../routes/Profile/BasicProfile';
import AdvancedProfile from '../routes/Profile/AdvancedProfile';

import BasicForm from '../routes/Forms/BasicForm';
import AdvancedForm from '../routes/Forms/AdvancedForm';
import StepForm from '../routes/Forms/StepForm';
import Step2 from '../routes/Forms/StepForm/Step2';
import Step3 from '../routes/Forms/StepForm/Step3';

import Exception403 from '../routes/Exception/403';
import Exception404 from '../routes/Exception/404';
import Exception500 from '../routes/Exception/500';

import Success from '../routes/Result/Success';
import Error from '../routes/Result/Error';

import LineTableList from '../routes/LineManagement/LineTableList';
import LineAddForm from '../routes/LineManagement/LineAddForm';
import LineAdvancedProfile from '../routes/LineManagement/LineProfile/AdvancedProfile';

import OrderTableList from '../routes/OrderManagement/OrderTableList';

import StepForm1 from '../routes/OrderManagement/StepForm';
import StepForm2 from '../routes/OrderManagement/StepForm/Step2';
import StepForm3 from '../routes/OrderManagement/StepForm/Step3';

import SupplyTableList from '../routes/SupplyManagement/SupplyTableList';
import SupplyAdd from '../routes/SupplyManagement/SupplyAdd';

import CountryTableList from '../routes/DestinationManagement/CountryTableList';
import CityTableList from '../routes/DestinationManagement/CityTableList';

import Loginpro from '../routes/User/LoginPro';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [{
      name: '分析页',
      path: 'analysis',
      component: Analysis,
    }, {
      name: '监控页',
      path: 'monitor',
      component: Monitor,
    }, {
      name: '工作台',
      path: 'workplace',
      component: Workplace,
    }],
  }, {
    name: '表单页',
    path: 'form',
    icon: 'form',
    children: [{
      name: '基础表单',
      path: 'basic-form',
      component: BasicForm,
    }, {
      name: '分步表单',
      path: 'step-form',
      component: StepForm,
      children: [{
        path: 'confirm',
        component: Step2,
      }, {
        path: 'result',
        component: Step3,
      }],
    }, {
      name: '高级表单',
      path: 'advanced-form',
      component: AdvancedForm,
    }],
  }, {
    name: '列表页',
    path: 'list',
    icon: 'table',
    children: [{
      name: '查询表格',
      path: 'table-list',
      component: TableList,
    }, {
      name: '标准列表',
      path: 'basic-list',
      component: BasicList,
    }, {
      name: '卡片列表',
      path: 'card-list',
      component: CardList,
    }, {
      name: '搜索列表（项目）',
      path: 'cover-card-list',
      component: CoverCardList,
    }, {
      name: '搜索列表（应用）',
      path: 'filter-card-list',
      component: FilterCardList,
    }, {
      name: '搜索列表（文章）',
      path: 'search',
      component: SearchList,
    }],
  }, {
    name: '详情页',
    path: 'profile',
    icon: 'profile',
    children: [{
      name: '基础详情页',
      path: 'basic',
      component: BasicProfile,
    }, {
      name: '高级详情页',
      path: 'advanced',
      component: AdvancedProfile,
    }],
  }, {
    name: '结果',
    path: 'result',
    icon: 'check-circle-o',
    children: [{
      name: '成功',
      path: 'success',
      component: Success,
    }, {
      name: '失败',
      path: 'fail',
      component: Error,
    }],
  }, {
    name: '异常',
    path: 'exception',
    icon: 'warning',
    children: [{
      name: '403',
      path: '403',
      component: Exception403,
    }, {
      name: '404',
      path: '404',
      component: Exception404,
    }, {
      name: '500',
      path: '500',
      component: Exception500,
    }],
  },{
    name: '线路管理',
    icon: 'shop',
    path: 'line_management',
    children: [{
      name: '线路列表',
      path: 'line_list',
      component: LineTableList,
      children: [{
        path: 'lineAdvancedProfile',
        component: LineAdvancedProfile,
      }],
    },{
      name: '线路新增',
      path: 'line_add',
      component: LineAddForm,
    }, {
      path: 'lineAdvancedProfile',
      component: LineAdvancedProfile,
    }],
  },{
    name: '订单管理',
    icon: 'file-text',
    path: 'order_management',
    children: [{
      name: '订单列表',
      path: 'order_list',
      component: OrderTableList,
    },  {
      name: '下单操作',
      path: 'step1-form',
      component: StepForm1,
      children: [{
        path: 'step2-form',
        component: StepForm2,
      }, {
        path: 'step3-form',
        component: StepForm3,
      }],
    },{
      name: '订单新增',
      path: 'line_add',
      component: LineAddForm,
    }],
  },{
    name: '供应商管理',
    icon: 'bank',
    path: 'supply_management',
    children: [{
      name: '供应商列表',
      path: 'supply_list',
      component: SupplyTableList,
    },{
      name: '供应商新增',
      path: 'supply_add',
      component: SupplyAdd,
    },],
  },{
    name: '目的地管理',
    icon: 'global',
    path: 'destination_management',
    children: [{
      name: '国家列表',
      path: 'country_list',
      component: CountryTableList,
    },{
      name: '城市列表',
      path: 'city_list',
      component: CityTableList,
    }],
  }],
},{
  component: UserLayout,
  layout: 'UserLayout',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: Login,
    }, {
      name: '注册',
      path: 'register',
      component: Register,
    }, {
      name: '注册结果',
      path: 'register-result',
      component: RegisterResult,
    }, {
      name: '氧气登陆',
      path: 'loginpro',
      component: Loginpro,
    }],
  }],
}, {
  component: BlankLayout,
  layout: 'BlankLayout',
  children: {
    name: '使用文档',
    path: 'http://pro.ant.design/docs/getting-started',
    target: '_blank',
    icon: 'book',
  },
}];

export function getNavData() {
  return data;
}

export default data;
