<template>
    <div class="flex mt-4">
        <div class="max-w-md w-full">
            <div class="px-4">
                <h1 class="text-4xl font-bold mb-6">Signup</h1>
            </div>
            <form @submit.prevent="register" class="px-4 text-center">
                <div class="mb-2">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">First Name</span>
                        </div>
                        <input v-model="firstName" type="text" id="firstName" placeholder="Mario" class="input input-bordered w-full" />
                    </label>

                    <div v-if="errors.firstName" class="text-red-500 text-sm text-right mt-1">{{ errors.firstName }}</div>
                </div>
                <div class="mb-2">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Last Name</span>
                        </div>
                        <input v-model="lastName" type="text" id="lastName" placeholder="Rossi" class="input input-bordered w-full" />
                    </label>
                    <!-- Add this line to display last name errors -->
                    <div v-if="errors.lastName" class="text-red-500 text-sm text-right mt-1">{{ errors.lastName }}</div>
                </div>

                <!-- Username field with errors -->
                <div class="mb-2">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Username</span>
                        </div>
                        <input v-model="username" type="text" id="username" placeholder="myuser" class="input input-bordered w-full" />
                    </label>
                    <!-- Add this line to display username errors -->
                    <div v-if="errors.username" class="text-red-500 text-sm text-right mt-1">{{ errors.username }}</div>
                </div>

                <!-- Password field with errors -->
                <div class="mb-6">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Password</span>
                        </div>
                        <input v-model="password" type="password" id="password" placeholder="****" class="input input-bordered w-full" />
                    </label>
                    <!-- Add this line to display password errors -->
                    <div v-if="errors.password" class="text-red-500 text-sm text-right mt-1" v-html="errors.password.join('<br />')"></div>
                </div>

                <button type="submit" class="btn w-full">Register</button>
            </form>
        </div>
    </div>
</template>

<script>
import { signup } from '../lib/api.js';
import { validateRegistrationInput } from '../lib/utils.js';
import { useToast } from "vue-toastification";

export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            errors: {}
        };
    },
    methods: {
        async register() {
            const result = await validateRegistrationInput(this.username, this.firstName, this.lastName, this.password);
            if (result.status === 'validated') {
                await signup(this.username, this.firstName, this.lastName, this.password);
                // Consider redirecting the user after successful registration
                this.$router.push('/signin');
                const $toast = useToast();
                $toast.success("Done! Now you can login", {
                    hideProgressBar: true,
                });
            } else {
                // Map the errors to the corresponding fields
                console.log(result.errors);
                this.errors = result.errors.reduce((acc, error) => {
                    if (error.field === 'password') {
                        if (!acc[error.field]) {
                            acc[error.field] = [];
                        }
                        acc[error.field].push(error.message);
                    } else {
                        acc[error.field] = error.message;
                    }
                    return acc;
                }, {});
            }
        },
    },
};
</script>