// Waitress Stats functionality
let waitressData = [];
let waitressDataLoaded = false;
let charts = {};

// Auto-load CSV when page loads
function loadWaitressData() {
    if (waitressDataLoaded) return;

    fetch('data/waitress-data.csv')
        .then(response => {
            if (!response.ok) throw new Error('Could not load waitress-data.csv');
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    try {
                        waitressData = results.data.map(row => {
                            const dateParts = row.Date.split('/');
                            return {
                                date: new Date(dateParts[2], dateParts[0] - 1, dateParts[1]),
                                sales: parseFloat(row.Sales),
                                tips: parseFloat(row.Tips),
                                tipPercent: (parseFloat(row.Tips) / parseFloat(row.Sales)) * 100
                            };
                        }).filter(row => !isNaN(row.sales) && !isNaN(row.tips));

                        if (waitressData.length === 0) {
                            document.getElementById('stats-message').textContent = 'No valid data found in CSV';
                            return;
                        }

                        waitressDataLoaded = true;
                        document.getElementById('stats-message').classList.add('hidden');
                        document.getElementById('stats-content').classList.remove('hidden');

                        populateYearSelector();
                        updateThisDayInHistory();
                        updateYearStats();
                    } catch (error) {
                        document.getElementById('stats-message').textContent = 'Error parsing CSV: ' + error.message;
                    }
                }
            });
        })
        .catch(error => {
            document.getElementById('stats-message').innerHTML =
                'Error loading data: ' + error.message + '<br><span class="text-sm">Make sure waitress-data.csv is in the data folder</span>';
        });
}

function populateYearSelector() {
    const years = [...new Set(waitressData.map(d => d.date.getFullYear()))].sort((a, b) => b - a);
    const select = document.getElementById('year-select');
    select.innerHTML = '<option value="all">All Years</option>' + years.map(year => `<option value="${year}">${year}</option>`).join('');
}

function updateThisDayInHistory() {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    const matchingDays = waitressData.filter(d =>
        d.date.getMonth() === month && d.date.getDate() === day
    );

    if (matchingDays.length === 0) {
        document.getElementById('history-date').textContent = `${month + 1}/${day}`;
        document.getElementById('history-avg-tips').textContent = 'No data';
        document.getElementById('history-avg-percent').textContent = 'No data';
        document.getElementById('history-years').textContent = 'No historical data for this date';
        return;
    }

    const avgTips = matchingDays.reduce((sum, d) => sum + d.tips, 0) / matchingDays.length;
    const avgPercent = matchingDays.reduce((sum, d) => sum + d.tipPercent, 0) / matchingDays.length;
    const years = matchingDays.map(d => d.date.getFullYear()).join(', ');

    document.getElementById('history-date').textContent = `${month + 1}/${day}`;
    document.getElementById('history-avg-tips').textContent = `$${avgTips.toFixed(2)}`;
    document.getElementById('history-avg-percent').textContent = `${avgPercent.toFixed(1)}%`;
    document.getElementById('history-years').textContent = `Based on ${matchingDays.length} shifts in years: ${years}`;
}

function renderHeatmapCalendar(yearData, selectedValue) {
    const container = document.getElementById('heatmap-calendar');

    // Get years to display based on selection
    let years;
    if (selectedValue === 'all') {
        years = [...new Set(waitressData.map(d => d.date.getFullYear()))].sort((a, b) => a - b);
    } else {
        years = [parseInt(selectedValue)];
    }

    // Create a map of dates to tip amounts
    const dateToTips = {};
    waitressData.forEach(d => {
        const dateKey = `${d.date.getFullYear()}-${d.date.getMonth()}-${d.date.getDate()}`;
        dateToTips[dateKey] = d.tips;
    });

    // Calculate percentiles for color scaling
    const allTips = waitressData.map(d => d.tips).sort((a, b) => a - b);
    const getColor = (tips) => {
        if (!tips) return '#f3f4f6'; // gray-100 for no data

        // Calculate which quintile the tip amount falls into
        const percentile = allTips.filter(t => t <= tips).length / allTips.length;

        if (percentile < 0.2) return '#d1fae5'; // green-100
        if (percentile < 0.4) return '#6ee7b7'; // green-300
        if (percentile < 0.6) return '#10b981'; // green-500
        if (percentile < 0.8) return '#059669'; // green-600
        return '#047857'; // green-700
    };

    let html = '<div class="space-y-6">';

    // Render each year
    years.forEach(year => {
        html += `<div>`;
        html += `<div class="text-sm font-semibold text-gray-700 mb-2">${year}</div>`;
        html += `<div class="inline-block">`;

        // Month labels
        html += `<div class="flex" style="margin-left: 28px; margin-bottom: 4px;">`;
        const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let month = 0; month < 12; month++) {
            const firstDayOfMonth = new Date(year, month, 1);
            const dayOfWeek = firstDayOfMonth.getDay();
            const weeksInMonth = Math.ceil((new Date(year, month + 1, 0).getDate() + dayOfWeek) / 7);
            const monthWidth = (weeksInMonth * 12) + ((weeksInMonth - 1) * 1);
            html += `<div class="text-xs text-gray-500" style="width: ${monthWidth}px; text-align: center;">${monthAbbr[month]}</div>`;
        }
        html += `</div>`;

        // Calendar grid
        html += `<div class="flex gap-2">`;

        // Day of week labels
        html += `<div class="flex flex-col gap-1 text-xs text-gray-500 justify-between" style="width: 20px;">`;
        html += `<div style="height: 12px;"></div>`;
        html += `<div style="height: 12px;">Mon</div>`;
        html += `<div style="height: 12px;"></div>`;
        html += `<div style="height: 12px;">Wed</div>`;
        html += `<div style="height: 12px;"></div>`;
        html += `<div style="height: 12px;">Fri</div>`;
        html += `<div style="height: 12px;"></div>`;
        html += `</div>`;

        // Days grid
        html += `<div class="flex gap-1">`;

        // Start from the first day of the year
        const firstDay = new Date(year, 0, 1);
        let currentWeek = [];
        let currentDay = new Date(year, 0, 1);

        // Fill in empty cells before the first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            currentWeek.push({ empty: true });
        }

        // Fill in all days of the year
        while (currentDay.getFullYear() === year) {
            const dateKey = `${currentDay.getFullYear()}-${currentDay.getMonth()}-${currentDay.getDate()}`;
            const tips = dateToTips[dateKey];
            const color = getColor(tips);

            currentWeek.push({
                date: new Date(currentDay),
                tips: tips,
                color: color
            });

            // If Saturday (end of week), render the week
            if (currentDay.getDay() === 6) {
                // Render this week
                html += `<div class="flex flex-col gap-1">`;
                currentWeek.forEach(day => {
                    if (day.empty) {
                        html += `<div style="width: 12px; height: 12px;"></div>`;
                    } else {
                        const dateStr = `${day.date.getMonth() + 1}/${day.date.getDate()}/${day.date.getFullYear()}`;
                        const tipStr = day.tips ? `$${day.tips.toFixed(2)}` : 'No data';
                        html += `<div class="rounded-sm border border-gray-300" style="width: 12px; height: 12px; background-color: ${day.color};" title="${dateStr}: ${tipStr}"></div>`;
                    }
                });
                html += `</div>`;
                currentWeek = [];
            }

            currentDay.setDate(currentDay.getDate() + 1);
        }

        // Render any remaining days in the last incomplete week
        if (currentWeek.length > 0) {
            html += `<div class="flex flex-col gap-1">`;
            currentWeek.forEach(day => {
                if (day.empty) {
                    html += `<div style="width: 12px; height: 12px;"></div>`;
                } else {
                    const dateStr = `${day.date.getMonth() + 1}/${day.date.getDate()}/${day.date.getFullYear()}`;
                    const tipStr = day.tips ? `$${day.tips.toFixed(2)}` : 'No data';
                    html += `<div class="rounded-sm border border-gray-300" style="width: 12px; height: 12px; background-color: ${day.color};" title="${dateStr}: ${tipStr}"></div>`;
                }
            });
            html += `</div>`;
        }

        html += `</div>`; // End days grid
        html += `</div>`; // End flex container
        html += `</div>`; // End inline-block
        html += `</div>`; // End year container
    });

    html += '</div>';
    container.innerHTML = html;
}

function updateYearStats() {
    const yearSelect = document.getElementById('year-select');
    if (!yearSelect.value) {
        return;
    }

    const selectedValue = yearSelect.value;
    let yearData;

    if (selectedValue === 'all') {
        yearData = waitressData;
    } else {
        const selectedYear = parseInt(selectedValue);
        yearData = waitressData.filter(d => d.date.getFullYear() === selectedYear);
    }

    if (yearData.length === 0) {
        return;
    }

    const totalSales = yearData.reduce((sum, d) => sum + d.sales, 0);
    const totalTips = yearData.reduce((sum, d) => sum + d.tips, 0);
    const avgTips = totalTips / yearData.length;
    const avgPercent = (totalTips / totalSales) * 100;

    const bestTipAmount = yearData.reduce((best, current) =>
        current.tips > best.tips ? current : best
    );

    const bestTipPercent = yearData.reduce((best, current) =>
        current.tipPercent > best.tipPercent ? current : best
    );

    document.getElementById('year-total-sales').textContent = `$${totalSales.toLocaleString()}`;
    document.getElementById('year-total-tips').textContent = `$${totalTips.toLocaleString()}`;
    document.getElementById('year-avg-tips').textContent = `$${avgTips.toFixed(2)}`;
    document.getElementById('year-avg-percent').textContent = `${avgPercent.toFixed(1)}%`;

    const bestTipAmountStr = `${bestTipAmount.date.getMonth() + 1}/${bestTipAmount.date.getDate()}/${bestTipAmount.date.getFullYear()}`;
    document.getElementById('year-best-tips').textContent =
        `${bestTipAmountStr}: $${bestTipAmount.tips.toFixed(2)} in tips (${bestTipAmount.tipPercent.toFixed(1)}% on $${bestTipAmount.sales.toFixed(2)} sales)`;

    const bestTipPercentStr = `${bestTipPercent.date.getMonth() + 1}/${bestTipPercent.date.getDate()}/${bestTipPercent.date.getFullYear()}`;
    document.getElementById('year-best-percent').textContent =
        `${bestTipPercentStr}: ${bestTipPercent.tipPercent.toFixed(1)}% (${bestTipPercent.tips.toFixed(2)} tips on ${bestTipPercent.sales.toFixed(2)} sales)`;

    // Calculate monthly statistics
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthlyData = {};

    // Group data by month
    yearData.forEach(d => {
        const monthKey = `${d.date.getFullYear()}-${d.date.getMonth()}`;
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                month: d.date.getMonth(),
                year: d.date.getFullYear(),
                tips: [],
                sales: [],
                tipPercents: []
            };
        }
        monthlyData[monthKey].tips.push(d.tips);
        monthlyData[monthKey].sales.push(d.sales);
        monthlyData[monthKey].tipPercents.push(d.tipPercent);
    });

    // Calculate averages per month
    const monthlyAverages = Object.keys(monthlyData).map(key => {
        const data = monthlyData[key];
        const avgTips = data.tips.reduce((a, b) => a + b, 0) / data.tips.length;
        const avgTipPercent = data.tipPercents.reduce((a, b) => a + b, 0) / data.tipPercents.length;
        return {
            month: data.month,
            year: data.year,
            avgTips: avgTips,
            avgTipPercent: avgTipPercent,
            displayName: selectedValue === 'all' ? `${monthNames[data.month]} ${data.year}` : monthNames[data.month]
        };
    });

    if (monthlyAverages.length > 0) {
        // Best and worst by tips
        const bestMonthTips = monthlyAverages.reduce((best, current) =>
            current.avgTips > best.avgTips ? current : best
        );
        const worstMonthTips = monthlyAverages.reduce((worst, current) =>
            current.avgTips < worst.avgTips ? current : worst
        );

        // Best and worst by tip percentage
        const bestMonthPercent = monthlyAverages.reduce((best, current) =>
            current.avgTipPercent > best.avgTipPercent ? current : best
        );
        const worstMonthPercent = monthlyAverages.reduce((worst, current) =>
            current.avgTipPercent < worst.avgTipPercent ? current : worst
        );

        document.getElementById('year-best-month-tips').textContent =
            `${bestMonthTips.displayName}: $${bestMonthTips.avgTips.toFixed(2)}/day`;
        document.getElementById('year-best-month-percent').textContent =
            `${bestMonthPercent.displayName}: ${bestMonthPercent.avgTipPercent.toFixed(1)}%`;

        document.getElementById('year-worst-month-tips').textContent =
            `${worstMonthTips.displayName}: $${worstMonthTips.avgTips.toFixed(2)}/day`;
        document.getElementById('year-worst-month-percent').textContent =
            `${worstMonthPercent.displayName}: ${worstMonthPercent.avgTipPercent.toFixed(1)}%`;
    } else {
        document.getElementById('year-best-month-tips').textContent = 'No data';
        document.getElementById('year-best-month-percent').textContent = 'No data';
        document.getElementById('year-worst-month-tips').textContent = 'No data';
        document.getElementById('year-worst-month-percent').textContent = 'No data';
    }

    // Total days with data
    document.getElementById('year-total-days').textContent = `${yearData.length}`;

    // Calculate days by day of week
    const dayOfWeekCounts = {
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0  // Saturday
    };

    yearData.forEach(d => {
        const dayOfWeek = d.date.getDay();
        dayOfWeekCounts[dayOfWeek]++;
    });

    document.getElementById('days-sun').textContent = dayOfWeekCounts[0];
    document.getElementById('days-mon').textContent = dayOfWeekCounts[1];
    document.getElementById('days-tue').textContent = dayOfWeekCounts[2];
    document.getElementById('days-wed').textContent = dayOfWeekCounts[3];
    document.getElementById('days-thu').textContent = dayOfWeekCounts[4];
    document.getElementById('days-fri').textContent = dayOfWeekCounts[5];
    document.getElementById('days-sat').textContent = dayOfWeekCounts[6];

    // Update charts with the filtered data
    updateCharts(yearData);

    // Update heatmap calendar with the filtered data
    renderHeatmapCalendar(yearData, selectedValue);
}

// Calculate linear regression for trend line
function calculateTrendLine(data) {
    const n = data.length;
    const indices = data.map((_, i) => i);

    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return indices.map(x => slope * x + intercept);
}

function updateCharts(yearData) {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};

    // Calculate day of week averages
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData = {};

    dayNames.forEach(day => {
        dayData[day] = { tips: [], percents: [] };
    });

    yearData.forEach(d => {
        const dayName = dayNames[d.date.getDay()];
        dayData[dayName].tips.push(d.tips);
        dayData[dayName].percents.push(d.tipPercent);
    });

    const avgTipsByDay = dayNames.map(day => {
        const tips = dayData[day].tips;
        return tips.length > 0 ? tips.reduce((a, b) => a + b, 0) / tips.length : 0;
    });

    const avgPercentByDay = dayNames.map(day => {
        const percents = dayData[day].percents;
        return percents.length > 0 ? percents.reduce((a, b) => a + b, 0) / percents.length : 0;
    });

    // Tips by Day Chart
    const tipsByDayCanvas = document.getElementById('tips-by-day-chart');
    if (tipsByDayCanvas) {
        charts.tipsByDay = new Chart(tipsByDayCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: dayNames,
                datasets: [{
                    label: 'Average Tips',
                    data: avgTipsByDay,
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: (v) => '$' + v.toFixed(0) }
                    }
                }
            }
        });
    }

    // Tip Percent by Day Chart
    const percentByDayCanvas = document.getElementById('percent-by-day-chart');
    if (percentByDayCanvas) {
        charts.percentByDay = new Chart(percentByDayCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: dayNames,
                datasets: [{
                    label: 'Average Tip %',
                    data: avgPercentByDay,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: (v) => v.toFixed(1) + '%' }
                    }
                }
            }
        });
    }

    // Sort data by date for time series
    const sortedData = [...yearData].sort((a, b) => a.date - b.date);

    // Check if we're showing multiple years
    const years = [...new Set(sortedData.map(d => d.date.getFullYear()))];
    const showYear = years.length > 1;

    const dates = sortedData.map(d => {
        const month = d.date.getMonth() + 1;
        const day = d.date.getDate();
        const year = d.date.getFullYear();
        return showYear ? `${month}/${day}/${year}` : `${month}/${day}`;
    });
    const tips = sortedData.map(d => d.tips);
    const sales = sortedData.map(d => d.sales);
    const percents = sortedData.map(d => d.tipPercent);

    // Tips Over Time Chart
    const tipsOverTimeCanvas = document.getElementById('tips-over-time-chart');
    if (tipsOverTimeCanvas) {
        const tipsTrend = calculateTrendLine(tips);
        charts.tipsOverTime = new Chart(tipsOverTimeCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Tips',
                    data: tips,
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.1,
                    fill: true,
                    order: 2
                }, {
                    label: 'Trend',
                    data: tipsTrend,
                    borderColor: 'rgba(220, 38, 38, 1)',
                    borderWidth: 3,
                    borderDash: [10, 5],
                    fill: false,
                    pointRadius: 0,
                    order: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toFixed(0) } },
                    x: { ticks: { maxTicksLimit: 12 } }
                }
            }
        });
    }

    // Sales Over Time Chart
    const salesOverTimeCanvas = document.getElementById('sales-over-time-chart');
    if (salesOverTimeCanvas) {
        const salesTrend = calculateTrendLine(sales);
        charts.salesOverTime = new Chart(salesOverTimeCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Sales',
                    data: sales,
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1,
                    fill: true,
                    order: 2
                }, {
                    label: 'Trend',
                    data: salesTrend,
                    borderColor: 'rgba(220, 38, 38, 1)',
                    borderWidth: 3,
                    borderDash: [10, 5],
                    fill: false,
                    pointRadius: 0,
                    order: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toFixed(0) } },
                    x: { ticks: { maxTicksLimit: 12 } }
                }
            }
        });
    }

    // Tip Percentage Over Time Chart
    const tipPercentOverTimeCanvas = document.getElementById('tip-percent-over-time-chart');
    if (tipPercentOverTimeCanvas) {
        const percentsTrend = calculateTrendLine(percents);
        charts.tipPercentOverTime = new Chart(tipPercentOverTimeCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Tip %',
                    data: percents,
                    borderColor: 'rgba(168, 85, 247, 1)',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.1,
                    fill: true,
                    order: 2
                }, {
                    label: 'Trend',
                    data: percentsTrend,
                    borderColor: 'rgba(220, 38, 38, 1)',
                    borderWidth: 3,
                    borderDash: [10, 5],
                    fill: false,
                    pointRadius: 0,
                    order: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: (v) => v.toFixed(1) + '%' } },
                    x: { ticks: { maxTicksLimit: 12 } }
                }
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadWaitressData();
});
