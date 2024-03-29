import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

export default class JoblyApi {
  static async request(endpoint, paramsOrData = {}, verb = "get") {

    paramsOrData._token = localStorage.getItem('token');

    console.debug("API Call:", endpoint, paramsOrData, verb);
    console.debug("API url:", `${BASE_URL}${endpoint}` );
    try {
      return (await axios({
        method: verb,
        url: `${BASE_URL}${endpoint}`,
        [verb === "get" ? "params" : "data"]: paramsOrData
      })).data;
      // axios sends query string data via the "params" key,
      // and request body data via the "data" key,
      // so the key we need depends on the HTTP verb
    }

    catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async loginUser(username, password) {
    let res = await this.request('login', {
      username: username || 'testuser',
      password: password || 'secret',
    }, 'post');
    return  [res.token, username];
  }

  /** Pulling data from API  */
  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  static async getCompanies() {
    let res = await this.request(`companies/`);
    return res.companies;
  }

  static async getJobs() {
    let res = await this.request('jobs');
    return res.jobs;
  }
  
  static async search(path, search) {
    let res = await this.request(`${path}?search=${search}`);
    return res[path];
  }

  static async registerUser(user){
    let res = await this.request(`users`, user, 'post');
    return [res.token, user.username];
  }
  
  static async updateUser(username, body){
    let res = await this.request(`users/${username}`,{...body}, 'patch');
    return res.user.username;
  }

  static async getUser(user){
    let res = await this.request(`users/${user}`);
    let {username, password, ...info} = res.user;
    return info;
  }

  static async applyToJob(jobid, username, state) {
    let body = {
      username, // user name
      state  // applied
    };
    let res = await this.request(`jobs/${jobid}/apply`, body, 'post');
    return res.message;
  }
  
}