import mongoose from 'mongoose';
import figlet from 'figlet';

async function databaseConnect(dbUri) {
    try {
        await mongoose.connect(dbUri);
        figlet("Database Connected  .  .  .  .",(err,data)=>{
            if(err){
                console.log("Something Went Wrong");
                return;
            }
            console.log(data);
        })
        // console.log("⚙️  ⚙️  ⚙️  Database connected ⚙️  ⚙️  ⚙️");
    } catch (error) {
        console.log("Database connection error ❌  ❌  ❌");
    }
}
export default databaseConnect;