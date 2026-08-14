<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #03a147">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Бронирование столов</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Столы</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/userinfo" class="nav-link">Пользователь</router-link>
          </li>
        </ul>
        <form class="d-flex">
          <a href="#" @click.prevent="logout" class="nav-link" v-if="isAuth">Выход</a>
          <router-link to="/auth" v-else class="nav-link">Вход</router-link>
        </form>
      </div>
    </div>
  </nav>
</template>
<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref } from "vue";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const username = ref();
    const isAuth = ref();

    username.value = store.getters["auth/username"];
    isAuth.value = store.getters["auth/isAuthenticated"];

    return {
      logout: () => {
        store.commit("auth/logout");
        router.push("/auth");
      },
      username,
      isAuth,
    };
  },
};
</script>
<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-link {
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.2rem;
  }
  
  .nav-link {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
