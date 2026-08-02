const mongoose = require("mongoose");


const salaryStructureSchema = new mongoose.Schema(
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

        unique:true

    },


    basicSalary:{

        type:Number,

        required:true,

        min:0

    },


    allowances:{


        houseAllowance:{

            type:Number,

            default:0

        },


        transportAllowance:{

            type:Number,

            default:0

        },


        medicalAllowance:{

            type:Number,

            default:0

        },


        otherAllowance:{

            type:Number,

            default:0

        }

    },




    deductions:{


        tax:{

            type:Number,

            default:0

        },


        providentFund:{

            type:Number,

            default:0

        },


        insurance:{

            type:Number,

            default:0

        },


        otherDeduction:{

            type:Number,

            default:0

        }

    },





    overtimeRatePerHour:{

        type:Number,

        default:0

    },





    effectiveFrom:{

        type:Date,

        default:Date.now

    },





    status:{

        type:String,

        enum:[

            "ACTIVE",

            "INACTIVE"

        ],

        default:"ACTIVE"

    },





    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User"

    },


    updatedBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User"

    }


},

{

    timestamps:true

});







salaryStructureSchema.index({

    company:1,

    employee:1

});






module.exports = mongoose.model(

    "SalaryStructure",

    salaryStructureSchema

);