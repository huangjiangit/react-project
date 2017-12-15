import { routeAddSubmit, routeUpdateSubmit, routetagfindbyname, routetagAdd } from '../services/line_api';
import { getSelect } from '../services/utils_api';
import { message } from 'antd';


export default {
  namespace: 'line_add',
  state: {
    data: {},
    loading: false,
    searchBody:{}
  },

  effects: {
    *formSubmit({payload}, { call, put }) {
      yield put({type: 'changeLoading', payload: true,});
      const action = payload.id?routeUpdateSubmit:routeAddSubmit;
      const response = yield call(action,payload);
      yield put({type: 'changeLoading', payload: false});
      // yield put(routerRedux.push('/line_management/line_list'));
    },
    *getSelectArray({payload}, { call, put }) {
      const response = yield call(getSelect,payload);
      yield put({
        type: 'save',
        payload: {select:response.data},
      });
    },
    *routetagfindbyname({payload}, { call, put }) {
      const response = yield call(routetagfindbyname,payload);
      yield put({
        type: 'save',
        payload: {tag:response.data},
      });
    },
    *tagAdd({payload}, { call, put }) {
      const response = yield call(routetagAdd,payload);
      message.success('标签添加成功.');
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
