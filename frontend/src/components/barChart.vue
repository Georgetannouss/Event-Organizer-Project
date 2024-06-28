<template>
  <div>
    <canvas class="p-10" ref="attendanceChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js'
import { Colors } from 'chart.js';

Chart.register(...registerables)
Chart.register(Colors);

const props = defineProps({
  label: Array,
  chartData: Array,
});

const attendanceChart = ref(null);

onMounted(() => {
  if (attendanceChart.value) {
    new Chart(attendanceChart.value, {
      type: 'bar',
      data: {
        labels: props.label,
        datasets: [
          {
            borderWidth: 1,
            data: props.chartData,
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            gridLines: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Attendance Chart',
          },
        },
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }
});
</script>
