import { NextResponse } from "next/server"
import brcypt from "bcrypt"
import User from "@/app/(models)/User";

async function POST(req) {
   try {
      const body = await req.json();
      const userData = body.formData

      if (!userData?.email || !userData?.password) {
         return NextResponse.json({ message: "All the fields are required" }, { status: 400 })
      }

      const duplicate = await User.findOne({ email: userData.email }).lean().exec();

      if (duplicate) {
         return NextResponse.json({ message: "Email already exists"}, { status: 409 })
      }

      const hashPassword = await brcypt.hash(userData.password, 10);
      userData.password = hashPassword;

      await User.create(userData)
      return NextResponse.json({ message: "User Created" }, { status: 201 })

   } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Error", error }, { status: 500 })
   }
}

export {POST as POST}