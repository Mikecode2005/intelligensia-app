import React from 'react';

const FloatingWords = () => {
  const words = [
    'Connect', 'Learn', 'Share', 'Resources', 'Internships', 'Jobs',
    'Students', 'Lecturers', 'Organizations', 'Schools', 'Knowledge',
    'Opportunities', 'Network', 'Grow', 'Collaborate', 'Succeed'
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {words.map((word, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-10 text-orange-400 dark:text-orange-600 font-bold text-lg md:text-xl lg:text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

export default FloatingWords;
