import mongoose from "mongoose"

const URI = process.env.MONGODB_URI
async function ConnectDb() {
    try {
        await mongoose.connect(URI)
        console.log('connection successfull to db')
    } catch (error) {
        console.log("db connection failed", error)
        process.exit(0)
    }
}

export default ConnectDb