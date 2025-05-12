"use client";
import React, { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

const LIMIT = 20;

const Page = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const loaderRef = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
      );
      const data = await res.json();

      const detailedData = await Promise.all(
        data?.results?.map(async ({ name, url }) => {
          const res = await fetch(url);
          const info = await res.json();
          return {
            name: info?.name,
            image: info?.sprites.front_default,
            abilities: info?.abilities.map((a) => a.ability.name),
            types: info?.types.map((t) => t.type.name),
            height: info?.height,
            weight: info?.weight,
          };
        })
      );

      setPokemonList((prev) => [...prev, ...detailedData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setPokemonList([]);

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Not Found");
      const data = await res.json();
      setPokemonList([
        {
          name: data.name,
          image: data.sprites.front_default,
          abilities: data.abilities.map((a) => a.ability.name),
          types: data.types.map((t) => t.type.name),
          height: data.height,
          weight: data.weight,
        },
      ]);
    } catch (error) {
      setPokemonList([]); // ensure it's empty on error
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchData();
    }
  }, [offset, searchQuery]);

  useEffect(() => {
    if (searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isLoading) {
          setOffset((prev) => prev + LIMIT);
        }
      },
      { threshold: 0.4 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [isLoading, searchQuery]);

  return (
    <div className="w-full h-full p-10 bg-black min-h-screen text-[#fff]">
      <div className="mb-5 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) {
              setHasSearched(false);
              setPokemonList([]);
              setOffset(0);
            }
          }}
          className="p-2 rounded-md bg-white text-black"
          placeholder="Search Pokémon"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 rounded-md bg-blue-500 text-white"
        >
          Search
        </button>
      </div>

      <div className="grid w-full h-full p-10 grid-cols-2 md:grid-cols-4 gap-10">
        {pokemonList?.length > 0
          ? pokemonList.map((pokemon, index) => (
              <div
                key={index}
                className="w-full h-60 [perspective:1000px] group relative"
              >
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute w-full h-full rounded-xl bg-white text-red-600 flex flex-col items-center justify-center shadow-lg backface-hidden">
                    <img
                      src={pokemon?.image}
                      alt={pokemon?.name}
                      className="w-24 h-24 object-contain"
                    />
                    <p className="mt-3 capitalize font-semibold">
                      {pokemon?.name}
                    </p>
                  </div>

                  {/* Back */}
                  <div className="absolute w-full h-full rounded-xl bg-gray-800 text-white p-3 flex flex-col justify-center items-center [transform:rotateY(180deg)] backface-hidden">
                    <p className="text-sm md:text-xl font-semibold mb-1">Abilities:</p>
                    <ul className=" text-xs md:text-sm mb-2 text-center">
                      {pokemon?.abilities?.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                    <p className="text-sm md:text-xl">
                      Types: {pokemon.types?.join(", ")}
                    </p>
                    <p className="text-xs md:text-sm mt-1">
                      Height: {pokemon.height}
                    </p>
                    <p className="text-xs md:text-sm">
                      Weight: {pokemon.weight}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : hasSearched &&
            !isLoading && (
              <div className="col-span-full text-center text-red-400 font-bold">
                Sorry, no such Pokémon found.
              </div>
            )}

        {!searchQuery && (
          <div
            ref={loaderRef}
            className="col-span-full text-center py-10 text-amber-400"
          >
            {isLoading && (
              <div className="flex items-center justify-center">
                <ClipLoader color="#36d7b7" size={80} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
