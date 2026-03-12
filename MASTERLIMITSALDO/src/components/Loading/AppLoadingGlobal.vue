<script setup>
  import { state } from "@/stores/loadingStore";
  import { DxLoadPanel } from "devextreme-vue/load-panel";
</script>

<template>
  <DxLoadPanel
    :position="{ of: '#main-router-view' }"
    v-model:visible="state.isLoading"
    :show-indicator="true"
    :show-pane="true"
    :shading="true"
    shading-color="rgba(0,0,0,0.1)"
  />
</template>
