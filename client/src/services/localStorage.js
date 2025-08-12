// utils/localStorageService.js
export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
