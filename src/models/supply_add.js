import { supplyFetch ,supplyAddSubmit,supplyUpdateSubmit} from '../services/supply_api';
import { getSelect,getCountry} from '../services/utils_api';
import { routerRedux } from 'dva/router';


export default {
  namespace: 'supply_add',
  state: {
    data: {},
    loading: false,
  },

  effects: {
    *getCountryArray({payload}, { call, put }) {
      const response = yield call(getCountry,payload);
      yield put({
        type: 'save',
        payload: {country:response.data.list},
      });
    },
    *getSelectArray({payload}, { call, put }) {
      const response = yield call(getSelect,payload);
      yield put({
        type: 'save',
        payload: {select:response.data},
      });
    },
    *formSubmit({payload}, { call, put }) {
      yield put({type: 'changeLoading', payload: true,});
      const action = payload.id?supplyUpdateSubmit:supplyAddSubmit;
      const response = yield call(action,payload);
      console.log(response);//TypeError: Failed to fetch
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      yield put(routerRedux.push('/supply_management/supply_list'));
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
    clear() {
      return {
        data:{},
        loading: false,
      };
    },
  },
};
