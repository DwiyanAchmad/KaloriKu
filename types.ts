export interface NutritionData {
  foodName: string;
  servingSize: string;
  detectedItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  explanation: string;
  healthTips: string;
  macroInsights: {
    protein: string;
    carbs: string;
    fat: string;
    sugar: string;
  }
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
  insight: string;
  [key: string]: any;
}
