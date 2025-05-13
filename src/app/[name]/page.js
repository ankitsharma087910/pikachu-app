"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const formatStatName = (name) => {
  switch (name) {
    case "special-attack":
      return "Sp. Atk";
    case "special-defense":
      return "Sp. Def";
    case "attack":
      return "Atk";
    case "defense":
      return "Def";
    case "speed":
      return "Speed";
    case "hp":
      return "HP";
    default:
      return name;
  }
};

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error("Pokémon not found");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        setError("Unable to fetch Pokémon details.");
      }
      setIsLoading(false);
    };

    fetchPokemon();
  }, [name]);

  if (error) return <div className="p-10 text-red-400">{error}</div>;
  if (isLoading || !pokemon) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-black text-white p-10">
      <Link href="/" className="text-blue-300 underline mb-5 block">
        ← Back to Home
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3 text-center">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-40 h-40 object-contain mb-4"
          />
          <h1 className="text-3xl capitalize font-bold mb-2">{pokemon.name}</h1>
          <p><strong>Height:</strong> {pokemon.height} dm</p>
          <p><strong>Weight:</strong> {pokemon.weight} hectograms</p>
          <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
          <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="font-semibold text-xl mb-3">Base Stats</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={pokemon.stats.map(stat => ({
                stat: formatStatName(stat.stat.name),
                value: stat.base_stat
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Stats"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href={`/`} className="text-blue-400 hover:underline text-lg">
          Go Back to All Pokémon
        </Link>
      </div>
    </div>
  );
};

export default PokemonDetail;
