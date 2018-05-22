import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import swal from 'sweetalert'
import axios from 'axios'
import router from './router'

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
    renewQuestion (state, questionData){
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
    getAllQuestions({commit}){
      axios.get('http://localhost:3000/home/show-questions')
      .then(function(response){
        commit('renewQuestions', response.data.data)
      })
      .catch(function(err){
        console.log(err)
      })
    },
    getOneQuestion({commit}, id) {
      axios.get(`http://localhost:3000/home/show-questions/${id}`)
      .then(function(questionData){
        commit('renewQuestion', questionData.data.data)
      })
      .catch(function(err){
        swal('Error while gettting question', err, 'warning')
        console.log(err)
      })
    },
    addNewAnswer({dispatch}, item) {
      axios.post(`http://localhost:3000/home/post-answer/${item.id}`, {postText: item.post}, {headers: {token: item.token}})
      .then(function(response){
        swal('Success', response.data.message)
        dispatch('getOneQuestion', item.id)
      })
      .catch(function(err){
        swal('Error while posting answer', err, 'warning')
      })
    },
    votePositive({dispatch}, item) {
      axios.put(`http://localhost:3000/home/voteup-question/${item.id}`, {}, {headers: {token: item.token}})
      .then(function(response){
        dispatch('getOneQuestion', item.id)
      })
      .catch(function(err){
        swal('Error while voting question', err, 'warning')
      })
    },
    voteNegative({dispatch}, item) {
      axios.put(`http://localhost:3000/home/votedown-question/${item.id}`, {}, {headers: {token: item.token}})
      .then(function(response){
        dispatch('getOneQuestion', item.id)
      })
      .catch(function(err){
        swal('Error while voting question', err, 'warning')
      })
    },
    votePositiveAnswer({dispatch}, item) {
      axios.put(`http://localhost:3000/home/voteup-answer/${item.answerId}`, {}, {headers: {token: item.token}})
      .then(function(response){
        dispatch('getOneQuestion', item.questionId)
      })
      .catch(function(err){
        swal('Error while voting answer', err, 'warning')
      })
    },
    voteNegativeAnswer({dispatch}, item) {
      axios.put(`http://localhost:3000/home/votedown-answer/${item.answerId}`, {}, {headers: {token: item.token}})
      .then(function(response){
        dispatch('getOneQuestion', item.questionId)
      })
      .catch(function(err){
        swal('Error while voting answer', err, 'warning')
      })
    },
    addQuestion({dispatch}, item) {
      axios.post(`http://localhost:3000/home/post-question`,
      {
        header: item.header,
        postText: item.postText,
        username: item.username
      },
      {
        headers: {token: item.token}
      })
      .then(function(response){
        swal('Success', response.data.message)
        let id = response.data.response._id
        router.push(`/question/${id}`)
        dispatch('getAllQuestions')
      })
      .catch(function(err){
        swal('Error while posting your question', err, 'warning')
      })
    },
    updateOneQuestion({dispatch}, item){
      axios.put(`http://localhost:3000/home/update/${item.questionId}`,
      {
        header: item.header,
        postText: item.postText
      },
      {
        headers: {token: item.token}
      })
      .then(function(response){
        swal('Success', response.data.message)
        dispatch('getAllQuestions')
        dispatch('getOneQuestion', item.questionId)
      })
      .catch(function(err){
        swal('Error while updating your question', err, 'warning')
      })
    },
    deleteQuestion({dispatch}, item){
      axios.delete(`http://localhost:3000/home/delete-question/${item.questionId}`,{headers: {token: item.token}})
      .then(function(response){
        swal('Success', response.data.message)
        dispatch('getAllQuestions')
        router.push('/')
      })
      .catch(function(err){
        swal('Error while deleting your question', err, 'warning')
      })
    },
    deleteAnswer({dispatch}, item){
      axios.delete(`http://localhost:3000/home/delete-answer/${item.answerId}`, {headers: {token: item.token, id: item.questionId}})
      .then(function(response){
        swal('Success', response.data.message)
        dispatch('getOneQuestion', item.questionId)
      })
      .catch(function(err){
        swal(err.response.data.message, "warning")
      })
    },
    doLogin ({commit}, loginData) {
      axios.post('http://localhost:3000/index/login', {username: loginData.username, password: loginData.password})
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
          console.log(err)
        })
    },
    registerUser ({commit}, registerData) {
      axios.post('http://localhost:3000/index/register',
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
          console.log(err)
        })
    },
    loginFB ({ commit, dispatch }, userProfile) {
      let username = userProfile.email
      let firstname = userProfile.first_name
      let lastname = userProfile.last_name
      let fbId = userProfile.id
      axios.post('http://localhost:3000/index/login-fb', {
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
  },
})
