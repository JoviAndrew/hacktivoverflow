<template>
  <div class="index">
    <table-questions></table-questions>
  </div>
</template>

<script>
import TableQuestions from '@/components/TableQuestions.vue'

export default {
  name: 'index',
  created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.$store.commit('changeStatusTrue')
    } else {
      this.$router.push('/')
    }
  },
  components: {
    TableQuestions
  }
}
</script>

<style>

</style>
