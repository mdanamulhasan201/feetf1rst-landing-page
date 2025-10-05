'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bannerImg from "../../public/banner/rightImg.jpg";
import logo from "../../public/banner/logo.png";
import RegisterEmailModal from "./(site)/_components/RegisterEmail";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/categories");
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative md:flex w-full h-screen text-white bg-black">
        {/* Left side black background */}
        <div className="hidden md:block md:w-1/2 h-full bg-black"></div>

        {/* Right side image */}
        <div className="absolute inset-0 md:relative md:w-1/2 h-full">
          <Image
            src={bannerImg}
            alt="A person holding a shoebox"
            fill
            priority
            quality={100}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        {/* Full width content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col p-8 sm:p-12 md:p-16 lg:p-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={logo}
              alt="FeetFirst Logo"
              width={80}
              height={80}
              className="object-contain w-16 h-16 md:w-24 md:h-24"
            />
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col justify-center gap-10">
            <div className="flex flex-col gap-7">
              <h1 className="text-xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-wider">
                EIN SCAN.
              </h1>
              <div className=" h-2 w-3 bg-white" />
              <h1 className="text-xl sm:text-4xl md:text-4xl lg:text-5xl font-bold ">
                PASSGENAUE EMPFEHLUNGEN.
              </h1>
              <div className="h-2 w-3 bg-white" />
              <h1 className="text-xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-wider">
                PERSÖNLICH ABGESTIMMT.
              </h1>
            </div>

            <p className="text-sm md:text-base ">
              Sie haben bereits einen Scan durchgeführt oder besitzen ein Konto in der FeetF1rst App? Behalten Sie alle Ihre Daten und Empfehlungen jederzeit im Blick!{" "}
              <button 
                className="underline font-bold cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                Jetzt anmelden!
              </button>
            </p>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleStart();
              }}
              className={`bg-white w-fit cursor-pointer text-black font-bold py-3 px-12 rounded-lg text-md hover:bg-gray-200 transition-colors flex items-center justify-center min-h-[48px] ${loading ? 'pointer-events-none' : ''}`}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                "Jetzt starten"
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Register Email Modal */}
      <RegisterEmailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}