// components/Flag.tsx
import ReactCountryFlag from "react-country-flag";

type FlagSize = "xs" | "sm" | "md" | "lg" | "xl";

interface FlagProps {
  countryCode: string;
  size?: FlagSize | number;
  className?: string;
  rounded?: boolean;
  title?: string; // accesibilidad: nombre del país
}

/**
 * Componente de bandera SVG ultra ligero y consistente
 * Usa react-country-flag con optimizaciones
 */
export default function Flag({
  countryCode,
  size = "md",
  className = "",
  rounded = true,
  title,
}: FlagProps) {
  const sizeMap: Record<FlagSize, string> = {
    xs: "w-4 h-3",
    sm: "w-5 h-4",
    md: "w-6 h-4",
    lg: "w-8 h-6",
    xl: "w-12 h-9",
  };

  const finalSize =
    typeof size === "number" ? `w-${size}` : sizeMap[size] || <sizeMap.md></sizeMap.md>

  const roundedClass = rounded ? "rounded-sm" : "";

  return (
    <ReactCountryFlag
      countryCode={countryCode.toUpperCase()}
      svg
      className={`${finalSize} ${roundedClass} inline-block align-middle drop-shadow-sm ${className}`}
      title={title || countryCode.toUpperCase()}
      aria-label={title ? `Bandera de ${title}` : undefined}
      style={{
        width: typeof size === "number" ? size : undefined,
        height: typeof size === "number" ? (size * 0.75) : undefined, // proporción 4:3 estándar
      }}
    />
  );
}