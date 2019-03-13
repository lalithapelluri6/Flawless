// Initialize Firebase
var config = {
    apiKey: "AIzaSyAetjyRx2t2a0mBfY0XwsSpH-2RclTWfeI",
    authDomain: "flawless-7a98a.firebaseapp.com",
    databaseURL: "https://flawless-7a98a.firebaseio.com",
    projectId: "flawless-7a98a",
    storageBucket: "flawless-7a98a.appspot.com",
    messagingSenderId: "1096240112468"
};
firebase.initializeApp(config);

$(document).ready(function () {

    var cdata = [];
    var dataArr = [];
    var callback;
    var dataset = {};
    var previousVal = '';
    var compareVal ='';
    var chartCount ;
    var currentFnD='';
    var ref = firebase.database().ref().orderByChild("foodAndDrinks");


    function getData() {
        ref.on("child_added", function (snapshot) {
            var obj = snapshot.val();

            if (obj.foodAndDrinks === previousVal && typeof obj.foodAndDrinks !=='undefined') {
                chartCount++;
                currentFnD=obj.foodAndDrinks;
            }
            else if(typeof obj.label === 'undefined' && typeof obj.foodAndDrinks ==='undefined' || obj.label === 'undefined' && obj.foodAndDrinks === ''){
                console.log(chartCount, obj.label);
                chartCount=1;
            }
            else if (typeof obj.foodAndDrinks !=='undefined' && typeof obj.label !== 'undefined' || obj.foodAndDrinks !== '' || obj.foodAndDrinks !== "null") {
                dataArr = ({
                    label: currentFnD,
                    value: chartCount,
                });
                console.log(obj.foodAndDrinks,chartCount);
                chartCount = 1;
                previousVal = obj.foodAndDrinks;
                currentFnd='';
            }
        

            
            //var newArr=  removeDuplicate(dataArr);
            
            if(typeof dataArr.label !== 'undefined' && typeof dataArr.value !=='undefined'){
               if(dataArr.label !== compareVal){
                    addData(myChart, dataArr.label, dataArr.value);
                    compareVal = dataArr.label;
               }     
               
                
            }
            var unique = $.makeArray($(dataArr).filter(function(i,itm){
                return i == $(dataArr).index(itm);
            })); 

        });

    }


    var ctx = document.getElementById("myChart").getContext("2d");
    options = {
        scales: {
            xAxes: [{
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
                gridLines: {
                    offsetGridLines: true
                },
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1000,
                        stepSize: 100
                    }
                }]
            }]
        }
    }
    var config = {
        type: 'line',
        data: {
            labels: dataArr.label,
            datasets: [{
                label: "User Views by Cuisine",
                backgroundColor: "#3e95cd",
                data: dataArr.value
            }],
            responsive: true,
            options: options

        }
    };
    var myChart = new Chart(ctx, config);

    // var myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: datasets,
    //     options: options
    // });

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    getData();
})
