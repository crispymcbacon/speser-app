import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const user_id = ref(localStorage.getItem('user_id') || '');
    const username = ref(localStorage.getItem('username') || '');
    const first_name = ref(localStorage.getItem('first_name') || '');
    const family_name = ref(localStorage.getItem('family_name') || '');

    function setUser(user) {
        user_id.value = user.user_id;
        username.value = user.username;
        first_name.value = user.first_name;
        family_name.value = user.family_name;

        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('first_name', user.first_name);
        localStorage.setItem('family_name', user.family_name);
    }

    return { user_id, username, first_name, family_name, setUser }
});
