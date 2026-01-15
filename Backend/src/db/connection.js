import { connect } from "mongoose";

export async function connection() {
    try {
        const instance = await connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
        console.log("Database connected: ", instance.connections[0].db.databaseName)
    } catch (error) {
        console.log("Database Error: ", error)
    }
}