<script setup>
  import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
  import { ref, defineProps, defineEmits, watch } from "vue";
  import Swal from "sweetalert2";

  const props = defineProps({
    visible: Boolean,
    title: String,
  });

  const emit = defineEmits(["update:visible", "submit"]);

  const popupVisible = ref(props.visible);

  const fileInput = ref(null);
  const errorMessage = ref("");

  watch(
    () => props.visible,
    (val) => (popupVisible.value = val)
  );
  watch(popupVisible, (val) => emit("update:visible", val));

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 5 * 1024 * 1024) {
      errorMessage.value = "Ukuran file tidak boleh lebih dari 5 MB";
      fileInput.value = null;
    } else {
      errorMessage.value = "";
      fileInput.value = e;
    }
  };

  const closePopup = () => {
    fileInput.value.value = "";
    fileInput.value = null;
    errorMessage.value = "";
    emit("update:visible", false);
  };

  const onSubmit = () => {
    if (!fileInput.value.target) {
      setTimeout(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Silakan pilih file yang valid (maks 5 MB)!`,
        });
      }, 10);

      // errorMessage.value = "";
      // emit("update:visible", false);
      return;
    }

    emit("submit", fileInput.value);
    emit("update:visible", false);
  };
</script>

<template>
  <DxPopup
    v-model:visible="popupVisible"
    :show-title="true"
    :title="title"
    :width="400"
    :height="250"
  >
    <template #default>
      <form @submit.prevent="onSubmit">
        <div class="input-group mb-3">
          <input
            type="file"
            class="form-control"
            ref="fileInput"
            @change="handleFileChange"
            accept=".xlsx, .xls"
          />
        </div>
        <div class="input-group">
          <label>Maximum File Size: 5 MB</label>
          <p v-if="errorMessage" class="text-danger mt-2">
            {{ errorMessage }}
          </p>
        </div>
      </form>

      <DxToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        :options="{ text: 'Cancel', onClick: closePopup }"
      />
      <DxToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        :options="{
          text: 'Simpan',
          type: 'normal',
          stylingMode: 'contained',
          onClick: onSubmit,
        }"
      />
    </template>
  </DxPopup>
</template>

<style scoped>
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 10px;
  }

  .text-danger {
    color: #dc3545;
  }
</style>
