import Swal from "sweetalert2";
import { exportDataGrid } from "devextreme/excel_exporter";
import ExcelJS from "exceljs";
import saveAs from "file-saver";

export async function exportGridToExcel(gridInstance, fileName = "DataExport") {
  const data = gridInstance.component.getSelectedRowsData();

  // if (!data || data.length === 0) {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "Peringatan",
  //     text: "Pilih satu data terlebih dahulu sebelum menggunakan Export Selected Data!",
  //   });
  //   return;
  // }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  await exportDataGrid({
    // component: gridInstance,
    component: gridInstance.component,
    worksheet: worksheet,
    selectedRowsOnly: gridInstance.selectedRowsOnly,
    autoFilterEnabled: true,
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
}