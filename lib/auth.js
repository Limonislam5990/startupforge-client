import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB || "startupforge");

const allowedSignupRoles = ["founder", "collaborator"];

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "collaborator",
        input: true, // register form sends the role
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // users can never set this themselves
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Stops anyone from registering as "admin" by editing the request
        before: async (user) => ({
          data: {
            ...user,
            role: allowedSignupRoles.includes(user.role) ? user.role : "collaborator",
          },
        }),
      },
    },
  },
});