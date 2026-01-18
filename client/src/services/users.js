import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_API_BASE}/users`;

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const create = async (newUser) => {
  const request = await axios.post(baseUrl, newUser);
  return request.data;
};

const follow = async (userId) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(`${baseUrl}/${userId}/follow`, {}, config);
  return response.data;
};

const unfollow = async (userId) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${userId}/follow`, config);
  return response.data;
};

const getFollowers = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}/followers`);
  return response.data;
};

const getFollowing = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}/following`);
  return response.data;
};

const getFollowStats = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}/follow-stats`);
  return response.data;
};

export default {
  getAll,
  create,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getFollowStats,
  setToken,
};
