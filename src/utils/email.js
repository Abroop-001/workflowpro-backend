const nodemailer = require("nodemailer");


const sendEmail = async(options)=>{


    if(
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASSWORD
    ){

        console.log("\n==============================");
        console.log("EMAIL DEVELOPMENT MODE");
        console.log("==============================");

        console.log("To:", options.email);

        console.log("Subject:", options.subject);

        console.log("Verification Link:");

        console.log(options.message);

        console.log("==============================\n");


        return;

    }



    const transporter = nodemailer.createTransport({

        service:"gmail",

        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }

    });



    await transporter.sendMail({

        from:process.env.EMAIL_USER,

        to:options.email,

        subject:options.subject,

        html:options.message

    });


};


module.exports = sendEmail;