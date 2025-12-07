import Image from "next/image";

export default function Navbar() {
  const navItems = ["Home", "About", "Work", "Contact"];

  return (
    <nav className="z-50 overflow-x-hidden">
      <div className="flex items-center justify-between ">
        <div className="  text-white tracking-wider cursor-pointer">
          <Image src="/logo.svg" alt="Logo" width={50} height={100}></Image>
        </div>

        <div className="flex space-x-2">
          {navItems.map((item) => (
            <button
              key={item}
            className="px-6 py-3 text-white  font-light text-sm rounded-full transition-all duration-300 transform hover:scale-105 
              
              relative 
    bg-white/5
    backdrop-blur-[0.5px]
    border border-white/10
    
    overflow-hidden
     tracking-wide

   before:content-[''] before:absolute before:inset-0 
  before:rounded-full 
  before:ring-1 before:ring-white/20 
  before:ring-offset-0
  before:mask-[linear-gradient(to_bottom_right,white,transparent)]
              "
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
