
import Image from "next/image";



export default function Navbar() {
  const navItems = ["Home", "About", "Work", "Contact"];

  return (
    <nav className="z-50 overflow-x-hidden">
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
  background: "rgba(255,255,255,0.06)",      // 10% white like your Figma fill
  backdropFilter: "blur(6px)",              // glass effect
  WebkitBackdropFilter: "blur(0px)",

  borderRadius: "50px",                      // matches Figma corner radius
  border: "1px solid rgba(255,255,255,0.05)",

   

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
