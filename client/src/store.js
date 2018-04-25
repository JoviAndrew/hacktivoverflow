import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import swal from 'sweetalert'
import axios from 'axios'

export default new Vuex.Store({
  state: {
    username: '',
    firstname: '',
    lastname: '',
    questions: [],
    answers: [],
    detailQuestion: [],
    isLogin: false
  },
  mutations: {
    renewQuestions (state, questionData) {       
      state.questions = questionData
    },
    renewQuestion (state, questionData){
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
      axios.post(`http://localhost:3000/home/post-question`, {header: item.header, postText: item.postText}, {headers: {token: item.token}})
      .then(function(response){
        swal('Success', response.data.message)
        dispatch('getAllQuestions')
      })
      .catch(function(err){
        swal('Error while posting your question', err, 'warning')
      })
    },
    updateOneQuestion({dispatch}, item){
      axios.put(`http://localhost:3000/home/update/${item.questionId}`, {header: item.header, postText: item.postText}, {headers: {token: item.token}})
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
        dispatch('getAllQuestions')
      })
      .catch(function(err){
        swal('Error while deleting your question', "warning")
      })
    },
  },
  getters: {
    getQuestions: state => {
      return state.questions
    },
  }
})
