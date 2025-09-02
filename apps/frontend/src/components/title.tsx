export const Title = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => <h1 className={`font-bold text-2xl ${className}`}>{text}</h1>;
