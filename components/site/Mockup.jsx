import Image from "next/image";

/**
 * A site on a Mac, on black, lit from behind in the project's colour, with an italic
 * title above. Three devices: a MacBook, a display on a stand and an iPhone. The screen takes the
 * screenshot's own proportions, so nothing is cropped, and every part of the device is
 * sized from its width, so the bezels and corners line up at any size.
 */
export default function Mockup({ src, w, h, title, tone, wide = false, kind = "laptop" }) {
  return (
    <span className={`mock is-${kind} ${wide ? "is-wide" : ""}`} style={{ "--tone": tone }}>
      <span className="mock-title">{title}</span>
      <span className={`mock-device is-${kind}`}>
        <span className="mock-lid">
          <span className="mock-screen">
            <Image src={src} alt={title} width={w} height={h} sizes="(max-width: 760px) 90vw, 600px" />
          </span>
          {kind === "laptop" ? <span className="mock-notch" /> : null}
        </span>
        {kind === "laptop" ? <span className="mock-deck" /> : null}
        {kind === "display" ? (
          <>
            <span className="mock-neck" />
            <span className="mock-foot" />
          </>
        ) : null}
      </span>
    </span>
  );
}
