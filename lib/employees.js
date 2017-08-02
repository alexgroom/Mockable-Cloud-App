var $fh = require('fh-mbaas-api');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var db = require('./db-store');

var EMPLOYEES_SERVICE_GUID = process.env.EMPLOYEES_SERVICE_GUID;
var EMPLOYEES_COLLECTION_NAME = process.env.EMPLOYEES_COLLECTION_NAME || "employees";
var MOCKED_UP = process.env.MOCKED_UP || "true";

function _searchEmployeesMockedUp (filter) {
  return new Promise(function(resolve, reject) {
    db.list(EMPLOYEES_COLLECTION_NAME, filter, function (err, data) {
      if (err) {
        reject({result:'ERROR', msg: err});
      } else {
        resolve(data);
      }
    });
  });
}

function _searchEmployees(filter) {
  return new Promise(function(resolve, reject) {
    var path = '/employees';
    console.log('path: ' + path);

    $fh.service({
      "guid" : EMPLOYEES_SERVICE_GUID, // The 24 character unique id of the service
      "path": path, //the path part of the url excluding the hostname - this will be added automatically
      "method": "POST",   //all other HTTP methods are supported as well. e.g. HEAD, DELETE, OPTIONS
      "timeout": 25000, // timeout value specified in milliseconds. Default: 60000 (60s)
      "params": filter,
      //"headers" : {
        // Custom headers to add to the request. These will be appended to the default headers.
      //}
    }, function(err, body, response) {
      console.log('statuscode: ', response && response.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        console.log(path + ' service call failed - err : ', err);
        reject({result:'ERROR', msg: err});
      } else {
        resolve(body);
      }
    });
  });
}

function searchEmployees(filter) {
  console.log('MOCKED_UP', MOCKED_UP);
  if (MOCKED_UP === 'true') {
    console.log('_searchEmployeesMockedUp');
    return _searchEmployeesMockedUp(filter);
  } else {
    console.log('_searchEmployees');
    return _searchEmployees(filter);
  }
}

function route() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  /*router.get('/', function(req, res) {
    var employeeId = req.query.employeeId;
    console.log('employeeId ' + employeeId);
    if (typeof employeeId === 'undefined' || employeeId === '') {
      res.status(404).json([]);
      return;
    }
    db.read(EMPLOYEES_COLLECTION_NAME, employeeId, function (err, data) {
      if (err) {
        res.status(500).json({result:'ERROR', msg: err})
      } else {
        res.status(200).json(data);
      }
    });
  });*/

  router.post('/', function(req, res) {
    var filter = req.body;
    console.log('filter: ' + filter);
    if (typeof filter === 'undefined') {
      res.status(404).json([]);
      return;
    }

    searchEmployees(filter).
    then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      res.status(500).json({result:'ERROR', msg: err})
    });
  });

  return router;
}

module.exports = route;
