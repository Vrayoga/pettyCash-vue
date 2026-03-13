<script setup>
import AppButton from '@/components/Button/AppButton.vue';
import {
  DxDataGrid,
  DxLoadPanel,
  DxPager,
  DxPaging,
  DxToolbar,
  DxItem,
} from "devextreme-vue/data-grid";
import {
  DxColumn,
  DxFilterRow,
  DxHeaderFilter,
} from "devextreme-vue/cjs/data-grid";
import DxSelectBox from "devextreme-vue/select-box";

import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter } from 'vue-router';
import { useSessionStore } from "@/helper/sessionStore";
import { exportGridToExcel } from "@/helper/exportExcel";
import Swal from "sweetalert2";

// ===== STATE =====
const sessionStore = useSessionStore();
const dataSource = ref([]);
const isLoading = ref(false);
const datagridRef = ref(null);

// ===== FILTER STATE =====
const filterNpk = ref('All NPK');
const filterPic = ref('All PIC');
const filterRekening = ref('All Nomor Rekening');
const filterStatus = ref('All Status');
const filterTipe = ref('All Tipe Data');

// ===== FILTER OPTIONS (Computed) =====
const npkOptions = computed(() => ['All NPK', ...new Set(dataSource.value.map(item => item.npk))]);
const picOptions = computed(() => ['All PIC', ...new Set(dataSource.value.map(item => item.namaPic))]);
const rekeningOptions = computed(() => ['All Nomor Rekening', ...new Set(dataSource.value.map(item => item.nomorRekening))]);
const statusOptions = computed(() => ['All Status', ...new Set(dataSource.value.map(item => item.status))]);
const tipeOptions = computed(() => ['All Tipe Data', ...new Set(dataSource.value.map(item => item.tipeKartu))]);

// ===== FILTERED DATA SOURCE =====
const filteredDataSource = computed(() => {
  return dataSource.value.filter(item => {
    return (filterNpk.value === 'All NPK' || item.npk === filterNpk.value) &&
           (filterPic.value === 'All PIC' || item.namaPic === filterPic.value) &&
           (filterRekening.value === 'All Nomor Rekening' || item.nomorRekening === filterRekening.value) &&
           (filterStatus.value === 'All Status' || item.status === filterStatus.value) &&
           (filterTipe.value === 'All Tipe Data' || item.tipeKartu === filterTipe.value);
  });
});


// ===== ROUTER & SESSION =====
const router = useRouter();

onMounted(async () => {
  console.log("Mounted MasterKartu.vue");
  isLoading.value = true;
  sessionStore.loadFromStorage();
  
  // Set mock data untuk HeaderComponent
  if (!sessionStore.sessionData || !sessionStore.sessionData.DOMAIN) {
    sessionStore.setSession({
      DOMAIN: 'MPM',
      USER_ID: 'admin',
      DATAAREA_ID: '021',
      MAIN_DEALER_ID: 'MD01',
      SITE_ID_MAPPING: 'S01'
    });
  }

  // Load dummy data
  loadDummyData();
  
  await nextTick();
  if (datagridRef.value) {
    datagridRef.value.instance.option('dataSource', dataSource.value);
    datagridRef.value.instance.refresh();
  }
  
  isLoading.value = false;
});

const datagrid = computed(() => datagridRef.value?.instance);

// ===== DUMMY DATA =====
const loadDummyData = () => {
  const dummyCards = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
    },
    {
      id: 4,
      npk: '100237',
      namaPic: 'Dewi Lestari',
      department: 'Finance',
      divisi: 'Tax',
      nomorRekening: '5678901234',
      namaBank: 'BRI',
      expiredDate: '2025-10-01',
      limitSaldo: 'Rp 8.000.000',
      saldoTerpakai: 'Rp 2.000.000',
      sisaSaldo: 'Rp 6.000.000',
      tipeKartu: 'Card',
      status: 'Active'
    },
    {
      id: 5,
      npk: '100238',
      namaPic: 'Rizky Fadillah',
      department: 'IT',
      divisi: 'Infrastructure',
      nomorRekening: '6789012345',
      namaBank: 'BCA',
      expiredDate: '2026-05-01',
      limitSaldo: 'Rp 12.000.000',
      saldoTerpakai: 'Rp 6.000.000',
      sisaSaldo: 'Rp 6.000.000',
      tipeKartu: 'Non Card',
      status: 'Active'
    },
    {
      id: 6,
      npk: '100239',
      namaPic: 'Indah Permata',
      department: 'Marketing',
      divisi: 'Promotions',
      nomorRekening: '7890123456',
      namaBank: 'Mandiri',
      expiredDate: '2027-01-01',
      limitSaldo: 'Rp 20.000.000',
      saldoTerpakai: 'Rp 10.000.000',
      sisaSaldo: 'Rp 10.000.000',
      tipeKartu: 'Credit Card',
      status: 'Active'
    },
    {
      id: 7,
      npk: '100240',
      namaPic: 'Agus Setiawan',
      department: 'Sales',
      divisi: 'Corporate Sales',
      nomorRekening: '8901234567',
      namaBank: 'BCA',
      expiredDate: '2026-11-01',
      limitSaldo: 'Rp 15.000.000',
      saldoTerpakai: 'Rp 12.000.000',
      sisaSaldo: 'Rp 3.000.000',
      tipeKartu: 'Card',
      status: 'Inactive'
    },
    {
      id: 8,
      npk: '100241',
      namaPic: 'Fitriani',
      department: 'HR',
      divisi: 'Recruitment',
      nomorRekening: '9012345678',
      namaBank: 'BNI',
      expiredDate: '2025-08-01',
      limitSaldo: 'Rp 5.000.000',
      saldoTerpakai: 'Rp 1.500.000',
      sisaSaldo: 'Rp 3.500.000',
      tipeKartu: 'Non Card',
      status: 'Active'
    },
    {
      id: 9,
      npk: '100242',
      namaPic: 'Hendro Siswanto',
      department: 'Operation',
      divisi: 'Maintenance',
      nomorRekening: '0123456789',
      namaBank: 'BRI',
      expiredDate: '2026-03-01',
      limitSaldo: 'Rp 10.000.000',
      saldoTerpakai: 'Rp 8.000.000',
      sisaSaldo: 'Rp 2.000.000',
      tipeKartu: 'Card',
      status: 'Active'
    },
    {
      id: 10,
      npk: '100243',
      namaPic: 'Maya Sari',
      department: 'Finance',
      divisi: 'Treasury',
      nomorRekening: '1122334455',
      namaBank: 'Mandiri',
      expiredDate: '2027-12-01',
      limitSaldo: 'Rp 25.000.000',
      saldoTerpakai: 'Rp 5.000.000',
      sisaSaldo: 'Rp 20.000.000',
      tipeKartu: 'Credit Card',
      status: 'Active'
    },
    {
      id: 11,
      npk: '100244',
      namaPic: 'Doni Saputra',
      department: 'IT',
      divisi: 'Software Development',
      nomorRekening: '2233445566',
      namaBank: 'BCA',
      expiredDate: '2026-07-01',
      limitSaldo: 'Rp 10.000.000',
      saldoTerpakai: 'Rp 2.000.000',
      sisaSaldo: 'Rp 8.000.000',
      tipeKartu: 'Non Card',
      status: 'Active'
    },
    {
      id: 12,
      npk: '100245',
      namaPic: 'Nina Marlina',
      department: 'Marketing',
      divisi: 'Digital Marketing',
      nomorRekening: '3344556677',
      namaBank: 'BNI',
      expiredDate: '2025-11-01',
      limitSaldo: 'Rp 12.000.000',
      saldoTerpakai: 'Rp 4.000.000',
      sisaSaldo: 'Rp 8.000.000',
      tipeKartu: 'Card',
      status: 'Active'
    },
    {
      id: 13,
      npk: '100246',
      namaPic: 'Reza Pahlevi',
      department: 'Sales',
      divisi: 'Retail Sales',
      nomorRekening: '4455667788',
      namaBank: 'BRI',
      expiredDate: '2026-10-01',
      limitSaldo: 'Rp 8.000.000',
      saldoTerpakai: 'Rp 7.500.000',
      sisaSaldo: 'Rp 500.000',
      tipeKartu: 'Non Card',
      status: 'Inactive'
    },
    {
      id: 14,
      npk: '100247',
      namaPic: 'Lina Marliana',
      department: 'HR',
      divisi: 'Payroll',
      nomorRekening: '5566778899',
      namaBank: 'BCA',
      expiredDate: '2027-02-01',
      limitSaldo: 'Rp 15.000.000',
      saldoTerpakai: 'Rp 10.000.000',
      sisaSaldo: 'Rp 5.000.000',
      tipeKartu: 'Credit Card',
      status: 'Active'
    },
    {
      id: 15,
      npk: '100248',
      namaPic: 'Ahmad Fauzi',
      department: 'Operation',
      divisi: 'Supply Chain',
      nomorRekening: '6677889900',
      namaBank: 'Mandiri',
      expiredDate: '2026-04-01',
      limitSaldo: 'Rp 20.000.000',
      saldoTerpakai: 'Rp 18.000.000',
      sisaSaldo: 'Rp 2.000.000',
      tipeKartu: 'Card',
      status: 'Active'
    },
    {
      id: 16,
      npk: '100249',
      namaPic: 'Rini Yulianti',
      department: 'Finance',
      divisi: 'Audit',
      nomorRekening: '7788990011',
      namaBank: 'BNI',
      expiredDate: '2025-09-01',
      limitSaldo: 'Rp 10.000.000',
      saldoTerpakai: 'Rp 3.000.000',
      sisaSaldo: 'Rp 7.000.000',
      tipeKartu: 'Non Card',
      status: 'Active'
    },
    {
      id: 17,
      npk: '100250',
      namaPic: 'Eko Prasetyo',
      department: 'IT',
      divisi: 'Network',
      nomorRekening: '8899001122',
      namaBank: 'BRI',
      expiredDate: '2026-12-01',
      limitSaldo: 'Rp 15.000.000',
      saldoTerpakai: 'Rp 5.000.000',
      sisaSaldo: 'Rp 10.000.000',
      tipeKartu: 'Credit Card',
      status: 'Inactive'
    },
    {
      id: 18,
      npk: '100251',
      namaPic: 'Tuti Wulandari',
      department: 'Marketing',
      divisi: 'Public Relations',
      nomorRekening: '9900112233',
      namaBank: 'BCA',
      expiredDate: '2027-05-01',
      limitSaldo: 'Rp 8.000.000',
      saldoTerpakai: 'Rp 2.500.000',
      sisaSaldo: 'Rp 5.500.000',
      tipeKartu: 'Card',
      status: 'Active'
    }
  ];
  dataSource.value = dummyCards;
};

// ===== WATCHERS =====
watch(isLoading, () => {
  if (!datagridRef.value) return;
  if (isLoading.value) {
    datagrid.value?.beginCustomLoading?.();
  } else {
    datagrid.value?.endCustomLoading?.();
  }
});

// ===== ACTION HANDLERS =====
const handleNew = () => {
  router.push('/master-kartu/add');
};

const handleEdit = (row) => {
  const npk = row?.data?.npk || row?.key;
  router.push(`/master-kartu/edit/${npk}`);
};

const handleEditLimit = (row) => {
  const npk = row?.data?.npk || row?.key;
  router.push(`/master-kartu/edit-limit/${npk}`);
};

const handleDelete = async (row) => {
  const npk = row?.data?.npk || row?.key;
  
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: `Apakah Anda yakin ingin menghapus data NPK: ${npk}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });

  if (!result.isConfirmed) return;

  isLoading.value = true;
  try {
    // Simulasi delete (ganti dengan API call)
    dataSource.value = dataSource.value.filter(item => item.npk !== npk);
    
    await Swal.fire('Berhasil!', 'Data berhasil dihapus.', 'success');
    
    await nextTick();
    if (datagridRef.value) {
      datagridRef.value.instance.refresh();
    }
  } catch (err) {
    console.error('handleDelete error', err);
    await Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleToggleStatus = async (row) => {
  const npk = row?.data?.npk || row?.key;
  const currentStatus = row?.data?.status;
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

  const result = await Swal.fire({
    title: `Konfirmasi ${newStatus}`,
    text: `Apakah Anda yakin ingin mengubah status ke ${newStatus}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f26f21',
    cancelButtonColor: '#6c757d',
    confirmButtonText: `Ya, ${newStatus}`,
    cancelButtonText: 'Batal',
  });

  if (!result.isConfirmed) return;

  isLoading.value = true;
  try {
    // Simulasi update status (ganti dengan API call)
    const itemIndex = dataSource.value.findIndex(item => item.npk === npk);
    if (itemIndex !== -1) {
      dataSource.value[itemIndex].status = newStatus;
    }

    await Swal.fire('Berhasil!', `Status berhasil diubah ke ${newStatus}.`, 'success');
    
    await nextTick();
    if (datagridRef.value) {
      datagridRef.value.instance.refresh();
    }
  } catch (err) {
    console.error('handleToggleStatus error', err);
    await Swal.fire('Error!', 'Terjadi kesalahan saat mengubah status.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleExport = (e) => {
  exportGridToExcel(e, "MasterKartu_Export");
};
</script>

<template>
  <div class="bg-light-gray">
    <!-- MAIN CONTENT -->
    <main class="container-fluid px-4 mt-4 mb-5">
      
      <!-- TITLE ROW -->
      <div class="d-flex justify-content-between align-items-center mb-4 mt-2 section-header">
        <h3 class="fw-semibold text-dark m-0">Master Kartu Petty Cash</h3>
        <div class="d-flex gap-2">
          <AppButton type="warning" text="+ New" @click="handleNew" class="btn-orange" />
        </div>
      </div>

      <!-- FILTER SECTION (Refined Design) -->
      <div class="card shadow-sm border-0 rounded-4 p-3 mb-4 filter-container">
        <div class="d-flex flex-wrap gap-3 align-items-center">
          <div class="filter-item">
            <DxSelectBox
              v-model:value="filterPic"
              :items="picOptions"
              :search-enabled="true"
              styling-mode="outlined"
              class="refined-select"
            />
          </div>
          <div class="filter-item">
            <DxSelectBox
              v-model:value="filterNpk"
              :items="npkOptions"
              :search-enabled="true"
              styling-mode="outlined"
              class="refined-select"
            />
          </div>
          <div class="filter-item">
            <DxSelectBox
              v-model:value="filterRekening"
              :items="rekeningOptions"
              :search-enabled="true"
              styling-mode="outlined"
              class="refined-select"
            />
          </div>
          <div class="filter-item">
            <DxSelectBox
              v-model:value="filterStatus"
              :items="statusOptions"
              :search-enabled="true"
              styling-mode="outlined"
              class="refined-select"
            />
          </div>
          <div class="filter-item">
            <DxSelectBox
              v-model:value="filterTipe"
              :items="tipeOptions"
              :search-enabled="true"
              styling-mode="outlined"
              class="refined-select"
            />
          </div>
        </div>
      </div>

      <!-- DATAGRID CARD -->
      <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
        <DxDataGrid 
          :data-source="filteredDataSource" 
          key-expr="id" 
          :show-borders="true" 
          :allow-column-resizing="true"
          ref="datagridRef" 
          :column-auto-width="true" 
          :export="{
            enabled: true,
            allowExportSelectedData: false,
          }" 
          @exporting="handleExport"
        >
          <DxToolbar>
            <DxItem location="after" widget="dxButton" :options="{
              icon: 'plus',
              onClick: handleNew,
            }" />
            <DxItem name="exportButton" />
          </DxToolbar>
          
          <DxLoadPanel :show-indicator="true" :show-pane="true" position="center" :visible="isLoading" />
          <DxFilterRow :visible="true" />
          <DxPaging :page-size="10" />
          <DxPager 
            :visible="true" 
            :allowed-page-sizes="[10, 25, 50, 100]" 
            :show-page-size-selector="true" 
            :show-info="true"
            :show-navigation-buttons="true" 
          />
          <DxHeaderFilter :visible="true" />

          <!-- Data Columns -->
          <DxColumn data-field="npk" caption="NPK" />
          <DxColumn data-field="namaPic" caption="Nama PIC" />
          <DxColumn data-field="department" caption="Department" />
          <DxColumn data-field="divisi" caption="Divisi" />
          <DxColumn data-field="nomorRekening" caption="Nomor Rekening" />
          <DxColumn data-field="namaBank" caption="Nama Bank" />
          <DxColumn data-field="expiredDate" caption="Expired Date" />
          <DxColumn data-field="limitSaldo" caption="Limit Saldo" />
          <DxColumn data-field="saldoTerpakai" caption="Saldo Terpakai" cell-template="saldoTerpakaiCell" />
          <DxColumn data-field="sisaSaldo" caption="Sisa Saldo" cell-template="sisaSaldoCell" />
          <DxColumn data-field="tipeKartu" caption="Tipe Kartu" />
          <DxColumn 
            data-field="status" 
            caption="Status"
            :calculate-cell-value="row => row.status" 
            cell-template="statusCell"
          />

          <!-- Kolom untuk button action (dipindah ke kanan) -->
          <DxColumn :width="300" :caption="'Action'" cell-template="actionCell" :allow-exporting="false" />

          <!-- Template untuk Saldo Terpakai (Orange) -->
          <template #saldoTerpakaiCell="{ data }">
            <span class="text-orange fw-medium">{{ data.value }}</span>
          </template>

          <!-- Template untuk Sisa Saldo (Green) -->
          <template #sisaSaldoCell="{ data }">
            <span class="text-green fw-medium">{{ data.value }}</span>
          </template>

          <!-- Template untuk Status Badge -->
          <template #statusCell="{ data }">
            <span :class="['badge-pill', data.row.data.status === 'Active' ? 'badge-pill-success' : 'badge-pill-danger']">
              {{ data.row.data.status }}
            </span>
          </template>

          <!-- Template untuk Action Buttons (Figma Style) -->
          <template #actionCell="{ data }">
            <div class="d-flex gap-2 justify-content-center">
              <button 
                class="btn btn-figma-outline" 
                @click="handleEdit(data.row)"
              >
                Edit
              </button>
              <button 
                class="btn btn-figma-beige" 
                @click="handleEditLimit(data.row)"
              >
                Edit Limit
              </button>
              <button 
                class="btn btn-figma-danger" 
                @click="handleDelete(data.row)"
              >
                Hapus
              </button>
            </div>
          </template>
        </DxDataGrid>
      </div>

      <div v-if="!isLoading && (!dataSource || dataSource.length === 0)" class="mt-3">
        <div class="alert alert-info">Tidak ada data Master Kartu untuk ditampilkan.</div>
      </div>
    </main>
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

/* Badge Status styling refined for Figma */
.badge-pill {
  padding: 0.3rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
}

.badge-pill-success {
  background-color: #e6f9ed;
  color: #2eb85c;
}

.badge-pill-danger {
  background-color: #fdeaea;
  color: #e55353;
}

.text-orange {
  color: #f26f21 !important;
}

.text-green {
  color: #2eb85c !important;
}

/* Figma Action Buttons */
.btn-figma-outline {
  background-color: #ffffff;
  border: 1px solid #d1d6dc;
  color: #3f4e65;
  font-size: 0.85rem;
  padding: 0.35rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-figma-outline:hover {
  background-color: #f8f9fa;
  border-color: #bcbfc4;
}

.btn-figma-beige {
  background-color: #f1f4e8;
  border: 1px solid #e1e7d1;
  color: #3f4e65;
  font-size: 0.85rem;
  padding: 0.35rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-figma-beige:hover {
  background-color: #e6edd3;
}

.btn-figma-danger {
  background-color: #e55353;
  border: none;
  color: #ffffff;
  font-size: 0.85rem;
  padding: 0.35rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-figma-danger:hover {
  background-color: #d44c4c;
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

/* DevExtreme Grid Customization */
:deep(.dx-datagrid) {
  background-color: #ffffff;
}

:deep(.dx-datagrid-header) {
  background-color: #ffffff;
  border-bottom: 1px solid #eef0f3;
}

:deep(.dx-datagrid-table tbody tr:hover) {
  background-color: #fafbfc !important;
}

:deep(.dx-datagrid-cell) {
  padding: 1rem;
  border-bottom: 1px solid #eef0f3;
}

:deep(.dx-datagrid-toolbar) {
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eef0f3;
}

:deep(.dx-pager) {
  background-color: #ffffff;
  border-top: 1px solid #eef0f3;
  padding: 0.75rem 1rem;
}

:deep(.dx-page-index) {
  color: #f26f21 !important;
}

:deep(.dx-page-index.dx-selection) {
  background-color: #f26f21 !important;
  color: white !important;
}

:deep(.dx-button-default) {
  color: #f26f21 !important;
}

:deep(.dx-button-default:hover) {
  background-color: #fff4ec;
}

:deep(.dx-header-filter) {
  color: #f26f21 !important;
}

/* Refined Filter Styling */
.filter-container {
  background-color: #ffffff;
  border: 1px solid #eef0f3;
}

.filter-item {
  flex: 1;
  min-width: 150px;
}

.refined-select {
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.refined-select :deep(.dx-texteditor-input) {
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #3f4e65;
  font-weight: 400;
}

.refined-select :deep(.dx-texteditor-container) {
  border: 1px solid #d1d6dc;
  border-radius: 6px;
}

.refined-select.dx-state-hover :deep(.dx-texteditor-container) {
  border-color: #bcbfc4;
}

.refined-select.dx-state-focused :deep(.dx-texteditor-container) {
  border-color: #f26f21;
}

.refined-select :deep(.dx-placeholder) {
  color: #8a96a3;
}

.refined-select :deep(.dx-dropdowneditor-icon) {
  color: #3f4e65;
}
</style>
