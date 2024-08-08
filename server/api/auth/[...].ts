import { NuxtAuthHandler } from "#auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET ?? 'test-123',
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
          token.sessionToken = account.session_token
      }
      return token
  },
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      async authorize(credentials: any) {
        const data = await $fetch(`${useRuntimeConfig().public.proxyApiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
        
        if (data) {
          return null
        }

        console.log(data)

        const user = data

        return user
      },
    })
  ]
}
)
// If you don't want to pass the full runtime config,
//  you can pass something like this: { public: { authJs: { baseUrl: "" } } }