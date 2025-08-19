import PDFDocument from "pdfkit";
import appError from "../errorHelper/appError";

interface IInvoiceInfo {
  name: string;
  transactionId:string;
  bookingDate:string;
  tourTitle:string;
  guestCount:number;
  totalAmount:number;
}

export const generateInvoice = (invoiceData: IInvoiceInfo) => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Buffer[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // Creating PDF
      doc.fontSize(22).text("Invoice", { align: "center" });

      doc.moveDown();

      doc.fontSize(14).text(`Transaction ID: ${invoiceData.transactionId}`);
      doc.text(`Booking Date: ${invoiceData.bookingDate}`)

      doc.moveDown();

      doc.text(`Tour: ${invoiceData.tourTitle}`);
doc.text(`Guests: ${invoiceData.guestCount}`);
doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`);

doc.moveDown();
doc.text("Thank you for booking with us!", {align: "center"});

doc.moveDown();
  })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    new appError(501, `Invoice generation failed: ${err.message}`);
  }
}
