import VueCookies from 'vue-cookies';
import { useUserStore } from '../lib/stores.js';

const api_url = 'http://192.168.1.51:3000/api';

function sendGETRequest(url) {
    return fetch(api_url+url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${VueCookies.get('jwt')}`,
        },
    });
}

function sendPOSTRequest(url, body) {
    return fetch(api_url+url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${VueCookies.get('jwt')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}

function sendPUTRequest(url, body) {
    return fetch(api_url+url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${VueCookies.get('jwt')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}

// ------ Auth -------------------------------------------------------------------
export async function signin(username, password) {
    try {
        const response = await fetch(`${api_url}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        // Set the user in the store
        const userStore = useUserStore();
        userStore.setUser(data.user); 

        console.log(data); // DELETE ME
        console.log(userStore); // DELETE ME
        console.log(userStore.username); // DELETE ME

        // Save the JWT token to a cookie
        VueCookies.set('jwt', data.accessToken);

        // Return success
        return { status: 'success', message: 'Login successful' };
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function signup(username, first_name, last_name, password) {
    try {
        const response = await fetch(`${api_url}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                first_name: first_name,
                last_name: last_name,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        // Save the JWT token to a cookie
        VueCookies.set('jwt', data.accessToken);

        console.log('Success:', data); // DELETE ME
    } catch (error) {
        console.error('Error:', error);
    }
}

// ------ Expenses ---------------------------------------------------------------
export async function getExpenses(year, month) {
    try {
        let url = '/budget';
        if (year && month) {
            url += `/${year}/${month}`;
        } else if (year) {
            url += `/${year}`;
        }
        const response = await sendGETRequest(url);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function addExpense(year, month, user_id, description, category_id, total_cost, users) {
    try{
        const response = await sendPOSTRequest(`/budget/${year}/${month}`, {
            user_id: user_id,
            description: description,
            category_id: category_id,
            total_cost: total_cost,
            users: users,
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getExpense(year, month, id) {
    try {
        const response = await sendGETRequest(`/budget/${year}/${month}/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function updateExpense(year, month, id, user_id, description, category_id, total_cost, users, date) {
    try {
        const response = await sendPUTRequest(`/budget/${year}/${month}/${id}`, {
            user_id: user_id,
            description: description,
            category_id: category_id,
            total_cost: total_cost,
            users: users,
            expense_id: id,
            date: date,
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }

}
// ------ Balance ----------------------------------------------------------------
export async function getBalance() {
    try {
        const response = await sendGETRequest('/balance');
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getBalanceToUser(id) {
    try {
        const response = await sendGETRequest(`/balance/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// ------ Search -----------------------------------------------------------------

export async function searchUser(query){
    try {
        const response = await sendGETRequest(`/users/search?q=${query}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function searchExpense(query){
    try {
        const response = await sendGETRequest(`/budget/search?q=${query}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function searchUsersOfExpense(query){
    try {
        const response = await sendGETRequest(`/categories/search?q=${query}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}
// ------ Categories -------------------------------------------------------------

export async function getCategories() {
    try {
        const response = await sendGETRequest('/categories');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}