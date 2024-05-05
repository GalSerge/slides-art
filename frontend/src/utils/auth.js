import { useLocation, Navigate } from 'react-router-dom'

import { API_SERVER } from '@constants';


export let setToken = (access_token, token_type) => {
    let now = new Date();
    let expiry_time = now.getTime() + 3 * 3600 * 1000;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('token_type', token_type);
    localStorage.setItem('expiry_time', expiry_time.toString());
}

export let fetchToken = () => {
    if (!timeIsValid())
        return null;

    let access_token = localStorage.getItem('access_token');
    let token_type = localStorage.getItem('token_type');

    if (!access_token || !token_type)
        return null;
    else
        return {
            'access_token': access_token,
            'token_type': token_type
        };
}

function timeIsValid() {
    let now = new Date();
    let expiry_time = Number(localStorage.getItem('expiry_time'));

    if (now.getTime() > expiry_time) {
        clearAuthToken();

        return false;
    }

    return true;
}

export let clearAuthToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
}

export let getAuthUser = () => {
    let user = localStorage.getItem('auth_user');
    if (user != null)
        return JSON.parse(user);
    else {
        return null;
    }
}

export let setAuthUser = async () => {
    let user = await loadAuthUser();
    localStorage.setItem('auth_user', JSON.stringify(user));
}

export function RequireToken({ children }) {
    let token = fetchToken()
    let location = useLocation()

    if (!token) {
        return <Navigate to='/login' state={{ from: location }} />;
    }

    return children;
}

export let loadAuthUser = async () => {
    let token = fetchToken();

    if (token == null)
        return null;

    try {
        const response = await fetch(`${API_SERVER}/user`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok)
            return await response.json();
    } catch (e) {
        return null;
    }
    return null;
};