const RefreshToken = require("../refreshToken.model");


const logoutUser = async (token) => {


    if (!token) {
    
        return true;
    }


    const refreshToken =
        await RefreshToken.findOne({ token });


    if (!refreshToken) {
       
        return true;
    }


    if (!refreshToken.isRevoked) {
        refreshToken.isRevoked = true;
        await refreshToken.save();
    }


    return true;

};


module.exports = logoutUser;