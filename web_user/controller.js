const {resError, resSuccess} = require ("../services/responseHandler")

exports.signup = async (req,res)=>{
    try {
        return res.render ("register")
    } catch (error) {
        return resError ({res, errors:error})
    }
}
exports.login = async (req,res)=>{
    try {
        return res.render ("login")
    } catch (error) {
        return resError ({res, errors:error})
    }
}
exports.setting = async (req,res)=>{
    try {
        return res.render ("setting")
    } catch (error) {
        return resError ({res, errors:error})
    }
}


