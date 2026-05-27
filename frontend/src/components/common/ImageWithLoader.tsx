import { useState } from "react";

type ImageWithLoaderProps = {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain";
};

function ImageWithLoader({
  src,
  alt,
  className = "",
  objectFit = "cover",
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full ${objectFit === "contain" ? "object-contain" : "object-cover"} rounded-lg transition-opacity duration-300 ease-in-out${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default ImageWithLoader;
