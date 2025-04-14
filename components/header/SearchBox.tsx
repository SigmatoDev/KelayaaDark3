"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
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
    let keywordIndex = 0;
    const keywordInterval = setInterval(() => {
      keywordIndex = (keywordIndex + 1) % keywords.length;
      setCurrentKeyword(keywords[keywordIndex]);
    }, 2000);
    return () => clearInterval(keywordInterval);
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
      <button
        onClick={() => setShowSearch(true)}
        className="p-2 text-white"
      >
        <Search className="text-white" />
      </button>

      {showSearch && (
        <div
          className={clsx(
            "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 transition-opacity duration-300",
            {
              "opacity-100": !fadeOut,
              "opacity-0 pointer-events-none": fadeOut,
            }
          )}
        >
          <div
            ref={searchRef}
            className="bg-white border border-black w-full max-w-xl rounded-xl p-6 shadow-lg relative animate-fadeIn"
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
                <ul className="rounded-md border border-gray-300">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => handlePillClick(item)}
                      className="px-4 py-2 text-sm cursor-pointer"
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
                    className="px-3 py-1 rounded-full border border-black text-xs text-black cursor-pointer"
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
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
