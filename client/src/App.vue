<template>
  <div id="app">
    <div class="row">
      <div class="col-12">
        <nav class="navbar justify-content-between navbar-light bg-light">
          <strong><a class="navbar-brand navbar-nav mr-auto">Hacktiv-Overflow</a></strong>
            <button class="btn btn-outline-primary" @click="goToHome">Home</button>
            <button v-if="isLogin" class="btn btn-outline-danger my-2 my-sm-0" @click="doLogout">Log out</button>
            <button v-else class="btn btn-outline-success my-2 my-sm-0" @click="gotoLogin">Log in</button>
        </nav>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import swal from 'sweetalert'

export default {
  computed: {
    ...mapState(['isLogin'])
  },
  created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.$store.commit('changeStatusTrue')
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    goToHome () {
      this.$router.push('/')
      this.$store.dispatch('getAllQuestions')
    },
    gotoLogin () {
      this.$router.push('/login')
    },
    doLogout () {
      swal({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((logout) => {
          if (logout) {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            localStorage.removeItem('firstname')
            localStorage.removeItem('lastname')
            this.$router.push('/')
            this.$store.commit('changeStatusFalse')
            this.$store.dispatch('getAllQuestions')
            swal('You have successfully logged out!', { icon: 'success' })
          }
        })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
