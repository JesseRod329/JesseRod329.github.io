let chart = null;
let filteredData = ratingsData;
let activeShow = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    initializeTable();
    calculateStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Show filter buttons
    document.querySelectorAll('.show-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.show-toggle').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeShow = e.target.getAttribute('data-show');
            filterData();
        });
    });
    
    // View toggle buttons
    document.getElementById('view-chart').addEventListener('click', () => {
        document.getElementById('chart-container').classList.remove('hidden');
        document.getElementById('table-container').classList.add('hidden');
        document.getElementById('view-chart').classList.add('active');
        document.getElementById('view-table').classList.remove('active');
        if (chart) {
            chart.update();
        }
    });
    
    document.getElementById('view-table').addEventListener('click', () => {
        document.getElementById('chart-container').classList.add('hidden');
        document.getElementById('table-container').classList.remove('hidden');
        document.getElementById('view-chart').classList.remove('active');
        document.getElementById('view-table').classList.add('active');
        updateTable();
    });
}

// Filter data based on selected show
function filterData() {
    if (activeShow === 'all') {
        filteredData = ratingsData;
    } else {
        filteredData = ratingsData;
    }
    
    updateChart();
    updateTable();
    calculateStats();
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('ratings-chart').getContext('2d');
    
    const datasets = [];
    
    if (activeShow === 'all' || activeShow === 'WWE') {
        datasets.push({
            label: 'WWE',
            data: ratingsData.map(d => d.WWE),
            borderColor: '#0066CC',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        });
    }
    
    if (activeShow === 'all' || activeShow === 'AEW') {
        datasets.push({
            label: 'AEW',
            data: ratingsData.map(d => d.AEW),
            borderColor: '#FF0000',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        });
    }
    
    if (activeShow === 'all' || activeShow === 'TNA') {
        datasets.push({
            label: 'TNA',
            data: ratingsData.map(d => d.TNA),
            borderColor: '#FFA500',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        });
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ratingsData.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' viewers';
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Cable Viewership (Thousands)',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Viewers (Thousands)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Update chart
function updateChart() {
    if (!chart) return;
    
    const datasets = [];
    
    if (activeShow === 'all' || activeShow === 'WWE') {
        datasets.push({
            label: 'WWE',
            data: filteredData.map(d => d.WWE),
            borderColor: '#0066CC',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        });
    }
    
    if (activeShow === 'all' || activeShow === 'AEW') {
        datasets.push({
            label: 'AEW',
            data: filteredData.map(d => d.AEW),
            borderColor: '#FF0000',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        });
    }
    
    if (activeShow === 'all' || activeShow === 'TNA') {
        datasets.push({
            label: 'TNA',
            data: filteredData.map(d => d.TNA),
            borderColor: '#FFA500',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
        });
    }
    
    chart.data.datasets = datasets;
    chart.update();
}

// Initialize table
function initializeTable() {
    updateTable();
}

// Update table
function updateTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    filteredData.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row.dateFormatted}</td>
            <td>${activeShow === 'all' || activeShow === 'WWE' ? row.WWE.toLocaleString() : '-'}</td>
            <td>${activeShow === 'all' || activeShow === 'AEW' ? row.AEW.toLocaleString() : '-'}</td>
            <td>${activeShow === 'all' || activeShow === 'TNA' ? row.TNA.toLocaleString() : '-'}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Calculate statistics
function calculateStats() {
    const wweValues = ratingsData.map(d => d.WWE);
    const aewValues = ratingsData.map(d => d.AEW);
    const tnaValues = ratingsData.map(d => d.TNA);
    
    const wweAvg = Math.round(wweValues.reduce((a, b) => a + b, 0) / wweValues.length);
    const aewAvg = Math.round(aewValues.reduce((a, b) => a + b, 0) / aewValues.length);
    const tnaAvg = Math.round(tnaValues.reduce((a, b) => a + b, 0) / tnaValues.length);
    
    const wweEl = document.getElementById('wwe-avg');
    const aewEl = document.getElementById('aew-avg');
    const tnaEl = document.getElementById('tna-avg');
    
    if (wweEl) wweEl.textContent = wweAvg.toLocaleString();
    if (aewEl) aewEl.textContent = aewAvg.toLocaleString();
    if (tnaEl) tnaEl.textContent = tnaAvg.toLocaleString();
}

