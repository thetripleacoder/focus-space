import { createSlice } from '@reduxjs/toolkit';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
} from '../services/localStorage';
import blogService from '../services/blogs';
import userService from '../services/users';

const initialState = {
  loggedUser: loadFromLocalStorage('focus-space-loggedUser') || null,
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.loggedUser = action.payload;
    },
    logout(state) {
      state.loggedUser = null;
      state.users = [];
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setUser, logout, setUsers, setSelectedUser } = userSlice.actions;

export const initializeUsers = () => async (dispatch) => {
  const users = await userService.getAll();

  dispatch(setUsers(users));
};
export const loginUser = (userData) => async (dispatch) => {
  console.log('Logging in user:', userData);
  saveToLocalStorage('focus-space-loggedUser', userData);
  blogService.setToken(userData.token);
  dispatch(setUser(userData));
};

export const logoutUser = () => async (dispatch) => {
  removeFromLocalStorage('focus-space-loggedUser');
  blogService.setToken(null);
  dispatch(logout());
};

export default userSlice.reducer;
