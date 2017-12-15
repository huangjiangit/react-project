import { countryFetch } from '../services/country_api';
import { getCountry } from '../services/utils_api';
import { routerRedux } from 'dva/router';

function conversionList(list) {
  list.map(function (item,index) {
    item.key = index;
  });
  return list
}

export default {
  namespace: 'country',
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
      const response = yield call(countryFetch,payload);
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
        searchBody:{}
      };
    },
  },
};
