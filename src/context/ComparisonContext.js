// context/ComparisonContext.tsx
"use client";
import { createContext, useContext, useState } from "react";


const ComparisonContext = createContext(null);

export const useComparison = () => {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error("useComparison must be used inside ComparisonProvider");
  return ctx;
};

export const ComparisonProvider = ({ children }) => {
  const [selected, setSelected] = useState([]);

  const togglePokemon = (pokemon) => {
    setSelected((prev) =>
      prev.find((p) => p.name === pokemon.name)
        ? prev.filter((p) => p.name !== pokemon.name)
        : [...prev.slice(0, 2), pokemon]
    );
  };

  const clearSelection = () => setSelected([]);

  return (
    <ComparisonContext.Provider value={{ selected, togglePokemon, clearSelection }}>
      {children}
    </ComparisonContext.Provider>
  );
};
