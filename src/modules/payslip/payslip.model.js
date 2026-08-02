const mongoose = require("mongoose");



const payslipSchema = new mongoose.Schema(

{

    company:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Company",

        required:true,

        index:true

    },



    employee:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Employee",

        required:true,

        index:true

    },



    payroll:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Payroll",

        required:true,

        unique:true

    },



    payslipNumber:{

        type:String,

        required:true,

        unique:true

    },



    month:{

        type:Number,

        required:true

    },



    year:{

        type:Number,

        required:true

    },





    salaryDetails:{


        basicSalary:{

            type:Number,

            default:0

        },


        allowances:{

            type:Object,

            default:{}

        },


        deductions:{

            type:Object,

            default:{}

        },


        overtimeAmount:{

            type:Number,

            default:0

        }


    },









    grossSalary:{

        type:Number,

        default:0

    },



    totalDeduction:{

        type:Number,

        default:0

    },



    netSalary:{

        type:Number,

        default:0

    },







    pdfUrl:{

        type:String

    },





    status:{

        type:String,

        enum:[

            "GENERATED",

            "SENT"

        ],

        default:"GENERATED"

    },







    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User"

    }



},

{

    timestamps:true

}

);









payslipSchema.index({

    company:1,

    employee:1,

    month:1,

    year:1

});







module.exports = mongoose.model(

    "Payslip",

    payslipSchema

);