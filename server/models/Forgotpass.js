const mongoose = require('mongoose');


const ForgotSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    authcode : {
        type : String,
        required : true
    },

})

const PassValidator = mongoose.model('storeAuthCode',ForgotSchema);
module.exports = PassValidator;