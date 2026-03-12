<script setup>
import IconImg from "../../assets/img/logo-mpm.webp";
import { useSessionStore } from "@/helper/sessionStore";

const sessionStore = useSessionStore();
</script>

<template>
  <div class="border-top shadow-sm border-5 p-1 pb-4" style="border-top-color: #f26f21 !important;">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <img :src="IconImg" alt="icon mpm" style="width: 100px" />
        </div>
        <div>
          <small>
            <b>VA MSO</b> |
            <span id="header-user">{{ sessionStore.sessionData.DOMAIN }}/{{ sessionStore.sessionData.USER_ID }}</span>
            |
            <span id="header-md">{{ sessionStore.sessionData.DATAAREA_ID }} -
              {{ sessionStore.sessionData.MAIN_DEALER_ID }} -
              {{ sessionStore.sessionData.SITE_ID_MAPPING }}</span>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
