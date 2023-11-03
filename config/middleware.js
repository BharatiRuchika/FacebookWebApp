// Middleware to set flash messages in response locals
module.exports.setFlash = function(req,res,next){
    // Set flash messages in the 'res.locals.flash' object
    res.locals.flash = {
        'success':req.flash('success'),// Retrieve 'success' flash messages
        'error':req.flash('error')// Retrieve 'error' flash messages
    }
    next()// Proceed to the next middleware
}

// Middleware for common data handling
module.exports.commomData = function(req,res,next){
    // console.log('im in common data')
    next()// Proceed to the next middleware
}