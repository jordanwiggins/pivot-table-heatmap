const dscc = require('@google/dscc');
const d3 = require('d3');

// Check if the environment is local
const isLocal = false;

// Function to render the visualization
const drawViz = (data) => {
  const container = document.getElementById('vizContainer');
  container.innerHTML = ''; // Clear existing visualization

  const table = d3.select(container)
    .append('table')
    .attr('style', 'border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;');

  // Add table headers
  const headers = table.append('thead').append('tr');
  data.fields.dimensions.forEach(dimension => {
    headers.append('th').text(dimension.name).attr('style', 'border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;');
  });
  data.fields.metrics.forEach(metric => {
    headers.append('th').text(metric.name).attr('style', 'border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;');
  });

  // Add table rows
  const rows = table.append('tbody')
    .selectAll('tr')
    .data(data.tables.DEFAULT)
    .enter()
    .append('tr');

  rows.each(function(rowData) {
    const row = d3.select(this);

    // Add dimension values
    rowData.dimensionValues.forEach(dimensionValue => {
      row.append('td').text(dimensionValue).attr('style', 'border: 1px solid #ddd; padding: 8px;');
    });

    // Add metric values with column-specific heatmap formatting
    rowData.metricValues.forEach((metricValue, index) => {
      const metricColumn = data.tables.DEFAULT.map(row => row.metricValues[index]);
      const maxValue = Math.max(...metricColumn);
      const minValue = Math.min(...metricColumn);

      const colorScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range(['#FFFFFF', '#FF0000']); // Gradient from white to red

      row.append('td')
        .text(metricValue)
        .attr('style', `border: 1px solid #ddd; padding: 8px; background-color: ${colorScale(metricValue)};`);
    });
  });
};

// Subscribe to Looker Studio updates
if (isLocal) {
  drawViz(local.message); // For local testing
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
