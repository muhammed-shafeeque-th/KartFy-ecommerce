const asyncHandler = (requestHandler) => (req, res, next) => {

    Promise.resolve(requestHandler(req, res, next))
    .catch((error)=> {
        
        console.log(error);
        // next(error)
      return( res.status(error?.statusCode ?? 500)
       .json({
        success: error.success,
        error: true,
        message: error.message,
       })
    )
    })
}

module.exports = asyncHandler;