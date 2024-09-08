import axios from "axios";
import config from "../config.js";
const apiUrl = config.apiUrl;

export const getDatabase = (database, body) => {
  return axios
    .post(`${apiUrl}/databases/${database}`, body)
    .then((response) => {
      return response.data.results;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};
export const getDatabase2 = (database) => {
  return axios
    .get(`${apiUrl}/databases/${database}`)
    .then((response) => {
      return response.data.results;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};
