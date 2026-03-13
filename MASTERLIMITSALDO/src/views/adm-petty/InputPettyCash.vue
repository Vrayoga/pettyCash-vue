<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import {
  DxDataGrid,
  DxColumn,
  DxPager,
  DxPaging,
  DxHeaderFilter,
  DxFilterRow,
  DxLoadPanel,
  DxToolbar,
  DxItem
} from "devextreme-vue/data-grid";
import DxSelectBox from "devextreme-vue/select-box";
import DxDateBox from "devextreme-vue/date-box";

// ===== STATE =====
const isLoading = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const selectedAccount = ref(null);

const summary = ref({
  saldoAwal: 'Rp. 10.000.000',
  saldoTransaksi: 'Rp. 2.450.000',
  sisaSaldo: 'Rp. 7.550.000',
  saldoBooked: 'Rp. 0'
});

const dataSource = ref([
  {
    id: 1,
    tanggal: '2026-03-01',
    noPettyCash: 'PC-001',
    deskripsi: 'Pembelian ATK Bulanan',
    jumlahNominal: 'Rp 1.500.000',
    noRekening: '1234567890',
    pic: 'Andi Pratama',
    tipe: 'Kas Bon',
    noRef: 'KB-2026-001',
    statusPetty: 'Draft',
    noBpu: '-',
    statusPencairan: '-'
  },
  {
    id: 2,
    tanggal: '2026-03-05',
    noPettyCash: 'PC-002',
    deskripsi: 'Biaya Transport Meeting',
    jumlahNominal: 'Rp 750.000',
    noRekening: '1234567890',
    pic: 'Andi Pratama',
    tipe: 'PO',
    noRef: 'PO-2026-015',
    statusPetty: 'Done',
    noBpu: 'INV-7788-2026',
    statusPencairan: 'Posting'
  },
  {
    id: 3,
    tanggal: '2026-03-10',
    noPettyCash: 'PC-003',
    deskripsi: 'Pembayaran Konsumsi Training',
    jumlahNominal: 'Rp 1.200.000',
    noRekening: '1234567890',
    pic: 'Andi Pratama',
    tipe: 'Reguler',
    noRef: '-',
    statusPetty: 'Revisi',
    noBpu: '-',
    statusPencairan: '-'
  },
  {
    id: 4,
    tanggal: '2026-03-12',
    noPettyCash: 'PC-004',
    deskripsi: 'Pembelian Snack Kantor',
    jumlahNominal: 'Rp 450.000',
    noRekening: '1234567890',
    pic: 'Andi Pratama',
    tipe: 'Kas Bon',
    noRef: 'KB-2026-020',
    statusPetty: 'Done',
    noBpu: 'BPU-NPC-20-2026-02',
    statusPencairan: 'Posting'
  },
  {
    id: 5,
    tanggal: '2026-03-13',
    noPettyCash: 'PC-005',
    deskripsi: 'Perbaikan AC Ruangan',
    jumlahNominal: 'Rp 2.000.000',
    noRekening: '0987654321', // Different account for filtering test
    pic: 'Andi Pratama',
    tipe: 'Reguler',
    noRef: '-',
    statusPetty: 'Draft',
    noBpu: '-',
    statusPencairan: '-'
  }
]);

// ===== COMPUTED =====
const filteredDataSource = computed(() => {
  return dataSource.value.filter(item => {
    const itemDate = new Date(item.tanggal);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;
    
    if (start) start.setHours(0,0,0,0);
    if (end) end.setHours(0,0,0,0);
    itemDate.setHours(0,0,0,0);

    const isAfterStart = !start || itemDate >= start;
    const isBeforeEnd = !end || itemDate <= end;
    const isMatchingAccount = !selectedAccount.value || item.noRekening === selectedAccount.value;

    return isAfterStart && isBeforeEnd && isMatchingAccount;
  });
});

// ===== OPTIONS =====
const accountOptions = ref(['1234567890', '0987654321']);

// ===== API LOGIC (COMMENTED) =====
/*
import { apiSelf } from '@/helper/ourAxios';
const fetchData = async () => {
  isLoading.value = true;
  try {
    const res = await apiSelf.get('/api/petty-cash/input-data', {
      params: { 
        start: startDate.value, 
        end: endDate.value,
        acc: selectedAccount.value 
      }
    });
    // dataSource.value = res.data.list;
    // summary.value = res.data.summary;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
*/

const handleNew = () => {
  console.log("New Petty Cash");
  // router.push('/petty-cash/add');
};

const handleView = (data) => {
  console.log("View", data);
};

const handleDelete = (data) => {
  console.log("Delete", data);
};

</script>

<template>
  <div class="bg-light-gray min-vh-100 pb-5">
    <main class="container-fluid px-4 pt-4">
      <h3 class="fw-semibold text-dark mb-4">Input Petty Cash</h3>

      <!-- FILTER & SUMMARY CARDS -->
      <div class="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
        <div class="row g-4 align-items-end">
          <div class="col-md-3">
            <label class="form-label mb-2">Start Date</label>
            <DxDateBox
              v-model:value="startDate"
              type="date"
              display-format="dd/MM/yyyy"
              styling-mode="outlined"
              class="refined-select"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label mb-2">End Date</label>
            <DxDateBox
              v-model:value="endDate"
              type="date"
              display-format="dd/MM/yyyy"
              styling-mode="outlined"
              class="refined-select"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label mb-2">No Rekening</label>
            <DxSelectBox
              v-model:value="selectedAccount"
              :items="accountOptions"
              styling-mode="outlined"
              class="refined-select"
              placeholder="Pilih No Rekening"
              :show-clear-button="true"
            />
          </div>
        </div>

        <div class="row g-3 mt-4">
          <!-- Saldo Awal -->
          <div class="col-md-3">
            <div class="summary-card p-3 rounded-4 shadow-sm border-0 bg-white">
              <div class="text-muted small mb-1">Saldo Awal</div>
              <div class="h4 fw-bold mb-0 text-dark">{{ summary.saldoAwal }}</div>
            </div>
          </div>
          <!-- Saldo Transaksi -->
          <div class="col-md-3">
            <div class="summary-card p-3 rounded-4 shadow-sm border-0 bg-white">
              <div class="text-muted small mb-1">Saldo Transaksi (On Progress)</div>
              <div class="h4 fw-bold mb-0 text-orange">{{ summary.saldoTransaksi }}</div>
            </div>
          </div>
          <!-- Sisa Saldo -->
          <div class="col-md-3">
            <div class="summary-card p-3 rounded-4 shadow-sm border-0 bg-white border-green-left">
              <div class="text-muted small mb-1">Sisa Saldo</div>
              <div class="h4 fw-bold mb-0 text-green">{{ summary.sisaSaldo }}</div>
            </div>
          </div>
          <!-- Saldo Booked -->
          <div class="col-md-3">
            <div class="summary-card p-3 rounded-4 shadow-sm border-0 bg-white">
              <div class="text-muted small mb-1">Saldo Booked</div>
              <div class="h4 fw-bold mb-0 text-blue">{{ summary.saldoBooked }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DATAGRID -->
      <div class="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <DxDataGrid
          :data-source="filteredDataSource"
          :show-borders="true"
          :allow-column-resizing="true"
          :column-auto-width="true"
          ref="datagridRef"
          class="figma-grid-refined"
        >
          <DxToolbar>
            <DxItem location="after" widget="dxButton" :options="{
              icon: 'plus',
              onClick: handleNew,
            }" />
          </DxToolbar>

          <DxLoadPanel :show-indicator="true" :show-pane="true" position="center" :visible="isLoading" />
          <DxFilterRow :visible="true" />
          <DxPaging :pageSize="10" />
          <DxPager 
            :visible="true" 
            :allowed-page-sizes="[10, 25, 50]" 
            :show-page-size-selector="true" 
            :show-info="true"
            :show-navigation-buttons="true" 
          />
          <DxHeaderFilter :visible="true" />

          <DxColumn data-field="noPettyCash" caption="No Petty Cash" />
          <DxColumn data-field="deskripsi" caption="Deskripsi Kebutuhan" />
          <DxColumn data-field="jumlahNominal" caption="Jumlah Nominal" cell-template="nominalCell" />
          <DxColumn data-field="noRekening" caption="No Rekening" />
          <DxColumn data-field="pic" caption="PIC" />
          <DxColumn data-field="tipe" caption="Tipe" />
          <DxColumn data-field="noRef" caption="Nomor Reference" />
          <DxColumn data-field="statusPetty" caption="Status Petty Cash" cell-template="statusPettyCell" />
          <DxColumn data-field="noBpu" caption="No BPU / Invoice" />
          <DxColumn data-field="statusPencairan" caption="Status Pencairan" cell-template="statusPencairanCell" />
          
          <DxColumn caption="Action" cell-template="actionCell" :width="160" alignment="center" />

          <template #nominalCell="{ data }">
            <span class="fw-medium">{{ data.value }}</span>
          </template>

          <template #statusPettyCell="{ data }">
            <span v-if="data.value === 'Revisi'" class="text-orange fw-medium italic">{{ data.value }}</span>
            <span v-else class="fw-medium">{{ data.value }}</span>
          </template>

          <template #statusPencairanCell="{ data }">
            <span v-if="data.value === 'Posting'" class="text-blue fw-medium">{{ data.value }}</span>
            <span v-else>{{ data.value }}</span>
          </template>

          <template #actionCell="{ data }">
            <div class="d-flex gap-2 justify-content-start">
              <button class="btn btn-view" @click="handleView(data.row.data)">View</button>
              <button v-if="data.row.data.statusPetty === 'Draft'" class="btn btn-delete" @click="handleDelete(data.row.data)">Hapus</button>
            </div>
          </template>
        </DxDataGrid>
      </div>
    </main>
  </div>
</template>

<style scoped>
.bg-light-gray {
  background-color: #f4f6fa;
}

.summary-card {
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.text-orange { color: #f26f21 !important; }
.text-green { color: #2eb85c !important; }
.text-blue { color: #3b7ddd !important; }
.italic { font-style: italic; }

.refined-select {
  border-radius: 8px;
  background-color: #ffffff;
}

.refined-select :deep(.dx-texteditor-container) {
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d1d6dc;
  transition: border-color 0.2s;
  background-color: #ffffff;
  display: flex !important;
  align-items: center !important;
}

.refined-select.dx-state-hover :deep(.dx-texteditor-container) {
  border-color: #bcbfc4;
}

.refined-select.dx-state-focused :deep(.dx-texteditor-container) {
  border-color: #f26f21;
}

.refined-select :deep(.dx-texteditor-input) {
  padding: 0 12px !important;
  margin: 0 !important;
  height: 100% !important;
  line-height: normal !important; /* Let flex centering handle it */
  font-size: 0.9rem;
  color: #334155;
  background-color: transparent;
  display: flex !important;
  align-items: center !important;
}

.refined-select :deep(.dx-placeholder) {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 12px;
  font-size: 0.9rem;
  top: 0;
}

.form-label {
  color: #94a3b8;
  font-size: 0.8rem;
  letter-spacing: 0.025em;
}

/* Grid Styling - Matched with MasterKartu.vue */
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

/* Action Buttons */
.btn-view {
  background-color: #3b7ddd;
  color: white;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 6px;
  border: none;
}

.btn-delete {
  background-color: #e55353;
  color: white;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 6px;
  border: none;
}

.btn-view:hover, .btn-delete:hover {
  opacity: 0.9;
  color: white;
}
</style>
