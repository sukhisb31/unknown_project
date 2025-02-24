import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true,
        minLength : [3, "Minimum three characters required"],
        maxLength : [32, "maximum 32 characters required do not exceed 32 characters"],
    },
    email : {
        type: String,
        required: true,
        unique : true, 
    },
    password : {
        type : String,
        minLength : [6, " password must be at least 6 characters or more"],
        maxLength : [32, "password must be less than 32 characters"],
    },
    phone: {
        type: String,
        minLength : [10, "Phone number must be at least 10 characters"],
        maxLength : [10, "Please provide valid phone number"],
    },
    address : {
        String,
    },
    profileImage : {
        public_id : {
            type: String,
            required : true,
        },
        url : {
            type: String,
            required : true,
        },
    },
    paymentMethods : {
        bankTransfer : {
            bankAccountNumber : {
                type: Number,
            },
            bankAccountName : {
                type: String,
            },
            bankName : {
                type: String,
            },
        },
        ifscCode : {
            upi_id : String,
        },
        paypal :{
            paypalEmail : String,
        }
    },
    role : {
        type : String,
        enum : ["Auctioneer", "Bidder", "Admin"],
    },
    unpaidCommission : {
        type : Number,
        default : 0,
    },
    auctionWon : {
        type : Number,
        default : 0,
    },
    moneySpent : {
        type: Number,
        default : 0,
    },
    createdAt : {
        type : Date,
        default :Date.now,
    }
})
export const User = mongoose.model("User", userSchema); 