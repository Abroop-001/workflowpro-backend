const leaveService = require("./leave.service");

const createLeave = async(req,res,next)=>{

    try{

        const leave =
            await leaveService.createLeave(
                req.body,
                req.user
            );


        res.status(201).json({

            success:true,

            message:
            "Leave applied successfully",

            data:{
                leave
            }

        });


    }catch(error){

        next(error);

    }

};


const approveLeave = async(req,res,next)=>{

    try{


        const leave =
            await leaveService.approveLeave(

                req.params.id,

                req.user

            );


        res.status(200).json({

            success:true,

            message:
            "Leave approved successfully",

            data:{
                leave
            }

        });


    }catch(error){

        next(error);

    }

};


const rejectLeave = async(req,res,next)=>{

    try{


        const leave =
            await leaveService.rejectLeave(

                req.params.id,

                req.body.rejectionReason,

                req.user

            );


        res.status(200).json({

            success:true,

            message:
            "Leave rejected successfully",

            data:{
                leave
            }

        });


    }catch(error){

        next(error);

    }

};


const cancelLeave = async(req,res,next)=>{

    try{


        const leave =
            await leaveService.cancelLeave(

                req.params.id,

                req.user

            );


        res.status(200).json({

            success:true,

            message:
            "Leave cancelled successfully",

            data:{
                leave
            }

        });

    }catch(error){

        next(error);

    }

};


const getEmployeeLeaves = async(req,res,next)=>{

    try{


        const leaves =
            await leaveService.getEmployeeLeaves(

                req.params.employeeId,

                req.user

            );


        res.status(200).json({

            success:true,

            data:{
                leaves
            }

        });


    }catch(error){

        next(error);

    }

};


const getLeaves = async (req, res, next) => {
    try {
        const leaves = await leaveService.getLeaves(req.query, req.user);
        res.status(200).json({
            success: true,
            data: { leaves }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLeave,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getEmployeeLeaves,
    getLeaves
};