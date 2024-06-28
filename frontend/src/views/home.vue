<script setup>
import AttendanceChart from '../components/barChart.vue'
import { getAttendance, getClientsByZipCode } from '../api/api'
import { ref, onMounted } from "vue"
import { Chart } from 'chart.js';


// State management for pie chart data
const zips = ref([]);
const labels = ref([]);
const chartData = ref([23, 45, 30]);
const zipLabels = ref(["77084", "77077", "77041"]);
const zipChartData = ref([77084, 77077, 77041]);
const loading = ref(false);
const error = ref(null);
const zipLoading = ref(false);
const zipError = ref(null); 

// Labels and data for the attendance chart
const attendanceLabels = ref(['Event 1', 'Event 2', 'Event 3']);
const attendanceData = ref([23, 45, 30]);

// Function to create a pie chart
const createPieChart = async () => {
  try {
    const ctx = document.getElementById('pieChart').getContext('2d');
    await getZipData();
    const pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: zipLabels.value,
        datasets: [{
          label: 'Zip Codes',
          data: zipChartData.value,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: '' }
        }
      }
    });
  } catch (error) {
    console.error('Error creating pie chart:', error);
  }
};

// Execute createPieChart on component mount
onMounted(() => {
  createPieChart();
});

// Fetch data for pie chart
async function getZipData() {
  try {
    zipError.value = null;
    zipLoading.value = true;
    
    const zipdata = await getClientsByZipCode();
    zips.value = zipdata;
    zipLabels.value = zipdata.map(item => item._id);
    zipChartData.value = zipdata.map(item => item.count);
  } catch (err) {
    handleError(err, zipError);
  }
  zipLoading.value = false;
}

// Function to format date
function formatDate(date) {
  const isoDate = new Date(date);
  return `${isoDate.getUTCMonth() + 1}/${isoDate.getUTCDate()}/${isoDate.getUTCFullYear()}`;
}

// General error handling function
function handleError(err, errorRef) {
  if (err.response) {
    errorRef.value = { title: 'Server Response', message: err.message };
  } else if (err.request) {
    errorRef.value = { title: 'Unable to Reach Server', message: err.message };
  } else {
    errorRef.value = { title: 'Application Error', message: err.message };
  }
}
</script>

<!-- Home view with a dashboard and charts -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Dashboard</h1>
      <br />
      <!-- Grid container for layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-10 py-20">
        <div class="ml-10"></div>
        <div class="flex flex-col col-span-2">
          <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Clients by Zip Code</h1>
          <div>
            <canvas id="pieChart" width="400" height="400"></canvas>
          </div>
          <!-- Table of zip codes and client counts -->
          <table v-if="zips.length" class="min-w-full shadow-md rounded mt-6">
            <thead class="bg-gray-50 text-xl">
              <tr class="p-4 text-left">
                <th class="p-4 text-left">Zip Number</th>
                <th class="p-4 text-left">Client Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(label, index) in zipLabels" :key="index" class="p-4">
                <td>{{ label }}</td>
                <td>{{ zipChartData[index] }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Loading and error handling UI -->
          <div v-if="zips.length" class="flex justify-center mt-10">
            <div class="mt-40" v-if="zipLoading">
              <p class="text-6xl font-bold text-center text-gray-500 animate-pulse">Loading...</p>
            </div>
            <div class="mt-12 bg-red-50" v-if="zipError">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">{{ zipError.title }}</h3>
              <p class="p-4 text-lg font-bold text-red-900">{{ zipError.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
