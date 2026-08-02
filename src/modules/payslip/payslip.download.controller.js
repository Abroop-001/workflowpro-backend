const Payslip = require("./payslip.model");

const fs = require("fs");

const path = require("path");

const AppError = require("../../utils/AppError");

const downloadPayslip = async (

    req,

    res,

    next

)=>{


    try{


        const payslip = await Payslip.findOne({

            _id:req.params.id,

            company:req.user.company

        })

        .populate(

            "employee"

        );

        if(!payslip){

            throw new AppError(

                "Payslip not found",

                404

            );

        }

        if(

            req.user.role === "EMPLOYEE"

            &&

            payslip.employee?.user?.toString()

            !==

            req.user._id.toString()

        ){

            throw new AppError(

                "Access denied",

                403

            );

        }


        if(!payslip.pdfUrl){

            throw new AppError(

                "PDF not generated",

                404

            );

        }

        const filePath = path.resolve(

            payslip.pdfUrl

        );

        if(!fs.existsSync(filePath)){


            throw new AppError(

                "File not found",

                404

            );


        }

        res.download(

            filePath,

            `${payslip.payslipNumber}.pdf`

        );



    }

    catch(error){

        next(error);

    }


};


module.exports = {


    downloadPayslip


};