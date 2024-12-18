Chart.register(ChartDataLabels);

function generateBubbleChart(selector, dictionnary_data_raw, minyear, maxyear, maxoccu) {
    var labels = [];
    let xdatamin = minyear - 1;
    let xdatamax = maxyear + 1;
    let ydatamin = 0;
    let ydatamax = maxoccu + 2;

    const chartConfig = {
        type: 'bubble',
        data: {
            datasets: dictionnary_data_raw,
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    suggestedMin: ydatamin,
                    suggestedMax: ydatamax,
                    ticks: {
                        display: true,
                        font: { size: 25 },
                    },
                    title: {
                        display: false,
                        text: 'Nb of occurences',
                        font: { size: 25 }
                    }
                },
                x: {
                    suggestedMin: xdatamin,
                    suggestedMax: xdatamax,
                    ticks: {
                        display: true,
                        font: { size: 25 },
                        callback: function(value, index, values) {
                            return Math.floor(value);  // Only show whole numbers (years)
                        },
                        stepSize: 1
                    },
                    title: {
                        display: false,
                        text: 'Year',
                        font: { size: 25 }
                    }
                }
            },
            events: ['mouseout'], // Remove 'click' from here
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: function(size) { return 25; }
                        },
                        filter: function(item, chart) {
                            return !item.text.includes('label');
                        }
                    }
                },
                datalabels: {
                    anchor: function(context) {
                        var value = context.dataset.data[context.dataIndex];
                        return value.v < 20 ? 'end' : 'center';
                    },
                    align: function(context) {
                        var value = context.dataset.data[context.dataIndex];
                        return value.v < 20 ? 'end' : 'center';
                    },
                    color: 'black',
                    font: {
                        weight: 'bold',
                        size: 25,
                    },
                    formatter: function(value) {
                        var display = value.display_custom;
                        if (display) {
                            return display == 'on' ? Math.round(value.v) : null;
                        }
                        else return Math.round(value.v);
                    },
                    offset: 1,
                    padding: 0
                },
                tooltip: { enabled: false }
            },

            // Core options
            layout: {
                padding: 30
            },
            elements: {
                point: {
                    radius: function(context) {
                        var value = context.dataset.data[context.dataIndex];
                        var size = context.chart.width;
                        var base = Math.abs(value.v) / 15;
                        return (size / 24) * base;
                    }
                }
            },
            // Disable animations
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            responsiveAnimationDuration: 0
        }
    };

    const ctx = document.querySelector(selector);
    const chart = new Chart(ctx.getContext('2d'), chartConfig);

    ctx.onclick = (evt) => {
      const points = chart.getElementsAtEventForMode(
        evt,
        'nearest',
        { intersect: true },
        true
      );
      if (points.length) {
          const firstPoint = points[0]
          const datasetPoint = firstPoint.datasetIndex;
          const dataPoint = firstPoint.index;
          if (chart.data.datasets[datasetPoint].data[dataPoint].label)
          {
              const software = document.getElementById("software_name")
              showSources(chart.data.datasets[datasetPoint].data[dataPoint].label, software.getAttribute("class"));
              showStructures(chart.data.datasets[datasetPoint].data[dataPoint].label);
              showAuthors(chart.data.datasets[datasetPoint].data[dataPoint].label);
          }
      }
    };
}

function showStructures(hal_id_list) {
    const uniqueStructures = new Set();

    hal_id_list.forEach(hal_id => {
        fetch(`/api/stru_id/${hal_id}`, {
            method: "GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(structure => {
                uniqueStructures.add(structure);
            });

            const uniqueStructuresArray = Array.from(uniqueStructures);

            // Clear previous content of structureContainer
            const container = document.getElementById('structureContainer');
            container.innerHTML = '';

            // Create <p> tags for each structure and append them to a container
            uniqueStructuresArray.forEach(structure => {
                const pTag = document.createElement('a');
                pTag.textContent = structure;
                pTag.href = `/dashboard/${structure}`;
                pTag.style.display = "block";
                container.appendChild(pTag);
            });
        })
        .catch(error => {
            console.error('Error fetching structures:', error);
        });
    });
}

function showAuthors(hal_id_list) {
    const uniqueStructures = new Set();

    hal_id_list.forEach(hal_id => {
        fetch(`/api/aut/${hal_id}`, {
            method: "GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(structure => {
                uniqueStructures.add(structure);
            });

            const uniqueStructuresArray = Array.from(uniqueStructures);

            // Clear previous content of structureContainer
            const container = document.getElementById('authorContainer');
            container.innerHTML = '';

            // Create <p> tags for each structure and append them to a container
            uniqueStructuresArray.forEach(structure => {
                const pTag = document.createElement('div');
                pTag.textContent = structure;
                pTag.style.display = "block";
                container.appendChild(pTag);
            });
        })
        .catch(error => {
            console.error('Error fetching structures:', error);
        });
    });
}

function showSources(hal_id_list, software) {
    let softwareName;
    if (software !== "") {
        softwareName = software;
    } else {
        softwareName = window.location.pathname.split('/').pop();
    }

    const container = document.getElementById('sourceContainer');
    container.innerHTML = ''; // Clearing the container before adding new elements

    hal_id_list.forEach(hal_id => {
        const pTag = document.createElement('a');
        pTag.textContent = hal_id;
        pTag.href = `/doc/${hal_id}/${softwareName}`; // Assuming you want the hal_id to link to its corresponding API
        pTag.style.display = "block";
        container.appendChild(pTag);
    });
}



function generateCircleChart(selector, value1, value2, value3) {
    const chartConfig = {
        type: 'pie',
        data: {
            labels: ["Used", "Created", "Shared"],
            datasets: [{
                backgroundColor: ["#6C9BCF", "#363949", "#677483"],
                data: [value1, value2, value3],
                borderWidth: 1,
                cutout: '20%',
            }]
        },
        options: {
            radius: 100,
            rotation: 180,
            hoverOffset: 4,
            responsive: false,
            animation: {
                animateScale: true
            },

            tooltips: {
                enabled: false
            },
            legend: {
                display: false
            }
        },

        plugins: [{
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;

                ctx.restore();
                ctx.font = 'bold 55px sans-serif';
                ctx.textAlign = 'center';
                chart.ctx.fillStyle = "black";
            },
        }]

    };

    const ctx = document.querySelector(selector);

    circleChart = new Chart(ctx.getContext('2d'), chartConfig);

}