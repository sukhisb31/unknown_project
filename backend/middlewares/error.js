class ErrorHandler extends Error {
    constructor(message, statusCode){
        super (message);
        this.statusCode = statusCode;
    };
};

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error"
    err.statusCode = err.statusCode || 500;

    if(!err.name === "jsonWebTokenError"){
        const message = "Invalid token try again";
        err = new ErrorHandler(message, 400);
    };
    if(!err.name === "jsonWebTokenExpire"){
        const message = "Token expired try again";
    };
    if(!err.name === "CastError"){
        const message = `Invalid ${err.path}`;
    };

    const errorMessage = err.errors ? Object.values(err.errors).map((error)=>{error.message}).join(" ") : err.message;

    return res.status (err.statusCode).json({
        success : false,
        message : errorMessage,
    });
};

export default ErrorHandler;