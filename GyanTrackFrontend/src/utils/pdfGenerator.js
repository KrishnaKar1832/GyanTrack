import jsPDF from "jspdf";

export const generatePDF = (content) => {
  const doc = new jsPDF();
  doc.text(content, 10, 10);
  doc.save("report.pdf");
};