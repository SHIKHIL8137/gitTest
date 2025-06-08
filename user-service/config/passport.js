import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import { generateUserId } from "../util/reuseFunctions.js";
import Client from "../model/user/clientMode.js";
import Freelancer from "../model/user/freelancerModel.js";

dotenv.config();

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails?.[0]?.value;
        if (!email) {
          throw new Error("Google profile does not contain an email address.");
        }

        const role = req.query.role || req.query.state || "client";
        const Model = role === "freelancer" ? Freelancer : Client;

        let user =
          (await Freelancer.findOne({
            $or: [{ googleId: profile.id }, { email }],
          })) ||
          (await Client.findOne({
            $or: [{ googleId: profile.id }, { email }],
          }));

        if (user) {
          if (user.block) {
            req.blockedUser = true;
            return done(null, false, { message: "User is blocked" });
          }
          return done(null, user);
        }

        if (!user) {
          let baseUserName = profile.displayName.trim().replace(/\s+/g, "_");
          let userName = baseUserName;
          let suffix = 1;

          while (
            (await Freelancer.findOne({ userName })) ||
            (await Client.findOne({ userName }))
          ) {
            userName = `${baseUserName}_${suffix++}`;
          }

          const newUser = new Model({
            userName,
            email,
            googleId: profile.id,
            userId: generateUserId(),
            role,
          });

          user = await newUser.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (userData, done) => {
  const { id, role } = userData;
  try {
    const Model = role === "freelancer" ? Freelancer : Client;
    const user = await Model.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
