import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-brutal-black text-brutal-white text-center p-6">
      <h1 className="text-[15vw] font-black leading-none text-brutal-accent mix-blend-screen">
        404
      </h1>
      <h2 className="text-2xl font-mono border-b-2 border-brutal-white pb-2 mb-6">
        COORDINATES_NOT_FOUND
      </h2>
      <p className="max-w-md font-mono text-sm mb-12 text-gray-400">
        The requested vector does not exist in this dimension. 
        Please recalibrate your navigation.
      </p>
      
      <Link 
        href="/" 
        className="px-8 py-4 bg-brutal-white text-brutal-black font-bold uppercase hover:bg-brutal-accent transition-colors"
      >
        Return to Base
      </Link>
    </div>
  );
}