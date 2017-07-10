var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputFile='OffTheGridData.csv';

var dataset = [],
  milestone3_lookup = [],
  milestone1 = 0,
  milestone2= {
    "waitTimeIncrease" :0,
    "stand" :0,
    "fromWeek" :0,
    "toWeek" :0
  },
  milestone3_a = {
    standsToVisit : [],
    totalTastiness : 0,
    totalWaitTime : 0
  },
  milestone3_b = {
    standsToVisit : [],
    totalTastiness : 0,
    totalWaitTime : 0
  },
  previousVisit = {
    "StandNumber" : 0,
    "WeekNumber" : 0,
    "Price" : 0,
    "WaitTime" : 0,
    "Tastiness" : 0
  };

var parser = parse({delimiter: ','}, function (err, data) {
  var visitcount = 0,
    waitTimeSumAtStall = 0,
    tastinessSumAtStall = 0;

    data.forEach(function (line) {
      var visit= {};
      visit.StandNumber = parseInt(line[0]);
      visit.WeekNumber = parseInt(line[1]);
      visit.Price = parseFloat(line[2]);
      visit.WaitTime = parseInt(line[3]);
      visit.Tastiness = parseInt(line[4]);
      dataset.push(visit);
      milestone1 = milestone1 + visit.Price;

      if (previousVisit.StandNumber === visit.StandNumber) {
        visitcount++;
        waitTimeSumAtStall = waitTimeSumAtStall + visit.WaitTime;
        tastinessSumAtStall = tastinessSumAtStall + visit.Tastiness;
        var waitTimeDifference = visit.WaitTime - previousVisit.WaitTime;
        if (waitTimeDifference > milestone2.waitTimeIncrease) {
          milestone2.waitTimeIncrease = waitTimeDifference;
          milestone2.stand = visit.StandNumber;
          milestone2.fromWeek = previousVisit.WeekNumber;
          milestone2.toWeek = visit.WeekNumber;
        }
      } else {
        milestone3_lookup.push({
          "StandNumber" : previousVisit.StandNumber,
          "averageWaitTime" : waitTimeSumAtStall/visitcount,
          "averageTastiness" : tastinessSumAtStall/visitcount,
        });
        visitcount = 1;
        waitTimeSumAtStall = visit.WaitTime;
        tastinessSumAtStall = visit.Tastiness;


      }
      previousVisit.StandNumber = parseInt(line[0]);
      previousVisit.WeekNumber = parseInt(line[1]);
      previousVisit.Price = parseFloat(line[2]);
      previousVisit.WaitTime = parseInt(line[3]);
      previousVisit.Tastiness = parseInt(line[4]);
    });
    console.log("Milestone 1 :  Total amount spent = ", milestone1 );
    console.log("Milestone 2 :  Highest Waittime Increase = ", milestone2 );

    //approximation analysis for milestone 3
    //I am assuming the more stalls you visit -> the more Tastiness you get

    //sorting stalls based on their waittimes, and then getting 20 minutes and 45 minutes outputs
    milestone3_lookup.sort(function(a, b) {
      return a.averageWaitTime - b.averageWaitTime;
    }).forEach(function(item) {
      if(milestone3_a.totalWaitTime + item.averageWaitTime < 45) {
        milestone3_a.standsToVisit.push(item.StandNumber);
        milestone3_a.totalWaitTime = milestone3_a.totalWaitTime + item.averageWaitTime;
        milestone3_a.totalTastiness = milestone3_a.totalTastiness + item.averageTastiness;
      }
      if(milestone3_b.totalWaitTime + item.averageWaitTime < 20) {
        milestone3_b.standsToVisit.push(item.StandNumber);
        milestone3_b.totalWaitTime = milestone3_b.totalWaitTime + item.averageWaitTime;
        milestone3_b.totalTastiness = milestone3_b.totalTastiness + item.averageTastiness;
      }
    });
    console.log("Milestone 3 : (I am assuming the more stalls you visit -> the more Total Tastiness you get) ");
    console.log("Milestone 3_a (without plan, 45 minutes visit to Off-The-Grid): ", milestone3_a );
    console.log("Milestone 3_b (with movie plan, 20 minutes visit to Off-The-Grid): ", milestone3_b );

    //exact analysis for milestone 3

});

fs.createReadStream(inputFile).pipe(parser);
