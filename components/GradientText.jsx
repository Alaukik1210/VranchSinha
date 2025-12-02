export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 3,
  showBorder = false
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        className={`relative mx-auto flex max-w-fit items-center justify-center rounded-[1.25rem] overflow-hidden cursor-pointer ${className}`}
      >
        {/* TEXT */}
        <div
          className="inline-block relative z-[2] text-transparent"
          style={{
            ...gradientStyle,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            backgroundSize: "300% 100%",
            animation: `gradientShift ${animationSpeed}s linear infinite`
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
