const mongoose = require("mongoose");



const leaveTypeSchema = new mongoose.Schema(

{

    allocated:{

        type:Number,

        default:0,

        min:0

    },


    used:{

        type:Number,

        default:0,

        min:0

    },


    remaining:{

        type:Number,

        default:0,

        min:0

    },


    carriedForward:{

        type:Number,

        default:0,

        min:0

    },


    expired:{

        type:Number,

        default:0,

        min:0

    }

},

{

    _id:false

}

);









const leaveBalanceSchema = new mongoose.Schema(

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





    year:{


        type:Number,


        required:true,


        index:true


    },





    casualLeave:{

        type:leaveTypeSchema,


        default:()=>({})

    },





    sickLeave:{

        type:leaveTypeSchema,


        default:()=>({})

    },





    paidLeave:{

        type:leaveTypeSchema,


        default:()=>({})

    },





    unpaidLeave:{


        used:{


            type:Number,


            default:0,


            min:0


        }


    },





    // Monthly tracking

    monthlyAccrual:{


        type:Boolean,


        default:false


    },





    // Policy reference

    leavePolicy:{


        type:mongoose.Schema.Types.ObjectId,


        ref:"LeavePolicy"


    },





    lastUpdatedBy:{


        type:mongoose.Schema.Types.ObjectId,


        ref:"User"


    },


    createdBy:{


        type:mongoose.Schema.Types.ObjectId,


        ref:"User"


    }



},

{

    timestamps:true

});









// One employee balance per year

leaveBalanceSchema.index(

{

    company:1,

    employee:1,

    year:1

},

{

    unique:true

}

);








leaveBalanceSchema.index({

    company:1,

    year:1

});









const LeaveBalance = mongoose.model(

    "LeaveBalance",

    leaveBalanceSchema

);



module.exports = LeaveBalance;