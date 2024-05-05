import { fetchToken } from '@utils/auth';

import { API_SERVER } from '@constants';


export let loadUsersList = async () => {
    let token = fetchToken();

    if (token == null)
        return null;

    try {
        const response = await fetch(`${API_SERVER}/users`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok)
            return await response.json();
        else
            return null;
    } catch (e) {
        return null;
    }
}

export let deleteUser = async (id) => {
    let token = fetchToken();

    if (token == null)
        return false;

    try {
        const response = await fetch(`${API_SERVER}/users/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        return response.ok;
    } catch (e) {
        return false;
    }
}

export let createNewUser = async (form) => {
    let token = fetchToken();

    if (token == null)
        return null;

    var data = {};
    form.forEach((value, key) => data[key] = value);

    try {
        const response = await fetch(`${API_SERVER}/users/create`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok)
            return await response.json();
        else
            return null;
    } catch (e) {
        return null;
    }
}