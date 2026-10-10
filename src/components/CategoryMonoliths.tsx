import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoryMonoliths: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryFilter(catId);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    {
      id: 'facewash-cleansing',
      num: '01 / BOTANICALS',
      title: 'Face Care',
      subtitle: 'Targeted lipid complexes & cold elixirs →',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6VndL6_YJBQ0kY5MX6A7dccDezKsXW_kBXlLRTS5qsEfhhfxuVpYCKcE11wa5ZlT-8kCVepW_qNminTSgypAmKo6p8U3W-635BD70BsB11jkCHkIfZBUER6ZjLqCMqu7B-dVvgNqba12zysWDqe6Vh3CyaquDQa4PMePU-u7dTQ_-d0m9dSiZYpaWTqTJax622LUw6sNLItMI-rkljhqIdxSyOY0vQ3C--F5Fqvm80WOoDQj911X',
    },
    {
      id: 'handmade-soaps',
      num: '02 / CLEANSING',
      title: 'Body & Bath',
      subtitle: 'Aromatic bars, soaks & cold-pressed salves →',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEm1ewT600OfF8-aeGAIgZn7ontNeU9TymlVSAibkpWIL4RoZ5dwRTnP_pbBtk1r2ljpgvQAzJPZUYctp3aXaZlZXpZtsTJXJY4G-KiyTSo8KUrvW6Xwlg72XMTrVgMFt4zMEF0mdtil-Q4f-xSv_fDe5o0Gz253crA5lOpIO686Kmq40dwXn7Jx4u4V9aojFh-bt5hbeUDA4rh67I4-Ef4gZYG_HPkRAJ2EaYi99JAzoTrI24lm7B',
    },
    {
      id: 'eco-domestic',
      num: '03 / ECO-DOMESTIC',
      title: 'Home Cleaning',
      subtitle: 'Thyme, citrus & plant-enzyme solutions →',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAanky9Tzc0ObQ0n6OeN9T1xKYV6wAFcISNLeLsv2wgbo_Cgh3Kes_FsE6OVMacb2VZHs0P73vp3RZc6CFVwvUd7SUeRQZ1srknEL-hpUqaBvdb5KIuaSLyXBWX_2K62qBKwbCXD_EDNpieeLsSnPZ2nT-WdUKxM-ImlmoM3VKk9_cYpYxAo1qPt7ILEX1RVjq3c9G-j747xve5NpvQZKjM5jGvHaXt7Wxk8MSb2ijOFXtYcNVXc3vW',
    },
    {
      id: 'creams-lip-care',
      num: '04 / ZERO WASTE',
      title: 'Refills & Sets',
      subtitle: 'Recycled aluminum concentrates & balms →',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD-CjtdQZq7ry-fm-9v3sVDYasCNOCfrNBeYAFcA7Jqd3fBPouZeM102_4v1vlZoyPM_avM_d6UTk1YAVewLSklDgG5BfvYAdRXQ-e2Iah3hvVthomrxYQYmvccDCFJ9D4eaLlKe4tax6AR-wnJFmCyqVZ7j_6dYY3PBwHLo8_-96rRhHyJtGM_LdRo277HqX8XcSVqWuvMQjQHGPljDagsTHgvjI4uGSWSIP0nSbFs5RzsUNaHqoO8',
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-white border-y border-[#E5E5E5]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="mb-10 pb-3 border-b border-[#E5E5E5] flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e5e5e] mb-1">
              Discipline
            </p>
            <h2 className="text-3xl lg:text-4xl text-black tracking-tight font-normal">
              Shop by category
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#5e5e5e] uppercase tracking-widest">
            Four Collections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative aspect-[3/4] bg-[#F5F4F2] overflow-hidden border border-[#E5E5E5] flex flex-col justify-end p-6 text-left cursor-pointer transition-all"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-105 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[11px] text-white/70 tracking-widest uppercase block mb-1 font-mono">
                  {cat.num}
                </span>
                <h3 className="text-2xl text-white uppercase tracking-tight font-normal">
                  {cat.title}
                </h3>
                <p className="text-[12px] text-white/80 mt-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  {cat.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
