import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Awdan Vibes",
    short_name: "Awdan",
    description:
      "A premium fitness platform that adapts to your body and lifestyle.",
    start_url: "/",
    display: "standalone",
    background_color: "#2b2a2a",
    theme_color: "#84c663",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
