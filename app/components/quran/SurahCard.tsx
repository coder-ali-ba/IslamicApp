import Link from "next/link";

type SurahCardProps = {
  id: number;
  name: string;
  arabicName: string;
  verses: number;
  revelation: string;
};

export default function SurahCard({
  id,
  name,
  arabicName,
  verses,
  revelation,
}: SurahCardProps) {
  return (
    <Link
      href={`/quran/${id}`}
      className="group rounded-2xl border border-stone-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        {/* Surah Number */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
          {id}
        </div>

        {/* Arabic Name */}
        <p
          dir="rtl"
          className="font-serif text-2xl text-stone-800"
        >
          {arabicName}
        </p>
      </div>

      {/* Names */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-stone-700">
          {name}
        </h3>

        <p className="mt-2 text-sm capitalize text-stone-400">
          {revelation} • {verses} Verses
        </p>
      </div>
    </Link>
  );
}