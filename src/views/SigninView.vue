<template>
    <div class="flex mt-4">
        <div class="max-w-md w-full">
            <div class="px-4">
                <h1 class="text-4xl font-bold mb-6">Signin</h1>
            </div>
            <form @submit.prevent="login" class="px-4 text-center">
                <div class="mb-2">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Username</span>
                        </div>
                        <input v-model="username" type="text" id="username"  placeholder="myuser" class="input input-bordered w-full" />
                    </label>
                </div>
                <div class="mb-6">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Password</span>
                        </div>
                        <input v-model="password" type="password" id="password" placeholder="****" class="input input-bordered w-full" />
                    </label>
                </div>
                <button type="submit" class="btn w-full">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
import { signin } from '../lib/api.js';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async login() {
            try{
                await signin(this.username, this.password)
                this.$emit('login-success') // Emit event after successful login
                this.$router.push('/')
            } catch (error) {
                console.log(error)
            }
        },
    },
};
</script>

<style>
/* Add any custom styles here */
</style>
