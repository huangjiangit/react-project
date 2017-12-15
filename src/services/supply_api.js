import request from '../utils/request';
import {BaseUrl} from './BaseUrl';

export async function routeFetch(params) {
  return request(`${BaseUrl}/supply/get/`+params);
}

export async function supplyFetch(params) {
  return request(`${BaseUrl}/supply/get/`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function supplyAddSubmit(params) {
  return request(`${BaseUrl}/supply/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function supplyUpdateSubmit(params) {
  return request(`${BaseUrl}/supply/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function supplyTest() {
  return request('/api/test');
}

