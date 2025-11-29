import Image from "next/image";

export default function Navbar() {
  const navItems = ["Home", "About", "Work", "Contact"];

  return (
    <nav className="z-50 overflow-x-hidden">
      <div className="flex items-center justify-between ">
        <div className="text-2xl font-extrabold text-white tracking-wider cursor-pointer">
          <Image src="/logo.svg" alt="Logo" width={50} height={100}></Image>
        </div>

        <div className="flex space-x-2">
          {navItems.map((item) => (
            <button
              key={item}
              className="px-6 py-3 text-white font-medium text-sm rounded-full transition-all duration-300 transform hover:scale-105"
style={{
  background: "rgba(255, 255, 255, 0.04)",     // very transparent
  backdropFilter: "blur(12px) saturate(160%)",
  WebkitBackdropFilter: "blur(12px) saturate(160%)",

  borderRadius: "999px",

  // soft thin white stroke
  border: "1px solid rgba(255, 255, 255, 0.18)",

  // subtle inner refraction — no strong white, no shadows
  boxShadow: `
    inset 0px 1px 3px rgba(255, 255, 255, 0.10),
    inset 0px -2px 6px rgba(0, 0, 0, 0.18)
  `,
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
