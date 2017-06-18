/**
 * Created by martijn on 6/18/17.
 */
var config = {
    type: 'line',
    data: {

    },
    options:{
        title:{
            text: "Temperature"
        },
        scales:{
            xAxes:[{
                type: "time",
                time: {
                    format: "DD/MM/YYYY HH:mm",
                    tooltipFormat: 'll HH:mm'
                },
                scaleLabel:{
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (&deg;C)'
                }
            }]
        }
    }
};

