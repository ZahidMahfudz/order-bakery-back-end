import dotnev from "dotenv"

dotnev.config();

export const config = {
    port : process.env.PORT || 3500,
    env : process.env.NODE_ENV || "Production"
}

