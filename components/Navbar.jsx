// export default function Navbar(){
//     return(

import Image from "next/image";

//     <div >

//       <div
//         className="relative z-10 p-8 w-full max-w-sm rounded-xl shadow-2xl border border-white/20"
//         style={{
//           // Tailwind equivalent: 'bg-white/10 backdrop-blur-md'
//           backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
//           backdropFilter: 'blur(10px)', // The crucial CSS property for the glass effect
//         }}
//       >
//         <h2 className="text-2xl font-bold text-white mb-4">Glassmorphism Card</h2>
//         <p className="text-white/80">
//           This container uses `backdrop-filter: blur()` to create the popular frosted glass effect, making the background visible but blurred.
//         </p>
//         <button className="mt-6 px-4 py-2 bg-white/30 text-white rounded-lg hover:bg-white/50 transition duration-300">
//           Get Started
//         </button>
//       </div>

//     </div>
//   );
// }

export default function Navbar() {
  const navItems = ["Home", "About", "Work", "Contact"];

  return (
    <nav className="w-full">
      <div className="flex items-center justify-between ">
        <div className="text-2xl font-extrabold text-white tracking-wider cursor-pointer">
          <Image src="/logo.svg" alt="Logo" width={50} height={100}>

          </Image>
        </div>

        <div className="flex space-x-2">
          {navItems.map((item) => (
            <button
              key={item}
              className="px-6 py-3 text-white font-medium text-sm rounded-full transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(50, 50, 50, 0.85)',
                boxShadow:
                  // Inner highlight on top-left (negative x,y)
                  'inset -1px -1px 0px rgba(255,255,255,0.6), ' +
                  // Inner shadow on bottom-right (positive x,y)
                  'inset 2px 2px 6px rgba(0,0,0,0.25), ' +
                  // Outer soft shadow on top-left (negative x,y)
                  '-6px -6px 20px rgba(0,0,0,0.35), ' +
                  // Outer soft shadow on bottom-right (positive x,y)
                  '6px 6px 20px rgba(0,0,0,0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
