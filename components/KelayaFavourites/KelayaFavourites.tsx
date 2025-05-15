"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FavouriteItem {
  videoSrc: string;
  poster: string;
  title?: string;
  link: string;
  start?: number; // in seconds
  end?: number;   // in seconds
}

const favourites: FavouriteItem[] = [
  {
    videoSrc: "https://kelayaavideos.s3.ap-south-1.amazonaws.com/fav1b.mp4",
    poster: "/favourites/fav1.jpg",
    start: 5,
    end: 10,
    link: "/search?materialType=beads"
  },
  {
    videoSrc: "https://kelayaavideos.s3.ap-south-1.amazonaws.com/fav2a.mp4",
    poster: "/favourites/fav2.jpg",
    link: "/search?materialType=gold"
  },
  {
    videoSrc: "https://kelayaavideos.s3.ap-south-1.amazonaws.com/fav4a.mp4",
    poster: "/favourites/fav3.jpg",
    link: "/search?materialType=silver&productCategory=Earrings"
  },
  {
    videoSrc: "https://kelayaavideos.s3.ap-south-1.amazonaws.com/fav5a.mp4",
    poster: "/favourites/fav4.jpg",
    link: "/search?materialType=gold&productCategory=Earrings"
  },
  {
    videoSrc: "https://kelayaavideos.s3.ap-south-1.amazonaws.com/fav9.mp4",
    poster: "/favourites/fav4.jpg",
    link: "/search?materialType=silver&productCategory=Sets"
  },
];

export default function KelayaFavourites() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-14">
     <h2 className="text-[22px] md:text-[36px] text-center font-normal  uppercase text-[#474747]">
        Kelayaa
        <span className="bg-gradient-to-r from-[#f76999] to-[#fb8d92] bg-clip-text text-transparent ml-2">
        Favourites
        </span>
      </h2>
      <p className="text-center mb-8 text-gray-400 font-light text-sm">Stories in Motion. Favourites Forever.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
      {favourites.map((item, index) => (
    <Link
    key={index}
    href={item.link}
    className="relative mx-auto w-full max-w-[320px] sm:max-w-none 
    aspect-[9/16] sm:aspect-auto 
    h-auto sm:h-[250px] md:h-[320px] lg:h-[380px] xl:h-[400px] 
    overflow-hidden rounded-2xl shadow-lg"
        >
<div className="absolute inset-0 bg-[#EC4999]/5" />
      <video
  ref={(ref) => {
    if (ref && item.start !== undefined && item.end !== undefined) {
      ref.currentTime = item.start;

      const handleTimeUpdate = () => {
        if (ref.currentTime >= item.end!) {
          ref.currentTime = item.start!;
        }
      };

      ref.addEventListener("timeupdate", handleTimeUpdate);

      // Cleanup on unmount
      return () => {
        ref.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }}
  src={item.videoSrc}
  poster={item.poster}
  autoPlay
  muted
  loop={true} // we control looping manually
  playsInline
  className="absolute inset-0 w-full h-full"
  style={{ objectFit: "cover", transform: "scale(1)" }}
/>

</Link>




  ))}
</div>

      <div className="flex justify-end items-center mt-6 md:mt-8 px-0 md:px-4">
      <Link
        href="https://www.instagram.com/kelayaajewellery/"
        className="group inline-flex items-center gap-2 text-black font-medium text-sm border-b border-transparent hover:border-black transition-all duration-300"
      >
        Visit our Instagram Channel for more stories
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
    </section>
  );
}
