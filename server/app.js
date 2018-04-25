require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost/hacktivoverflow')

const indexRouter = require('./routers/index_router.js')
const homeRouter = require('./routers/home_router.js')
const notifRouter = require('./routers/notif_router')

app.use('/index', indexRouter)
app.use('/home', homeRouter)
app.use('/notif', notifRouter)

app.listen(3000, () => {
    console.log('listening on port 3000')
})