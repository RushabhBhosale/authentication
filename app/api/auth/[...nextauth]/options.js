import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/app/(models)/User';
import bcrypt from "bcrypt"

export const options = {
   providers: [
      GithubProvider({
         profile(profile) {
            console.log("Github Profile: ", profile);

            let userRole = "Github User";

            if (profile?.email == "bhosalerushabh0@gmail.com") {
               userRole = "admin"
            }

            return {
               ...profile,
               role: userRole,
            };
         },
         clientId: process.env.GITHUB_ID,
         clientSecret: process.env.GITHUB_SECRET,
      }),

      GoogleProvider({
         profile(profile) {
            console.log("Google Profile: ", profile);
            let userRole = "Google User";
 
            if (profile?.email == "bhosalerushabh0@gmail.com" || "rushabhbhosale25757@gmail.com") {
               userRole = "admin"
            }

            return {
               ...profile,
               id: profile.sub,
               role: userRole,
            };
         },
         clientId: process.env.GOOGLE_ID,
         clientSecret: process.env.GOOGLE_SECRET,
      }),

      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: {
               label: "Email: ",
               type: "email",
               placeholder: "example@gmail.com",
            },
            password: {
               label: "Password: ",
               type: "password",
            },
         },
         async authorize(credentials) {
            try {
               const foundUser = await User.findOne({email: credentials.email}).lean().exec();

               if(foundUser) {
                  console.log("User Exists");
                  const match  = await bcrypt.compare(credentials.password, foundUser.password);

                  if (match) {
                     console.log("Good password");
                     delete foundUser.password

                     foundUser["role"]  = "User";
                     return foundUser;
                  }
               }

            } catch (error) {
               console.log(error);
            }
            return null
         }
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user) token.role = user.role;
         return token
      },
      async session({ session, token }) {
         if (session?.user) session.user.role = token.role;
         return session;
      },
   }
}