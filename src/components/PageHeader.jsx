import { FiChevronRight } from "react-icons/fi";

export default function PageHeader({ title, description }) {
  return (
    <div className="mb-6 border-b border-white/10 pb-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      {description && (
        <p className="text-white/60 mt-1 text-sm leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
