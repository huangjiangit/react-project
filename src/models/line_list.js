import { routeFetch, changeRouteStatus } from '../services/line_api';
import { getSelect } from '../services/utils_api';
import { message } from 'antd';

function conversionList(list) {
  list.map(function (item,index) {
    // console.log(item.keyword);
    item.key = index;
  });
  return list
}


export default {
  namespace: 'line_list',
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
      const response = yield call(routeFetch,payload);
      message.success('操作成功.',1.5);
      response.data?conversionList(response.data.list):null;
      yield put({
        type: 'save',
        payload: {...response,searchBody:payload},
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *changestatus({payload}, { call, put }) {
      const response = yield call(changeRouteStatus,payload);
      yield put({
        type: 'fetch',
        payload: {...payload.searchBody},
      });
    },
    *getSelectArray({payload}, { call, put }) {
      const response = yield call(getSelect,payload);
      yield put({
        type: 'save',
        payload: {select:response.data},
      });
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
