'use client'

import { useRouter } from "next/navigation"
import { useState } from "react";

export default function UserForm() {

   const router = useRouter();
   const [formdata, setFormData] = useState({
      name:"",
      email:"",
      password:""
   });
   const [errorMsg, setErrorMsg] = useState("");

   const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMsg("");
      const res = await fetch("http://localhost:3000/api/Users", {
         method: "POST",
         body: JSON.stringify({formdata}),
         headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
         const response = await res.json();
         setErrorMsg(response.message);
      } else {
         // router.refresh();
         // router.push("/");
      }
   }

   return (
      <>
      <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-3 w-1/2">
         <h1>Create New Users</h1>
         <label>Full Name</label>
         <input type="text" required onChange={handleChange} placeholder="Enter Name" name="name" value={formdata.name} className="m-2 bg-slate-400 rounded"/>

         <label>Email</label>
         <input type="email" required onChange={handleChange} placeholder="Enter Email" name="email" value={formdata.email} className="m-2 bg-slate-400 rounded"/>

         <label>Password</label>
         <input type="password" required onChange={handleChange} name="password" value={formdata.password} className="m-2 bg-slate-400 rounded"/>

         <input type="submit" value="Create user" className="bg-blue-300 hover:bg-blue-200"/>
      </form>
      <p className="text-red-500">{errorMsg}</p>
      </>
   )
}
