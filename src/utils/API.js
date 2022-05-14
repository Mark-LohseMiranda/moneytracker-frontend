import axios from "axios";
//local
// const URL_PREFIX = "http://localhost:3001";
//deploy
const URL_PREFIX = "https://mymoney-tracker-backend.herokuapp.com"

const API = {
  login: (usrData) => {
    return axios.post(`${URL_PREFIX}/api/user/login`, usrData);
  },
  signup: (usrData) => {
    return axios.post(`${URL_PREFIX}/api/user/signup`, usrData);
  },
  verify: (tkn) => {
    return axios.get(`${URL_PREFIX}/api/user/verify`, {
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    });
  },
  addTransaction: (data, tkn) => {
    return axios.post(`${URL_PREFIX}/api/transaction/add`, data, {
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    });
  },
  getAll: (tkn) => {
    return axios.get(`${URL_PREFIX}/api/transaction/getall`, {
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    });
  },
  getOne: (id, tkn) => {
    return axios.get(`${URL_PREFIX}/api/transaction/getone/${id}`, {
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    });
  },
  update: (data, id, tkn) => {
    return axios.put(`${URL_PREFIX}/api/transaction/${id}`, data, {
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    });
  },
  delete: (id, tkn) => {
    return axios.delete(`${URL_PREFIX}/api/transaction/${id}`, {
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    });
  },
};

export default API;
