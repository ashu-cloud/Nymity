 import mongoose from "mongoose"

 type ConnectionObject = {
    isConnected?: number
 }

 const connection: ConnectionObject = {}

 async function deConnect(): Promise<void>{
    if(connection.isConnected) {
        console.log("Connected")
        return
    }
    try{

        const db = await mongoose.connect(process.env.MONGODB_URI|| '', {})

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected")

    }catch(e){
        console.error("Database connection failed: ", e);
        process.exit(1);
    }
 }



 export default deConnect;