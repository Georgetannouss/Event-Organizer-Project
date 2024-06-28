<template>
  <div class="w-1/2">
    <canvas class="p-10" ref="zipChart"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js'
import { onMounted, ref } from 'vue'

// Register the necessary Chart.js components
Chart.register(...registerables)

// Define props
const props = defineProps({
  label: Array,
  chartData: Array
})

// Use a ref to access the canvas element
const zipChart = ref(null)

// Use the onMounted lifecycle hook to initialize the chart when the component mounts
onMounted(() => {
  // Ensure the ref is set before trying to use it
  if (zipChart.value) {
    new Chart(zipChart.value, {
      type: 'doughnut',
      data: {
        labels: props.label,
        datasets: [
          {
            borderWidth: 1,
            data: props.chartData // Use the provided data
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false // Hide the legend
          },
          title: {
            display: true,
            text: 'Clients by Zip Code' // Set the chart title
          }
        },
        responsive: true,
        maintainAspectRatio: true
      }
    })
  }
})
</script>
