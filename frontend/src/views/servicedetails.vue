<!-- This view allows a user to update a specific service's information. -->
<script setup>
// Core Vue and Router imports
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';

// Vuelidate for form validations
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

// API and store imports
import { getServiceById, getEventsByServiceId, updateService, deleteService } from '../api/api';
import { useLoggedInUserStore } from "../store/loggedInUser";

// Toast notifications setup
import { useToast } from 'vue-toastification';
const toast = useToast();
const router = useRouter();
const route = useRoute();

// Reactive state for service and related events
const service = ref({ name: '', description: '', status: null });
const events = ref([]);

// Variable to highlight the row user is hovering over
const hoverId = ref(null);

// Function setup for Vuelidate and user store
const v$ = useVuelidate();
const user = useLoggedInUserStore();

// Service validations
function validations() {
  return { service: { name: { required } } };
}

// Fetch service details and related events on component mount
onMounted(async () => {
  try {
    const [serviceResponse, eventsResponse] = await Promise.all([
      getServiceById(route.params.id),
      getEventsByServiceId(route.params.id),
    ]);
    service.value = serviceResponse;
    events.value = eventsResponse;
  } catch (error) {
    toast.error(error);
  }
});

// Date formatting for display
function formatDate(date) {
  const isoDate = new Date(date);
  return `${isoDate.getUTCMonth() + 1}/${isoDate.getUTCDate()}/${isoDate.getUTCFullYear()}`;
}

// Handle service update submission
async function submitServiceUpdate() {
  try {
    const response = await updateService(route.params.id, service.value);
    toast.success("Service Updated!");
    router.push('/findservice');
  } catch (error) {
    toast.error(error.message);
  }
}

// Handle service deletion
async function submitDeleteService() {
  if (events.value.length != 0) {
    toast.info('Service cannot be deleted since it is being used by events.');
    return;
  }
  try {
    const response = await deleteService(route.params.id);
    toast.success("Service Deleted");
    router.push('/findservice');
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}
</script>

<template>
  <main>
    <!-- Page header -->
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
      Service Details
    </h1>
    <!-- Service update form -->
    <div class="px-10 py-20">
      <!-- Service details input grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Service Details</h2>
        <!-- Service name input -->
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Service Name</span>
            <span style="color: #ff0000">*</span>
            <input type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="service.name" />
          </label>
        </div>
        <!-- Service description input -->
        <div class="flex flex-col">
          <label>
            <span class="text-gray-700">Description:</span>
            <textarea
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="service.description"></textarea>
          </label>
        </div>
      </div>
      <!-- Service status selection -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <div class="flex flex-col">
          <label class="block">
            <span class="text-gray-700">Service Status</span>
            <span style="color: #ff0000">*</span>
            <div class="mt-1">
              <label class="inline-flex items-center">
                <input type="radio" class="form-radio" value="Active" v-model="service.status">
                <span class="ml-2">Active</span>
              </label>
              <label class="inline-flex items-center ml-6">
                <input type="radio" class="form-radio" value="Inactive" v-model="service.status">
                <span class="ml-2">Inactive</span>
              </label>
            </div>
          </label>
        </div>
      </div>
      <!-- Service action buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <div></div>
        <div class="flex justify-between mt-20 mr-20">
          <button @click="submitServiceUpdate" type="submit" class="bg-green-700 disabled:opacity-50 text-white rounded"
            :disabled="user.role === 'user'">
            Update Service
          </button>
        </div>
        <div class="flex justify-between mt-20 mr-20">
          <button @click="submitDeleteService" type="submit" class="bg-red-700 disabled:opacity-50 text-white rounded"
            :disabled="user.role === 'user'">
            Delete Service
          </button>
        </div>
        <div class="flex justify-between mt-20 mr-20">
          <button type="reset" class="border border-red-700 bg-white text-red-700 rounded" @click="$router.back()">
            Go back
          </button>
        </div>
      </div>
    </div>
    <!-- Events table -->
    <hr class="mt-10 mb-10" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Events</h2>
        <h3 class="italic">Click table row to view event details</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Event Date</th>
              <th class="p-4 text-left">Event Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="router.push({name: 'eventdetails', params: { id: event._id } })" 
              v-for="event in events" :key="event._id" class="cursor-pointer"
              :class="{ 'hoverRow': hoverId === event._id }" @mouseenter="hoverId = event._id"
              @mouseleave="hoverId = null">
              <td class="p-2 text-left">{{ event.name }}</td>
              <td class="p-2 text-left">{{ formatDate(event.date) }}</td>
              <td class="p-2 text-left">{{ event.address.line1 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
