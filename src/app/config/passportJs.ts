/* eslint-disable no-console */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import { userModel } from "../modules/users/user.model";
import { isActive, role } from "../modules/users/user.interface";
import bcrypt from "bcrypt";

// For credenital authentication by passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const existedUser = await userModel.findOne({ email });

        if (!existedUser) {
         return done(null, false, { message: "User not exist" });
        }

        if (
          existedUser.isActive === isActive.INACTIVE ||
          existedUser.isActive === isActive.BLOCKED
        ) {
          return done(null, false, { message: `User is ${existedUser.isActive}` });
        }

         const hashedPassword = await bcrypt.compare(
          password,
          existedUser?.password as string
        );
        if (!hashedPassword) {
          return done(null, false, { message: "Password is invalid" });
        }

        if (existedUser.isVerified === false) {
            console.log(`In passport - User is not veified block`)
            return done(null, false, { message: "User is not verified" });
        }

        if (existedUser.isDeleted === true) {
            return done(null, false, { message: "User is deleted already" });
        }

        const isGoogleAthenticated = existedUser.auths.some(
          (providerObject) => providerObject.provider === "google"
        );

        // if (isGoogleAthenticated && existed) {
        //   return done(null, false, {message:"You have athenticated through google, If you want to login through credential, then at first login with google and set a passowrd then you can be able to login with credentials"})
        // }
        if (isGoogleAthenticated && !existedUser.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. To log in with credentials, log in with Google first and set a password."
          });
        }

       
        return done(null, existedUser);
      } catch (error) {
        console.log("Credential login faild: ", error);
        done(error);
      }
    }
  )
);

// for google authentication by passport
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID as string,
      clientSecret: envVars.GOOGLE_SECRET as string,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let existedUser = await userModel.findOne({ email });
        if (!existedUser) {
          existedUser = await userModel.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            isVerified: true,
            role: role.USER,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
         await existedUser.save();
        }
        return done(null, existedUser);
      } catch (error) {
        console.log(`Logging with google is faild: ${error}`);
        return done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
