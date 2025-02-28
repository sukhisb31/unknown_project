export const generateToken = (user, res, statusCode, message) =>{
    const token = user.generateJsonWebToken();
    res.status(statusCode).cookie("token", token, {
        expiresIn : new Date(Date.now() + process.env.COOKIE_EXPIRE *24 *60 *60 *1000),
        httpOnly : true,
    }).json({
        success : true,
        message,
        user,
        token,
    })
}