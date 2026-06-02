import Profile from "./Profile";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-[#0E0E0E] min-h-screen overflow-hidden"
    >
      {/* Background gradient blur — scales with viewport */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div
          className="w-[140vw] max-w-[1200px] aspect-[12/11] blur-[60px] sm:blur-[80px] rounded-full opacity-50 -translate-y-[30%]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #DCC0F9 31%, #894FC3 48%, #0E0E0E 100%)",
          }}
        />
      </div>

      {/* 3D lanyard card — hangs from the top, centred.
          The scene is 160vh tall; pull it up so the card hangs into view. */}
      <div className="absolute top-0 z-20 -mt-[510px] w-full scale-110">
        <Profile />
      </div>

      {/* Tagline */}
      <div className="relative z-10 flex min-h-screen items-end md:items-center">
        <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 pb-24 md:pb-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center font-light text-white md:flex-row md:items-center md:justify-between lg:text-lg xl:text-2xl">
            {/* Both lines sit in equal-width halves and hug the centred card,
                so the gap from each line to the card is identical. */}
            <p className="md:w-[37%] md:text-right">
              I craft digital experiences and brand identities,
            </p>
            <p className="md:w-[37%] md:text-left">
              I also love listening to music.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
