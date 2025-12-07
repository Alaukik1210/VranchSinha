"use client";
import Image from "next/image";

export default function Production() {
  const items = [
    {
      id: 1,
      img: "/gdg.svg",
      title: "GOOGLE DEVELOPER GROUP BU",
      subtitle: "(UI/UX LEAD)",
      desc:
        "Joined as part of the junior team and helped organise 5 events in the first year, later became the UI/UX Lead and guided the team in organising 7 events in the second year.",
      gradient: "from-[#FBBC04]/25 to-transparent",
      stylee:"text-[#FBBC04]"
    },
    {
      id: 2,
      img: "/lex.svg",
      title: "LEXHACK",
      subtitle: "(DESIGN HEAD)",
      desc:
        "Created all design assets for a hackathon organised for law and engineering students, including the brand kit, posters, brachure, etc.",
        gradient: "from-[#F2B0F0]/25 to-transparent",
        stylee:"text-[#F2B0F0]"
    },
    {
      id: 3,
      img: "/sfcmun.svg",
      title: "SFCMUN",
      subtitle: "(EDITOR IN CHIEF)",
      desc:
        "Created magazines, posts as well as all the stationary required for as MUN",
      gradient: "from-[#06ACE1]/25 to-transparent",
      stylee:"text-[#06ACE1] pt-12"
    },
  ];

  return (
    <div className="h-auto md:h-screen text-white flex flex-col z-10 items-center">
      <div className="pt-8 text-xl mt-12 tracking-wider">PRODUCTION</div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full px-6 place-items-center">
        {items.map((item) => (
          <div
            key={item.id}
           className="group relative w-[450px] h-[500px] p-10 rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center"
            // style={{
            //   backgroundColor: "rgba(255, 255, 255, 0.1)",
            //   backdropFilter: "blur(12px)",
            //   WebkitBackdropFilter: "blur(12px)",
            // }}
            
          >
            {/* VERY BLURRY BOTTOM GRADIENT */}
            <div
              className={`
                absolute bottom-0 left-1/2 -translate-x-1/2
                w-[500px] h-[420px]
                rounded-t-full
                bg-gradient-to-t ${item.gradient}
                opacity-0 group-hover:opacity-100
                blur-3xl
                transition-all duration-700
              `}
            ></div>

            {/* LOGO - perfectly centered */}
            <div className="relative z-10 mt-16 transition-all duration-500 group-hover:-translate-y-6">
              <Image
                src={item.img}
                alt={`icon-${item.id}`}
                width={300}
                height={300}
                className="object-contain mt-12"
              />
            </div>

            {/* TEXT - hidden until hover */}
            <div className="relative z-10 mt-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:-translate-y-2">
              <p className="font-semibold text-lg">{item.title}</p>
              <p className={` ${item.stylee}`}>{item.subtitle}</p>
              <p className="text-sm mt-3 px-4 text-gray-200">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
