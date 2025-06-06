"use client";
import React, { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { ComparisonProvider, useComparison } from "@/context/ComparisonContext";
import CompareModal from "@/components/CompareModal";
import Navbar from "../Navbar";

const LIMIT = 20;

const PokemonGrid = ({
  pokemonList,
  isLoading,
  loaderRef,
  searchQuery,
  hasSearched,
}) => {
  const { togglePokemon, selected } = useComparison();

  const filteredList = searchQuery
    ? pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pokemonList;

  return (
    <div className="grid w-full h-full p-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {filteredList.length > 0
        ? filteredList.map((pokemon, index) => (
            <div
              key={index}
              className="group bg-white hover:bg-blue-300 text-red-600 hover:text-white transition-all rounded-xl shadow-lg p-4 text-center cursor-pointer h-64 relative"
            >
              {/* Comparison Checkbox */}
              <input
                type="checkbox"
                checked={selected.some((p) => p.name === pokemon.name)}
                onChange={() => togglePokemon(pokemon)}
                className="absolute top-2 right-2 w-5 h-5 cursor-pointer z-10"
              />

              <div className="w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                {/* Front Side */}
                <div className="absolute w-full h-full flex flex-col items-center backface-hidden">
                  <img
                    src={
                      pokemon.sprites?.front_default ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                    }
                    alt={pokemon.name}
                    className="w-24 h-24 object-contain"
                  />
                  <p className="mt-3 capitalize font-semibold text-lg">
                    {pokemon.name}
                  </p>
                  <div className="mt-2 text-sm text-black font-medium group-hover:text-white">
                    Types:{" "}
                    {pokemon.types
                      .map((t) => t.type.name)
                      .join(", ")
                      .toUpperCase()}
                  </div>
                  <div className="text-sm text-black font-medium group-hover:text-white">
                    Abilities:{" "}
                    {pokemon.abilities
                      .map((a) => a.ability.name)
                      .join(", ")
                      .toUpperCase()}
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full bg-blue-300 flex items-center justify-center rotate-y-180 backface-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      outerRadius={80}
                      data={pokemon.stats.map((stat) => ({
                        stat: stat.stat.name,
                        value: stat.base_stat,
                      }))}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="stat" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar
                        name="Stats"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
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
  );
};

const HomeContent = () => {
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
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );

      setPokemonList((prev) => [...prev, ...detailedData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [offset]);

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
    <div className="w-full h-full p-10 bg-black min-h-screen text-white">
      <Navbar />
      <CompareModal />
      <div className="mb-5 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setHasSearched(true);
          }}
          className="p-2 rounded-md bg-white text-black"
          placeholder="Search Pokémon"
        />
      </div>
      <PokemonGrid
        pokemonList={pokemonList}
        isLoading={isLoading}
        loaderRef={loaderRef}
        searchQuery={searchQuery}
        hasSearched={hasSearched}
      />
    </div>
  );
};

const Home = () => (
  <ComparisonProvider>
    <HomeContent />
  </ComparisonProvider>
);

export default Home;
