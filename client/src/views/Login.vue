<template>
<div id="index">
  <div class="row">
    <div class="mainBody col-12">
      <div class="col-4"></div>
      <div class="login col-4">
        <h4 class="headerLogin"><strong>Login</strong></h4>
        <input type="text" class="form-control" placeholder="email@mail.com" v-model="username">
        <input type="password" class="form-control" placeholder="Password"  v-model="password">
        <div>
          <button class="btnLogin btn btn-primary my-2 my-sm-0" @click="doLogin">Log in</button>
        </div>
        <button class="btn btn-link" @click="goToRegister">Don't have an account? Register</button>
      </div>
      <div class="col-4"></div>
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import swal from 'sweetalert'

export default {
  name: 'index',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    doLogin () {
      let username = this.username
      let password = this.password
      let self = this

      axios.post('http://35.197.131.176/index/login', {username: username, password: password})
        .then(function (response) {
          swal({
            title: 'Success',
            text: response.data.message,
            icon: 'success',
            buttons: 'OK'
          })
          console.log(response.data)
          self.$router.push('/index')
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('username', response.data.username)
          this.$store.commit('changeStatusTrue')
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    goToRegister () {
      this.$router.push('/')
    }
  }
}
</script>

<style>

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
