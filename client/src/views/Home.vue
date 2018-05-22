<template>
  <div class="home">
    <div v-if="!isLogin" class="mainBody row">
      <div class="textBody col-sm-12 col-lg-6">
        <h4>Share, Learn, Develop Together!</h4>
        <h6>Join our growing developer community</h6>
      </div>
      <div class="registerBody col-sm-12 col-lg-6 px-5">
        <div class="row">
          <div class="col-12">
            <button type="button" scope="public_profile, email, gender" class="btn btn-primary my-2 my-sm-0" @click="openFbLoginDialog">Login with Facebook</button>
          </div>
          <div class="col-12">
            <label class="divider">OR</label>
          </div>
        </div>
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
      </div>
    </div>
    <div v-if="!isLogin" class="col-12 px-0 mt-0">
      <marquee behavior="Alternate" direction="left">JOIN US NOW!</marquee>
    </div>
  <table-questions></table-questions>
  </div>
</template>

<script>
// @ is an alias to /src
import TableQuestions from '@/components/TableQuestions.vue'
import { mapState } from 'vuex'

window.fbAsyncInit = function() {
  FB.init({
    appId      : '191927258109113',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.0'
  });
  FB.AppEvents.logPageView()  
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id
  js.src = "https://connect.facebook.net/en_US/sdk.js"
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

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
      wrongFormatUsername: false
    }
  },
  computed: mapState(['questions', 'isLogin']),
  components: {
    TableQuestions
  },
  created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.$store.commit('changeStatusTrue')
      this.$router.push('/')
    }
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
    openFbLoginDialog () {
      FB.login(this.checkLoginState, { scope: 'email' })
    },
    checkLoginState: function (response) {
      let self = this
      if (response.status === 'connected') {
        FB.api('me', { fields: ['id', 'first_name', 'email', 'last_name'] }, function (profile) {
          self.$store.dispatch('loginFB', profile)
        })
      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook,
        // but has not authenticated your app
      } else {
        // the user isn't logged in to Facebook.
      }
    },
    doRegister () {
      let registerData = {
        username: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname
      }
      this.$store.dispatch('registerUser', registerData)
      this.resetRegister()
    },
    resetRegister () {
      this.firstname = ''
      this.lastname = ''
      this.username = ''
      this.password = ''
      this.confirm = ''
    }
  }
}
</script>

<style scoped>
.textBody{
  margin-top: 9%
}
.divider {
  text-align: center;
  margin: 2% 0%;
  color: grey;
  font-weight: bold;
  font-size: 75%
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
