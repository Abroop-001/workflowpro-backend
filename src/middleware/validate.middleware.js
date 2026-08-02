const AppError = require("../utils/AppError");



const validate = (schema) => {


    return (req,res,next)=>{


        const {error} =
            schema.validate(

                req.body,

                {
                    abortEarly:false,

                    allowUnknown:false

                }

            );



        if(error){


            const messages =
                error.details.map(
                    detail => detail.message
                );



            return next(

                new AppError(

                    messages.join(", "),

                    400

                )

            );

        }



        next();


    };


};



module.exports = validate;