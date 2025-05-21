import arcjet, { validateEmail } from "@arcjet/node";
import { config } from "dotenv";
config();

const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: process.env.ARCJET_KEY,
    rules: [
        validateEmail({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            // block disposable, invalid, and email addresses with no MX records
            block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});

export default aj;