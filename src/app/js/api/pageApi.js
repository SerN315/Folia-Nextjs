import axios from 'axios';
import config from '../config.js';
const apiUrl = config.apiUrl;

export const getFooterData = () => {
  return axios.get(`${apiUrl}/footer`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const getFlashcardData = () => {
  return axios.get(`${apiUrl}/flashcard`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};