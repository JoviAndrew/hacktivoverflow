<template>
  <div id="app">
    <div class="row">
      <div class="col-12">
        <nav class="navbar justify-content-between navbar-light bg-light">
          <strong><a class="navbar-brand navbar-nav mr-auto" href="">Hacktiv-Overflow</a></strong>
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

export default {
  data () {
    return {
      showLogin: true,
      showLogout: false
    }
  },
  computed: mapState([
    'isLogin'
  ]),
  methods: {
    gotoLogin () {
      this.$router.push('/login')
    },
    doLogout () {
      localStorage.clear()
      this.showLogin = true
      this.showLogout = false
      this.$router.push('/')
      this.$store.commit('changeStatusFalse')
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
