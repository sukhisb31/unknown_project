// import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  try {
    // Check if profile image is provided
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Profile image is required", 400));
    }

    const { profileImage } = req.files;

    // Validate file type
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(profileImage.mimetype)) {
        return next(new ErrorHandler("File format not supported", 400));
    }

    // Extract user details from request body
    const {
        userName,
        password,
        email,
        address,
        phone,
        bankAccountNumber,
        bankAccountName,
        bankName,
        upi_d,
        paypalEmail,
        role
    } = req.body;

    // Validate required fields
    if (!userName || !password || !email || !address || !phone || !role) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    // Additional validation for auctioneers
    if (role === "Auctioneer") {
        if (!bankAccountName || !bankAccountNumber || !bankName) {
            return next(new ErrorHandler("Please provide correct bank details", 400));
        }
        if (!upi_id) {
            return next(new ErrorHandler("Please provide your UPI ID", 400));
        }
        if (!paypalEmail) {
            return next(new ErrorHandler("Please provide your PayPal email", 400));
        }
    }

    // Check if user is already registered
    const isRegister = await User.findOne({ email });
    if (isRegister) {
        return next(new ErrorHandler("User already registered", 400));
    }

    // Upload profile image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
        folder: "AUCTION_PLATFORM_USERS",
    });

    if (cloudinaryResponse.error) {
        console.error("Cloudinary error", cloudinaryResponse.error || "unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }

    // Create new user
    const user = await User.create({
        userName,
        email,
        password,
        address,
        phone,
        role,
        profileImage: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        paymentMethods: {
            bankTransfer: {
                bankAccountNumber,
                bankAccountName,
                bankName,
            },
            upi: upi_id, 
            payPal: paypalEmail 
        },
    });

    // Send success response
    generateToken(user, res, 201, "User Registered Successfully")
   

} catch (error) {
    next(new ErrorHandler(error.message, 500));
}
});
// check login user is valid or not
export const login = catchAsyncError(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return next (new ErrorHandler ("Both fields are required to fill", 400));
    };

    // check user is valid or not
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next (new ErrorHandler("User not found", 400));
    };

    // check password matched or not
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch) {
        return next (new ErrorHandler("Password is not matched", 400));
    };
    generateToken(user, "Login successfully", 201 , res);
});

// get Profile
export const getProfile = catchAsyncError(async(req, res, next)=>{
    const user = req.user;
    res.status(200).json({
        success : true,
        user,
    });
});

// logout
export const logOut = catchAsyncError(async(req, res, next) =>{
    res.status(200).cookie("token", "", {
        expires : new Date(Date.now()),
        httpOnly : true,
    }).json({
        success : true,
        message : "Logout Successfully",
    });
});

// fetch leaderboard
export const fetchLeaderBoard = catchAsyncError(async(req, res, next) => {
    const users = await User.find({moneySpent : {$gt : 0}});
    const leaderboard = users.sort((a,b)=> b.moneySpent - a.moneySpent);
    res.status(200).json({
        success : true,
        leaderboard
    })
})