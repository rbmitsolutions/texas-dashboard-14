import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate } from "../date-fns/dateFormat";
import { CompanyHireFormSchemaType } from "../zod/forms/company/companyHireForm";

async function getFile(blob: Blob) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    return dataUrl;
}

export const createHireContract = async (contract: CompanyHireFormSchemaType, role_title: string) => {
    const contractFile = "/contract.pdf";
    if (!contractFile) {
        console.error("contract.pdf file not found");
        return;
    }

    const existingPdfBytes = await fetch(contractFile).then((res) =>
        res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPage(6);
    const { height } = page.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    const content = `
    Your Name: ${contract?.name}
    Your Email: ${contract?.email}
    Your Address:
    Your Contact Number: 
    Your PPS Number: 
    Your Commencement Date: ${formatDate({
        date: new Date(contract?.commencement_date),
        f: "dd/MM/yyyy",
    })}
    Your Job Title: ${role_title}
    Your Job Title: ${contract?.manager_name}
    Your Place of Work: Texas Steakout Limerick
    Your Employment Status: ${contract?.employment_status}
    Your Normal Working Hours: ${contract?.normal_working_hours}
    ${contract?.fixed_salary
            ? `Your Rate of Pay [Fixed Weekly Salary]: ${contract?.salary}`
            : `Your Rate of Pay [Hourly Rate]: ${contract?.rate_per_hour}`
        }
    Contract Issue Date: ${formatDate({
            date: new Date(contract?.issue_date),
            f: "dd/MM/yyyy",
        })}
  `;

    const lines = content.split("\n");

    let y = height - 80;
    for (const line of lines) {
        page.drawText(line, {
            x: 5,
            y,
            font: helveticaFont,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        y -= 20;
    }

    if (contract?.signature) {
        const imageUrl = contract.signature;
        const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
        const pdfImage = await pdfDoc.embedPng(imageBytes);
        page.drawImage(pdfImage, {
            x: 70,
            y: 80,
            width: 150,
            height: 80,
        });
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
    });

    return await getFile(modifiedPdfBlob);
}

interface ISignContract {
    contract_pdf: string;
    signature: string;
    address: string;
    pps_number: string;
    contact_number: string;
}

export const signContract = async ({
    contract_pdf,
    signature,
    address,
    pps_number,
    contact_number,
}: ISignContract) => {
    const existingPdfBytes = await fetch(contract_pdf).then((res) =>
        res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPage(6);

    const { height } = page.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    page.drawText(address, {
        x: 100,
        y: height - 140,
        font: helveticaFont,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
    page.drawText(pps_number, {
        x: 125,
        y: height - 180,
        font: helveticaFont,
        size: fontSize,
        color: rgb(0, 0, 0),
    });
    page.drawText(contact_number, {
        x: 145,
        y: height - 160,
        font: helveticaFont,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    if (signature) {
        const imageUrl = signature;
        const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
        const pdfImage = await pdfDoc.embedPng(imageBytes);
        page.drawImage(pdfImage, {
            x: 380,
            y: 80,
            width: 150,
            height: 80,
        });
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
    });

    return await getFile(modifiedPdfBlob);
}


export const downloadPDF = (base64String: any, fileName: string) => {
    // Remove header of base64 string
    const base64WithoutHeader = base64String.split(';base64,').pop();

    // Convert base64 to Uint8Array
    const bytes = new Uint8Array(atob(base64WithoutHeader).split('').map(char => char.charCodeAt(0)));

    // Create Blob object
    const pdfBlob = new Blob([bytes], { type: 'application/pdf' });

    // Create temporary URL
    const url = URL.createObjectURL(pdfBlob);

    // Create anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Append anchor to body and trigger download
    document.body.appendChild(a);
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
};