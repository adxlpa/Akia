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
      id: 'handmade-soaps',
      num: '01 / BATH & BODY',
      title: 'Handmade Soaps',
      subtitle: 'Thulasi, Neem, Aloe, Sandal & Charcoal bars →',
      image: '/images/products/thulasi-soap.jpg',
    },
    {
      id: 'facewash-cleansing',
      num: '02 / FACE CARE',
      title: 'Herbal Face Wash',
      subtitle: 'Manjistha & Shankupushpam botanical wash →',
      image: '/images/products/manjisthadi-facewash.jpg',
    },
    {
      id: 'hair-care',
      num: '03 / SCALP & ROOTS',
      title: 'Hair Care',
      subtitle: 'Brahmi Bhringaraj Oil & Herbal Shampoo →',
      image: '/images/products/bhringraj-hair-oil.jpg',
    },
    {
      id: 'gels-nourishment',
      num: '04 / NOURISHMENT',
      title: 'Gels & Creams',
      subtitle: 'Aloevera Gel, Nalpamarathi & Beauty Cream →',
      image: '/images/products/aloevera-gel.jpg',
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-white border-y border-[#E5E5E5]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="mb-10 pb-3 border-b border-[#E5E5E5] flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e5e5e] mb-1 font-mono">
              Botanical Disciplines
            </p>
            <h2 className="text-3xl lg:text-4xl text-black tracking-tight font-serif font-normal">
              Shop by category
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#5e5e5e] uppercase tracking-widest">
            Brochure Collections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative aspect-[3/4] bg-[#F5F4F2] overflow-hidden border border-[#E5E5E5] flex flex-col justify-end p-6 text-left cursor-pointer transition-all hover:border-black"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
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
