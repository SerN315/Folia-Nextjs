import axios from 'axios';

export const getAudio= function (word){
  return axios.get({
    url: `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/example}`,
    headers: {
      'X-RapidAPI-Key': '3b348803b4msh6cd665dad394a09p18e81djsn5381b615508d',
      'X-RapidAPI-Host': 'lingua-robot.p.rapidapi.com'
    }

  }).then((response) => {
    return response
  }).catch((error) => {
    console.error("Error:", error);
    throw error;
  });
}

