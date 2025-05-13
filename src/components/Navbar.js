import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4">
      <div className="flex justify-between">
        <div className="font-bold text-xl">
          <Link href="/" className="text-white hover:text-yellow-400">
            Pokémon Home
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-yellow-400">
            Home
          </Link>
          <Link href="/evolution" className="text-white hover:text-yellow-400">
            Evolution Chain
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
