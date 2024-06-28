<template>
  <div>
    <!-- Header displaying welcome message -->
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    <!-- Login form with non-reloading submission handling -->
    <form @submit.prevent="store.login(username, password)" novalidate="true">
      <!-- Username input field -->
      <div class="flex justify-center mt-10">
        <label>
          <span class="text-gray-700">Username</span>
          <span style="color: #ff0000">*</span>
          <input type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder v-model="username" />
        </label>
      </div>
      <!-- Password input field -->
      <div class="flex justify-center mt-10">
        <label>
          <span class="text-gray-700">Password</span>
          <span style="color: #ff0000">*</span>
          <input type="password"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder v-model="password" />
        </label>
      </div>
      <!-- Login button -->
      <div class="flex justify-center mt-10">
        <button class="bg-red-700 text-white rounded" type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loginUser } from '../api/api';
import { useLoggedInUserStore } from "../store/loggedInUser";

// Setup component state using Vue's reactive references
const username = ref('');
const password = ref('');
const error = ref(null);

// Access the global user store
const store = useLoggedInUserStore();

// Function to perform login using API call
async function login() {
  try {
    // Authenticate user
    const token = await loginUser(username.value, password.value);
    // Set user as logged-in
    store.isLoggedIn = true;
    // Redirect to home/dashboard page
    router.push('/');
  } catch (err) {
    // Handle errors
    error.value = err.message;
  }
}

// Export reactive data and functions for use in the template
const data = {
  username,
  password,
  login
};
</script>
