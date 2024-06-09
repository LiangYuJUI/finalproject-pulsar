<template>
    <div>
        <div id="battery-chart" class="h-80"></div>
    </div>
    
    <button @click="randomizeBatteryLevel">隨機充電百分比</button>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';
  
  const batteryLevel = ref(50);
  
  const randomizeBatteryLevel = () => {
    batteryLevel.value = Math.floor(Math.random() * 100) + 1;
    updateBatteryChart();
  };
  
  const updateBatteryChart = () => {
    const svg = d3.select('#battery-chart svg');
    const arc = d3.arc().innerRadius(70).outerRadius(80).cornerRadius(10);
    const path = svg.select('path');
    const batteryLevelText = svg.select('text');
    const colorScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range(['#ff8888', '#88ff88']);
  
    const pie = d3
      .pie()
      .value(d => d)
      .sort(null);
  
    const data = [batteryLevel.value, 100 - batteryLevel.value];
    const pieData = pie(data);
  
    path
      .data(pieData)
      .transition()
      .duration(500)
      .attrTween('d', d => {
        const interpolate = d3.interpolate(
          { startAngle: 0, endAngle: 0 },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        );
        return t => arc(interpolate(t));
      })
      .attr('fill', (d, i) => (i === 0 ? colorScale(batteryLevel.value) : '#e0e0e0'));
  
    batteryLevelText.text(`${batteryLevel.value}%`);
  };
  
  onMounted(() => {
    const svg = d3
      .select('#battery-chart')
      .append('svg')
      .attr('viewBox', '0 0 200 200')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMidYMid meet');
  
    svg.append('path').attr('transform', 'translate(100, 100)');
    svg
      .append('text')
      .attr('x', 100)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '24px');
  
    updateBatteryChart();
  });
  </script>
  
  <style>
  #battery-chart {
    margin-bottom: 20px;
  }
  </style>