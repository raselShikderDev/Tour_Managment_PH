import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { userModel } from "../modules/users/user.model";
import { role } from "../modules/users/user.interface";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID as string,
      clientSecret: envVars.GOOGLE_SECRET as string,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken:string, refreshToken:string, profile:Profile, done:VerifyCallback) => {
        try {
           const email = profile.emails?.[0].value;
           if (!email) {
            return done(null, false, {message:"No email found"})
           }
           let user = await userModel.findOne({email})
           if (!user) {
            user = await userModel.create({
               name:profile.displayName,
               email,
               picture:profile.photos?.[0].value,
               isVerified:true,
               role:role.USER,
               auths:[
                {
                    provider:"google",
                    providerId:profile.id
                }
               ]
            })
            user.save()
           }
           return done(null, user)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Logging with google is faild: ${error}`);
            return done(error)
        }
    }
  )
);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) =>{
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async(id:string, done:any)=>{
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        done(error)
    }
})