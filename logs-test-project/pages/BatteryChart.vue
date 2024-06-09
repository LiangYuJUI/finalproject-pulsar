<template>
    <div id="battery-chart"></div>
    <button @click="randomizeBatteryLevel">隨機充電百分比</button>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';
  
  export default {
    setup() {
      const batteryLevel = ref(50);
  
      const randomizeBatteryLevel = () => {
        batteryLevel.value = Math.floor(Math.random() * 100) + 1;
        updateBatteryChart();
      };
  
      const updateBatteryChart = () => {
        const svg = d3.select('#battery-chart svg');
  
        const radius = 80;
        const cx = 100;
        const cy = 100;
  
        const pie = d3.pie().value(d => d);
        const data = [batteryLevel.value, 100 - batteryLevel.value];
  
        const arc = d3
          .arc()
          .innerRadius(radius - 10)
          .outerRadius(radius)
          .cornerRadius(10)
          .startAngle(-Math.PI / 2)
          .endAngle(Math.PI / 2);
  
        const arcs = svg
          .selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', (d, i) => (i === 0 ? 'green' : '#e0e0e0'))
          .attr('transform', `translate(${cx}, ${cy})`);
  
        const batteryLevelText = svg
          .append('text')
          .attr('x', cx)
          .attr('y', cy)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', '24px')
          .text(`${batteryLevel.value}%`);
  
        const updateBatteryLevel = () => {
          const newData = [batteryLevel.value, 100 - batteryLevel.value];
  
          arcs
            .data(pie(newData))
            .transition()
            .duration(500)
            .attr('d', arc);
  
          batteryLevelText.text(`${batteryLevel.value}%`);
        };
  
        return updateBatteryLevel;
      };
  
      onMounted(() => {
        const svg = d3
          .select('#battery-chart')
          .append('svg')
          .attr('viewBox', '0 0 200 200')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('preserveAspectRatio', 'xMidYMid meet');
  
        const updateBatteryChart = updateBatteryChart();
  
        updateBatteryChart();
      });
  
      return {
        randomizeBatteryLevel
      };
    }
  };
  </script>
  
  <style>
  #battery-chart {
    margin-bottom: 20px;
  }
  </style>
  