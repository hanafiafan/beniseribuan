import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/masuk",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as any)?.role
      const isOnDashboard = nextUrl.pathname.startsWith('/akun')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      
      console.log(`Middleware check: path=${nextUrl.pathname}, loggedIn=${isLoggedIn}, role=${role}`)

      if (isOnAdmin) {
        if (isLoggedIn && role === 'admin') return true
        return false
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          // @ts-ignore
          session.user.id = token.id.toString()
        } else if (token.sub) {
          session.user.id = token.sub
        }
        
        // @ts-ignore
        session.user.role = token.role
      }
      return session
    },
  },
} satisfies NextAuthConfig
