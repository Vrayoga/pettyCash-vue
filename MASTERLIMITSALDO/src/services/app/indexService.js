import Swal from "sweetalert2";
import { ref } from "vue";
import { apiClient, apiCbgMSO } from "@/helper/ourAxios";
import { useSessionStore } from "@/helper/sessionStore";

const DEFAULT_RETRY = 1; // number of retries on transient failure

function normalizeApiResponse(res) {
  // Backend uses ApiResponse wrapper { success, data, message }
  // but some environments may return raw array or object. Normalize to { success, data }
  if (!res) return { success: false, data: [] };
  if (res.data && typeof res.data === "object") {
    // Common possible wrappers: { success: true, data: [...] } or { status: 'success', data: [...] }
    if ("success" in res.data) return { success: Boolean(res.data.success), data: res.data.data ?? [], message: res.data.message };
    if ("status" in res.data) return { success: String(res.data.status).toLowerCase() === "success", data: res.data.data ?? [], message: res.data.message ?? res.data.error };
    if ("code" in res.data) return { success: Number(res.data.code) === 0, data: res.data.data ?? [], message: res.data.message };
  }
  // If server returned array directly
  if (Array.isArray(res.data)) return { success: true, data: res.data };
  // If server returned object array or single object
  if (Array.isArray(res)) return { success: true, data: res };
  return { success: false, data: [] };
}

async function safeGet(url, retry = DEFAULT_RETRY) {
  try {
    return await apiClient.get(url);
  } catch (err) {
    if (retry > 0) {
      // small backoff
      await new Promise((r) => setTimeout(r, 300));
      return safeGet(url, retry - 1);
    }
    throw err;
  }
}

// Load grid data. Accepts a ref to an array and fills it with normalized rows.
export async function loadData(dataSource) {
  const sessionStore = useSessionStore();
  dataSource.value = [];
  try {
    //console.log('[indexService] calling GET /AuthVirtualAcc');
    const res = await safeGet("/AuthVirtualAcc");
    //console.log('[indexService] raw response:', res && res.data ? res.data : res);
    const normalized = normalizeApiResponse(res);
    //console.log('[indexService] normalized:', normalized);
    if (normalized.success && Array.isArray(normalized.data)) {
      dataSource.value = normalized.data.map((v, idx) => ({
        // ensure id exists for DataGrid key-expr
        id: v.id ?? v.recId ?? v.ID ?? v.Id ?? idx + 1,
        ...v,
        no: idx + 1,
      }));
      //console.log('[indexService] populated dataSource length=', dataSource.value.length);
    } else {
      // If success is false but data present, try to use it
      if (Array.isArray(normalized.data) && normalized.data.length) {
        dataSource.value = normalized.data.map((v, idx) => ({ id: v.id ?? v.recId ?? idx + 1, ...v, no: idx + 1 }));
      } else {
        dataSource.value = [];
      }
    }
  } catch (error) {
    //console.error("loadData error:", error);
    Swal.fire({ icon: "error", title: "Gagal Memuat Data", text: error.message || "Terjadi kesalahan saat memuat data." });
    dataSource.value = [];
  }
}

// Optional helper: get single bank by id -> returns normalized object or null
export async function getBankById(id) {
  if (!id) return null;
  try {
    // try a direct endpoint first
    const res = await safeGet(`/MstVirtualAccCompany/GetById?id=${id}`);
    const normalized = normalizeApiResponse(res);
    if (normalized.success && normalized.data) return normalized.data;
    // fallback: try AuthVirtualAcc endpoint
    const all = await safeGet("/AuthVirtualAcc");
    const normAll = normalizeApiResponse(all);
    if (normAll.success && Array.isArray(normAll.data)) return normAll.data.find(x => String(x.id) === String(id)) ?? null;
    return null;
  } catch (err) {
    console.error("getBankById error:", err);
    return null;
  }
}



// Fetch bank admin (biaya) by id
export async function getBankAdminById(id) {
  if (!id) return null;
  try {
    const res = await safeGet(`/MstVirtualAccBankAdmin/${id}`);
    const normalized = normalizeApiResponse(res);
    if (normalized.success) return normalized.data ?? normalized;
    return null;
  } catch (err) {
    console.error('getBankAdminById error', err);
    return null;
  }
}


// Create new bank record (simple wrapper)
export async function createBank(payload) {
  try {
    // Use the AuthVirtualAcc controller POST action (route: /AuthVirtualAcc)
    const res = await apiClient.post('/AuthVirtualAcc', payload);
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('createBank error', err);
    throw err;
  }
}

export async function getAuthVirtualAccById(id) {
  if (!id) return null;
  try {
    const res = await safeGet(`/AuthVirtualAcc/${id}`); // ✅ route sesuai controller
    const normalized = normalizeApiResponse(res);
    if (normalized.success) {
      return normalized.data ?? normalized;
    }
    return null;
  } catch (err) {
    console.error('getAuthVirtualAccById error', err);
    return null;
  }
}

//////////////////////DETAIL PAGE HELPERS//////////////////////

// Fetch bank admin rows by mstAuthVirtualAccId (returns array)
export async function getBankAdminsByAuthId(mstAuthVirtualAccId) {
  if (!mstAuthVirtualAccId) return [];
  try {
    const res = await safeGet(`/MstVirtualAccBankAdmin/by-auth/${mstAuthVirtualAccId}`);
    const normalized = normalizeApiResponse(res);
    if (normalized.success && Array.isArray(normalized.data)) return normalized.data;
    if (normalized.success && normalized.data && typeof normalized.data === 'object') return [normalized.data];
    return [];
  } catch (err) {
    console.error('getBankAdminsByAuthId error', err);
    return [];
  }
}

// Fetch minimal bank info (vendor/companyCode) for detail page
export async function getBankSimpleById(id) {
  if (!id) return null;
  try {
    const res = await safeGet(`/Bank/${id}`);
    const normalized = normalizeApiResponse(res);
    if (normalized.success) return normalized.data ?? normalized;
    return null;
  } catch (err) {
    console.error('getBankSimpleById error', err);
    return null;
  }
}



// Fetch companies (branches) by mstAuthVirtualAcc id
export async function getCompaniesByAuthId(id) {
  if (!id) return [];
  try {
    const res = await safeGet(`/MstVirtualAccCompany/auth/${id}`);
    const normalized = normalizeApiResponse(res);
    if (normalized.success && Array.isArray(normalized.data)) return normalized.data;
    // if backend wrapped single object, try to coerce
    if (normalized.success && normalized.data && typeof normalized.data === 'object') return [normalized.data];
    return [];
  } catch (err) {
    console.error('getCompaniesByAuthId error', err);
    return [];
  }
}

export async function getAllCabangMSO() {
  try {
    const res = await apiCbgMSO.get(`/newscm/scmax/getcompany`); // ✅ route sesuai controller
    return res.data.Data;
  } catch (err) {
    console.error('getAllCabangMSO error', err);
    return null;
  }
}

// Create new bank record (simple wrapper)
export async function createMSOCabang(payload, idMstAuthVirtualAcc) {
  try {
    // Use the AuthVirtualAcc controller POST action (route: /AuthVirtualAcc)
    const res = await apiClient.post('/MstVirtualAccCompany', payload, { params: { idMstAuthVirtualAcc } });
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('createMSOCabang error', err);
    throw err;
  }
}

export async function getMSObyBranchCode(branchCode, id) {
  if (!branchCode || !id) return null;
  try {
    const res = await safeGet(`/MstVirtualAccCompany/branch/${branchCode}/${id}`);
    const normalized = normalizeApiResponse(res);
    if (normalized.success) return normalized.data ?? normalized;
    return null;
  } catch (err) {
    console.error('getMSObyBranchCode error', err);
    return null;
  }
}

// Update an existing MstVirtualAccCompany record (PUT /MstVirtualAccCompany/{id})
export async function updateMSOCompany(id, payload) {
  if (!id || !payload) throw new Error('id and payload required');
  try {
    const res = await apiClient.put(`/MstVirtualAccCompany/${id}`, payload);
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('updateMSOCompany error', err);
    throw err;
  }
}



export async function getCompaniesInactive(id) {
  if (!id) return [];
  try {
    const res = await safeGet(`/MstVirtualAccCompany/inactive/${id}`);
    console.log('Response from inactive companies:', res);
    const normalized = normalizeApiResponse(res);
    if (normalized.success && Array.isArray(normalized.data)) return normalized.data;
    // if backend wrapped single object, try to coerce
    if (normalized.success && normalized.data && typeof normalized.data === 'object') return [normalized.data];
    return [];
  } catch (err) {
    console.error('getCompaniesNonActive error', err);
    return [];
  }
}
export async function getCompaniesActive(id) {
  if (!id) return [];
  try {
    const res = await safeGet(`/MstVirtualAccCompany/active/${id}`);
    console.log('Response from active companies:', res);
    const normalized = normalizeApiResponse(res);
    if (normalized.success && Array.isArray(normalized.data)) return normalized.data;
    // if backend wrapped single object, try to coerce
    if (normalized.success && normalized.data && typeof normalized.data === 'object') return [normalized.data];
    return [];
  } catch (err) {
    console.error('getCompaniesActive error', err);
    return [];
  }
}

// Update an existing MstVirtualAccCompany record (PUT /MstVirtualAccCompany/{id})
export async function updateAllMSOCompany(id, payload) {
  if (!id || !payload) throw new Error('id and payload required');
  try {
    const res = await apiClient.put(`/MstVirtualAccCompany/UpdateAll/${id}`, payload);
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('updateAllMSOCompany error', err);
    throw err;
  }
}


////////////////BANK /////////////////////////
// Create new bank admin (POST /MstVirtualAccBankAdmin?idMstAuthVirtualAcc={id})
export async function createBankAdmin(payload, idMstAuthVirtualAcc) {
  try {
    const res = await apiClient.post('/MstVirtualAccBankAdmin', payload, { params: { idMstAuthVirtualAcc } });
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('createBankAdmin error', err);
    throw err;
  }
}

// Update an existing MstVirtualAccBankAdmin record (PUT /MstVirtualAccBankAdmin/{id})
export async function updateAdmin(payload, id) {
  if (!id || !payload) throw new Error('id and payload required');
  try {
    const res = await apiClient.put(`/MstVirtualAccBankAdmin/${id}`, payload);
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('updateAdmin error', err);
    throw err;
  }
}


// Update an existing MstVirtualAccCompany record (PUT /MstVirtualAccCompany/{id})
export async function UpdateHeader(id, payload) {
  if (!id || !payload) throw new Error('id and payload required');
  try {
    const res = await apiClient.put(`/AuthVirtualAcc/${id}`, payload);
    const normalized = normalizeApiResponse(res);
    return normalized;
  } catch (err) {
    console.error('UpdateHeader error', err);
    throw err;
  }
}

export async function getBankAccountsAx() {
  try {
    const res = await apiCbgMSO.get(`/vamsoapi/api/listbankax`); // ✅ route sesuai controller
    //console.log('Response from getBankAccountsAx:', res);
    return res.data.data;
  } catch (err) {
    console.error('getBankAccountsAx error', err);
    return null;
  }
}
