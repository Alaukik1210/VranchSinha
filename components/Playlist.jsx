"use client";
import Image from "next/image";

export default function Playlist() {
  const playlists = [
    { id: 1, name: "ROGUE SAINTS", img: "/rougesaints.svg" },
    { id: 2, name: "MAXPAID", img: "/maxpaid.svg" },
    { id: 3, name: "THE BIG BOOK BOX", img: "/tbbb.svg" },
    { id: 4, name: "NEERSENSE", img: "/neersence.svg" },
  ];

  return (
    <div className="h-auto md:h-screen text-white flex flex-col items-center">
      <div className="pt-8 text-xl mt-12 tracking-wider pb-20">PLAY-LISTS</div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-6">
        {playlists.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            
            {/* Card Wrapper (Hover group) */}
            <div className="relative w-4/5 aspect-square rounded-2xl overflow-hidden shadow-lg group">

              {/* Image */}
              <Image
                src={item.img}
                alt={item.name}
                width={500}
                height={500}
                className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-30"
              />

              {/* Play Icon Overlay */}
              <div className="
                absolute inset-0 flex justify-center items-center
                opacity-0 group-hover:opacity-100
                transition-all duration-300
                cursor-pointer
              ">
                <div className="
                  w-16 h-16 bg-white/90 rounded-full flex justify-center items-center
                  shadow-xl
                ">
                  <div className="w-0 h-0 
                    border-t-[12px] border-t-transparent
                    border-b-[12px] border-b-transparent
                    border-l-[20px] border-l-black
                    ml-1
                  ">
                  </div>
                </div>
              </div>

            </div>

            {/* Name */}
            <p className="mt-8 text-sm md:text-xl tracking-wide">{item.name}</p>

          </div>
        ))}
      </div>
    </div>
  );
}
