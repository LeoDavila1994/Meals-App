const dotenv = require("dotenv");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const sendErrorDev = (error, req, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error,
        stack: error.stack
    });
};
const sendErrorProd = (error, req, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message || "Something went wrong!"
    });
};

const tokenExpiredError = () => {
    return new AppError("Session expired...", 403)
};

const jwtError = () =>{
    return new AppError("Invalid token...", 403)
};

const emailDuplicationError = () => {
    return new AppError("This email are in use", 400)
}

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "fail"

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(error, req, res)
    } else if (process.env.NODE_ENV === "production"){
        let err = { ...error };

        if(error.name === "TokenExpiredError"){
            err = tokenExpiredError();
        } else if(error.name === "JsonWebTokenError"){
            err = jwtError()
        } else if (error.name === "SequelizeUniqueConstrainError"){
            err = emailDuplicationError();
        }

        sendErrorProd(err, req, res)
    }
};

module.exports = { globalErrorHandler };