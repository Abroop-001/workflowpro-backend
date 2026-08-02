const attendanceService=require("./attendance.service");

const checkIn=async(req,res,next)=>{
    try{
        const attendance=
            await attendanceService.checkIn(
                req.body,
                req.user
            );

        res.status(201).json({
            success:true,
            message:"Attendance checked in successfully",
            data:{
                attendance
            }
        });

    }catch(error){
        next(error);
    }
};


const checkOut=async(req,res,next)=>{
    try{
        const attendance=
            await attendanceService.checkOut(
                req.body.attendanceId,
                req.user
            );

        res.status(200).json({
            success:true,
            message:"Attendance checked out successfully",
            data:{
                attendance
            }
        });

    }catch(error){
        next(error);
    }
};


const getEmployeeAttendance=async(req,res,next)=>{
    try{
        const attendance=
            await attendanceService.getEmployeeAttendance(
                req.params.employeeId,
                req.user
            );

        res.status(200).json({
            success:true,
            data:{
                attendance
            }
        });

    }catch(error){
        next(error);
    }
};


const getTodayAttendance=async(req,res,next)=>{
    try{
        const attendance=
            await attendanceService.getTodayAttendance(
                req.user
            );

        res.status(200).json({
            success:true,
            data:{
                attendance
            }
        });

    }catch(error){
        next(error);
    }
};


const getAttendances = async (req, res, next) => {
    try {
        const attendances = await attendanceService.getAttendances(req.query, req.user);
        res.status(200).json({
            success: true,
            data: { attendances }
        });
    } catch (error) {
        next(error);
    }
};

module.exports={
    checkIn,
    checkOut,
    getEmployeeAttendance,
    getTodayAttendance,
    getAttendances
};