const mongoose = require("mongoose");



const notificationSchema = new mongoose.Schema(

{

    company:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Company",

        required:true,

        index:true

    },


    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true,

        index:true

    },

    type:{

        type:String,

        enum:[

            "LEAVE",

            "PAYROLL",

            "ATTENDANCE",

            "RECRUITMENT",

            "DOCUMENT",

            "PERFORMANCE",

            "SYSTEM"

        ],

        required:true,

        index:true

    },

    priority:{

        type:String,

        enum:[

            "LOW",

            "MEDIUM",

            "HIGH",

            "URGENT"

        ],

        default:"MEDIUM"

    },

    title:{

        type:String,

        required:true,

        trim:true,

        maxlength:150

    },
    message:{

        type:String,

        required:true,

        trim:true,

        maxlength:500

    },

    reference:{

        module:{

            type:String,

            default:null

        },


        id:{

            type:mongoose.Schema.Types.ObjectId,

            default:null

        }

    },

    isRead:{

        type:Boolean,

        default:false,

        index:true

    },

    readAt:{

        type:Date,

        default:null

    },

    expiresAt:{

        type:Date,

        default:null

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

notificationSchema.index({

    user:1,

    isRead:1,

    createdAt:-1

});


notificationSchema.index({

    company:1,

    createdAt:-1

});


module.exports = mongoose.model(

    "Notification",

    notificationSchema

);