export const catchAsyncError = (func) => {
    return (req, res, next) => {
        promises.resolve(func(req,res,next)).catch(next);
    }
}