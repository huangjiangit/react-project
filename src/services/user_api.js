import request from '../utils/request';
import {BaseUrl} from './BaseUrl';


export async function userLogin(params) {
  return request(`${BaseUrl}/user/login`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
