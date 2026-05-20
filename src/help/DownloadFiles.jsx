import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from "docx";
import { saveAs } from "file-saver";

// 🔹 Excel Export
export const exportToExcel = (data, fields, filename = "Export.xlsx") => {
  const formatted = data.map((item) => {
    let row = {};
    fields.forEach((f) => {
      row[f.label] = formatField(getFieldValue(item, f.key), f.key);

    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(formatted);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
};

// 🔹 PDF Export
export const exportToPDF = (data, fields, filename = "Export.pdf") => {
  const doc = new jsPDF();

  doc.text("Report", 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [fields.map((f) => cleanText(f.label))],
    body: data.map((item) =>
      fields.map((f) => cleanText(getFieldValue(item, f.key)))
    ),

  });

  doc.save(filename);
};

// 🔹 WordPress Export (CSV Uploadable or JSON)
export const exportToWordPress = async (data, fields, filename = "Export.docx") => {
  const tableRows = [];

  // Header row
  const headerRow = new TableRow({
    children: fields.map(
      (f) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: f.label, bold: true })],
            }),
          ],
        })
    ),
  });
  tableRows.push(headerRow);

  // Data rows
  data.forEach((item) => {
    const row = new TableRow({
      children: fields.map(
        (f) =>
          new TableCell({
           children: [new Paragraph(String(formatField(getFieldValue(item, f.key), f.key)))],

          })
      ),
    });
    tableRows.push(row);
  });

  // ✅ Proper table with width
  const table = new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: "pct",
    },
  });

  const doc = new Document({
    sections: [
      {
        children: [table],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};


const cleanText = (value) => {
  if (!value) return "";
  // saare unwanted special characters hata do
  return String(value).replace(/[^\x20-\x7E₹]/g, "");
};


// 🔹 Helper (format date, amount, etc.)
const formatField = (value, key) => {
  if (key === "date") return new Date(value).toLocaleDateString();
  if (key === "amount") return `₹ ${value}`;
  return value ?? "N/A";
};


// 🔹 Helper to get nested or direct key values
const getFieldValue = (item, key) => {
  if (typeof key === "function") return key(item); // nested
  return item[key] ?? "N/A"; // direct
};

