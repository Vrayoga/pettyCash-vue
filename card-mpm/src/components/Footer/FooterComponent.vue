<script setup>
import { ref } from 'vue'

const year = ref(new Date().getFullYear())
</script>

<template>
    <footer class="py-3 bottom-0 left-0 w-100 mt-5" style="background-color: #f26f21;">
        <div class="text-center text-light fw-medium">
            MPM Motor &copy;
            <span>{{ year }}</span>
        </div>
    </footer>
</template>

<style scoped>

</style>