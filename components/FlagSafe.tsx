// components/FlagSafe.tsx
import Flag from "./Flag";

type FlagProps = {
  countryCode: string;
  [key: string]: any; // Para aceptar el resto de props
};

export function FlagSafe({ countryCode, ...props }: FlagProps) {
  if (!countryCode || countryCode.length !== 2) {
    return <span className="inline-block w-6 h-4 bg-gray-300 rounded-sm" />;
  }

  return <Flag countryCode={countryCode} {...props} />;
}