const PDFDocument = require("pdfkit");

const fs = require("fs");

const path = require("path");





// ======================================
// Generate Payslip PDF
// ======================================

const generatePayslipPDF = async (

    payslip,

    employee

)=>{


    const uploadDir = path.join(

        __dirname,

        "../../uploads/payslips"

    );





    // Create folder if not exists

    if(!fs.existsSync(uploadDir)){

        fs.mkdirSync(

            uploadDir,

            {

                recursive:true

            }

        );

    }





    const fileName =

        `${payslip.payslipNumber}.pdf`;





    const filePath = path.join(

        uploadDir,

        fileName

    );







    return new Promise((resolve,reject)=>{



        const doc = new PDFDocument({

            margin:50

        });





        const stream = fs.createWriteStream(

            filePath

        );





        doc.pipe(stream);







        // Header

        doc

        .fontSize(20)

        .text(

            "COMPANY PAYSLIP",

            {

                align:"center"

            }

        );





        doc.moveDown();





        doc.fontSize(12)

        .text(

            `Payslip No: ${payslip.payslipNumber}`

        )

        .text(

            `Month: ${payslip.month}/${payslip.year}`

        );







        doc.moveDown();





        // Employee Details

        doc.fontSize(14)

        .text(

            "Employee Details"

        );



        doc.fontSize(12)

        .text(

            `Employee ID: ${employee.employeeId}`

        )

        .text(

            `Name: ${employee.personalInfo.firstName} ${employee.personalInfo.lastName || ""}`

        );








        doc.moveDown();





        // Salary Details

        doc.fontSize(14)

        .text(

            "Salary Details"

        );





        doc.fontSize(12)

        .text(

            `Basic Salary: ₹${payslip.salaryDetails.basicSalary}`

        )

        .text(

            `Gross Salary: ₹${payslip.grossSalary}`

        )

        .text(

            `Overtime Amount: ₹${payslip.salaryDetails.overtimeAmount}`

        );








        doc.moveDown();





        // Allowances

        doc.fontSize(14)

        .text(

            "Allowances"

        );





        Object.entries(

            payslip.salaryDetails.allowances

        )

        .forEach(([key,value])=>{


            doc.fontSize(12)

            .text(

                `${key}: ₹${value}`

            );


        });








        doc.moveDown();





        // Deductions

        doc.fontSize(14)

        .text(

            "Deductions"

        );





        Object.entries(

            payslip.salaryDetails.deductions

        )

        .forEach(([key,value])=>{


            doc.fontSize(12)

            .text(

                `${key}: ₹${value}`

            );


        });








        doc.moveDown();





        doc.fontSize(16)

        .text(

            `Net Salary: ₹${payslip.netSalary}`,

            {

                bold:true

            }

        );








        doc.moveDown(2);





        doc.fontSize(10)

        .text(

            "This is a system generated payslip.",

            {

                align:"center"

            }

        );





        doc.end();







        stream.on(

            "finish",

            ()=>{


                resolve(filePath);


            }

        );





        stream.on(

            "error",

            reject

        );



    });


};









module.exports = {


    generatePayslipPDF


};