import Link from 'next/link';

export default function Navbar() {
  const navItems = [
    { name: 'ABOUT', path: '/about' },
    { name: 'EXPERIMENTS', path: '/experiments' },
    { name: 'RESUME', path: '/cv' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 mix-blend-difference text-brutal-white">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold tracking-tighter hover:italic transition-all">
          HIZKIA.WZ
        </Link>
        
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className="text-sm font-bold tracking-widest hover:underline decoration-2 underline-offset-4"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button className="md:hidden text-brutal-white font-bold">
          MENU
        </button>
      </div>
    </nav>
  );
}