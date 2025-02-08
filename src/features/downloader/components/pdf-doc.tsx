"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// PDF Document
const MyDocument = ({ data }: { data: any }) => {
  const doc = new jsPDF();

  // It can parse html:
  // <table id="my-table"><!-- ... --></table>
  autoTable(doc, { html: "#my-table" });

  // Or use javascript directly:
  autoTable(doc, {
    head: [
      [
        "Term",
        "Week",
        "Name",
        "Date",
        "In Time",
        "Out Time",
        "Break",
        "Hrs Worked",
      ],
    ],
    body: data,
    styles: { halign: "center" },
  });

  const download = () => {
    doc.save("table.pdf");
  };

  return (
    <div
      onClick={download}
      className="bg-green-500 py-3 px-4 rounded-lg text-white"
    >
      Download
    </div>
  );
};

// Main Component
export default function PDFTable({ data }: { data: any }) {
  const transformedData = data.map((item: any) => {
    const { dueDate } = item;
    if (dueDate) {
      const date = new Date(dueDate);
      item.dueDate = date.toLocaleDateString();
    }

    return [
      item.project?.name ?? "",
      item.week ?? "",
      item.assignee?.name ?? "",
      item.dueDate ?? "",
      item.inTime ?? "",
      item.outTime ?? "",
      item.break ?? "",
      item.hrsWorked ?? "",
    ];
  });

  return (
    <div className="">
      <MyDocument data={transformedData} />
    </div>
  );
}
