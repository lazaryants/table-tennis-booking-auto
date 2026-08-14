<template>
  <component :is="layout + '-layout'" v-if="layout"></component>
</template>

<script>
  import {computed} from "vue";
  import MainLayout from "@/layout/MainLayout"
  import AuthLayout from "@/layout/AuthLayout"
  import {useRoute} from "vue-router/dist/vue-router";

  export default {
    setup() {
      const route = useRoute()

      console.log(route.meta.layout)

      return {
        layout: computed(() => route.meta.layout)
      }
    },
    components: {MainLayout, AuthLayout}
  }
</script>
