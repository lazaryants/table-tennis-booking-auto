<template>
    <form class="card" @submit.prevent="onSubmit">
      <h1>Войти в систему</h1>
      <div :class="['form-control1', {invalid: eError}]">
        <label for="username">Логин</label>
        <input id="username" v-model="username" @blur="eBlur">
        <small v-if="eError">{{ eError }}</small>
      </div>
      <div :class="['form-control1', {invalid: pError}]">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" @blur="pBlur">
        <small v-if="pError">{{ pError }}</small>
      </div>
      <div class="signup-link">
        <router-link to="/signUp">Зарегистрироваться!</router-link>
      </div>
      <button class="btn primary item" type="submit" :disabled="isSubmitting">Войти</button>
    </form>
</template>
<script>
import {useLoginForm} from "@/use/login-form";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {error} from "@/utils/error";
export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    if (route.query.message) {
      store.dispatch('setMessage', {
        value: error(route.query.message),
        type: 'warning'
      })
    }
    return {...useLoginForm()}
  }
}
</script>
<style scoped>
.signup-link {
  margin: 15px 0 10px;
  text-align: center;
}
.signup-link a {
  font-size: 1.25rem;
  color: #03a147;
  text-decoration: none;
  font-weight: 600;
}
.signup-link a:hover {
  text-decoration: underline;
}
</style>
