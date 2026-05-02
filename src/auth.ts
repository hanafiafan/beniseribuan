import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as any;
        
        if (!email || !password) return null;

        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, email)
        });

        if (!dbUser || !dbUser.password) return null;

        const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);

        if (!isPasswordCorrect) return null;

        return {
          id: dbUser.id.toString(),
          email: dbUser.email,
          name: dbUser.displayName,
          role: dbUser.role,
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback Start:", { provider: account?.provider, email: user.email })
      
      if (account?.provider === "google" && user.email) {
        try {
          // Check if user exists using a more standard query
          const existingUsers = await db.select().from(users).where(eq(users.email, user.email)).limit(1)
          const existingUser = existingUsers[0]
          
          console.log("Existing user found:", !!existingUser)

          if (!existingUser) {
            console.log("Creating new Google user")
            const nameParts = (user.name || "User").split(" ")
            const firstName = nameParts[0] || "User"
            const lastName = nameParts.slice(1).join(" ") || ""

            await db.insert(users).values({
              email: user.email,
              firstName: firstName,
              lastName: lastName,
              displayName: user.name || user.email.split("@")[0],
              avatar: user.image || "",
              provider: "google",
              providerId: user.id || "",
              isActive: true,
            })
            console.log("New Google user created successfully")
          } else {
            console.log("Updating existing user for Google provider")
            await db.update(users)
              .set({ 
                provider: "google",
                providerId: user.id || "",
                avatar: user.image || existingUser.avatar
              })
              .where(eq(users.id, existingUser.id))
            console.log("User updated successfully")
          }
          return true
        } catch (error) {
          console.error("CRITICAL ERROR during Google Sign In:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      // Fetch latest user data from DB to ensure role is up to date
      const userEmail = token.email || user?.email
      if (userEmail) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, userEmail)
        })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
        }
      }
      return token
    },
  },
})
