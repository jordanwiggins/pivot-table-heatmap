// Load the required libraries
const dscc = require('@google/dscc');
const local = require('./localMessage.js'); // For local development
const d3 = require('d3');

const isLocal = false; // Set to true for local testing

// Draw function to render the visualization
const drawViz = (data) => {
  const container = document.getElementById('vizContainer');
  container.innerHTML = ''; // Clear the container

  const table = d3.select(container)
    .append('table')
    .attr('style', 'border-collapse: collapse; width: 100%;');

  // Add headers
  const headers = table.append('thead').append('tr');
  data.fields.dimensions.forEach(dimension => {
    headers.append('th').text(dimension.name).attr('style', 'border: 1px solid #ddd; padding: 8px;');
  });
  data.fields.metrics.forEach(metric => {
    headers.append('th').text(metric.name).attr('style', 'border: 1px solid #ddd; padding: 8px;');
  });

  // Add rows with data
  const rows = table.append('tbody')
    .selectAll('tr')
    .data(data.rows)
    .enter()
    .append('tr');

  rows.each(function(rowData) {
    const row = d3.select(this);

    // Add dimensions
    rowData.dimensionValues.forEach(dimensionValue => {
      row.append('td').text(dimensionValue).attr('style', 'border: 1px solid #ddd; padding: 8px;');
    });

    // Add metrics with conditional formatting
    rowData.metricValues.forEach((metricValue, i) => {
      const value = metricValue;
      const maxValue = d3.max(data.rows, d => d.metricValues[i]);
      const minValue = d3.min(data.rows, d => d.metricValues[i]);

      const colorScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range(['#FFFFFF', '#FF0000']); // White to red gradient

      row.append('td')
        .text(value)
        .attr('style', `border: 1px solid #ddd; padding: 8px; background-color: ${colorScale(value)};`);
    });
  });
};

// Subscribe to the data updates from Looker Studio
if (isLocal) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}