/*
levelToExp: function(level, factor) {
        var exp = 0;
        for (var l = 0; l < level; l++) {
            exp += Math.floor(200 * Math.pow(l + 1, factor));
        }

        return exp;
    },
*/

function levelToExp(level, factor) {
    var exp = 0;
    for (var l = 0; l < level; l++) { exp += Math.floor(200 * Math.pow(l + 1, factor)) }
    return exp;
}

/*
var layout = {
  showlegend: false,
  height: 600,
  width: 600,
  xaxis: {
    showline: true,
    showgrid: false,
    showticklabels: true,
    linecolor: 'rgb(204,204,204)',
    linewidth: 2,
    autotick: false,
    ticks: 'outside',
    tickcolor: 'rgb(204,204,204)',
    tickwidth: 2,
    ticklen: 5,
    tickfont: {
      family: 'Arial',
      size: 12,
      color: 'rgb(82, 82, 82)'
    }
  },
  yaxis: {
    showgrid: false,
    zeroline: false,
    showline: false,
    showticklabels: false
  },
  autosize: false,
  margin: {
    autoexpand: false,
    l: 100,
    r: 20,
    t: 100
  },
  annotations: [
    {
      xref: 'paper',
      yref: 'paper',
      x: 0.0,
      y: 1.05,
      xanchor: 'left',
      yanchor: 'bottom',
      text: 'Main Source for News',
      font:{
        family: 'Arial',
        size: 30,
        color: 'rgb(37,37,37)'
      },
      showarrow: false
    },
    {
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      y: -0.1,
      xanchor: 'center',
      yanchor: 'top',
      text: 'Source: Pew Research Center & Storytelling with data',
      showarrow: false,
      font: {
        family: 'Arial',
        size: 12,
        color: 'rgb(150,150,150)'
      }
    }
  ]
};
*/

/*
data: [{
        x: 10,
        y: 20
    }, {
        x: 15,
        y: 10
    }]*/

function expChart() {
    var canvas = document.getElementById('expChart');

    var data = {
        levels: new Array(),
        values: new Array()
    }

    for (var l = 0; l <= 50; l++) { data.levels.push(l); data.values.push(levelToExp(l, 1.5)) }

    var options = {};

    /*var chart = new Chart(canvas, {
        type: 'line',
        data: {
            datasets: [data]
        },
        options: options
    });*/

    var chat = new Chart(canvas, {
        type: 'line',
        data: {
            labels: data.levels,
            datasets: [{
                label: 'exp',
                data: data.values,
                backgroundColor: 'rgba(60,63,98, 0.4)',
                borderWidth: 1
            }]
        },

        options: {
            scales: {
                yAxes: [{
                    ticks: { beginAtZero: true }
                }]
            }
        }
    });

    /*var myChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });*/
}

/*
function expChart() {
    var trace = {
        x: new Array(),
        y: new Array(),
        mode: 'lines',
        line: {
            color: '#6A6D98',
            width: 2
        }
    }
    
    var max = 100;
    for (var i = 0; i <= 100; i++) {
        trace.x.push(i);
        trace.y.push(levelToExp(i, 1.5));
    }
      
    var data = [trace];

    var layout = {
        title: 'exp curve',
        xaxis: { title: 'level' },
        yaxis: { title: 'exp' },
        showlegend: false,
        tickcolor: '#CCC',
        tickwidth: 2,
        ticklen: 5,
        tickfont: {
            family: 'Arial',
            size: 12,
            color: '#CCC'
        },
        autosize: true
    };
      
    Plotly.newPlot('expChart', data, layout);
}*/