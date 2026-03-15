type PageContainerProps = {
  children: React.ReactNode;
  /** max width: "default" (6xl) or "narrow" (4xl) */
  size?: "default" | "narrow";
  className?: string;
};

export function PageContainer({
  children,
  size = "default",
  className = "",
}: PageContainerProps) {
  const maxWidth = size === "narrow" ? "max-w-4xl" : "max-w-6xl";
  return (
    <div className={`mx-auto ${maxWidth} px-6 py-12 sm:px-8 sm:py-14 ${className}`}>
      {children}
    </div>
  );
}
