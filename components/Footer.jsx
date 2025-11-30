"use client"

import { div } from "framer-motion/client"
import Image from "next/image"

export default function Footer() {
    return (
       <div>
       
               
       <div className="">
           <div className=" h-[100vh] rounded-t-[75px]  w-full bg-gradient-to-b from-purple-900 via-purple-950 to-black"
          
>
           
            
               <div className="flex  pt-32 w-full" >
               <div>
                   <Image src="/logo.svg" alt="logo" width={80} height={80} className="mx-12"/>
               </div>
               <div className="flex justify-between gap-[700px]">
       
               <div className="  items-end text-purple-300 ">
                    <span className="text-7xl font-funnel">
                       Vranch Sinha
                       </span> 
                   <div className="text-2xl pl-4">
                       PORTFOLIO VOL. 1
                   </div>
               </div>
               <div className="flex gap-12">
                   <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
                   <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
                   <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
                   <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
               </div>
               </div>
               </div>
           </div>
       </div>
       </div>
    );
};
