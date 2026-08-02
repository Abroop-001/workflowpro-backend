const mongoose=require("mongoose");

const companySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    phone:{
        type:String,
        trim:true
    },
    address:{
        street:String,
        city:String,
        state:String,
        country:String
    },
    industry:{
        type:String,
        trim:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:[
            "ACTIVE",
            "SUSPENDED"
        ],
        default:"ACTIVE"
    }
},{
    timestamps:true
});

const Company=mongoose.model(
    "Company",
    companySchema
);

module.exports=Company;