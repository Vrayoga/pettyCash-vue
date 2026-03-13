<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiSelf } from '@/helper/ourAxios'
import Swal from 'sweetalert2'

const router = useRouter()
const props = defineProps({ 
  titleProject: { type: String, default: 'Tambah Kartu' }, 
  user: String 
})

const formData = ref({
  npk: '',
  namaPic: '',
  department: '',
  divisi: '',
  nomorRekening: '',
  namaBank: '',
  expiredDate: '',
  limitSaldo: '',
  tipeKartu: 'Card',
  status: 'Active'
})

const handleSimpan = async () => {
  try {
    // simpan data dummy
    const result = await Swal.fire({
      title: 'Berhasil!',
      text: 'Data berhasil disimpan.',
      icon: 'success',
      confirmButtonColor: '#f26f21',
    });

    if (result.isConfirmed) {
      router.push('/');
    }

    /*
    // API
    const response = await apiSelf.post('/api/petty-cash/create', formData.value)
    if (response.data && response.status === 200) {
      await Swal.fire('Berhasil!', 'Data berhasil disimpan!', 'success')
      router.push('/')
    }
    */
  } catch (error) {
    Swal.fire('Error!', error.message, 'error')
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
        <h3 class="fw-semibold text-dark m-0">{{ props.titleProject }}</h3>
      </div>

      <!-- FORM CARD -->
      <div class="card shadow-sm border-0 rounded-3 p-4">
        <!-- R1 -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">NPK</label>
            <select v-model="formData.npk" class="form-select form-select-sm custom-input">
              <option value="" disabled>Pilih NPK</option>
              <option value="100234">100234</option>
              <option value="100235">100235</option>
              <option value="100236">100236</option>
              <option value="100248">100248</option>
              <option value="100249">100249</option>
              <option value="100250">100250</option>
              <option value="100251">100251</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Nama PIC</label>
            <input type="text" v-model="formData.namaPic" class="form-control form-control-sm custom-input" placeholder="">
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Department</label>
            <input type="text" v-model="formData.department" class="form-control form-control-sm custom-input" placeholder="">
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Divisi</label>
            <input type="text" v-model="formData.divisi" class="form-control form-control-sm custom-input" placeholder="">
          </div>
        </div>
        
        <!-- R2 -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Nomor Rekening</label>
            <input type="text" v-model="formData.nomorRekening" class="form-control form-control-sm custom-input" placeholder="Masukkan Nomor Rekening">
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Nama Bank</label>
            <input type="text" v-model="formData.namaBank" class="form-control form-control-sm custom-input" placeholder="Masukkan Nama Bank">
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Expired Date</label>
            <input type="date" v-model="formData.expiredDate" class="form-control form-control-sm custom-input" placeholder="mm/yyyy">
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Limit Saldo</label>
            <input type="text" v-model="formData.limitSaldo" class="form-control form-control-sm custom-input" placeholder="Masukkan Limit Saldo">
          </div>
        </div>

        <!-- R3 -->
        <div class="row g-4 mb-5">
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Tipe Kartu</label>
            <select v-model="formData.tipeKartu" class="form-select form-select-sm custom-input">
              <option value="Card">Card</option>
              <option value="Non Card">Non Card</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label text-muted small fw-medium mb-1">Status</label>
            <select v-model="formData.status" class="form-select form-select-sm custom-input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
