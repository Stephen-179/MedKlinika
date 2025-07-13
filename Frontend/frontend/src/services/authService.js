import API from './api';

export const login = async ( email, password) => {
    const {data} = await API.post('/auth/login', {email, password});
    if (data.token) {
        localStorage.setItem('user' , JSON.stringify(data));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('user');
};