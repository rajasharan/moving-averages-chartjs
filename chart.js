var ctx = document.getElementById("my-chart");

axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=INX&outputsize=full&apikey=6XXXJS1ZXIORAEEXXXRPJ4')
    .then(res => res.data)
    .then(json => json['Time Series (Daily)'])
    .then(R.pluck('4. close'))
    .then(keysAndValues)
    .catch(console.log);

function keysAndValues(obj) {
    var keys = R.compose(R.reverse, R.keys)(obj);
    var values = R.compose(R.reverse, R.values)(obj);
    var movingAvg20 = nDayAverage(20, keys, values);
    var movingAvg100 = nDayAverage(100, keys, values);
    var movingAvg200 = nDayAverage(200, keys, values);
    var movingAvg500 = nDayAverage(500, keys, values);
    var movingAvg1000 = nDayAverage(1000, keys, values);
    createChart(keys, values, movingAvg20, movingAvg100, movingAvg200, movingAvg500, movingAvg1000);
}

function nDayAverage(n, keys, values) {
    var movingAvg = [];
    while (values.length > n) {
        avg = R.pipe(R.take(n), R.sum)(values)/n;
        values = values.slice(1);
        movingAvg.push(avg.toFixed(4));
    }

    keys = keys.slice(n);

    var mappedIndex = R.addIndex(R.map);
    return mappedIndex((val, i) => {
        return {
            x: keys[i],
            y: val
        }
    })(movingAvg);
}

function createChart(keys, values, movingAvg20, movingAvg100, movingAvg200, movingAvg500, movingAvg1000) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: keys,
            datasets: [
                {
                    label: 'S&P 500 Index',
                    data: values,
                    pointRadius: 0,
                    borderWidth: 0.1
                },
                {
                    label: '20 day SMA',
                    data: movingAvg20,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'RED',
                    fill: false
                },
                {
                    label: '100 day SMA',
                    data: movingAvg100,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'BLUE',
                    hidden: true,
                    fill: false
                },
                {
                    label: '200 day SMA',
                    data: movingAvg200,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'PURPLE',
                    hidden: true,
                    fill: false
                },
                {
                    label: '500 day SMA',
                    data: movingAvg500,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'GREEN',
                    fill: false
                },
                {
                    label: '1000 day SMA',
                    data: movingAvg1000,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'BLACK',
                    hidden: true,
                    fill: false
                }

            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                duration: 0, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0,
        }
    });
}
