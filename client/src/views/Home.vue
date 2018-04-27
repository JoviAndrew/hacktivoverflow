<template>
  <div class="home">
    <div class="mainBody row">
      <div class="textBody col-sm-12 col-lg-6">
        <h4>Share, Learn, Develop Together!</h4>
        <h6>Join our growing developer community</h6>
      </div>
      <div class="registerBody col-sm-12 col-lg-6 px-5">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">First Name</span>
          </div>
          <input type="text" class="form-control" v-model="firstname" placeholder="Tom" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Last Name</span>
          </div>
          <input type="text" class="form-control" v-model="lastname" placeholder="Tommy" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Username</span>
          </div>
          <input type="text" class="form-control" v-model="username" :class="{ err: wrongFormatUsername }" placeholder="email@mail.com" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">Password</span>
        </div>
        <input type="password" class="form-control" :class="{ err: wrongFormatPass }" v-model="password" placeholder="6 Alphanumeric Characters" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Confirm Password</span>
          </div>
          <input type="password" class="form-control" :class="{ err: wrongInput }" v-model="confirm" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <button class="btn btn-outline-success" @click="doRegister">Register</button>
      <div v-show="hide" class="alert alert-dismissible alert-danger mt-3">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong><p>{{errorMessage}}</p></strong>
      </div>
      </div>
    </div>
    <div class="col-12 px-0 mt-0">
      <marquee behavior="Alternate" direction="left">JOIN US NOW!</marquee>
    </div>
  <table-questions></table-questions>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import TableQuestions from '@/components/TableQuestions.vue'
import { mapState } from 'vuex'
import swal from 'sweetalert'

export default {
  name: 'home',
  data () {
    return {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      confirm: '',
      wrongInput: false,
      wrongFormatPass: false,
      wrongFormatUsername: false,
      errorMessage: '',
      hide: false
    }
  },
  computed: mapState([
    'questions'
  ]),
  components: {
    TableQuestions
  },
  watch: {
    confirm () {
      if (this.confirm !== this.password) {
        this.wrongInput = true
      } else {
        this.wrongInput = false
      }
    },
    password () {
      const letter = /[a-zA-Z]/
      const number = /[0-9]/
      let goodPassword = letter.test(this.password) && number.test(this.password)
      if (this.password.length < 6) {
        this.wrongFormatPass = true
      } else if (!goodPassword) {
        this.wrongFormatPass = true
      } else {
        this.wrongFormatPass = false
      }
    },
    username () {
      // eslint-disable-next-line
      const regexUsername = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      if (!regexUsername.test(this.username)) {
        this.wrongFormatUsername = true
      } else {
        this.wrongFormatUsername = false
      }
    }
  },
  methods: {
    doRegister () {
      let self = this
      if(this.wrongFormatUsername == false && this.wrongFormatPass == false){
        axios.post('http://localhost:3000/index/register',
          {
            username: self.username,
            password: self.password,
            firstname: self.firstname,
            lastname: self.lastname
          })
          .then(function (response) {
            console.log(response)
            if (response.data.message !== 'success register a new user') {
              let message = response.data.message
              self.errorMessage = message
              self.hide = true
            } else {
              swal({title: 'Success', text: response.data.message, icon: 'success', buttons: 'OK'})
              self.resetRegister()
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    resetRegister () {
      this.firstname = '',
      this.lastname = '',
      this.username = '',
      this.password = '',
      this.confirm = ''
    }
  }
}
</script>

<style scoped>
.textBody{
  margin-top: 9%
}

.mainBody{
  margin-top: 3%;
  border: 1px solid gainsboro
}

.registerBody{
  margin: 2% 0%
}

.err{
  border: 1px solid red
}

marquee{
  padding: 1%;
  margin-top: 5%;
  border: 1px solid green;
  color:green;
  font-weight: bold

}

</style>
