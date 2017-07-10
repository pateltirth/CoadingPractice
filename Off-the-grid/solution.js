var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputFile='OffTheGridData.csv';

var dataset = [];

var milestone1 = 0;
var startStall = 0, lastWaitTime = 0; maxTimeDiff= {"diff" :0, "stand" :0; "week1" :0, "week2" :0};

var parser = parse({delimiter: ','}, function (err, data) {
    data.forEach(function (line) {
      var visit= {};
      visit.StandNumber = parseInt(line[0]);
      visit.WeekNumber = parseInt(line[1]);
      visit.Price = parseFloat(line[2]);
      visit.WaitTime = parseInt(line[3]);
      visit.Tastiness = parseInt(line[4]);
      dataset.push(visit);
      milestone1 = milestone1 + visit.Price;

      if (startStall === visit.StandNumber) {
        var lTimeDiff = visit.WaitTime - lastWaitTime;
        if (lTimeDiff > maxTimeDiff.diff) {
          maxTimeDiff.diff = lTimeDiff;
          maxTimeDiff.stand = visit.StandNumber;
          maxTimeDiff.week1 = 
        }

      }
    });
    console.log("Milestone 1 :  Total amount spent = ", milestone1 );
});
fs.createReadStream(inputFile).pipe(parser);
