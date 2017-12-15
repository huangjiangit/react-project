import { routerRedux } from 'dva/router';
import { userLogin } from '../services/user_api';

function setStatus(response,payload) {
  if(response.code && response.code >= 200 && response.code < 300){
    response.status = 'ok';
    response.type = 'account';
    if(payload.remember){
      // console.log(response,payload);
      sessionStorage.setItem("loginName", payload.loginName);
      sessionStorage.setItem("password", payload.password);
      sessionStorage.setItem("remember", payload.remember);
    }
  }else{
    response.status = 'error';
    response.type = 'account';
  }
  return response
}

export default {
  namespace: 'loginpro',

  state: {
    status: undefined,
    avatar:'https://gw.alipayobjects.com/zos/rmsportal/KYlwHMeomKQbhJDRUVvt.png',
    imgMap : {
      user: 'https://gw.alipayobjects.com/zos/rmsportal/UjusLxePxWGkttaqqmUI.png',
      a: 'https://gw.alipayobjects.com/zos/rmsportal/ZrkcSjizAKNWwJTwcadT.png',
      b: 'https://gw.alipayobjects.com/zos/rmsportal/KYlwHMeomKQbhJDRUVvt.png',
      c: 'https://gw.alipayobjects.com/zos/rmsportal/gabvleTstEvzkbQRfjxu.png',
      d: 'https://gw.alipayobjects.com/zos/rmsportal/jvpNzacxUYLlNsHTtrAD.png',
    }
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(userLogin, payload);
      setStatus(response,payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, { put }) {
      yield put({
        type: 'clear',
        payload: {
          status: false,
        },
      });
      // sessionStorage.removeItem('user');
      sessionStorage.clear();
      yield put(routerRedux.push('/user/loginpro'));
    },
  },

  reducers: {
    clear(state, { payload }) {
      return {
        ...payload
      };
    },
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
