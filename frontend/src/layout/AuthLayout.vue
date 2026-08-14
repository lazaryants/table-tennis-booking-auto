<template>
  <the-navbar></the-navbar>
  <div class="container with-nav">
    <app-message></app-message>
    <router-view></router-view>
  </div>
</template>
<script>
import TheNavbar from "@/components/TheNavbar";
import AppMessage from "@/components/ui/AppMessage";
export default {
  name: "AuthLayout",
  components: {AppMessage, TheNavbar}
}
</script>
<style scoped>
</style>
