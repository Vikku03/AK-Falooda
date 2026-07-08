/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CustomFalooda, MenuItem } from '../types';
import { Sparkles, Plus, Check, Undo, Layers, Heart } from 'lucide-react';

interface CustomFaloodaBuilderProps {
  onAddCustomFalooda: (customItem: MenuItem, customizationSummary: string) => void;
}

export const CustomFaloodaBuilder: React.FC<CustomFaloodaBuilderProps> = ({ onAddCustomFalooda }) => {
  const [customName, setCustomName] = useState('My Signature Falooda');
  const [baseSyrup, setBaseSyrup] = useState('Rose Syrup');
  const [milkType, setMilkType] = useState('Creamy Whole Milk');
  const [vermicelliLevel, setVermicelliLevel] = useState<'light' | 'normal' | 'extra'>('normal');
  const [sabjaLevel, setSabjaLevel] = useState<'light' | 'normal' | 'extra'>('normal');
  const [selectedScoops, setSelectedScoops] = useState<string[]>(['Royal Vanilla']);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Crushed Almonds & Pistachios', 'Sweet Jelly Cubes']);

  // Config options and their prices
  const baseSyrups = [
    { name: 'Rose Syrup', color: 'bg-rose-600', textClass: 'text-rose-400', hex: '#e11d48', desc: 'Sweet, floral classic' },
    { name: 'Mango Pulp', color: 'bg-amber-500', textClass: 'text-amber-400', hex: '#f59e0b', desc: 'Chunky, tropical pure' },
    { name: 'Golden Caramel', color: 'bg-amber-700', textClass: 'text-amber-600', hex: '#b45309', desc: 'Rich, caramelized brown' },
    { name: 'Belgian Chocolate', color: 'bg-stone-800', textClass: 'text-stone-400', hex: '#44403c', desc: 'Dark, decadent cocoa' },
  ];

  const milkTypes = [
    { name: 'Creamy Whole Milk', price: 0, color: 'bg-stone-100', desc: 'Classic velvety milk' },
    { name: 'Saffron Almond Milk', price: 20, color: 'bg-amber-100', desc: 'Loaded with real saffron +₹20' },
    { name: 'Chilled Coconut Milk', price: 15, color: 'bg-amber-50/70', desc: 'Rich and dairy-free feel +₹15' },
  ];

  const iceCreamScoops = [
    { name: 'Royal Vanilla', price: 30, desc: 'Creamy Madagascar vanilla' },
    { name: 'Rich Chocolate', price: 30, desc: 'Deep dark chocolate fudge' },
    { name: 'Dry Fruit Scoop', price: 30, desc: 'Loaded with almond & cashew bits' },
    { name: 'Black Current Berry', price: 30, desc: 'Tangy blackcurrant swirl' },
    { name: 'Pistachio Kulfi', price: 30, desc: 'Traditional slow-cooked kulfi' },
  ];

  const toppings = [
    { name: 'Crushed Almonds & Pistachios', price: 10, label: '🌰 Nuts' },
    { name: 'Chewy Tutti-Frutti', price: 10, label: '🍬 Tutti-Frutti' },
    { name: 'Sweet Jelly Cubes', price: 10, label: '🍇 Jellies' },
    { name: 'Edible Silver Foil', price: 15, label: '✨ Silver Vark' },
    { name: 'Whipped Cream Swirl', price: 10, label: '🧁 Whipped Cream' },
  ];

  // Price Calculation
  const totalPrice = useMemo(() => {
    let price = 80; // Base Price

    // Milk premium
    const milkObj = milkTypes.find(m => m.name === milkType);
    if (milkObj) price += milkObj.price;

    // Vermicelli extra
    if (vermicelliLevel === 'extra') price += 10;
    // Sabja extra
    if (sabjaLevel === 'extra') price += 10;

    // Scoops price (first scoop is included in base, subsequent scoops are +₹30)
    if (selectedScoops.length > 1) {
      price += (selectedScoops.length - 1) * 30;
    } else if (selectedScoops.length === 0) {
      price -= 15; // Discount for no scoop
    }

    // Toppings
    selectedToppings.forEach(toppingName => {
      const toppingObj = toppings.find(t => t.name === toppingName);
      if (toppingObj) price += toppingObj.price;
    });

    return price;
  }, [milkType, vermicelliLevel, sabjaLevel, selectedScoops, selectedToppings]);

  const handleToggleScoop = (name: string) => {
    if (selectedScoops.includes(name)) {
      setSelectedScoops(selectedScoops.filter(s => s !== name));
    } else {
      if (selectedScoops.length < 3) {
        setSelectedScoops([...selectedScoops, name]);
      }
    }
  };

  const handleToggleTopping = (name: string) => {
    if (selectedToppings.includes(name)) {
      setSelectedToppings(selectedToppings.filter(t => t !== name));
    } else {
      setSelectedToppings([...selectedToppings, name]);
    }
  };

  const handleReset = () => {
    setCustomName('My Signature Falooda');
    setBaseSyrup('Rose Syrup');
    setMilkType('Creamy Whole Milk');
    setVermicelliLevel('normal');
    setSabjaLevel('normal');
    setSelectedScoops(['Royal Vanilla']);
    setSelectedToppings(['Crushed Almonds & Pistachios', 'Sweet Jelly Cubes']);
  };

  const handleAddToTray = () => {
    const summary = `Base: ${baseSyrup} | Milk: ${milkType} | Noodles: ${vermicelliLevel} | Sabja: ${sabjaLevel} | Scoops: ${selectedScoops.join(', ') || 'None'} | Toppings: ${selectedToppings.join(', ') || 'None'}`;
    
    const customMenuItem: MenuItem = {
      id: `custom-f-${Date.now()}`,
      name: customName.trim() || 'Custom Royal Falooda',
      price: totalPrice,
      category: 'falooda',
      description: `Custom Handcrafted Falooda: ${selectedScoops.join(' & ') || 'Vanilla'} dessert with ${baseSyrup}, ${milkType}, vermicelli noodles, and delicious toppings.`,
      isSpecial: true,
      tags: ['Custom Created', 'One of a Kind']
    };

    onAddCustomFalooda(customMenuItem, summary);
  };

  // Find the current syrup color details
  const activeSyrup = baseSyrups.find(s => s.name === baseSyrup) || baseSyrups[0];
  const activeMilk = milkTypes.find(m => m.name === milkType) || milkTypes[0];

  return (
    <section id="builder" className="w-full bg-pink-50/30 py-16 px-4 sm:px-6 lg:px-8 border-b border-pink-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-pink-600 font-mono text-xs uppercase tracking-widest font-bold">Interactive Lab</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            Design-A-Falooda Lab
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base">
            Channel your inner chef! Mix and match layers of delicious syrups, cooling seeds, noodles, premium ice cream scoops, and exotic toppings. Watch your custom masterpiece take shape!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Layered Glass Preview */}
          <div className="lg:col-span-4 flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 sticky top-28 shadow-sm">
            <h3 className="text-pink-600 font-display font-bold text-sm tracking-widest uppercase mb-4 text-center">
              Real-Time Visual Layering
            </h3>

            {/* Custom Name Input */}
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Name your creation..."
              className="w-full bg-pink-50/50 text-stone-900 text-center font-display font-semibold px-4 py-2 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none mb-6 text-base"
              maxLength={28}
              id="custom-falooda-name-input"
            />

            {/* Visual Glass Container */}
            <div className="relative w-44 h-80 bg-pink-50/10 border-x-4 border-b-4 border-pink-300/30 rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end shadow-2xl relative">
              
              {/* Toppings floating at top */}
              <div className="absolute top-2 left-0 right-0 z-20 flex flex-wrap justify-center gap-1 px-2 pointer-events-none">
                {selectedToppings.map((t, idx) => {
                  const item = toppings.find(top => top.name === t);
                  return item ? (
                    <span key={t} className="text-xs animate-bounce" style={{ animationDelay: `${idx * 0.2}s` }}>
                      {item.label.split(' ')[0]}
                    </span>
                  ) : null;
                })}
              </div>

              {/* Scoops layer */}
              <div className="h-20 bg-pink-50/10 flex flex-col justify-end items-center relative border-b border-pink-100 z-10">
                {selectedScoops.length === 0 ? (
                  <span className="text-[10px] text-stone-400 italic mb-2">No Scoops Added</span>
                ) : (
                  <div className="flex -space-x-4 mb-1">
                    {selectedScoops.map((scoop, idx) => {
                      let scoopColor = 'bg-amber-100 text-amber-900'; // vanilla default
                      if (scoop.includes('Chocolate')) scoopColor = 'bg-amber-950 text-amber-100';
                      else if (scoop.includes('Black')) scoopColor = 'bg-pink-700 text-pink-100';
                      else if (scoop.includes('Pistachio')) scoopColor = 'bg-emerald-200 text-emerald-950';
                      else if (scoop.includes('Dry')) scoopColor = 'bg-amber-200 text-amber-950';

                      return (
                        <div 
                          key={scoop} 
                          className={`w-10 h-10 rounded-full ${scoopColor} flex items-center justify-center text-[8px] font-bold shadow-md border border-stone-900/10 origin-bottom animate-scaleIn`}
                          style={{ zIndex: 10 - idx }}
                        >
                          🍨
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="text-[9px] text-stone-500 font-mono">SCOOPS</div>
              </div>

              {/* Milk layer */}
              <div className={`h-16 ${activeMilk.color} flex flex-col justify-center items-center relative border-b border-stone-900/10 z-0`}>
                <div className="text-[9px] text-stone-800 font-bold uppercase tracking-widest">{milkType.replace('Creamy ', '').replace('Chilled ', '')}</div>
                {sabjaLevel === 'extra' && <div className="absolute inset-0 bg-[radial-gradient(#1c1917_15%,transparent_20%)] bg-[size:5px_5px] opacity-20" />}
              </div>

              {/* Noodles / Vermicelli layer */}
              <div className="h-16 bg-amber-50/90 flex flex-col justify-center items-center relative border-b border-stone-900/10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#eab308_25%,transparent_25%,transparent_50%,#eab308_50%,#eab308_75%,transparent_75%,transparent)] bg-[size:12px_12px] opacity-30" />
                <span className="text-[9px] text-stone-900 font-mono font-bold z-10">🍜 NOODLES ({vermicelliLevel.toUpperCase()})</span>
              </div>

              {/* Sabja Seeds / Basil seeds base layer */}
              <div className="h-14 bg-stone-900 flex flex-col justify-center items-center relative border-b border-stone-950">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_20%,transparent_20%)] bg-[size:4px_4px] opacity-50" />
                <span className="text-[9px] text-stone-300 font-mono font-bold z-10">⚫ BASIL SEEDS ({sabjaLevel.toUpperCase()})</span>
              </div>

              {/* Base Syrup Layer */}
              <div className={`h-14 ${activeSyrup.color} flex flex-col justify-center items-center transition-colors duration-500`}>
                <span className="text-xs text-white font-serif italic font-bold z-10">{baseSyrup}</span>
              </div>
            </div>

            {/* Stand & stem of glass */}
            <div className="w-10 h-5 bg-pink-100/50" />
            <div className="w-20 h-2 bg-pink-200/50 rounded-full shadow-lg" />

            {/* Live Price Tag */}
            <div className="mt-8 flex items-center justify-between w-full bg-pink-50/30 p-4 rounded-xl border border-pink-100">
              <span className="text-xs text-stone-600 uppercase tracking-widest font-mono">Calculated Price</span>
              <span className="text-xl text-pink-600 font-mono font-extrabold">₹{totalPrice}/-</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <button
                onClick={handleReset}
                className="py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 hover:text-pink-800 text-xs font-bold rounded-xl border border-pink-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                id="builder-reset-btn"
              >
                <Undo className="w-3.5 h-3.5" /> Reset Lab
              </button>
              <button
                onClick={handleAddToTray}
                className="py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                id="builder-add-btn"
              >
                <Plus className="w-4 h-4" /> Add to Order
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls Panel */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Base Syrup Selection */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">1</div>
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg">Select Base Syrup</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {baseSyrups.map((syrup) => (
                  <button
                    key={syrup.name}
                    onClick={() => setBaseSyrup(syrup.name)}
                    className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-24 cursor-pointer ${
                      baseSyrup === syrup.name
                        ? 'bg-pink-500/10 border-pink-500 text-pink-700 font-bold'
                        : 'bg-white border-pink-100 hover:border-pink-300 text-stone-600'
                    }`}
                    id={`builder-syrup-${syrup.name.replace(' ', '-').toLowerCase()}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`w-3.5 h-3.5 rounded-full ${syrup.color}`} />
                      {baseSyrup === syrup.name && <Check className="w-4 h-4 text-pink-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-stone-800 leading-tight">{syrup.name}</div>
                      <div className="text-[9px] text-stone-500 mt-1">{syrup.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dairy Milk Base */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">2</div>
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg">Choose Your Dairy Milk Base</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {milkTypes.map((milk) => (
                  <button
                    key={milk.name}
                    onClick={() => setMilkType(milk.name)}
                    className={`p-3.5 rounded-xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                      milkType === milk.name
                        ? 'bg-pink-500/10 border-pink-500 text-pink-700 font-bold'
                        : 'bg-white border-pink-100 hover:border-pink-300 text-stone-600'
                    }`}
                    id={`builder-milk-${milk.name.replace(' ', '-').toLowerCase()}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {milkType === milk.name ? (
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-white text-[10px]"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-pink-200" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-stone-800">{milk.name}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{milk.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Ingredient Densities */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Noodles */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">3A</div>
                  <h3 className="font-display font-bold text-stone-800 text-xs uppercase tracking-wider">Vermicelli Noodles (Sev)</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'normal', 'extra'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setVermicelliLevel(level)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                        vermicelliLevel === level
                          ? 'bg-pink-500/10 border-pink-500 text-pink-600'
                          : 'bg-white border-pink-100 text-stone-600 hover:border-pink-300'
                      }`}
                      id={`builder-sev-${level}`}
                    >
                      {level} {level === 'extra' ? '(+₹10)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sabja Seeds */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">3B</div>
                  <h3 className="font-display font-bold text-stone-800 text-xs uppercase tracking-wider">Cooling Basil Seeds (Sabja)</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'normal', 'extra'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSabjaLevel(level)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                        sabjaLevel === level
                          ? 'bg-pink-500/10 border-pink-500 text-pink-600'
                          : 'bg-white border-pink-100 text-stone-600 hover:border-pink-300'
                      }`}
                      id={`builder-sabja-${level}`}
                    >
                      {level} {level === 'extra' ? '(+₹10)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Ice Cream Scoops */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">4</div>
                  <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg">Select Gourmet Scoops <span className="text-xs text-stone-500 font-sans font-normal">(Select up to 2)</span></h3>
                </div>
                <span className="text-xs text-stone-500 font-mono font-bold">
                  {selectedScoops.length}/2 Selected
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {iceCreamScoops.map((scoop) => {
                  const isSelected = selectedScoops.includes(scoop.name);
                  const canSelectMore = selectedScoops.length < 2;
                  const isDisabled = !isSelected && !canSelectMore;

                  return (
                    <button
                      key={scoop.name}
                      onClick={() => handleToggleScoop(scoop.name)}
                      disabled={isDisabled}
                      className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500/10 border-pink-500 text-pink-700 font-bold'
                          : isDisabled
                            ? 'bg-pink-50/10 border-pink-100 text-stone-400 opacity-40 cursor-not-allowed'
                            : 'bg-white border-pink-100 hover:border-pink-300 text-stone-600'
                      }`}
                      id={`builder-scoop-${scoop.name.replace(' ', '-').toLowerCase()}`}
                    >
                      <div>
                        <div className="font-bold text-xs text-stone-800 leading-tight">{scoop.name}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{scoop.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-pink-600 font-mono font-bold">₹{scoop.price}/-</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-pink-200'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Luxury Garnishing Toppings */}
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">5</div>
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg">Luxury Garnishing & Crunchy Toppings</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {toppings.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.name);

                  return (
                    <button
                      key={topping.name}
                      onClick={() => handleToggleTopping(topping.name)}
                      className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500/10 border-pink-500 text-pink-700 font-bold'
                          : 'bg-white border-pink-100 hover:border-pink-300 text-stone-600'
                      }`}
                      id={`builder-topping-${topping.name.replace(' ', '-').toLowerCase()}`}
                    >
                      <div>
                        <span className="mr-1.5 text-xs">{topping.label.split(' ')[0]}</span>
                        <span className="font-bold text-xs text-stone-800 leading-tight">{topping.name.replace('Crushed ', '').replace('Sweet ', '')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-pink-600 font-mono font-bold">₹{topping.price}/-</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-pink-200'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
