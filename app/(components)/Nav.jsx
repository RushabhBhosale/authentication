import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { options } from '../api/auth/[...nextauth]/options'

export default async function Navbar() {

   const session = await getServerSession(options)

   return (
      <header className="bg-gray-700 text-white">
         <nav className="flex items-center justify-between w-full px-10 py-4">
            <div>My Site</div>
            <div className="flex gap-10">
               <Link href='/'>Home</Link>
               <Link href='/createuser'>Create User</Link>
               <Link href='/clientmember'>Client Member</Link>
               <Link href='/member'>Member</Link>
               <Link href='/public'>Public</Link>
               {session ? (
                  <Link href='/api/auth/signout?callbackUrl=/'>Logout</Link>
               ) : (
                  <Link href='/api/auth/signin'>Login</Link>
               )}
            </div>
         </nav>
      </header>
   )
}
