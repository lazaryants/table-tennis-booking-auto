<template>
  <form class="card" @submit.prevent="onSubmit">
    <h1>Регистрация</h1>
    <div :class="['form-control1', {invalid: eError}]">
        <label for="username">Логин</label>
        <input id="username" v-model="username" @blur="eBlur">
        <small v-if="eError">{{ eError }}</small>
    </div>
    <div :class="['form-control1', {invalid: fError}]">
        <label for="first_name">Имя</label>
        <input id="first_name" v-model="first_name" @blur="fBlur">
        <small v-if="fError">{{ fError }}</small>
    </div>
    <div :class="['form-control1', {invalid: lError}]">
        <label for="last_name">Фамилия</label>
        <input id="last_name" v-model="last_name" @blur="lBlur">
        <small v-if="lError">{{ lError }}</small>
    </div>
    <div :class="['form-control1', {invalid: phoneError}]">
        <label for="phone">Номер телефона</label>
        <input id="phone" v-model="phone" @blur="phoneBlur">
        <small v-if="phoneError">{{ phoneError }}</small>
    </div>
    <div :class="['form-control1', {invalid: pError}]">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" @blur="pBlur">
        <small class="password-hint" v-if="!pError">Пароль должен содержать буквы разных регистров, хотя бы одну цифру и один специальный знак</small>
        <small v-if="pError">{{ pError }}</small>
    </div>
    <button class="btn primary item" type="submit" :disabled="isSubmitting">Зарегистрироваться</button>
  </form>
</template>
<script>
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {useSignUpForm} from "@/use/signup-form";
import {error} from "@/utils/error";
export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    if (route.query.message === 'REGISTERED') {
      store.dispatch('setMessage', {
        value: error(route.query.message),
        type: 'primary'
      })
    }
    if (route.query.message === 'danger') {
      store.dispatch('setMessage', {
        value: error(route.query.message),
        type: 'warning'
      })
    }
    return {
      ...useSignUpForm()
    }
  }
}
</script>
<style scoped>
.password-hint {
  color: #666;
  font-size: 0.85rem;
  display: block;
  margin-top: 4px;
}
</style>
