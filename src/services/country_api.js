import request from '../utils/request';
import {BaseUrl} from './BaseUrl';


export async function countryFetch(params) {
  return request(`${BaseUrl}/country/get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cityFetch(params) {
  return request(`${BaseUrl}/city/get`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cityAddSubmit(params) {
  return request(`${BaseUrl}/city/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cityDelete(params) {
  return request(`${BaseUrl}/city/delete/${params}`);
}

export async function cityUpdateSubmit(params) {
  return request(`${BaseUrl}/city/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function countryAddSubmit(params) {
  return request(`${BaseUrl}/supply/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function countryUpdateSubmit(params) {
  return request(`${BaseUrl}/supply/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


