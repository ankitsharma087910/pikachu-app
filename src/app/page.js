"use client";
import React, { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

const LIMIT = 20;

const Page = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);
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
        };
      })
    );

    setPokemonList((prev) => [...prev, ...detailedData]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [offset]);

  useEffect(() => {
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
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [isLoading]);

  return (
    <div className="grid w-full h-full p-10 grid-cols-2 md:grid-cols-4 gap-10 text-[#fff] bg-black min-h-screen">
      {pokemonList?.map((pokemon, index) => (
        <div
          key={index}
          className="bg-white hover:bg-blue-300 text-red-600 hover:text-white transition-all rounded-xl shadow-lg p-4 text-center cursor-pointer flex flex-col items-center  duration-300 transform hover:scale-105 hover:shadow-2xl animate-fadeUp"
        >
          <img
            src={pokemon?.image}
            alt={pokemon?.name}
            className="w-24 h-24 object-contain"
          />
          <p className="mt-3  capitalize font-semibold">{pokemon?.name}</p>
        </div>
      ))}

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
    </div>
  );
};

export default Page;
