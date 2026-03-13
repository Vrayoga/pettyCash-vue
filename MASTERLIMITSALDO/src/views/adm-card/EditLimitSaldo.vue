<script setup>
import { ref } from 'vue'
import { apiSelf } from '@/helper/ourAxios'

const props = defineProps({ 
  titleProject: { type: String, default: 'Edit Limit Saldo' }, 
  id: String, 
  user: String 
})

const formData = ref({
  npk: props.id || '',
  limitSaldo: ''
})

const handleSimpan = async () => {
  try {
    const response = await apiSelf.put(`/api/petty-cash/update/${formData.value.npk}`, { limitSaldo: formData.value.limitSaldo })
    
    if (response.data && response.status === 200) {
      alert("Limit Saldo berhasil diperbarui!")
      window.history.back()
    } else {
      alert("Gagal memperbarui Limit Saldo dari server!")
    }
  } catch (error) {
    alert("Error: " + error.message)
  }
}

const handleCancel = () => {
  window.history.back()
}
</script>

<template>
  <div class="bg-light-gray">
    <!-- MAIN CONTENT -->
    <main class="container-fluid px-4 mt-4 mb-5">
      
      <!-- TITLE ROW -->
      <div class="d-flex justify-content-between align-items-center mb-4 mt-2 section-header">
        <h3 class="fw-semibold text-dark m-0">{{ props.titleProject }} - {{ props.id }}</h3>
      </div>

      <!-- FORM CARD -->
      <div class="card shadow-sm border-0 rounded-3 p-4">
        <!-- Form Content -->
        <div class="row g-4 mb-5">
          <div class="col-md-6">
            <label class="form-label text-muted small fw-medium mb-1">NPK</label>
            <input type="text" v-model="formData.npk" class="form-control form-control-sm custom-input" disabled placeholder="NPK">
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-md-6">
            <label class="form-label text-muted small fw-medium mb-1">Limit Saldo</label>
            <input type="text" v-model="formData.limitSaldo" class="form-control form-control-sm custom-input" placeholder="Masukkan Limit Saldo Baru">
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex gap-2">
          <button class="btn btn-warning text-white px-4 custom-modal-btn" style="background-color: #f26f21; border-color: #f26f21;" @click="handleSimpan">Simpan</button>
          <button class="btn px-4 custom-btn-outline-orange custom-modal-btn" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.bg-light-gray {
  background-color: #f5f5f5;
}

.text-dark {
  color: #333;
}

.text-secondary {
  color: #6c757d;
}

.section-header h3 {
  font-weight: 600;
}

.custom-input {
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

.custom-modal-btn {
  font-weight: 500;
}

.custom-btn-outline-orange {
  border-color: #f26f21;
  color: #f26f21;
}

.custom-btn-outline-orange:hover {
  background-color: #f26f21;
  color: white;
}
</style>
