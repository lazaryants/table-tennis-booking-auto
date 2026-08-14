<template>
  <div class="modal-backdrop1" @click="$emit('close')"></div>
    <div id="myModal" class="modal1">
      <div class="modal-content1" style="text-align: center">
        <h3><strong>Вы уверены, что хотите удалить свою запись?</strong></h3>
        <button class="btn primary" @click="deleteTimeLapseTable(i, timelapsestoday); $emit('close')">Да</button> <button class="btn warning" @click="$emit('close')">Нет</button>
      </div>
    </div>
</template>

<script>
import axios from "@/utils/axios";
export default {
  emits: ['close'],
  props: {
    timelapsestoday: Array,
    i: Number,
    chooseDate: Function,
    getTimeLapses: Function
  },
  setup(props) {
    const deleteTimeLapse = async (id) => {
      await axios.delete(`/timelapses/${id}`)
      await props.getTimeLapses()
      await props.chooseDate()
    }

    const deleteTimeLapseTable = async (i, timelapsestoday) => {
      await deleteTimeLapse(timelapsestoday[i].id)
    }

    return {
      deleteTimeLapseTable
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 700px) {
    .modal1 {
      position: fixed;
      top: 60px;
      width: 600px;
      padding: 1rem;
      background: #fff;
      z-index: 1000;
      left: 50%;
      border-radius: 10px;
      transform: translateX(-50%);
      box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
      max-width: 300px;
    }
  }
</style>
