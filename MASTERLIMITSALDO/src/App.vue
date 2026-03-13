<script setup>
import HeaderPage from "@/components/Header/HeaderComponent.vue";
import FooterPage from "@/components/Footer/FooterComponent.vue";

import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useSessionStore } from "@/helper/sessionStore";

const route = useRoute();
const sessionStore = useSessionStore();
const sessionReady = ref(false);
const isLoading = ref(true);
const userParam = ref(null);


onMounted(async () => {
  try {
    // Try to restore session from storage first
    const sessionRestored = sessionStore.loadFromStorage();

    // If no session or missing DOMAIN, set a dummy session (do not hit APIs)
    if (!sessionStore.sessionData || !sessionStore.sessionData.DOMAIN) {
      sessionStore.setSession({
        DOMAIN: 'MPM',
        USER_ID: 'admin',
        DATAAREA_ID: '021',
        MAIN_DEALER_ID: 'MD01',
        SITE_ID_MAPPING: 'S01'
      });
    }

    sessionReady.value = true;
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text:
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan.",
    });
    isLoading.value = false;
  }
});
</script>


<template>
  <DxLoadPanel :visible="isLoading" :show-indicator="true" :show-pane="true" position="center" message="Loading..." />

  <div class="d-flex flex-column min-vh-100">
    <HeaderPage v-if="sessionReady" />

    <div class="container flex-fill mt-4 mb-5">
      <router-view v-if="sessionReady" />
    </div>

    <FooterPage />
  </div>
</template>


<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.text-orange {
  color: #f26f21;
}
</style>
