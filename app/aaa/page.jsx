// "use client";

// import Image from "next/image";
// import React from "react";
// // Removed unused imports: motion, useScroll, useTransform

// // Helper component for the Production blocks (remains visually unchanged)
// const ProductionContent = () => {
//     const items = [
//         {
//       id: 1,
//       img: "/gdg.svg",
//       title: "GOOGLE DEVELOPER GROUP BU",
//       subtitle: "(UI/UX LEAD)",
//       desc:
//         "Joined as part of the junior team and helped organise 5 events in the first year, later became the UI/UX Lead and guided the team in organising 7 events in the second year.",
//       gradient: "from-[#FBBC04]/25 to-transparent",
//       stylee:"text-[#FBBC04]"
//     },
//     {
//       id: 2,
//       img: "/lex.svg",
//       title: "LEXHACK",
//       subtitle: "(DESIGN HEAD)",
//       desc:
//         "Created all design assets for a hackathon organised for law and engineering students, including the brand kit, posters, brachure, etc.",
//         gradient: "from-[#F2B0F0]/25 to-transparent",
//         stylee:"text-[#F2B0F0]"
//     },
//     {
//       id: 3,
//       img: "/sfcmun.svg",
//       title: "SFCMUN",
//       subtitle: "(EDITOR IN CHIEF)",
//       desc:
//         "Created magazines, posts as well as all the stationary required for as MUN",
//       gradient: "from-[#06ACE1]/25 to-transparent",
//       stylee:"text-[#06ACE1] pt-12"
//     },
//   ];

//     return (
//         <div className="h-auto md:h-screen text-white flex flex-col items-center py-20 z-20">
//             <div className="pt-8 text-xl mt-12 tracking-wider uppercase font-semibold text-center">
//                 Production
//             </div>

//             <div className="mt-16 z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl px-6 place-items-center">
//                 {items.map((item) => (
//                     <div
//                         key={item.id}
//                         className="
//                             group relative w-full max-w-[450px] h-[500px] p-10 
//                             rounded-xl shadow-2xl border border-white/20 
//                             overflow-hidden flex flex-col items-center justify-center
//                         "
//                         style={{
//                             backgroundColor: "rgba(255,255,255,0.1)",
//                             backdropFilter: "blur(12px)",
//                             WebkitBackdropFilter: "blur(12px)"
//                         }}
//                     >
//                         {/* Glowing gradient background */}
//                         <div
//                             className={`
//                                 absolute bottom-0 left-1/2 -translate-x-1/2 
//                                 w-[500px] h-[420px] rounded-t-full 
//                                 bg-gradient-to-t ${item.gradient}
//                                 opacity-0 group-hover:opacity-100 blur-3xl 
//                                 transition-all duration-700
//                             `}
//                         ></div>

//                         <div className="relative z-10 mt-16 transition-all duration-500 group-hover:-translate-y-6">
//                             <img
//                                 src={item.img}
//                                 alt={item.imgAlt}
//                                 width={300}
//                                 height={300}
//                                 className="object-contain mt-12"
//                             />
//                         </div>

//                         <div className="relative z-10 mt-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-2">
//                             <p className="font-semibold text-lg">{item.title}</p>
//                             <p className={item.stylee}>{item.subtitle}</p>
//                             <p className="text-sm mt-3 px-4 text-gray-200">
//                                 {item.desc}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// // Component for the receiving folder/slot and the footer
// const FolderContactSection = () => {
//     return (
//        <div>
       
               
//        <div className="bg-white h-[100vh] rounded-t-[75px] mx-12 pt-32 z-0">
//            <div className="bg-purple-900 h-[89vh] rounded-t-[75px] z-50 w-full ">
//                <div className="flex pt-32 w-full" >
//                <div>
//                    <Image src="/logo.svg" alt="logo" width={80} height={80} className="mx-12"/>
//                </div>
//                <div className="flex justify-between gap-[700px]">
       
//                <div className="  items-end text-purple-300 ">
//                     <span className="text-7xl font-funnel">
//                        Vranch Sinha
//                        </span> 
//                    <div className="text-2xl pl-4">
//                        PORTFOLIO VOL. 1
//                    </div>
//                </div>
//                <div className="flex gap-12">
//                    <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
//                    <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
//                    <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
//                    <div className="h-15 w-15 bg-purple-300 rounded-xl"></div>
//                </div>
//                </div>
//                </div>
//            </div>
//        </div>
//        </div>
//     );
// };

// // Main component implementing the new sticky overlay behavior
// const PortfolioScrollAnimation = () => {
//     return (
//         <div className="min-h-screen font-inter">
            
//             {/* 1. STICKY BLOCKS: The content is pinned to the top (z-20) */}
//             <div className="sticky top-0 h-screen z-20 overflow-hidden">
//                 <ProductionContent />
//             </div>

//             {/* 2. SCROLL SPACER: Creates the scroll distance. This div is transparent. */}
//             <div className="h-[100vh]"></div>

//             {/* 3. FOLDER SECTION: Pulled up by 100vh (-mt-[100vh]) to start exactly where the spacer ends.
//                  As you scroll through the spacer, this section scrolls up over the sticky blocks.
//             */}
//             <div className="relative z-30 -mt-[100vh]">
//                 <FolderContactSection />
//             </div>
             
//         </div>
//     );
// };

// export default PortfolioScrollAnimation;