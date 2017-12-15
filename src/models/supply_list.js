import { supplyFetch } from '../services/supply_api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

function conversionList(list) {
  list.map(function (item,index) {
    let str = '';
    let array = [] ;
    item.country = {};
    item.supplyArea.split(',').map(s => {
      if(s && s.split('@')[1]){
        str += (str?',':'') + s.split('@')[1] ;
        //解释供应商区域成Select能接受的值
        item.country.key = s.split('@')[0];
        item.country.label = s.split('@')[1];
      }
    });
    item.paymentType.split(',').map(d => {
      if(d){ array.push(d) }
    });
    item.key = index;
    item.supplyArea = str;
    item.paymentTypeArray = array;
    item.paymentType = switchPayType(item.paymentType);
  });
  return list
}

function switchPayType(array) {
  var myStatus = new Array();
  myStatus[1] = "信用卡";
  myStatus[2] = "paypal";
  myStatus[3] = "对公账号";
  myStatus[4] = "预付款";
  myStatus[5] = "月结";
  var str = "";
  array.split(',').map(function (dom,i) {
    str += (str == "" ? "" :(myStatus[dom] === undefined ? "" :""))+(myStatus[dom] === undefined ? "" : myStatus[dom]+",");
  });
  return str;
};

export default {
  namespace: 'supply',
  state: {
    data: {},
    loading: false,
    searchBody:{}
  },

  effects: {
    *fetch({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(supplyFetch,payload);
      message.success('操作成功.',1.5);
      response.data?conversionList(response.data.list):null;
      yield put({
        type: 'save',
        payload: {...response, searchBody:payload},
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *edit({payload}, { call, put }) {
      yield put(routerRedux.push('/supply_management/supply_add'));
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    clear(state) {
      return {
        data:{},
        loading: false,
        searchBody:{...state.searchBody}
      };
    },
  },
};
