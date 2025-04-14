"use client";

import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, XIcon } from "lucide-react";
import clsx from "clsx";

const keywords = ["Gold", "Diamond", "Silver", "Special", "Ring", "Necklace", "Bracelet"];

export const SearchBox = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const router = useRouter();

  const [formQuery, setFormQuery] = useState(q);
  const [showSearch, setShowSearch] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState(keywords[0]);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % keywords.length;
      setCurrentKeyword(keywords[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleCloseModal();
    router.push(`/search?q=${formQuery}`);
  };

  const handleCloseModal = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowSearch(false);
      setFadeOut(false);
    }, 300);
  };

  const handleChange = (val: string) => {
    setFormQuery(val);
    if (!val.trim()) return setSuggestions([]);
    const filtered = keywords.filter((k) =>
      k.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handlePillClick = (term: string) => {
    setFormQuery(term);
    setSuggestions([]);
    handleSubmit();
  };

  return (
    <>
      <button onClick={() => setShowSearch(true)} className="p-2 text-white">
        <Search />
      </button>

      {showSearch && (
        <div
          className={clsx(
            "fixed left-0 top-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            {
              "opacity-100": !fadeOut,
              "opacity-0 pointer-events-none": fadeOut,
            }
          )}
          style={{ position: "fixed" }}
        >
          <div className="w-full max-w-2xl p-4">
            <div
              ref={searchRef}
              className="bg-white border border-black rounded-2xl p-6 shadow-xl relative animate-fadeZoom"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder={`Search in Kelayaa... ${currentKeyword}`}
                  value={formQuery}
                  onChange={(e) => handleChange(e.target.value)}
                  autoFocus
                  className="w-full border-b border-black text-sm py-2 px-2 placeholder-gray-500 focus:outline-none"
                />

                {suggestions.length > 0 && (
                  <ul className="rounded-md border border-gray-300 max-h-48 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handlePillClick(item)}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 mt-1">
                  {keywords.map((word, i) => (
                    <span
                      key={i}
                      onClick={() => handlePillClick(word)}
                      className="px-3 py-1 rounded-full border border-black text-xs text-black cursor-pointer hover:bg-black hover:text-white transition"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md self-start text-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fadeZoom {
          animation: fadeZoomIn 0.3s ease-out;
        }

        @keyframes fadeZoomIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};
