<script setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: [Function, Object],
    default: null,
  },
  iconPosition: {
    type: String,
    default: "left",
  },
  type: {
    type: String,
    default: "primary",
  },
  as: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "filled",
    validator: (value) => ["filled", "outline"].includes(value),
  },
});

const typeClasses = computed(() => {
  const baseType = props.type === 'primary' ? 'primary' :
                   props.type === 'secondary' ? 'secondary' :
                   props.type === 'danger' ? 'danger' :
                   props.type === 'warning' ? 'warning' :
                   props.type === 'success' ? 'success' : 'light';
                   
  if (props.variant === "outline") {
    return `btn-outline-${baseType} custom-btn-outline`;
  }

  return `btn-${baseType} custom-btn-filled`;
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};
</script>

<template>
  <button
    :class="[
      'btn d-inline-flex align-items-center justify-content-center px-4 py-2 custom-btn',
      props.disabled && 'disabled pe-none',
      typeClasses,
      icon && text ? 'gap-2' : '',
    ]"
    :type="as"
    @click="handleClick"
    :disabled="props.disabled"
  >
    <component :is="icon" size="18" v-if="iconPosition === 'left'" />
    <span>{{ text }}</span>
    <component :is="icon" size="18" v-if="iconPosition === 'right'" />
  </button>
</template>

<style scoped>
.custom-btn {
  font-size: 0.875rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

/* Custom override for 'warning' to match MPM Orange if passed as warning */
.btn-warning.custom-btn-filled {
  background-color: #f26f21;
  border-color: #f26f21;
  color: #fff;
}
.btn-warning.custom-btn-filled:hover {
  background-color: #d95c1b;
  border-color: #d95c1b;
}

.btn-outline-warning.custom-btn-outline {
  color: #f26f21;
  border-color: #f26f21;
}
.btn-outline-warning.custom-btn-outline:hover {
  background-color: #f26f21;
  color: #fff;
}
</style>
