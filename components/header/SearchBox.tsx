"use client";

import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, XIcon } from "lucide-react";
import clsx from "clsx";
import Image from "next/image"; // add this import at top


type ProductSuggestion = {
  _id: string;
  name: string;
  category: string;
  collectionType: string;
  slug: string;
  productCode: string;
  image: string;
};

const keywordRedirects: { [key: string]: string } = {
  "Wedding Rings": "search?q=all&materialType=all&productCategory=Rings&category=all&price=all&rating=all&sort=newest&page=1",
  "Engagement Necklaces": "search?q=all&productCategory=all&category=Necklace+and+Earrings&price=all&rating=all&sort=newest&page=1&materialType=all&collectionType=all",
  "Bridal Bangles": "search?q=all&productCategory=Bangles&category=all&materialType=gold&price=all&rating=all&sort=newest&page=1",
  "Anniversary Gifts": "search?q=all&productCategory=Sets&category=all&materialType=silver&price=all&rating=all&sort=newest&page=1",
  "Diamond Earrings": "search?q=all&productCategory=Earrings&category=all&materialType=gold&price=all&rating=all&sort=newest&page=1",
  "Gold Bracelets": "search?q=all&productCategory=Bracelets&category=all&materialType=gold&price=all&rating=all&sort=newest&page=1",
  "Silver Pendants": "search?q=all&materialType=silver&productCategory=Pendants&category=all&price=all&rating=all&sort=newest&page=1",
  "Customized Jewelry": "custom-design",
};


export const SearchBox = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const router = useRouter();

  const [formQuery, setFormQuery] = useState(q);
  const [showSearch, setShowSearch] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (formQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search-products?q=${encodeURIComponent(formQuery)}`);
        const data = await res.json();
        setSuggestions(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [formQuery]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    handleCloseModal();
    
    const trimmedQuery = formQuery.trim();
    
    // Check if query matches any keyword exactly
    const matchedCategoryUrl = keywordRedirects[trimmedQuery];
    
    if (matchedCategoryUrl) {
      router.push(matchedCategoryUrl);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };
  

  const handleCloseModal = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowSearch(false);
      setFadeOut(false);
      setFormQuery("");
      setSuggestions([]);
    }, 300);
  };

  const handleProductClick = (productCode: string) => {
    handleCloseModal();
    router.push(`/product/${productCode}`);
  };

  const handlePillClick = (keyword: string) => {
    handleCloseModal();
    
    const matchedCategoryUrl = keywordRedirects[keyword];
    
    if (matchedCategoryUrl) {
      router.push(matchedCategoryUrl);
    } else {
      router.push(`/search?q=${encodeURIComponent(keyword)}&materialType=all&productCategory=all&price=all&rating=all&sort=newest&page=1&collectionType=all`);
    }
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
        >
          <div className="w-full max-w-2xl p-4 min-h-[600px]">
            <div
              ref={searchRef}
              className="bg-white border border-black rounded-2xl p-8 shadow-xl relative animate-fadeZoom min-h-[500px]"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400"
              >
                <XIcon className="w-6 h-6" />
              </button>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                <input
                  type="text"
                  placeholder={`Search your dream jewelry...`}
                  value={formQuery}
                  onChange={(e) => setFormQuery(e.target.value)}
                  autoFocus
                  className="w-full border-b-2 border-black text-lg py-4 px-3 placeholder-gray-500 focus:outline-none"
                />

                {/* Suggestions */}
                {loading && <div className="text-sm text-gray-400 mt-2">Loading...</div>}

                {!loading && formQuery.trim() !== "" && suggestions.length > 0 && (
                  <ul className="border rounded-md max-h-80 overflow-y-auto mt-2 text-sm">
                    {suggestions.map((product) => (
  <li
    key={product._id}
    onClick={() => handleProductClick(product.productCode)}
    className="px-2 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
  >
    {product.image && (
      <div className="w-10 h-10 relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="40px"
          className="rounded-md object-cover"
        />
      </div>
    )}
    <div className="flex flex-col">
      <div className="font-medium text-[12px]">{product.name}</div>
      <div className="text-[10px] text-gray-400">
        {product.category} | {product.collectionType}
      </div>
    </div>
  </li>
))}

                  </ul>
                )}

                {/* Popular Search Pills */}
                {formQuery.trim() === "" && (
                  <>
                  <p className="text-[13px] text-gray-500">Popular Searches</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {Object.keys(keywordRedirects).map((word, i) => (
  <span
    key={i}
    onClick={() => handlePillClick(word)}
    className="px-4 py-1 rounded-full border border-gray-500 text-[10px] text-gray-500 cursor-pointer hover:bg-black hover:text-white transition"
  >
    {word}
  </span>
))}

                  </div>
                  </>
                )}
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
