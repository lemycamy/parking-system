import axios from axios;

export const loginUser = async (credentials) => {
  // credentials = { email, password }
  const response = await axios.post("/auth/login", credentials);
  return response;
};
