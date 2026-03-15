type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base text-gray-600 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
