<template>
  <div class="question">
    <div class="row mt-2">
      <div class="header col-xs-12 col-sm-12 col-lg-9">
        <h3>{{detailQuestion.header}}</h3>
      </div>
      <div class="col-xs-12 col-sm-12 col-lg-3 buttonAsk">
        <div class="col-12">
          <button class="btn btn-outline-primary" data-toggle="modal" data-target="#questionModal" @click="setForCreate">Ask Question</button>
        </div>
        <div v-if="username === detailQuestion.username" class="mt-3 col-12">
          <button class="btn btn-link" data-toggle="modal" data-target="#editModal" @click="setForEdit(detailQuestion)">Edit</button>
          <button class="btn btn-link" @click="deleteQuestion">Delete</button>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-lg-9">
        <p>{{detailQuestion.post_text}}</p>
        <div>
          <p style="font-size: 12px">Posted by:<strong> {{detailQuestion.user.firstname}} {{detailQuestion.user.lastname}}</strong></p>
          <p style="font-size: 12px">At: <strong>{{detailQuestion.createdAt.getFullYear()}}-{{detailQuestion.createdAt.getMonth()}}-{{detailQuestion.createdAt.getDate()}} {{detailQuestion.createdAt.getHours()}}:{{detailQuestion.createdAt.getMinutes()}}:{{detailQuestion.createdAt.getSeconds()}}</strong></p>
        </div>
      </div>
      <div class="side col-xs-12 col-sm-12 col-lg-3">
        <p>Is this question useful?</p>
        <button class="btn btn-success" @click="voteUp">Yes</button>
        <button class="btn btn-danger" @click="voteDown">No</button>
        <div class="votes">
          <label><strong>Votes</strong></label>
          <p>{{detailQuestion.up.length - detailQuestion.down.length}}</p>
        </div>
      </div>
      <div class="columnAnswer col-xs-12 col-sm-12 col-lg-9">
        <h4 class="uppercase" style="text-decoration: underline">Answers</h4>
        <div class="answer row" v-for="(answer, index) in detailQuestion.answers" :key="index">
          <div class="mt-3 col-xs-12 col-sm-9 col-lg-9">
            <p>{{answer.post_text}}</p>
            <div class="detail pt-2">
              <p style="font-size: 12px">Posted by: <strong>{{answer.user.firstname}} {{answer.user.lastname}}</strong></p>
              <p style="font-size: 12px">At: <strong>{{answer.createdAt.getFullYear()}}-{{answer.createdAt.getMonth()}}-{{answer.createdAt.getDate()}} {{answer.createdAt.getHours()}}:{{answer.createdAt.getMinutes()}}:{{answer.createdAt.getSeconds()}}</strong></p>
              <button v-if="username === answer.username" style="font-size: 12px" class="btn btn-link" @click="deleteAnswer(answer._id)">Remove</button>
            </div>
          </div>
          <div class="mt-3 col-xs-12 col-sm-3 col-lg-3">
            <p>Is this answer helpful?</p>
            <button class="btn btn-success" @click="voteUpAnswer(answer._id)">Yes</button>
            <button class="btn btn-danger" @click="voteDownAnswer(answer._id)">No</button>
            <div class="votes">
              <label><strong>Votes</strong></label>
              <p>{{answer.up.length - answer.down.length}}</p>
            </div>
          </div>
        </div>
        <div class="postAnswer col-xs-12 col-lg-9 mt-3">
        <textarea cols="70" rows="8" v-model="postTextAnswer"></textarea>
        <button class="btn btn-primary mt-3" @click="addAnswer">Post your answer</button>
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

  <!-- Modal Edit -->
  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModal" aria-hidden="true">
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
          <button type="button" class="btn btn-primary" data-dismiss="modal" @click="updateQuestion">Edit</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'question',
  data () {
    return {
      username: '',
      postTextAnswer: '',
      postCreator: true,
      header: '',
      postText: ''
    }
  },
  computed: {
    ...mapState(['detailQuestion', 'isLogin'])
  },
  beforeCreate () {
    this.$store.dispatch('getOneQuestion', this.$route.params.id)
  },
  created () {
    let tempUser = localStorage.getItem('username')
    if(tempUser !== null) {
      this.username = tempUser
    }
  },
  methods: {
    addAnswer () {
      let post = this.postTextAnswer
      let token = localStorage.getItem('token')
      let items = {
        token: token,
        post: post,
        id: this.$route.params.id
      }
      this.$store.dispatch('addNewAnswer', items)
      this.postTextAnswer = ''
    },
    voteUp () {
      let token = localStorage.getItem('token')
      let items = {
        token: token,
        id: this.$route.params.id
      }
      this.$store.dispatch('votePositive', items)
    },
    voteDown () {
      let token = localStorage.getItem('token')
      let items = {
        token: token,
        id: this.$route.params.id
      }
      this.$store.dispatch('voteNegative', items)
    },
    voteUpAnswer (id) {
      let token = localStorage.getItem('token')
      let items = {
        token: token,
        answerId: id,
        questionId: this.$route.params.id
      }

      this.$store.dispatch('votePositiveAnswer', items)
    },
    voteDownAnswer (id) {
      let token = localStorage.getItem('token')
      let items = {
        token: token,
        answerId: id,
        questionId: this.$route.params.id
      }
      this.$store.dispatch('voteNegativeAnswer', items)
    },
    setForCreate () {
      this.header = ''
      this.postText = ''
    },
    createNewQuestion () {
      let header = this.header
      let postText = this.postText
      let token = localStorage.getItem('token')

      let item = {
        header: header,
        postText: postText,
        token: token
      }

      this.header = ''
      this.postText = ''
      this.$store.dispatch('addQuestion', item)
      this.$router.push('/index')
    },
    setForEdit (data) {
      this.header = data.header
      this.postText = data.post_text
    },
    updateQuestion () {
      let header = this.header
      let postText = this.postText
      let token = localStorage.getItem('token')

      let item = {
        header: header,
        postText: postText,
        token: token,
        questionId: this.$route.params.id
      }

      this.header = ''
      this.postText = ''
      this.$store.dispatch('updateOneQuestion', item)
    },
    deleteQuestion () {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this data!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          let token = localStorage.getItem('token')
          let item = {
            questionId: this.$route.params.id,
            token: token
          }
          this.$store.dispatch('deleteQuestion', item)
        }
      })
    },
    deleteAnswer (answerId) {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this data!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          let token = localStorage.getItem('token')
          let item = {
            answerId: answerId,
            questionId: this.$route.params.id,
            token: token
          }
          this.$store.dispatch('deleteAnswer', item)
        }
      })
    }
  }
}
</script>

<style scoped>
.modal-body{
  display: flex;
  flex-direction: column
}
textarea{
  resize: none
}
.side{
  border-left: 1px solid lightblue;
  height: 100%;
  padding-top: 5%
}
.columnAnswer{
  padding-top: 10%
}
.votes{
  padding-top: 10%;
  font-size: 20px
}
.header{
  margin-top: 3%
}
.buttonAsk{
  margin-top: 3%;
  border-left: 1px solid lightblue
}
.postAnswer {
  display: flex;
  flex-direction: column;
  margin-left: 12%
}
.answer{
  margin-top: 3%;
  border: 2px solid lightblue;
  background-color: rgb(238, 238, 238)
}
</style>
