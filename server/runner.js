const CronJob = require('cron').CronJob
const axios = require('axios')
let emailRegistrationNotif = new CronJob({
  //Send every Monday
  cronTime: '* * * * * */0',
  onTick: function() {
    axios.post('http://localhost:3000/notif/send', {}, {})
          .then((response) => {
            console.log('get')
          })
          .catch((err) => {
            console.log(err)
          })
  },
  start: false,
  timeZone: 'Asia/Jakarta'
});

emailRegistrationNotif.start()