import axios from 'axios';
import config from './config';
import { getAuthUser } from '../src/components/Common';
export const userService = {
  post,
  login,
  get,
  uploadImage,
};
let cachedToken;
async function post(apiEndpoint, payload) {
  try {
    const response = await axios
      .post(`${config.nodeUrl}` + apiEndpoint, payload, await getOptions());
    return response;
  } catch (err) {
    if (err.response !== undefined && err.response.status === 401) {
      console.error(err);
    } else {
      console.error(err);
    }
    return err;
  }
}
async function uploadImage(apiEndpoint, payload) {
  try {
    const response = await axios
      .post(config.nodeUrl + apiEndpoint, payload, getOptionImage());
    return response;
  } catch (err) {
    console.error(err);
    if (err.response !== undefined && err.response.status === 401) {
      console.error(err);
    } else {
      console.error(err);
    }
    return err;
  }
}
async function get(apiEndpoint) {
  try {
    const response = await axios
      .get(`${config.nodeUrl}` + apiEndpoint,await getOptions());
    return response;
  } catch (err) {
   
    if (err.response !== undefined && err.response.status === 401) {
      console.error(err);
    } else {
      console.error(err);
    }
    return err;
  }
}
async function login(apiEndpoint, payload) {
  try {
    const response = await axios
      .post(config.nodeUrl + apiEndpoint, payload, getOptionsLogin());
    return response;
  } catch (err) {
    console.error(err);
    if (err.response !== undefined && err.response.status === 401) {
      console.error(err);
    } else {
      console.error(err);
    }
    return err;
  }
}
async function getOptions() {
  if (!cachedToken) {
    cachedToken = getAuthUser();
  }
  try {
    return {
      headers: {
        'Content-Type': 'application/json',
        token: cachedToken,
      },
    };
  } catch (error) {
    console.error('Error fetching token:', error);
    return null; // Or handle error differently, e.g., throw an error
  }
}
function getOptionsLogin() {
  var options = {};
  options.headers = {
    'Content-Type': 'application/json'
  };
}

function getOptionImage() {
  if (!cachedToken) {
    cachedToken = getAuthUser();
  }

  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: cachedToken
    }
  };
}