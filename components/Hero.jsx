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
              'radial-gradient(circle at center, #DCC0F9 31%, #894FC3 48%, #0E0E0E 100%)',
          }}
        />
      </div>

      {/* Foreground content */}
      <div className="fixed w-full px-24 py-12">
            <Navbar />
            </div>
    <div className="h-screen flex items-center justify-center text-2xl">
  <div className="flex items-center w-full px-40">
    <div className="mr-auto">I craft digital experiences and brand identities,</div>
    <div className="mr-16">I also love listening to music.</div>
  </div>
</div>

<div>

</div>


        
        <div className=" -mt-40 absolute top-0 pr-20 w-full scale-105 z-12">
          <Profile />
        </div>
      
    </div>
  );
}