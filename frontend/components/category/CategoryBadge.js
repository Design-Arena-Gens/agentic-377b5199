export default function CategoryBadge({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-secondary hover:border-primary hover:text-primary'}`}
    >
      {label}
    </button>
  );
}
