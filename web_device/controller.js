const {resError, resSuccess} = require ("../services/responseHandler")

exports.pairing = async (req,res)=>{
    try {
        return res.render ("pairing")
    } catch (error) {
        return resError ({res, errors:error})
    }
}
exports.dashboard = async (req,res)=>{
    try {
        return res.render ("dashboard")
    } catch (error) {
        return resError ({res, errors:error})
    }
}

