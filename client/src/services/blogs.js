import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => {
  return token;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  // console.log(token);
  const request = await axios.get(baseUrl, config);
  return request.data;
};

const getOne = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  // console.log(id);
  // // console.log(token);
  const request = await axios.get(`${baseUrl}/${id}`, config);
  return request.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  // Remove the populated object field (e.g., "user") from the update data
  delete newObject.user;

  // console.log('update', newObject);
  const request = axios.patch(`${baseUrl}/${id}`, newObject, config);

  return request.then((response) => {
    // console.log('services/blogs.js', request);
    return response.data;
  });
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${id}`, config);
  return request.then((response) => response.data);
};

export default { getAll, getOne, create, update, remove, setToken, getToken };
