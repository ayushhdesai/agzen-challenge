document.addEventListener('DOMContentLoaded', function() {
    const statusIndicatorsDiv = document.getElementById('status-indicators');
    const imageContainer = document.getElementById('image-container');
    const ctx = document.getElementById('metric-history-chart').getContext('2d');

    // Setup the chart with empty data
    const dataPoints = [];
    const timeLabels = [];
    const metricHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Metric History',
                data: dataPoints,
                backgroundColor: 'rgba(0, 13, 0, 0.2)',
                borderColor: 'rgba(4, 217, 255, 1.0)',
                borderWidth: 1,
                lineTension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Time (sec)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Units'
                    }
                }
            },
            animation: {
                duration: 0
            },
            maintainAspectRatio: false
        }
    });

    // Mapping from CSV values to display labels
    const statusLabels = {
        speed: ['BAD', 'GOOD'],
        gpa: ['DOWN', 'UP'],
        boom: ['BAD', 'GOOD']
    };

    const images = ['image_1.png', 'image_2.png', 'image_3.png', 'image_4.png', 'image_5.png'];
    let currentImageIndex = 0;

    // Function to update the status indicators on the page
    function updateStatusIndicators(speed, gpa, boom) {
        // Update speed indicator
        const speedIndicator = document.getElementById('speed-indicator');
        speedIndicator.textContent = statusLabels.speed[speed];
        if (statusLabels.speed[speed] === 'GOOD') {
            speedIndicator.className = 'status-indicator good';
        } else {
            speedIndicator.className = 'status-indicator bad';
        }

        // Update gpa indiactor
        const gpaIndicator = document.getElementById('gpa-indicator');
        if (statusLabels.gpa[gpa] === 'UP') {
            gpaIndicator.innerHTML = '&#x2191; UP'; 
            gpaIndicator.className = 'status-indicator up';
        } else {
            gpaIndicator.innerHTML = '&#x2193; DOWN';
            gpaIndicator.className = 'status-indicator down';
        }
        
        // Update boom indicator
        const boomIndicator = document.getElementById('boom-indicator');
        boomIndicator.textContent = statusLabels.boom[boom];
        if (statusLabels.boom[boom] === 'GOOD') {
            boomIndicator.className = 'status-indicator good';
        } else {
            boomIndicator.className = 'status-indicator bad';
        }
    }

    // Function to show the next image with a smooth transition
    function showNextImage() {
        let nextImage = new Image();
        nextImage.onload = function() {
            imageContainer.style.backgroundImage = `url('${nextImage.src}')`;
            imageContainer.style.opacity = '1';
        };
        nextImage.src = `/static/${images[currentImageIndex]}`;
        imageContainer.style.opacity = '0';
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    // Function to fetch the latest data from the server and update the chart
    function fetchData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                // Update status indicators
                updateStatusIndicators(data.speed, data.gpa, data.boom);
                // Update the chart with new data
                updateChart(data.time, data.metric);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to update the live chart
    function updateChart(newTime, newMetric) {
        if (dataPoints.length > 50) {
            timeLabels.shift();
            dataPoints.shift();
        }
        timeLabels.push(newTime);
        dataPoints.push(newMetric);
        metricHistoryChart.update();
    }

    
    // Start the image slideshow
    setInterval(showNextImage, 3000); 

    // Start fetching data and updating indicators every 0.2 seconds
    setInterval(fetchData, 200);
});
