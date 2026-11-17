import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";

const user = encodeURIComponent(process.env.DB_USER as string);
const pass = encodeURIComponent(process.env.DB_PASS as string);

const uri = `mongodb://${user}:${pass}@ac-p9w7mcs-shard-00-00.v3ivgdl.mongodb.net:27017,ac-p9w7mcs-shard-00-01.v3ivgdl.mongodb.net:27017,ac-p9w7mcs-shard-00-02.v3ivgdl.mongodb.net:27017/?ssl=true&replicaSet=atlas-sptajs-shard-0&authSource=admin&retryWrites=true&w=majority`;


const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
const client = globalForMongo._mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

const db = client.db("Reparo");

// Roles a visitor may pick on the public sign-up form.
// Admin is NOT in this list — see the hook below.
const PUBLIC_ROLES = ["customer", "technician"];

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        // allows the field to be sent during sign-up, but ONLY after the
        // server-side check in the hook below has cleaned it up
        input: true,
      },
    },
  },
  hooks: {
    // runs on the server before every auth request is processed.
    // we never trust the role value coming from the browser.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const requestedRole =
        typeof ctx.body?.role === "string" ? ctx.body.role : undefined;

      // never allow self-assigning admin rights from the public form
      if (requestedRole === "admin") {
        throw new APIError("FORBIDDEN", {
          message:
            "Admin accounts cannot be created through public sign-up. Please contact support.",
        });
      }

      // only whitelisted roles are accepted; anything unknown falls back to customer
      if (requestedRole && !PUBLIC_ROLES.includes(requestedRole)) {
        return { context: { body: { ...ctx.body, role: "customer" } } };
      }
    }),
  },
});
