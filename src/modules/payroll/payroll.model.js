const mongoose=require("mongoose");

const payrollSchema=new mongoose.Schema({
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

    month:{
        type:Number,
        required:true,
        min:1,
        max:12
    },

    year:{
        type:Number,
        required:true,
        min:2000,
        max:2100
    },

    basicSalary:{
        type:Number,
        required:true,
        min:0
    },

    allowances:{
        houseAllowance:{type:Number,default:0},
        transportAllowance:{type:Number,default:0},
        medicalAllowance:{type:Number,default:0},
        otherAllowance:{type:Number,default:0}
    },

    attendance:{
        totalWorkingDays:{type:Number,default:0},
        presentDays:{type:Number,default:0},
        absentDays:{type:Number,default:0},
        leaveDays:{type:Number,default:0}
    },

    overtime:{
        hours:{type:Number,default:0},
        amount:{type:Number,default:0}
    },

    deductions:{
        tax:{type:Number,default:0},
        providentFund:{type:Number,default:0},
        insurance:{type:Number,default:0},
        absentDeduction:{type:Number,default:0},
        otherDeduction:{type:Number,default:0}
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

    status:{
        type:String,
        enum:[
            "DRAFT",
            "PROCESSED",
            "APPROVED",
            "PAID",
            "CANCELLED"
        ],
        default:"DRAFT"
    },

    paymentDate:{
        type:Date
    },

    paymentReference:{
        type:String,
        trim:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    paidBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},

updatedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}

},{
    timestamps:true
});


payrollSchema.index({
    company:1,
    employee:1,
    month:1,
    year:1
},{
    unique:true
});

payrollSchema.index({
    company:1,
    status:1
});


module.exports=mongoose.model("Payroll",payrollSchema);