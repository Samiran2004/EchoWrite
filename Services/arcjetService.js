import arcjet, { validateEmail } from "@arcjet/node";
import { config } from "dotenv";
config();

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        validateEmail({
            mode: "LIVE", 
            block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});

export default aj;