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
    <section
      id="production"
      className="h-auto md:h-screen text-white flex flex-col z-10 items-center px-6 py-16 md:py-0"
    >
      <div className="pt-8 text-base sm:text-xl mt-12 tracking-wider">
        PRODUCTION
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-6xl place-items-center">
        {items.map((item) => (
          <div
            key={item.id}
            className="liquid-glass [backdrop-filter:blur(7px)_saturate(1.8)_url(#liquid-lens)] [-webkit-backdrop-filter:blur(16px)_saturate(1.6)] group relative w-full max-w-[420px] aspect-[9/10] p-8 md:p-10 rounded-3xl overflow-hidden flex flex-col items-center justify-center"
          >
            {/* VERY BLURRY BOTTOM GRADIENT */}
            <div
              className={`
                absolute bottom-0 left-1/2 -translate-x-1/2
                w-[110%] h-[80%]
                rounded-t-full
                bg-gradient-to-t ${item.gradient}
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                blur-3xl
                transition-all duration-700
              `}
            ></div>

            {/* LOGO - minimalist, perfectly centered */}
            <div className="relative z-10 flex items-center justify-center transition-all duration-500 md:group-hover:-translate-y-5">
              <Image
                src={item.img}
                alt={`icon-${item.id}`}
                width={160}
                height={160}
                sizes="(max-width: 640px) 30vw, 160px"
                className="object-contain w-24 sm:w-28 md:w-32 h-auto"
              />
            </div>

            {/* TEXT - always visible on touch, hover-reveal on desktop */}
            <div className="relative z-10 mt-6 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:group-hover:-translate-y-2">
              <p className="font-semibold text-base md:text-lg">{item.title}</p>
              <p className={`${item.stylee}`}>{item.subtitle}</p>
              <p className="text-sm mt-3 px-2 md:px-4 text-gray-200">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
