<template>
<div id="loginPage">
  <div class="row">
    <div class="mainBody col-12">
      <div class="col-lg-4 col-xs-12"></div>
      <div class="login col-lg-4 col-xs-12">
        <h4 class="headerLogin"><strong>Login</strong></h4>
        <button type="button" scope="public_profile, email, gender" class="btn btn-primary my-2 my-sm-0" @click="openFbLoginDialog">Login with Facebook</button>
        <hr>
        <label>OR</label>
        <hr>
        <input type="text" class="form-control" placeholder="email@mail.com" v-model="username">
        <input type="password" class="form-control mt-3" placeholder="Password"  v-model="password">
        <div>
          <button class="btnLogin btn btn-primary mt-3" @click="doLogin">Log in</button>
        </div>
        <button class="btn btn-link" @click="goToRegister">Don't have an account? Register</button>
      </div>
      <div class="col-lg-4 col-xs-12"></div>
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
/* eslint-disable */

window.fbAsyncInit = function() {
  FB.init({
    appId      : '191927258109113',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.0'
  });
  FB.AppEvents.logPageView()  
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) { return }
  js = d.createElement(s); js.id = id
  js.src = 'https://connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  created () {
    if (localStorage.getItem('token') !== null) {
      this.$router.push('/')
      this.$store.commit('changeStatusTrue')
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
    doLogin () {
      let loginData = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('doLogin', loginData)
    },
    goToRegister () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
input{
  margin: 2%
}

.headerLogin{
  margin: 3%;
  margin-bottom: 5%
}

.login{
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(57, 183, 255);
  border-radius: 25px;
  margin: 3%
}

.mainBody{
  display: flex;
  justify-content: center
}

.btn{
  margin: 2%
}
</style>
