const userService = require("./user.service");

const createUser = async(req,res,next)=>{
    try{
        const user = await userService.createUser(
            req.body,
            req.user
        );

        res.status(201).json({
            success:true,
            message:"User created successfully",
            data:{user}
        });
    }catch(error){
        next(error);
    }
};

const getUsers = async(req,res,next)=>{
    try{
        const result = await userService.getCompanyUsers(
            req.user,
            req.query
        );

        res.status(200).json({
            success:true,
            data:result
        });
    }catch(error){
        next(error);
    }
};

const getUser = async(req,res,next)=>{
    try{
        const user = await userService.getUserById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            data:{user}
        });
    }catch(error){
        next(error);
    }
};

const updateUser = async(req,res,next)=>{
    try{
        const user = await userService.updateUser(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"User updated successfully",
            data:{user}
        });
    }catch(error){
        next(error);
    }
};

const toggleStatus = async(req,res,next)=>{
    try{
        const user = await userService.toggleUserStatus(
            req.params.id,
            req.body.status,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"User status updated successfully",
            data:{user}
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    createUser,
    getUsers,
    getUser,
    updateUser,
    toggleStatus
};