const {resError, resSuccess} = require("../../services/responseHandler")

exports.deviceList = async (req, res)=>{
    try {
        return resSuccess({res, title: "Success to show all device list", data: ["device 1", "device 2"]})
    } catch (error) {
        return resError({res, errors: error})
    }
}