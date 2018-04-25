const CronJob = require('cron').CronJob
const axios = require('axios')
let emailRegistrationNotif = new CronJob({
  cronTime: '* * * * * */0',
  onTick: function() {
    axios.post('http://localhost:3000/users/notifications', {}, {})
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