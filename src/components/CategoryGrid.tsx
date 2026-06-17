import Link from "next/link";
import { categories } from "@/lib/data";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/explorar?categoria=${cat.id}`}
          className="category-tile group flex flex-col items-center justify-center px-6 py-10 sm:py-12 text-center"
        >
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yaavs-navy/5 to-yaav-500/10 text-4xl sm:text-5xl mb-5 shadow-inner group-hover:scale-110 transition-transform duration-300">
            {cat.icon}
          </span>
          <span className="font-display text-lg sm:text-xl font-bold uppercase tracking-[0.15em] text-neutral-900 group-hover:text-yaavs-navy transition-colors">
            {cat.label}
          </span>
          <span className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xs leading-relaxed">
            {cat.description}
          </span>
        </Link>
      ))}
    </div>
  );
}
