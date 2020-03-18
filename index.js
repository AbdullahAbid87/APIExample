const express = require("express");
const path = require("path");
const app = new express();
const bib = require("./server-side/bib");
const cors = require("cors");
//List to return
var listFinal = [];

//Calling bib to update JSON files
setTimeout(function() {
  bib.get();
}, 1000);

setTimeout(function() {
  //Retrieving JSON updated
  const michelin_json = require("./server-side/michelin.json");
  const maitre_json = require("./server-side/maitre.json");

  var size = michelin_json.length + maitre_json.length;

  //Normalizing the final list and importing data in it
  for (var i = 0; i < size; i++) {
    if (i < michelin_json.length) {
      listFinal[i] = michelin_json[i];
    }
    if (i >= michelin_json.length) {
      listFinal[i] = maitre_json[i - michelin_json.length];
    }
  }

  //Diplay of the final list
  for (var i = 0; i < listFinal.length; i++) {
    console.log(i + 1 + " " + listFinal[i].name + " - " + listFinal[i].address);
  }

  //web app creation
  app.get("/", function(req, res) {
    //rendering html
    res.sendFile("./index.html", { root: __dirname });
    //sending JSON (final list) to the html
    res.send(listFinal);
  });

  //add other middleware

  app.listen(8000, function() {
    console.log("Scrapping web app listening on port 8000");
  });
}, 55000);
