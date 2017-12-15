import request from '../utils/request';
import {BaseUrl} from './BaseUrl';

export async function getSelect(params) {
  return request(`${BaseUrl}/dict/findDictByType/${params}`);
}

export async function getCountry(params) {
  return request(`${BaseUrl}/country/findname/${params}`);
}

