import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Origen — La Habana",
    short_name: "The Origen",
    description:
      "Cocina cubana de autor en Vedado, La Habana. Menú, historia y reservas por WhatsApp.",
    start_url: "/es",
    display: "standalone",
    background_color: "#14100D",
    theme_color: "#14100D",
    lang: "es",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
