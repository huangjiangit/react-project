import { cityFetch, cityAddSubmit, cityUpdateSubmit, cityDelete } from '../services/country_api';
import { getCountry } from '../services/utils_api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

function conversionList(list) {
  list.map(function (item,index) {
    item.key = index;
  });
  return list
}

export default {
  namespace: 'city',
  state: {
    data: {},
    loading: false,
    searchBody:{},
    update:{}
  },

  effects: {
    *fetch({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(cityFetch,payload);
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
    *formSubmit({payload}, { call, put }) {
      yield put({type: 'changeLoading', payload: true,});
      const action = payload.id?cityUpdateSubmit:cityAddSubmit;
      const response = yield call(action,payload);
      yield put({
        type: 'fetch',
        payload: payload.searchBody,
      });
    },
    *deleteCity({payload}, { call, put }) {
      const response = yield call(cityDelete,payload.id);
      yield put({
        type: 'fetch',
        payload: payload.searchBody,
      });
    },
    *findCountry({payload}, { call, put }) {
      yield put({
        type: 'save',
        payload: {fetching:true},
      });
      const response = yield call(getCountry,payload);
      const countryList = response.data.list.map(country => ({
        name: `${country.name}`,
        value: country.id,
      }));
      yield put({
        type: 'save',
        payload: { country:countryList,fetching:false},
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
    refresh(state, { payload }) {
      return {
        ...state,
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
        searchBody:{},
        update:{}
      };
    },
  },
};
