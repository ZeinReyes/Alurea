import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export const register = async ({ name, email, password }) => {
    const response = await axios.post(`${API}/register`, { name, email, password });
    return response.data;
};

export const login = async ({ email, password }) => {
    const response = await axios.post(`${API}/login`, { email, password });
    return response.data;
};

export const verifyOTP = async ({ email, otp }) => {
    const response = await axios.post(`${API}/verify-otp`, { email, otp });
    return response.data;
};

// NEW: Verify Cognito email
export const verifyEmailCognito = async ({ email, code }) => {
    const response = await axios.post(`${API}/verify-cognito-email`, { email, code });
    return response.data;
};
