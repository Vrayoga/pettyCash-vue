<script setup>
  import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
  import { ref, defineProps, defineEmits, watch, computed } from "vue";

  const props = defineProps({
    visible: Boolean,
    title: String,
    formData: Object,
    selectData: Object,
  });

  const form = ref({
    costType: "",
    name: "",
    stdPaiMethod: "",
    dataAreaId: "",
    description: "",
    isInactive: 0,
  });

  const isNonAktif = computed({
    get: () => form.value.isInactive === 1,
    set: (val) => {
      form.value.isInactive = val ? 1 : 0;
    },
  });

  const errors = ref({});

  const emit = defineEmits(["update:visible", "submit"]);

  const popupVisible = ref(props.visible);

  watch(
    () => props.visible,
    (val) => (popupVisible.value = val)
  );
  watch(popupVisible, (val) => emit("update:visible", val));
  watch(
    () => props.formData,
    (newVal) => {
      if (newVal) form.value = { ...newVal };
    },
    { immediate: true }
  );

  const closePopup = () => {
    errors.value = {};
    emit("update:visible", false);
  };

  const validateFirst = () => {
    errors.value = {};
    if (!form.value.costType)
      errors.value.costType = "Expense Category tidak boleh kosong!";
    if (!form.value.name)
      errors.value.name = "Expense Subcategory Name tidak boleh kosong!";
    if (!form.value.stdPaiMethod)
      errors.value.stdPaiMethod = "Payment tidak boleh kosong!";

    return Object.keys(errors.value).length === 0;
  };

  const onSubmit = () => {
    if (validateFirst()) {
      errors.value = {};
      emit("submit", { ...form.value });
    }
  };
</script>

<template>
  <DxPopup
    v-model:visible="popupVisible"
    :show-title="true"
    :title="title"
    :width="700"
    :height="500"
  >
    <template #default>
      <form @submit.prevent="onSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label>Expense Category <span class="required">*</span></label>
            <input
              v-model="form.costType"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.costType }"
              :disabled="true"
            />
            <small v-if="errors.costType" class="text-danger">
              {{ errors.costType }}
            </small>
          </div>

          <div class="form-group">
            <label
              >Expense Subcategory Name <span class="required">*</span></label
            >
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.name }"
            />
            <small v-if="errors.name" class="text-danger">
              {{ errors.name }}
            </small>
          </div>

          <div class="form-group">
            <label>Dataarea</label>
            <input
              v-model="form.dataAreaId"
              type="text"
              class="form-control"
              :disabled="true"
            />
          </div>

          <div class="form-group">
            <label>Payment <span class="required">*</span></label>
            <select
              v-model="form.stdPaiMethod"
              :class="{ 'is-invalid': errors.stdPaiMethod }"
              class="form-select"
            >
              <option disabled value="">-- Pilih item --</option>
              <option
                v-for="item in props.selectData"
                :key="item.settingId"
                :value="item.tag1.toUpperCase()"
              >
                {{ item.tag1.toUpperCase() }}
              </option>
            </select>
            <small v-if="errors.stdPaiMethod" class="text-danger">
              {{ errors.stdPaiMethod }}
            </small>
          </div>

          <div class="form-group">
            <label for="deskripsi" class="form-label">Description</label>
            <textarea
              id="deskripsi"
              class="form-control"
              rows="4"
              placeholder="Tulis deskripsi di sini..."
              v-model="form.description"
            ></textarea>
          </div>

          <div class="form-group">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="fiturSwitch"
                v-model="isNonAktif"
              />
              <label class="form-check-label" for="fiturSwitch">
                {{ isOn ? "Active" : "Inactive" }}
              </label>
            </div>
          </div>
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

  .required {
    color: #cc1616;
    font-weight: bold;
  }

  .is-invalid {
    border-color: #dc3545;
  }

  .text-danger {
    color: #dc3545;
  }
</style>
