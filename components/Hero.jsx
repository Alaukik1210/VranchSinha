import Navbar from "./Navbar";
import Profile from "./Profile";

export default function Hero() {
  return (
    <div className="relative bg-[#0E0E0E]  ">
      {/* Background gradient blur */}
      <div className="absolute inset-0 flex items-center justify-center ">
        <div
          className="w-[1200px] h-[1100px] blur-[80px] rounded-full opacity-50 -translate-y-[30%]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #DCC0F9 31%, #894FC3 48%, #0E0E0E 100%)",
          }}
        />
      </div>

      {/* Foreground content */}
      <div className="fixed w-full px-24 py-12 font-outfit">
        <Navbar />
      </div>
      <div className="h-screen flex items-center  justify-evenly md:text-xl lg:text-2xl mx-20">
        <div className="flex items-center w-full ">
          <div className="w-2/5 text-center">
            I craft digital experiences and brand identities,
          </div>
          <div className="w-1/3" >

          </div>
          <div className="w-1/3">I also love listening to music.</div>
        </div>
      </div>

      <div></div>

      <div className=" -mt-40  absolute top-0 md:pr-20 w-full scale-105 z-12">
        <Profile />
      </div>
    </div>
  );
}
