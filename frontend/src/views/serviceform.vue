<!-- This view allows for the creation of a new service -->
<script setup>
// Import necessary dependencies
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { createService } from '../api/api';

// Setup notifications
const toast = useToast();
const $router = useRouter();
const $route = useRoute();

// Define reactive service object
const service = ref({
    name: '',
    description: '',
    status: null,
});

// Setup validations
const validations = {
    service: {
        name: { required },
    }
}
const $v = useVuelidate(validations, service);

// Function to handle form submission
async function handleSubmitForm() {
    // $v.$validate();

    // if ($v.$error) {
    //     toast.error('Error creating new service: Form contains validation errors');
    //     return;
    // }

    try {
        const response = await createService(service.value);
        toast.success(response)
        $router.push('/findservice')
    } catch (error) {
        toast.error('Error creating new service:', error)
    }
}
</script>

<template>
    <main>
        <!-- Page Header -->
        <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
            Create Service
        </h1>
        <!-- Service Form -->
        <div class="px-10 py-20">
            <form @submit.prevent="handleSubmitForm">
                <!-- Service Details -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    <h2 class="text-2xl font-bold">Service Details</h2>
                    <!-- Service Name Input -->
                    <div class="flex flex-col">
                        <label class="block">
                            <span class="text-gray-700">Service Name</span>
                            <span style="color: #ff0000">*</span>
                            <input type="text"
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                v-model="service.name" />
                            <!-- Validation Error Message -->
                            <span v-if="$v.service.name.$error" class="text-red-500">
                                Service Name is required
                            </span>
                        </label>
                    </div>
                    <!-- Description Input -->
                    <div class="flex flex-col">
                        <label>
                            <span class="text-gray-700">Description:</span>
                            <textarea
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                v-model="service.description"></textarea>
                        </label>
                    </div>
                </div>
                <!-- Service Status Selection -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-10">
                    <div></div>
                    <div class="flex flex-col">
                        <label class="block">
                            <span class="text-gray-700">Service Status</span>
                            <span style="color: #ff0000">*</span>
                            <div class="mt-1">
                                <label class="inline-flex items-center">
                                    <input type="radio" class="form-radio" value="Active"
                                        v-model="service.status">
                                    <span class="ml-2">Active</span>
                                </label>
                                <label class="inline-flex items-center ml-6">
                                    <input type="radio" class="form-radio" value="Inactive"
                                        v-model="service.status">
                                    <span class="ml-2">Inactive</span>
                                </label>
                            </div>
                        </label>
                    </div>
                </div>
                <!-- Submit Button -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    <div></div>
                    <div class="flex justify-between mt-10 mr-20">
                        <button class="bg-red-700 text-white rounded" type="submit">
                            Add Service
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>
