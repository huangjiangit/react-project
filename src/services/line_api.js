import request from '../utils/request';
import {BaseUrl} from './BaseUrl';

export async function routeFindById(params) {
  return request(`${BaseUrl}/route/find/`+params);
}

export async function routetagfindbyname(params) {
  return request(`${BaseUrl}/routetag/findbyname/`+params);
}

export async function routetagAdd(params) {
  return request(`${BaseUrl}/routetag/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function changeRouteStatus(params) {
  return request(`${BaseUrl}/route/changestatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function routeFetch(params) {
  return request(`${BaseUrl}/route/get/`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function routeAddSubmit(params) {
  return request(`${BaseUrl}/route/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function routeUpdateSubmit(params) {
  return request(`${BaseUrl}/route/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
