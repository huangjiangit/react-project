import request from '../utils/request';
import {BaseUrl} from './BaseUrl';

export async function routeFindById(params) {
  return request(`${BaseUrl}/order/find/`+params);
}

export async function orderFetch(params) {
  return request(`${BaseUrl}/order/get/`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function orderAddSubmit(params) {
  return request(`${BaseUrl}/order/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function orderUpdateSubmit(params) {
  return request(`${BaseUrl}/order/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
