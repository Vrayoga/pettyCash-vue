<script setup>
import { ref } from 'vue'
import HeaderComponent from '@/components/Header/HeaderComponent.vue'
import FooterComponent from '@/components/Footer/FooterComponent.vue'
import AppButton from '@/components/Button/AppButton.vue'
import { useSessionStore } from '@/helper/sessionStore'

const sessionStore = useSessionStore();
// Set mock data so HeaderComponent has something to show
sessionStore.setSession({
    DOMAIN: 'MPM',
    USER_ID: 'admin',
    DATAAREA_ID: '021',
    MAIN_DEALER_ID: 'MD01',
    SITE_ID_MAPPING: 'S01'
});

// Data Dummy Sesuai Gambar Figma
const cards = ref([
    {
        npk: '100234',
        namaPic: 'Andi Pratama',
        department: 'Finance',
        divisi: 'Accounting',
        nomorRekening: '1234567890',
        namaBank: 'BCA',
        expiredDate: '2026-12-01',
        limitSaldo: 'Rp 10.000.000',
        saldoTerpakai: 'Rp 2.500.000',
        sisaSaldo: 'Rp 7.500.000',
        tipeKartu: 'Card',
        status: 'Active'
    },
    {
        npk: '100235',
        namaPic: 'Siti Rahma',
        department: 'Operation',
        divisi: 'Logistic',
        nomorRekening: '9876543210',
        namaBank: 'Mandiri',
        expiredDate: '2027-06-01',
        limitSaldo: 'Rp 5.000.000',
        saldoTerpakai: 'Rp 1.000.000',
        sisaSaldo: 'Rp 4.000.000',
        tipeKartu: 'Non Card',
        status: 'Inactive'
    },
    {
        npk: '100236',
        namaPic: 'Budi Santoso',
        department: 'HR',
        divisi: 'People Development',
        nomorRekening: '4567891230',
        namaBank: 'BNI',
        expiredDate: '2026-09-01',
        limitSaldo: 'Rp 15.000.000',
        saldoTerpakai: 'Rp 5.000.000',
        sisaSaldo: 'Rp 10.000.000',
        tipeKartu: 'Credit Card',
        status: 'Active'
    }
])


// Set pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5) // adjust items per page here

import { computed } from 'vue'

const totalPages = computed(() => {
    return Math.ceil(cards.value.length / itemsPerPage.value)
})

const paginatedCards = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return cards.value.slice(start, end)
})

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
    currentPage.value = page
}

const filterPic = ref('')
const filterNpk = ref('')
const filterRekening = ref('')
const filterStatus = ref('')
const filterTipeOptions = ref('')

// Form Modal State
const showModal = ref(false)
const isEditMode = ref(false)
const editIndex = ref(-1)

// Form Fields Default
const defaultFormData = {
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
}

const formData = ref({ ...defaultFormData })

const handleNew = () => {
    isEditMode.value = false
    editIndex.value = -1
    formData.value = { ...defaultFormData }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const handleSimpan = () => {
    if (isEditMode.value && editIndex.value !== -1) {
        // Update data
        cards.value[editIndex.value] = { ...formData.value }
        alert("Data berhasil diperbarui!")
    } else {
        // Tambah data baru
        cards.value.push({ ...formData.value })
        alert("Data berhasil disimpan!")
    }
    closeModal()
}

const handleEdit = (npk) => {
    const targetIndex = cards.value.findIndex(item => item.npk === npk)
    if (targetIndex !== -1) {
        isEditMode.value = true
        editIndex.value = targetIndex
        formData.value = { ...cards.value[targetIndex] }
        showModal.value = true
    }
}

const handleExport = () => {
   alert("Mode Export to Excel") 
}

const handleHapus = (npk) => {
    if(confirm("Hapus data NPK: " + npk + "?")) {
        alert("Terhapus")
    }
}
</script>

<template>
    <div class="d-flex flex-column min-vh-100 bg-light-gray">
        <!-- HEADER -->
        <HeaderComponent />

        <!-- MAIN CONTENT -->
        <main class="container-fluid flex-fill px-4 mt-4 mb-5">
            
            <!-- TITLE ROW -->
            <div class="d-flex justify-content-between align-items-center mb-4 mt-2 section-header">
                <h3 class="fw-semibold text-dark m-0">Master Kartu Petty Cash</h3>
                <div class="d-flex gap-2">
                    <AppButton type="warning" text="+ New" @click="handleNew" class="btn-orange" />
                    <!-- Replace empty button with icon image if desired, or styled button -->
                    <button class="btn btn-outline-secondary bg-white px-3 fw-bold" @click="handleExport">
                       <i class="bi bi-bar-chart-fill me-1" style="color: #ff6f21;"></i>
                       &#x1F4CA; 
                    </button>
                </div>
            </div>

            <!-- FILTER ROW -->
            <div class="card shadow-sm border-0 rounded-3 mb-4 filter-container">
                <div class="card-body py-3 px-4">
                    <div class="row gx-3 gy-2 align-items-center">
                        <div class="col-12 col-md filter-col">
                            <select v-model="filterPic" class="form-select w-100 form-select-sm">
                                <option value="">All PIC</option>
                                <option value="Andi Pratama">Andi Pratama</option>
                                <option value="Siti Rahma">Siti Rahma</option>
                            </select>
                        </div>
                        <div class="col-12 col-md filter-col">
                            <select v-model="filterNpk" class="form-select w-100 form-select-sm">
                                <option value="">All NPK</option>
                                <option value="100234">100234</option>
                                <option value="100235">100235</option>
                            </select>
                        </div>
                        <div class="col-12 col-md filter-col">
                            <select v-model="filterRekening" class="form-select w-100 form-select-sm">
                                <option value="">All Nomor Rekening</option>
                                <option value="1234567890">1234567890</option>
                            </select>
                        </div>
                        <div class="col-12 col-md filter-col">
                            <select v-model="filterStatus" class="form-select w-100 form-select-sm">
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="col-12 col-md filter-col">
                            <select v-model="filterTipeOptions" class="form-select w-100 form-select-sm">
                                <option value="">All Tipe Kartu</option>
                                <option value="Card">Card</option>
                                <option value="Non Card">Non Card</option>
                                <option value="Credit Card">Credit Card</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-auto mt-3 mt-md-0 d-flex align-items-stretch">
                            <button class="btn btn-warning text-white btn-sm w-100 filter-btn shadow-sm d-flex align-items-center justify-content-center m-0" style="background-color: #f26f21; border-color: #f26f21;">
                                <i class="bi bi-search me-1"></i> Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DATA TABLE -->
            <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-borderless table-hover mb-0 custom-table align-middle">
                        <thead>
                            <tr>
                                <th class="text-secondary fw-medium py-3 ps-4">NPK</th>
                                <th class="text-secondary fw-medium py-3">Nama PIC</th>
                                <th class="text-secondary fw-medium py-3">Department</th>
                                <th class="text-secondary fw-medium py-3">Divisi</th>
                                <th class="text-secondary fw-medium py-3">Nomor Rekening</th>
                                <th class="text-secondary fw-medium py-3">Nama Bank</th>
                                <th class="text-secondary fw-medium py-3">Expired Date</th>
                                <th class="text-secondary fw-medium py-3">Limit Saldo</th>
                                <th class="text-secondary fw-medium py-3 text-center">Saldo Terpakai</th>
                                <th class="text-secondary fw-medium py-3 text-center">Sisa Saldo</th>
                                <th class="text-secondary fw-medium py-3">Tipe Kartu</th>
                                <th class="text-secondary fw-medium py-3 text-center">Status</th>
                                <th class="text-secondary fw-medium py-3 pe-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in paginatedCards" :key="index" class="border-bottom">
                                <td class="ps-4 fw-medium text-dark">{{ item.npk }}</td>
                                <td class="text-dark">{{ item.namaPic }}</td>
                                <td class="text-dark">{{ item.department }}</td>
                                <td class="text-dark">{{ item.divisi }}</td>
                                <td class="text-dark">{{ item.nomorRekening }}</td>
                                <td class="text-dark">{{ item.namaBank }}</td>
                                <td class="text-dark">{{ item.expiredDate }}</td>
                                <td class="text-dark">{{ item.limitSaldo }}</td>
                                <td class="text-warning text-center fw-medium">{{ item.saldoTerpakai }}</td>
                                <td class="text-success text-center fw-medium">{{ item.sisaSaldo }}</td>
                                <td class="text-dark">{{ item.tipeKartu }}</td>
                                <td class="text-center">
                                    <span :class="['badge-status', item.status === 'Active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger']">
                                        {{ item.status }}
                                    </span>
                                </td>
                                <td class="pe-4 text-center">
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-outline-secondary btn-sm action-btn px-3" @click="handleEdit(item.npk)">Edit</button>
                                        <button class="btn btn-danger btn-sm action-btn px-3 fw-medium" @click="handleHapus(item.npk)">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- PAGINATION CONTROLS -->
                <div class="card-footer bg-white border-top-0 py-3 px-4 d-flex justify-content-between align-items-center">
                    <span class="text-secondary small">
                        Menampilkan {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
                        {{ Math.min(currentPage * itemsPerPage, cards.length) }}
                        dari {{ cards.length }} hasil
                    </span>
                    <nav aria-label="Table navigation">
                        <ul class="pagination pagination-sm m-0">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link shadow-none" @click="prevPage">Sebelumnya</button>
                            </li>
                            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                                <button class="page-link shadow-none" @click="goToPage(page)">{{ page }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages || totalPages === 0 }">
                                <button class="page-link shadow-none" @click="nextPage">Selanjutnya</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </main>

        <!-- ADD MODAL -->
        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered custom-modal">
                <div class="modal-content border-0">
                    <div class="modal-header border-0 pb-0 pt-4 px-4">
                        <h5 class="modal-title fw-semibold text-dark fs-5" id="modalLabel">{{ isEditMode ? 'Edit Kartu Petty Cash' : 'Buat Kartu Petty Cash' }}</h5>
                        <button type="button" class="btn-close shadow-none" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body px-4 py-4">
                        <div class="card bg-white shadow-sm border-0 rounded-3 p-4">
                            <!-- R1 -->
                            <div class="row g-4 mb-4">
                                <div class="col-md-3">
                                    <label class="form-label text-muted small fw-medium mb-1">NPK</label>
                                    <select v-model="formData.npk" class="form-select form-select-sm custom-input" :disabled="isEditMode">
                                        <option value="" disabled>Pilih NPK</option>
                                        <option value="100234">100234</option>
                                        <option value="100235">100235</option>
                                        <option value="100236">100236</option>
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
                                <button class="btn px-4 custom-btn-outline-orange custom-modal-btn" @click="closeModal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FOOTER -->
        <FooterComponent />
    </div>
</template>

<style scoped>
.bg-light-gray {
    background-color: #f4f6fa;
}

.text-dark {
    color: #4a4a4a !important;
}

.text-secondary {
    color: #8a96a3 !important;
    font-size: 0.85rem;
}

.section-header h3 {
    color: #3f4e65;
}

.table-responsive {
    background-color: #ffffff;
}

.custom-table {
    font-size: 0.9rem;
}

.custom-table thead th {
    background-color: #ffffff;
    border-bottom: 1px solid #eef0f3;
}

.custom-table tbody tr {
    transition: background-color 0.15s ease-in-out;
}

.custom-table tbody tr:hover {
    background-color: #fafbfc;
}

.custom-table tbody td {
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eef0f3;
}

/* Badge Status styling */
.badge-status {
    padding: 0.35rem 0.8rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
}

.bg-soft-success {
    background-color: #e5f7ed;
}

.text-success {
    color: #2eb85c !important;
}

.bg-soft-danger {
    background-color: #fde6e8;
}

.text-danger {
    color: #e55353 !important;
}

.text-warning {
    color: #f26f21 !important; /* Orange text for saldo terpakai based on Figma */
}

/* Override standard bootstrap warning if needed */
.custom-table .text-success {
    color: #2eb85c !important;
}

/* Buttons */
.btn-orange {
    background-color: #f26f21;
    color: white;
    border: none;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(242, 111, 33, 0.2);
}

.btn-orange:hover {
    background-color: #e05e10;
}

.action-btn {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
}

.btn-outline-secondary.action-btn {
    color: #6c757d;
    border-color: #d1d6dc;
}

.btn-danger.action-btn {
    background-color: #dc3545;
    border-color: #dc3545;
}

/* Select Box Styling */
.filter-container .form-select {
    color: #495057;
    border-color: #e2e5e9;
    border-radius: 20px;
    padding: 0.4rem 1.25rem;
    font-size: 0.85rem;
    font-weight: 500;
}

.filter-container select:focus {
    box-shadow: none;
    border-color: #aeb5be;
}

.filter-btn {
    border-radius: 20px;
    padding: 0.4rem 1.5rem;
    font-size: 0.85rem;
    font-weight: 500;
}

.filter-col {
  /* This ensures that on very large screens it doesn't stretch infinitely, but looks nice inline */
  flex-grow: 1;
}

/* Pagination Overrides */
.page-link {
    color: #6c757d;
    border: none;
    margin: 0 0.15rem;
    border-radius: 6px;
    font-weight: 500;
}

.page-item.active .page-link {
    background-color: #f26f21;
    color: white;
}

.page-link:hover {
    background-color: #f4f6fa;
    color: #f26f21;
}

.page-item.active .page-link:hover {
    background-color: #f26f21;
    color: white;
}

/* Modal Styling */
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
}

.custom-modal {
    max-width: 1100px;
}

.custom-input {
    border-color: #dee2e6;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    color: #495057;
}

.custom-input:focus {
    box-shadow: none;
    border-color: #f26f21;
}

.text-muted {
    color: #8f959e !important;
}

.custom-modal-btn {
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.5rem 1.5rem !important;
}

.custom-btn-outline-orange {
    color: #f26f21;
    border: 1px solid #f26f21;
    background-color: transparent;
}

.custom-btn-outline-orange:hover {
    background-color: #fff4ec;
    color: #d95c1b;
}

.modal-content {
    background-color: #f9f9f9;
}
</style>
