const Shift=require("./shift.model");
const AppError=require("../../utils/AppError");


const createShift=async(
    data,
    currentUser
)=>{

    const existingShift=await Shift.findOne({
        company:currentUser.company,
        name:data.name,
        isDeleted:false
    });


    if(existingShift){
        throw new AppError(
            "Shift with this name already exists",
            409
        );
    }


    return await Shift.create({

        ...data,

        company:currentUser.company,

        createdBy:currentUser.id

    });

};



const getCompanyShifts=async(
    currentUser
)=>{

    return await Shift.find({

        company:currentUser.company,

        isDeleted:false

    })
    .sort({

        createdAt:-1

    });

};



const getShiftById=async(
    shiftId,
    currentUser
)=>{


    const shift=await Shift.findOne({

        _id:shiftId,

        company:currentUser.company,

        isDeleted:false

    });


    if(!shift){

        throw new AppError(
            "Shift not found",
            404
        );

    }


    return shift;

};



const updateShift=async(
    shiftId,
    updateData,
    currentUser
)=>{


    delete updateData.company;
    delete updateData.createdBy;
    delete updateData.isDeleted;



    if(updateData.name){

        const existingShift=await Shift.findOne({

            company:currentUser.company,

            name:updateData.name,

            isDeleted:false,

            _id:{
                $ne:shiftId
            }

        });


        if(existingShift){

            throw new AppError(
                "Shift with this name already exists",
                409
            );

        }

    }



    const shift=await Shift.findOneAndUpdate(

        {
            _id:shiftId,

            company:currentUser.company,

            isDeleted:false
        },

        updateData,

        {
            new:true,

            runValidators:true

        }

    );



    if(!shift){

        throw new AppError(
            "Shift not found",
            404
        );

    }


    return shift;

};



const deactivateShift=async(
    shiftId,
    currentUser
)=>{


    const shift=await Shift.findOne({

        _id:shiftId,

        company:currentUser.company,

        isDeleted:false

    });



    if(!shift){

        throw new AppError(
            "Shift not found",
            404
        );

    }



    shift.status="INACTIVE";


    await shift.save();



    return shift;

};



module.exports={

    createShift,

    getCompanyShifts,

    getShiftById,

    updateShift,

    deactivateShift

};