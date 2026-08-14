<template>
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <div id="myModal" class="modal">
      <div class="modal-content" v-if="modalType === 'create'">
        <center><h3><strong>Вы не можете записаться на интервал в прошлом!</strong></h3></center>
      </div>

      <div class="modal-content" v-if="modalType === 'delete'">
        <center><h3><strong>Вы не можете удалить записанный интервал в прошлом, а также в настоящем за 2 часа до его начала!</strong></h3></center>
      </div>

      <div class="modal-content" v-if="modalType === 'deleteConfirm'">
        <center><h3><strong>Вы уверены, что хотите удалить свою запись?</strong></h3></center>
        <center><button class="btn primary">Да</button> <button class="btn warning" @click="$emit('close')">Нет</button></center>
      </div>

      <div class="modal-content" v-if="modalType === 'creationConfirm'">
        <center><h3><strong>Вы уверены, что хотите записаться на {{date}} c {{hour - 1}}:00 до {{hour}}:00 на стол номер {{table}}?</strong></h3></center>
        <center><button class="btn primary">Да</button> <button class="btn warning" @click="$emit('close')">Нет</button></center>
      </div>
    </div>
</template>

<script>
import {ref} from "vue";
export default {
  emits: ['close'],
  props: {
    modalType: {
      type: String
    },
     date: {
      type: String
    },
     hour: {
      type: Number
    },
    table: {
      type: Number
    }
  }
}

</script>

<style scoped>

</style>