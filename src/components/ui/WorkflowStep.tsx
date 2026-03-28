type WorkflowStepProps = {
  step: number;
  title: string;
  description: string;
  className?: string;
};

export function WorkflowStep({
  step,
  title,
  description,
  className = "",
}: WorkflowStepProps) {
  return (
    <div
      className={`flex flex-col items-center text-center sm:min-w-[160px] md:min-w-[180px] ${className}`}
    >
      <div className="card w-full flex-1">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600"
          aria-hidden
        >
          {step}
        </span>
        <h3 className="mt-4 text-sm font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
