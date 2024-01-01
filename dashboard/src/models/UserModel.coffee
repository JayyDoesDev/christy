{ Schema, model } = require "mongoose"

UserModel = new Schema
            User : String
            presentCount : type : Number, default : 0
            candyCount : type : Number, default : 0
            snowballCount : type : Number, default : 0
            blackListed : type : Boolean, default : false
            {
                versionKey : false
                strict : true
            } 

module.exports = model "users", UserModel