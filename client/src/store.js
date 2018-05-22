import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import swal from 'sweetalert'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    firstname: '',
    lastname: '',
    questions: [],
    detailQuestion: [],
    isLogin: false
  },
  mutations: {
    renewQuestions (state, questionData) {
      questionData.forEach(question => {
        let date = new Date(question.createdAt)
        question.createdAt = date
      })
      state.questions = questionData
    },
    renewQuestion (state, questionData) {
      let date = new Date(questionData.createdAt)
      questionData.createdAt = date
      questionData.answers.forEach(answer => {
        let date = new Date(answer.createdAt)
        answer.createdAt = date
      })
      state.detailQuestion = questionData
    },
    changeStatusTrue (state) {
      state.isLogin = true
    },
    changeStatusFalse (state) {
      state.isLogin = false
    }
  },
  actions: {
    getAllQuestions ({ commit }) {
      axios.get('https://hacktiv-overflow-server.jovianandrewhari.cf/home/show-questions')
        .then(function (response) {
          commit('renewQuestions', response.data.data)
        })
        .catch(function (err) {
          swal(err.response.data.message, { icon: 'warning' })
        })
    },
    getOneQuestion ({ commit }, id) {
      axios.get(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/show-questions/${id}`)
        .then(function (questionData) {
          commit('renewQuestion', questionData.data.data)
        })
        .catch(function (err) {
          swal('Error while gettting question', err, 'warning')
          swal(err.response.data.message, { icon: 'warning' })
        })
    },
    addNewAnswer ({ dispatch }, item) {
      axios.post(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/post-answer/${item.id}`, {postText: item.post}, {headers: {token: item.token}})
        .then(function (response) {
          swal('Success', response.data.message)
          dispatch('getOneQuestion', item.id)
        })
        .catch(function (err) {
          swal('Error while posting answer', err, 'warning')
        })
    },
    votePositive ({dispatch}, item) {
      axios.put(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/voteup-question/${item.id}`, {}, {headers: {token: item.token}})
        .then(function (response) {
          dispatch('getOneQuestion', item.id)
        })
        .catch(function (err) {
          swal('Error while voting question', err, 'warning')
        })
    },
    voteNegative ({ dispatch }, item) {
      axios.put(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/votedown-question/${item.id}`, {}, {headers: {token: item.token}})
        .then(function (response) {
          dispatch('getOneQuestion', item.id)
        })
        .catch(function (err) {
          swal('Error while voting question', err, 'warning')
        })
    },
    votePositiveAnswer ({ dispatch }, item) {
      axios.put(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/voteup-answer/${item.answerId}`, {}, {headers: {token: item.token}})
        .then(function (response) {
          dispatch('getOneQuestion', item.questionId)
        })
        .catch(function (err) {
          swal('Error while voting answer', err, 'warning')
        })
    },
    voteNegativeAnswer ({ dispatch }, item) {
      axios.put(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/votedown-answer/${item.answerId}`, {}, {headers: {token: item.token}})
        .then(function (response) {
          dispatch('getOneQuestion', item.questionId)
        })
        .catch(function (err) {
          swal('Error while voting answer', err, 'warning')
        })
    },
    addQuestion ({dispatch}, item) {
      axios.post(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/post-question`,
        {
          header: item.header,
          postText: item.postText,
          username: item.username
        },
        {
          headers: {token: item.token}
        })
        .then(function (response) {
          swal('Success', response.data.message)
          let id = response.data.response._id
          router.push(`/question/${id}`)
          dispatch('getAllQuestions')
        })
        .catch(function (err) {
          swal('Error while posting your question', err, 'warning')
        })
    },
    updateOneQuestion ({dispatch}, item) {
      axios.put(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/update/${item.questionId}`,
        {
          header: item.header,
          postText: item.postText
        },
        {
          headers: {token: item.token}
        })
        .then(function (response) {
          swal('Success', response.data.message)
          dispatch('getAllQuestions')
          dispatch('getOneQuestion', item.questionId)
        })
        .catch(function (err) {
          swal('Error while updating your question', err, 'warning')
        })
    },
    deleteQuestion ({ dispatch }, item) {
      axios.delete(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/delete-question/${item.questionId}`,
        {
          headers: { token: item.token }
        })
        .then(function (response) {
          swal('Success', response.data.message)
          dispatch('getAllQuestions')
          router.push('/')
        })
        .catch(function (err) {
          swal('Error while deleting your question', err, 'warning')
        })
    },
    deleteAnswer ({ dispatch }, item) {
      axios.delete(`https://hacktiv-overflow-server.jovianandrewhari.cf/home/delete-answer/${item.answerId}`,
        {
          headers:
          {
            token: item.token,
            id: item.questionId
          }
        })
        .then(function (response) {
          swal('Success', response.data.message)
          dispatch('getOneQuestion', item.questionId)
        })
        .catch(function (err) {
          swal(err.response.data.message, {icon: 'warning'})
        })
    },
    doLogin ({commit}, loginData) {
      axios.post('https://hacktiv-overflow-server.jovianandrewhari.cf/index/login', {username: loginData.username, password: loginData.password})
        .then(function (response) {
          swal({
            title: 'Success',
            text: response.data.message,
            icon: 'success',
            buttons: 'OK'
          })
          router.push('/')
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('username', response.data.username)
          commit('changeStatusTrue')
        })
        .catch(function (err) {
          swal(err.response.data.message, {icon: 'warning'})
        })
    },
    registerUser ({commit}, registerData) {
      axios.post('https://hacktiv-overflow-server.jovianandrewhari.cf/index/register',
        {
          username: registerData.username,
          password: registerData.password,
          firstname: registerData.firstname,
          lastname: registerData.lastname
        })
        .then(function (response) {
          let message = response.data.message
          if (message !== 'success register a new user') {
            swal(message, {icon: 'warning'})
          } else {
            swal({title: 'Success', text: response.data.message, icon: 'success'})
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', response.data.username)
            commit('changeStatusTrue')
          }
        })
        .catch(function (err) {
          swal(err.response.data.message, {icon: 'warning'})
        })
    },
    loginFB ({ commit, dispatch }, userProfile) {
      let username = userProfile.email
      let firstname = userProfile.first_name
      let lastname = userProfile.last_name
      let fbId = userProfile.id
      axios.post('https://hacktiv-overflow-server.jovianandrewhari.cf/index/login-fb', {
        username: username,
        firstname: firstname,
        lastname: lastname,
        fbId: fbId
      })
        .then(function (response) {
          swal({
            title: 'Success',
            text: response.data.message,
            icon: 'success'
          })
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('firstname', response.data.firstname)
          localStorage.setItem('lastname', response.data.lastname)
          localStorage.setItem('username', response.data.username)
          commit('changeStatusTrue')
          dispatch('getAllQuestions')
          router.push('/')
        })
        .catch(function (err) {
          swal({
            title: 'Error!',
            text: err.response.data.message,
            icon: 'warning'
          })
        })
    }
  }
})
