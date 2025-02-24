import mongoose from "mongoose";

export const Connection = () => {
    mongoose.connect(process.env.MONGO_URI, 
        {
            dbName: "AUCTION_SYSTEM",
        }
    ).then(() =>{
        console.log("Database connected successfully");
        
    }).catch((err)=>{
        console.log(`something error to db connection : ${err}`);
        
    })
}