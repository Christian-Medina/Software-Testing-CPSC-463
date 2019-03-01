import axios from 'axios';
import config from '../config';

/**
 * Service to standardize requests to the API
 */
class ApiService {

  static services = config.api.services;

  static getBase() {
    const {proto, host, basePath} = config.api;
    return `${proto}://${host}${basePath}`;
  }

  static getService(service){
    return ApiService.getBase() + service;
  }

  static players() {
    return ApiService.getService(ApiService.services.players);
  }
  static cards() {
    return ApiService.getService(ApiService.services.cards);
  }
  static decks() {
    return ApiService.getService(ApiService.services.decks);
  }
  static games() {
    return ApiService.getService(ApiService.services.games);
  }

  static getData(resp){ return resp.data; }

  static post(url, data) {
    return axios.post(url, data).catch(ApiService.handleErrors).then(ApiService.getData);
  }

  static get(url) {
    return axios.get(url).catch(ApiService.handleErrors).then(ApiService.getData);
  }

  static delete(url){
    return axios.delete(url).catch(ApiService.handleErrors).then(ApiService.getData);
  }

  static put(url, data){
    return axios.put(url, data).catch(ApiService.handleErrors).then(ApiService.getData);
  }

  static handleErrors(err) {
    const {code, name, message} = err.response.data;
    console.error(`API Error: ${code} ${name} - ${message}`);
    throw err;
  }
}

export default ApiService;
