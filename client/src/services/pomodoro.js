import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_BASE}/pomodoro`;

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getStats = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(`${baseUrl}/stats`, config);
  return response.data;
};

const getSessions = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(`${baseUrl}/sessions`, config);
  return response.data;
};

const createSession = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(`${baseUrl}/sessions`, newObject, config);
  return response.data;
};

export default { getStats, getSessions, createSession, setToken };
