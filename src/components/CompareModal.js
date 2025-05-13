// components/CompareModal.tsx
"use client";
import React from "react";
import { useComparison } from "@/context/ComparisonContext";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const formatStat = (name) => {
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

const CompareModal = () => {
  const { selected, clearSelection } = useComparison();

  if (selected.length < 2) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/80 text-white flex flex-col p-6 z-50 overflow-y-auto">
      <button
        onClick={clearSelection}
        className="self-end text-red-400 mb-4 hover:underline"
      >
        ✖ Close
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">
        Pokémon Comparison
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selected.map((pokemon) => (
          <div
            key={pokemon.name}
            className="bg-white text-black rounded-lg p-4 shadow-lg"
          >
            <div className="flex flex-col items-center">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-24 h-24"
              />
              <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
              <p>
                <strong>Types:</strong>{" "}
                {pokemon.types.map((t) => t.type.name).join(", ")}
              </p>
              <p>
                <strong>Abilities:</strong>{" "}
                {pokemon.abilities.map((a) => a.ability.name).join(", ")}
              </p>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  outerRadius={80}
                  data={pokemon.stats.map((stat) => ({
                    stat: formatStat(stat.stat.name),
                    value: stat.base_stat,
                  }))}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="stat" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareModal;
