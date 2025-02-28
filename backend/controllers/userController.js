// import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";

export const register = catchAsyncError(async (req, res, next) => {
  // cloudinary image file error
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Profile image is required", 400));
    }

    const { profileImage } = req.files;

    // mention image format in this error
    const allowFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowFormats.includes(profileImage.mimetype)) {
      return next(
        new ErrorHandler(
          "Image format is not valid please upload valid image format file",
          400
        )
      );
    }

    // check user validation he provide all details exact or not

    const {
      userName,
      email,
      password,
      phone,
      address,
      role,
      bankName,
      bankAccountNumber,
      bankAccountName,
      upi_id,
      paypalEmail,
    } = req.body;

    // if user leave any field for registration then validate error to user
    if (!userName || !email || !password || !phone || !address || !role) {
      return next(new ErrorHandler("please fill all fields", 400));
    }
    // auctioneer role
    if (role === "Auctioneer") {
      if (!bankName || !bankAccountNumber || !bankAccountName) {
        return next(new ErrorHandler("please provide correct bank details "));
      }
      if (!upi_id) {
        return next(
          new ErrorHandler("Provide your upi id and correct upi id", 400)
        );
      }
      if (!paypalEmail) {
        return next(
          new ErrorHandler("Provide your paypal email and correct email", 400)
        );
      }
    }
    // check user is registered or not
    const isRegister = await User.findOne({ email });
    if (isRegister) {
      return next(new ErrorHandler("User already registered", 400));
    }
    // cloudinary response error
    const cloudinaryResponse = await cloudinary.uploader.upload(
      profileImage.tempFilePath,
      {
        folder: "AUCTION_SYSTEM_USERS",
      }
    );
    if (cloudinaryResponse.error) {
      console.log("cloudinary Error :", cloudinaryResponse.error || "unknown cloudinary error");
      return next(
        new ErrorHandler("failed to upload image to cloudinary", 500)
      );
    }

    // create user
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
          bankName,
          bankAccountNumber,
          bankAccountName,
        },
        upi: upi_id,
        payPal: paypalEmail,
      },
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
