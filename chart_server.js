'use strict'

var express = require('express')
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = 8000
var router = express.Router()
var moment = require('moment-timezone')

function show_res(res,data) {
  res.status(200).json(data)
  time_log('OUT res = '+JSON.stringify(data))
}

function console_bar() {
  console.log('---------------------------------------------------------------')
}

function time_log(log) {
  var time_current = moment().tz('Asia/Seoul').format('YYYY-MM-DD H:mm:ss') // KST
  console.log('[KST: ' + time_current + '] '+ log)
}

router.route('/ping').get(function(req, res) {
  console_bar()
  time_log('Called /ping')

  var result={}
  result.s = "ok"
  result.msg = "pong"

  show_res(res,result)
})

router.route('/config').get(function(req, res) {
  console_bar()
  time_log('Called /config')

  var result={}
  result.supports_search = true
  result.supports_group_request = false
  result.supports_marks = true
  result.supports_timescale_marks = true
  result.supports_time = true
  result.exchanges = [
    {
      "value": "VAM",
      "name": "VAM",
      "desc": "VAM"
    }
  ]
  result.symbols_types = [
    {
      "name": "EUC",
      "value": "EUC"
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

router.route('/time').get(function(req, res) {
  var result = moment().unix()
  show_res(res,result)
})

router.route('/symbols').get(function(req, res) {
  var params = {}
  params.symbol = req.query.symbol;

  console_bar()
  time_log('Call /symbols = ' + JSON.stringify(params));

  var result={}
  result.name = "EUC"
  result['exchange-traded'] = "VAM"
  result['exchange-listed'] = "VAM"
  result.timezone = "Asis/Seoul"
  result.minmov = 1
  result.minmov2 = 0
  result.pointvalue = 1
  result.session = "0930-1630"
  result.has_intraday = false
  result.has_no_volume = false
  result.description = "EXM/USD Contract"
  result.type = "stock"
  result.supported_resolutions = [
    "D",
    "2D",
    "3D",
    "W",
    "3W",
    "M",
    "6M"
  ]
  result.pricescale = 100
  result.ticker = "EUC"

  show_res(res,result)
})

// router.route('/symbol_info').get(function(req, res) {
//   var params = {}
//   params.group = req.query.group;
//
//   console_bar()
//   time_log('Call /symbol_info = ' + JSON.stringify(params));
//
//   var result = {
//     "symbol":["EUC"],
//     "description":["EXEUM/USD Constract"],
//     "exchange-listed":"VAM",
//     "exchange-traded":"VAM",
//     "minmov":1,
//     "minmov2":0,
//     "pointvalue":1,
//     "pricescale":[1],
//     "has-dwm":true,
//     "has-intraday":true,
//     "has-no-volume":[false],
//     "type":["stock"],
//     "ticker":["EUC"],
//     "timezone":"America/New_York",
//     "session-premarket":"0400-0900",
//     "session-regular":"0900-1600",
//     "session-postmarket":"1600-1900"
//   }
//
//   show_res(res,result)
// })

router.route('/history').get(function(req, res) {
  var params = {}
  params.symbol = req.query.symbol;
  params.resolution = req.query.resolution;
  params.from = req.query.from;
  params.to = req.query.to;

  if(params.symbol==null) params.symbol = "EUC"
  if(params.resolution==null) params.resolution = "D"
  if(params.from==null && params.to==null) params.to = moment().unix()
  if(params.to==null) params.to = params.from + 8640000  // 60 * 60 * 24 * 100
  if(params.from==null) params.from = params.to - 8640000

  console_bar()
  time_log('Call /history = ' + JSON.stringify(params));

  var step = 86400
  if(params.resolution=="D") {
    step = 86400
  }
  params.from = parseInt(params.from/step) * step
  params.to = parseInt(params.to/step) * step

  var result={}
  result.s = "ok"
  result.t = []
  result.o = []
  result.h = []
  result.l = []
  result.c = []
  result.v = []

  var o_now, h_now, l_now, v_now, c_now = 100.0
  for(var i = params.from; i <= params.to; i+=step) {
    o_now = c_now + Math.random()*2.0-1.0
    c_now = o_now + Math.random()*6.0-3.0
    h_now = Math.max(o_now, c_now) + Math.random()*5.0
    l_now = Math.min(o_now, c_now) - Math.random()*5.0
    v_now = parseInt(Math.random()*10000.0)

    result.t.push(i)
    result.o.push(o_now)
    result.h.push(h_now)
    result.l.push(l_now)
    result.c.push(c_now)
    result.v.push(v_now)
  }

  show_res(res,result)
})

router.route('/marks').get(function(req, res) {
  var params = {}
  params.symbol = req.query.symbol;
  params.resolution = req.query.resolution;
  params.from = req.query.from;
  params.to = req.query.to;

  if(params.symbol==null) params.symbol = "EUC"
  if(params.resolution==null) params.resolution = "D"
  if(params.from==null && params.to==null) params.to = moment().unix()
  if(params.to==null) params.to = params.from + 8640000  // 60 * 60 * 24 * 100
  if(params.from==null) params.from = params.to - 8640000

  console_bar()
  time_log('Call /marks = ' + JSON.stringify(params));

  var step = 86400
  if(params.resolution=="D") {
    step = 86400
  }
  params.from = parseInt(params.from/step) * step
  params.to = parseInt(params.to/step) * step

  var gap = parseFloat(params.to - params.from) * 0.2
  var time_0 = parseInt((params.from + gap) / step) * step
  var time_1 = parseInt((params.to - gap) / step) * step

  var result={}
  result.id = [0, 1]
  result.time = [time_0, time_1]
  result.color = ["red", "blue"]
  result.text = ["Some test point", "ever4cys likes here"]
  result.label = ["Test", "ever4cys"]
  result.labelFontColor = ["white", "#0ff"]
  result.minSize = [24, 30]

  show_res(res,result)
})

router.route('/timescale_marks').get(function(req, res) {
  var params = {}
  params.symbol = req.query.symbol;
  params.resolution = req.query.resolution;
  params.from = req.query.from;
  params.to = req.query.to;

  if(params.symbol==null) params.symbol = "EUC"
  if(params.resolution==null) params.resolution = "D"
  if(params.from==null && params.to==null) params.to = moment().unix()
  if(params.to==null) params.to = params.from + 8640000  // 60 * 60 * 24 * 100
  if(params.from==null) params.from = params.to - 8640000

  console_bar()
  time_log('Call /timescale_marks = ' + JSON.stringify(params));

  var step = 86400
  if(params.resolution=="D") {
    step = 86400
  }
  params.from = parseInt(params.from/step) * step
  params.to = parseInt(params.to/step) * step

  var gap = parseFloat(params.to - params.from) * 0.2
  var time_0 = parseInt((params.from + gap) / step) * step
  var time_1 = parseInt((params.to - gap) / step) * step

  var item0={}
  item0.id = "tsm0"
  item0.time = time_0
  item0.color = "green"
  item0.label = "M"
  item0.tooltip = [
    "tsm0",
    "Is is going well?"
  ]

  var item1={}
  item1.id = "tsm1"
  item1.time = time_1
  item1.color = "yellow"
  item1.label = "Y"
  item1.tooltip = [
    "EXEUM will be the next cryptocurrency",
    "We need some time"
  ]

  var result = [item0, item1]

  show_res(res,result)
})


// server start
app.use('/', router)
app.listen(port)
console_bar()
time_log('Simple-chart-server Started, port : ' + port)
console_bar()
