let charts = document.querySelectorAll(".resultChart");

window.onload = window.location.reload;

for (let i of charts) {
    let data = JSON.parse(i.dataset.answers);

    new Chart(i, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    'rgba(34, 177, 76, 0.8)',
                    'rgba(237, 28, 36, 0.8)',
                    'rgba(255, 124, 62, 0.8)',
                    'rgba(143, 67, 141, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#fff',
                        fontSize: 15,
                        padding: 5
                    },
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#fff',
                        fontSize: 15
                    },
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }],
            },
            legend: {
                display: false
            },
	    responsive: true
        }
    });
}
