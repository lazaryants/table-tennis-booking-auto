<template>
  <div class="modal-backdrop1" @click="$emit('close')"></div>
  <div id="myModal" class="modal1">
    <div class="modal-content1" style="text-align: center">
      <h3>
        <strong>
          Этот стол уже забронирован.
        </strong>
      </h3>

      <p v-if="username">
        Пользователь: <strong>{{ username }}</strong>
      </p>

      <button
        class="btn primary"
        @click="$emit('close')"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],

  props: {
    username: {
      type: String,
      default: ''
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
