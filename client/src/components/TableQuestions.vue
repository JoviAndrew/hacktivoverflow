<template>
  <div class="table-questions">
      <div class="row">
        <div class="col-sm-12 col-lg-8">
          <table class="table table-hover">
            <tr v-for="(question, index) in questions" :key="index">
              <td>
                <div class="col-12 mt-4">
                  {{question.up.length - question.down.length}}
                </div>
                <div class="col-12">
                  <label>Votes</label>
                </div>
              </td>
              <td>
                <div class="col-12 mt-4">
                  {{question.answers.length}}
                </div>
                <div class="col-12">
                  <label>Answers</label>
                </div>
              </td>
              <td>
                <div class="col-12">
                  <router-link class="headerQuestion btn btn-link" :to="{ name: 'question', params: {id: question._id}}">{{question.header}}</router-link>
                </div>
                <div class="col-12">
                  <span class="details">Submited at <strong>{{question.createdAt.getFullYear()}}-{{question.createdAt.getMonth()}}-{{question.createdAt.getDate()}} {{question.createdAt.getHours()}}:{{question.createdAt.getMinutes()}}:{{question.createdAt.getSeconds()}}</strong> by <strong>{{question.username}}</strong></span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="col-sm-12 col-lg-4">
          <div v-if="isLogin" class="mt-4 col-12">
            <button class="btn btn-outline-primary" data-toggle="modal" data-target="#questionModal" @click="setForCreate">Ask Question</button>
          </div>
        </div>
      </div>
      <!-- Modal Create -->
    <div class="modal fade" id="questionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModal" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>Header: </label>
            <input type="text" class="form-control" v-model="header">
            <label>Question Detail: </label>
            <textarea cols="30" rows="10" class="form-control" v-model="postText"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="createNewQuestion">Create Question</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'table-questions',
  data () {
    return {
      header: '',
      postText: '',
      hide: false
    }
  },
  computed: mapState(['questions', 'isLogin']),
  created () {
    this.$store.dispatch('getAllQuestions')
    let token = localStorage.getItem('token')

    if (token == null) {
      this.hide = true
    } else {
      this.hide = false
    }
  },
  methods: {
    createNewQuestion () {
      let item = {
        header: this.header,
        postText: this.postText,
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username')
      }
      this.setForCreate()
      this.$store.dispatch('addQuestion', item)
    },
    setForCreate () {
      this.header = ''
      this.postText = ''
    }
  }
}
</script>

<style>
.headerQuestion{
  font-size: 24px
}
.details{
  font-size: 12px
}
.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
