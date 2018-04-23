require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const CronJob = require('cron').CronJob
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/hacktivoverflow')

const indexRouter = require('./routers/index_router')

new CronJob('* * * * *', function(){
    console.log('testing cron');
},null, true, 'Asia/Jakarta')

app.use('/index', indexRouter)

app.listen(3000, () => {
    console.log('listening on port 3000')
})