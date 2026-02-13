"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const ads = [
    {
      id: 1,
      title: "Advanced Research Tools for Teams",
      description: "Scale your academic throughput with our cloud-integrated lab management system.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjHkUB4-UUpovC8AJ1PNbXk9fsecPlm9rd_CdDH924B-iDM55ELoyYgWLGbLjup1_F7XJzKy72O9mtUmIBrI8VZkXuA5raxkIHsmkkBMa66EIk47pu-TUhmv4xRPgvtlXAYbFS6pKz1ZSnMeuAbhZZd_2gtRP-KpgCO_pWLD66_-OLCNAx4mqKFy8-JTYD_jzGLML1YMc5117uht_x92xn0Hoe9lumzXlD5oQlpXqR96zHK5SnHgARtaSSBc4Wxln-McD2oAUGi0k",
      cta: "Get Early Access"
    },
    {
      id: 2,
      title: "Collaborative Study Platform",
      description: "Connect with peers, share resources, and ace your exams together.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjHkUB4-UUpovC8AJ1PNbXk9fsecPlm9rd_CdDH924B-iDM55ELoyYgWLGbLjup1_F7XJzKy72O9mtUmIBrI8VZkXuA5raxkIHsmkkBMa66EIk47pu-TUhmv4xRPgvtlXAYbFS6pKz1ZSnMeuAbhZZd_2gtRP-KpgCO_pWLD66_-OLCNAx4mqKFy8-JTYD_jzGLML1YMc5117uht_x92xn0Hoe9lumzXlD5oQlpXqR96zHK5SnHgARtaSSBc4Wxln-McD2oAUGi0k",
      cta: "Learn More"
    },
    {
      id: 3,
      title: "Premium Academic Resources",
      description: "Access curated notes, exam prep materials, and expert tutoring.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjHkUB4-UUpovC8AJ1PNbXk9fsecPlm9rd_CdDH924B-iDM55ELoyYgWLGbLjup1_F7XJzKy72O9mtUmIBrI8VZkXuA5raxkIHsmkkBMa66EIk47pu-TUhmv4xRPgvtlXAYbFS6pKz1ZSnMeuAbhZZd_2gtRP-KpgCO_pWLD66_-OLCNAx4mqKFy8-JTYD_jzGLML1YMc5117uht_x92xn0Hoe9lumzXlD5oQlpXqR96zHK5SnHgARtaSSBc4Wxln-McD2oAUGi0k",
      cta: "Upgrade Now"
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, ads.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % ads.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + ads.length) % ads.length);
    setAutoPlay(false);
  };

  return (
    <div className="bg-[#121212] rounded-xl border border-[#FF6B00]/20 overflow-hidden relative group">
      {/* Sponsored Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-black/60 text-[#FF6B00] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-[#FF6B00]/20 backdrop-blur-sm">
          Sponsored
        </span>
      </div>

      {/* Carousel Container */}
      <div className="flex items-center">
        {/* Left Navigation Button */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-2 z-10 size-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:text-[#FF6B00] hover:bg-black/80 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        {/* Slides */}
        <div className="flex-1 relative">
          <div className="relative h-64 w-full">
            <div className="absolute inset-0 flex">
              {ads.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  className="absolute inset-0 flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === current ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ pointerEvents: index === current ? "auto" : "none" }}
                >
                  {/* Image Section */}
                  <div
                    className="w-1/2 h-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${ad.image}")` }}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-transparent to-[#121212]" />
                  </div>

                  {/* Content Section */}
                  <div className="w-1/2 p-8 flex flex-col justify-center gap-4">
                    <h4 className="text-xl font-bold text-white leading-tight">
                      {ad.title}
                    </h4>
                    <p className="text-sm text-neutral-400">{ad.description}</p>
                    <motion.button
                      className="bg-[#FF6B00] text-black w-fit px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#E66000] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setAutoPlay(false)}
                      onMouseLeave={() => setAutoPlay(true)}
                    >
                      {ad.cta}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Navigation Button */}
        <motion.button
          onClick={nextSlide}
          className="absolute right-2 z-10 size-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:text-[#FF6B00] hover:bg-black/80 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {ads.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrent(index);
              setAutoPlay(false);
            }}
            className={`size-1.5 rounded-full transition-all ${
              index === current
                ? "bg-[#FF6B00]"
                : "bg-neutral-700 hover:bg-neutral-500 cursor-pointer"
            }`}
            whileHover={{ scale: 1.2 }}
            onMouseLeave={() => setAutoPlay(true)}
          />
        ))}
      </div>
    </div>
  );
}