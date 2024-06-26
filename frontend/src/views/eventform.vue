<!-- This view allows for the creation of a new event -->
<script setup>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { getServices, createEvent } from '../api/api'
import { useToast } from 'vue-toastification'
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router';

//Notifications
const toast = useToast();
const router = useRouter();

const event = ref({
  name : '',
 description : '',
 date : null,
 services : [],
 address : {
  line1: null,
  line2: null,
  city: null,
  county: null,
  zip: null
 },
  attendees : [],

});


function setup() {
  const v$ = useVuelidate();
  return { v$ };
}

if (!event.services || !Array.isArray(event.services)) {
  event.services = [];
}



function validations() {
    // validations
    const validDate = (value) => {
      const date = new Date(value)
      return !isNaN(date)
    }
  // prevents form submission if new event has a date before the current date
  const notBeforeToday = (value) => {
      const today = new Date()
      return value >= today.toISOString().split('T')[0]
    }

    return {
      event: {
        name: { required },
        date: {
          required,
          validDate,
          notBeforeToday
        },
      }
    }
  }


const v$ = useVuelidate(validations(), event);

const activeServices = ref([]);

onMounted(async () => {
  try {
    const response = await getServices();
    activeServices.value = response.filter(item => item.status === "Active");
    
  
  } catch (error) {
    toast.error(error.message);
  }
});


async function handleSubmitForm() {
  // Trigger validation
  // v$.$validate();

  if (v$.$error) {
    toast.error('Please fix input field errors')
    // Form is invalid, do not proceed
    return;
  }

  try {
    const response = await createEvent(event.value);
    router.push('/findevents')
    toast.success(response)
  } catch (error) {
    toast.error(error.message)
  }
};
</script>

<template>
  <main>
    <div>
      <!--Header-->
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Create New Event
      </h1>
    </div>
    <div class="px-10 py-20">
      <!--Form-->
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Event Details</h2>

          <!-- Event Name Input Field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Event Name</span>
              <span style="color: #ff0000">*</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.name" />
            </label>
            <!-- Validation error messages -->
            <span v-if="v$.event.name.$error" class="text-red-500">
              Event Name is required
            </span>
          </div>

          <!-- Date input field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Date</span>
              <span style="color: #ff0000">*</span>
              <input
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                v-model="event.date" type="date" />
            </label>
            <!-- Validation error messages -->
            <span v-if="v$.event.date.$error" class="text-red-500">
              <span v-if="v$.event.date.required.$invalid">
                Event Date is required
              </span>
              <span v-else-if="!v$.event.date.required.$invalid && v$.event.date.validDate.$invalid">
                Event Date must be a valid date
              </span>
              <span
                v-else-if="!v$.event.date.required.$invalid && !v$.event.date.validDate.$invalid && v$.event.date.notBeforeToday.$invalid">
                New Event Date cannot be in the past.
              </span>
            </span>
          </div>

          <div></div>
          <div></div>
          <!-- Description input field -->
          <div class="flex col-span-2 flex-col">
            <label class="block">
              <span class="text-gray-700">Description</span>
              <textarea
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="2"></textarea>
            </label>
          </div>
        </div>

        <!-- Services Offered at Event checkboxes -->
        <div>
              <!-- Check if activeServices has been populated with data before rendering -->
    <ul v-if="activeServices.value = !0" class="space-y-2">
      <!-- Render list items based on activeServices -->
      <li v-for="service in activeServices" :key="service._id" :data-service-id="service._id"
          class="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 transition-colors relative">
        <!-- Render checkboxes for each service -->
        <label class="block w-full h-full">
          <input type="checkbox" :id="service._id" :value="service._id"
          :checked="event.services && event.services.includes(service._id)" 
                      v-model="event.services"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50 mr-2">

          <span class="font-medium">{{ service.name }}</span>
        </label>
      </li>
    </ul>

<!--If there are no active services for the user's organization, this will appear instead of list of checkboxes-->
<p v-else class="text-gray-600">No Active Services Available</p>
</div>


        <!-- grid container -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <h2 class="text-2xl font-bold">Address</h2>
          <!-- Address 1 input field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 1</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.line1" />
            </label>
          </div>
          <!-- Address 2 input field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Address Line 2</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.line2" />
            </label>
          </div>
          <!-- City input field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">City</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.city" />
            </label>
          </div>
          <div></div>
          <!-- County input field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">County</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.county" />
            </label>
          </div>
          <!-- Zip code field -->
          <div class="flex flex-col">
            <label class="block">
              <span class="text-gray-700">Zip Code</span>
              <input type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder v-model="event.address.zip" />
            </label>
          </div>
        </div>

        <!--Add New Event submit button-->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <div></div>
          <div class="flex justify-between mr-20">
            <button class="bg-red-700 text-white rounded" type="submit">
              Add New Event
            </button>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
