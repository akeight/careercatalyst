import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Builds a small, valid single-page PDF with a correct xref table so it renders
// reliably in browser PDF viewers. Used only to seed the demo resume showcase.

const outPath = new URL("../public/demo/sample-resume.pdf", import.meta.url)
  .pathname;

const lines = [
  "BT",
  "/F1 24 Tf",
  "72 720 Td",
  "(Sample Resume) Tj",
  "/F1 14 Tf",
  "0 -40 Td",
  "(Jordan Demo Candidate) Tj",
  "0 -22 Td",
  "(Software Engineering Intern Candidate) Tj",
  "0 -40 Td",
  "(This is a sample resume shown in the Catalyst demo.) Tj",
  "ET",
];
const content = lines.join("\n");

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (const off of offsets) {
  pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
pdf += `startxref\n${xrefStart}\n%%EOF`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, pdf, "latin1");
console.log(`Wrote ${outPath} (${pdf.length} bytes)`);
