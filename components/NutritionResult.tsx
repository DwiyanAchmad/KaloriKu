import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Sector } from 'recharts';
import { NutritionData, ChartData } from '../types';
import { Flame, Droplets, Wheat, Dumbbell, Activity, Info, Utensils, Zap, Leaf, Candy } from 'lucide-react';

interface NutritionResultProps {
  data: NutritionData;
  imageSrc: string;
  onReset: () => void;
}

// Updated Colors for 5 distinct items + base colors
const COLORS = {
  protein: '#3b82f6', // Blue
  fat: '#10b981',     // Green
  carbs: '#f59e0b',   // Amber
  sugar: '#ef4444',   // Red
  fiber: '#8b5cf6',   // Purple
  calories: '#f97316' // Orange
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth={4}
        style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.15))' }}
      />
    </g>
  );
};

const NutritionResult: React.FC<NutritionResultProps> = ({ data, imageSrc, onReset }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Chart data now includes Fiber. Calories is treated separately as the "center" or context.
  const chartData: ChartData[] = [
    { name: 'Protein', value: data.protein, fill: COLORS.protein, insight: data.macroInsights.protein },
    { name: 'Lemak', value: data.fat, fill: COLORS.fat, insight: data.macroInsights.fat },
    { name: 'Karbo', value: data.carbs, fill: COLORS.carbs, insight: data.macroInsights.carbs },
    { name: 'Gula', value: data.sugar, fill: COLORS.sugar, insight: data.macroInsights.sugar },
    { name: 'Serat', value: data.fiber, fill: COLORS.fiber, insight: "Penting untuk pencernaan sehat." },
  ];

  // Helper to calculate percentage of Daily Value (approximate) for the progress bars
  const getPercentage = (val: number, target: number) => Math.min(Math.round((val / target) * 100), 100);

  // Daily Value Targets (Standard 2000kcal diet)
  const DV = {
    calories: 2000,
    protein: 60,
    fat: 70,
    carbs: 275,
    sugar: 50,
    fiber: 30
  };

  const handleMouseEnter = (_: any, index: number) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-1 bg-gray-50 flex flex-col">
          <div className="relative h-64 lg:h-72 w-full group overflow-hidden">
            <img 
              src={imageSrc} 
              alt="Food" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="text-emerald-400 font-medium text-sm mb-1 tracking-wider uppercase">Terdeteksi</span>
              <h2 className="text-white text-3xl font-bold leading-tight drop-shadow-lg">{data.foodName}</h2>
              <p className="text-gray-200 text-sm mt-2 font-medium bg-black/30 backdrop-blur-sm inline-block px-3 py-1 rounded-full w-fit">
                {data.servingSize}
              </p>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4">
             {/* Detected Items Tags */}
             {data.detectedItems && data.detectedItems.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Utensils size={14} /> Komposisi
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.detectedItems.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold shadow-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm mt-auto">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">{data.explanation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Charts */}
        <div className="lg:col-span-2 p-6 md:p-8 flex flex-col gap-8">
          
          {/* Header Action */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="text-emerald-500" /> Komposisi Nutrisi
            </h3>
            <button 
              onClick={onReset}
              className="text-sm font-semibold text-gray-400 hover:text-emerald-600 transition-colors"
            >
              Scan Lainnya →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Chart Section */}
            <div className="relative h-[280px] w-full flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95} 
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      activeShape={renderActiveShape}
                      {...{ activeIndex: activeIndex !== null ? activeIndex : undefined } as any}
                    >
                      {chartData.map((entry, index) => {
                        const isActive = activeIndex === index;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.fill} 
                            opacity={activeIndex === null || isActive ? 1 : 0.4}
                            className="focus:outline-none cursor-pointer"
                          />
                        );
                      })}
                      <Label
                        value={`${data.calories}`}
                        position="centerBottom"
                        className="text-4xl font-black fill-gray-800"
                        dy={-5}
                      />
                      <Label
                        value="kCal"
                        position="centerTop"
                        className="text-sm font-medium fill-gray-400 uppercase tracking-widest"
                        dy={5}
                      />
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
               
               {/* Insight Tooltip Overlay (Desktop) */}
               {activeIndex !== null && (
                 <div className="absolute bottom-0 left-0 right-0 text-center animate-fade-in bg-gray-800/90 backdrop-blur-sm text-white text-xs py-2 px-4 rounded-lg pointer-events-none mx-8 shadow-lg transform translate-y-2">
                    {chartData[activeIndex].insight}
                 </div>
               )}
            </div>

            {/* Detailed Grid Stats */}
            <div className="grid grid-cols-2 gap-3">
              <NutrientCard 
                label="Kalori"
                value={data.calories}
                unit="kcal"
                target={DV.calories}
                color="text-orange-500"
                bg="bg-orange-50"
                icon={<Flame size={18} />}
                isActive={true} // Always active as main stat
              />
              <NutrientCard 
                label="Protein"
                value={data.protein}
                unit="g"
                target={DV.protein}
                color="text-blue-500"
                bg="bg-blue-50"
                icon={<Dumbbell size={18} />}
                isActive={activeIndex === null || activeIndex === 0}
                onHover={() => setActiveIndex(0)}
                onLeave={() => setActiveIndex(null)}
              />
               <NutrientCard 
                label="Karbohidrat"
                value={data.carbs}
                unit="g"
                target={DV.carbs}
                color="text-amber-500"
                bg="bg-amber-50"
                icon={<Wheat size={18} />}
                isActive={activeIndex === null || activeIndex === 2}
                onHover={() => setActiveIndex(2)}
                onLeave={() => setActiveIndex(null)}
              />
              <NutrientCard 
                label="Lemak"
                value={data.fat}
                unit="g"
                target={DV.fat}
                color="text-emerald-500"
                bg="bg-emerald-50"
                icon={<Droplets size={18} />}
                isActive={activeIndex === null || activeIndex === 1}
                onHover={() => setActiveIndex(1)}
                onLeave={() => setActiveIndex(null)}
              />
              <NutrientCard 
                label="Serat"
                value={data.fiber}
                unit="g"
                target={DV.fiber}
                color="text-purple-500"
                bg="bg-purple-50"
                icon={<Leaf size={18} />}
                isActive={activeIndex === null || activeIndex === 4}
                onHover={() => setActiveIndex(4)}
                onLeave={() => setActiveIndex(null)}
              />
               <NutrientCard 
                label="Gula"
                value={data.sugar}
                unit="g"
                target={DV.sugar}
                color="text-red-500"
                bg="bg-red-50"
                icon={<Candy size={18} />}
                isActive={activeIndex === null || activeIndex === 3}
                onHover={() => setActiveIndex(3)}
                onLeave={() => setActiveIndex(null)}
              />
            </div>
          </div>

          {/* Health Tips Section */}
          <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-4">
            <div className="bg-white p-2.5 rounded-full shadow-sm">
              <SparklesIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm uppercase tracking-wide mb-1">Tips Kesehatan AI</h4>
              <p className="text-emerald-800 text-sm leading-relaxed">{data.healthTips}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Detailed Cards
const NutrientCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  target: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
  isActive: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}> = ({ label, value, unit, target, color, bg, icon, isActive, onHover, onLeave }) => {
  const percentage = Math.min(Math.round((value / target) * 100), 100);
  
  return (
    <div 
      className={`p-3 rounded-xl transition-all duration-300 border cursor-default ${isActive ? 'border-gray-200 shadow-sm bg-white opacity-100 scale-100 ring-2 ring-gray-50' : 'border-transparent bg-gray-50 opacity-60 scale-95'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${bg} ${color}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
      </div>
      
      <div className="flex items-end gap-1 mb-2">
        <span className="text-xl font-bold text-gray-800">{value}</span>
        <span className="text-xs font-medium text-gray-400 mb-1">{unit}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${bg.replace('bg-', 'bg-') === 'bg-orange-50' ? 'bg-orange-500' : bg.replace('50', '500')}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-right">{percentage}% AKG</p>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
  </svg>
);

export default NutritionResult;