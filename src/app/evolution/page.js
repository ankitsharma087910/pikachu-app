"use client";

import React, { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
export const dynamic = "force-dynamic";

const getPokemonId = (url) => url.split("/").filter(Boolean).pop();

const EvolutionPage = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const focRef = useRef(null);

  const fetchEvolutionChain = async (name) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) throw new Error("Pokémon not found");

      const data = await res.json();
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      const chain = [];
      let current = evoData.chain;

      while (current) {
        chain.push(current.species);
        current = current.evolves_to[0];
      }

      setEvolutionChain(chain);
    } catch (err) {
      setError(err.message);
      setEvolutionChain([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setPokemonName(searchTerm.trim().toLowerCase());
    }
  };

  useEffect(() => {
    focRef.current?.focus();
  }, []);

  useEffect(() => {
    if (pokemonName) {
      fetchEvolutionChain(pokemonName);
    }
  }, [pokemonName]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Pokémon Evolution Chain</h1>
      <div className="flex gap-2 mb-8">
        <input
          ref={focRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Pokémon name..."
          className="px-4 py-2 rounded-lg text-white bg-gray-800 w-60"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600"
        >
          Search
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="#36d7b7" size={60} />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : evolutionChain.length > 0 ? (
        <div className="flex flex-wrap items-center gap-4">
          {evolutionChain.map((species, index) => (
            <React.Fragment key={species.name}>
              <div className="bg-white text-red-600 hover:bg-blue-300 hover:text-white transition-all rounded-xl shadow-lg p-4 text-center cursor-pointer flex flex-col items-center duration-300 transform hover:scale-105 hover:shadow-2xl animate-fadeUp">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
                    species.url
                  )}.png`}
                  alt={species.name}
                  className="w-24 h-24 object-contain"
                />
                <p className="mt-3 capitalize font-semibold">{species.name}</p>
              </div>
              {index < evolutionChain.length - 1 && (
                <span className="text-3xl text-white">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">
          Search for a Pokémon to see its evolution chain.
        </p>
      )}
    </div>
  );
};

export default EvolutionPage;
