import Navbar from "./Navbar";
import Profile from "./Profile";

export default function Hero() {
  return (
    
    <div className="bg-[#0E0E0E] overflow-hidden h-screen">
      
    
      <div className="flex items-center justify-center">
        <div
         
          className="w-[1200px] h-[1200px] blur-[80px] rounded-full -mt-[30%] opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, #DCC0F9 21%, #894FC3 48%, #0E0E0E 100%)',
          }}
        />
      </div>

      {/* 2. Navbar and Main Content (The Foreground Element) */}
      {/* The key is the large negative margin-top to pull the Navbar/content container up 
         so it sits over the blurred circle element, effectively overlapping it. */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 text-white -mt-30"> 
        
        <Profile/>
        
        {/* Other Hero content goes here */}
        
      </div>
      
    </div>
  );
}