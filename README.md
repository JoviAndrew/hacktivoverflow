# hacktivoverflow
hacktivoverflow portofolio hackitv8 phase 2

This project is created using `nodejs`, `vue` as the client framework and `express` for the server.

URL to the deployed project: https://hacktiv-overflow.jovianandrewhari.cf/#/

Dependencies used in this project are:    
   
#### Server

    axios
    bcryptjs
    cors
    cron
    dotenv
    express
    jsonwebtoken
    mongoose
    nodemailer
    path

#### Client

    axios
    sweetalert
    vue
    vue-router
    vuex

The Client uses `vue-cli`. To run the project, first you must type in `npm run serve` in your respective terminal

## End Point

#### Index
| Action | Path | Description |
|---------|:-----:|:----------:|
|POST|/index/login|Login User|
|POST|/index/register|Register User|
|POST|/index/login-fb|For Users who uses Facebook Login|

#### Home
| Action | Path | Description |
|---------|:-----:|:----------:|
|GET|/home/show-questions|Get All Questions|
|GET|/home/show-questions/:id|Get one question by id|
|GET|/home/show-answers/:id|Show answers for the question|
|POST|/home/post-question|Post new question|
|POST|/home/post-answer/:id|Post answer for a question|
|PUT|/home/update/:id|Update question|
|DELETE|/home/delete-question/:id|Delete question|
|DELETE|/home/delete-answer/:id|Delete answer|
|PUT|/home/voteup-question/:id|Vote up question|
|PUT|/home/votedown-question/:id|Vote down question|
|PUT|/home/voteup-answer/:id|Vote up answer|
|PUT|/home/votedown-answer/:id|Vote down answer|

#### Notif
| Action | Path | Description |
|---------|:-----:|:----------:|
|POST|/notif/send|Sending email to users with cron|
