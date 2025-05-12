"use client";
import React, { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
const page = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);

  const LIMIT = 20;

  const fetchData = async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
    );
    const data = await res.json();
    console.log(data, "data");
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
      (enteries) => {
        console.log(enteries, "log");
        const first = enteries[0];
        if (first?.isIntersecting && !isLoading) {
          setOffset((prev) => prev + LIMIT);
        }
      },
      {
        threshold: 0.4,
      }
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
    <div className="grid w-full h-full p-10 grid-cols-2  md:grid-cols-4 gap-10 text-[#fff]">
      {pokemonList?.map((pokemon, index) => (
        <div
          key={index}
          className="bg-white rounded shadow p-4 text-center flex flex-col items-center"
        >
          <img src={pokemon?.image} alt={pokemon?.name} className="w-20 h-20" />
          <p className="mt-2 text-red-600 capitalize">{pokemon?.name}</p>
        </div>
      ))}
      <div
        ref={loaderRef}
        className="col-span-full text-center py-10 text-amber-400"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <ClipLoader color="#36d7b7" size={100} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ClipLoader color="#36d7b7" size={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
