'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = 8000
var router = express.Router()

var moment = require('moment-timezone')
var randomstring = require("randomstring")

// --------------------- common functions ----------------------------------------------

function show_res(res,data) {
  res.send(data)
  time_log('OUT res = '+JSON.stringify(data))
}

function console_bar() { console.log('-------------------------------------------------------------------') }

function time_log(log) {
  var time_current = moment().tz('Asia/Seoul').format('YYYY-MM-DD H:mm:ss')            // KST
  console.log('[KST: ' + time_current + '] '+ log)
}

// ------------------------------------------------------------------------------------------------------------------------------------------

router.route('/ping').get(function(req, res) {
  console_bar()
  time_log('Called /ping')

  var result={}
  result.s = "ok"
  result.msg = "pong"

  show_res(res,result)
})

// ------------------------------------------------------------------------------------------------------------------------------------------


router.route('/config').get(function(req, res) {
  console_bar()
  time_log('Called /config')

  var result={}
  result.supports_search = true
  result.supports_group_request = false
  result.supports_marks = true
  result.supports_timescale_marks = true
  result.supports_time = true
  result.exchange = [
    {
      "value": "ExmVAM",
      "name": "ExmVAM",
      "desc": "ExmVAM"
    }
  ]
  result.symbols_types = [
    {
      "name": "ExmContract",
      "value": "ExmContract"
    }
  ]
  result.supported_resolutions = [
    "D",
    "2D",
    "3D",
    "W",
    "3W",
    "M",
    "6M"
  ]

  show_res(res,result)
})



// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// server start
app.use('/', router)
app.listen(port)
console_bar()
time_log('Simple-chart-server Started, port : ' + port)
console_bar()
