
export enum UserGoal {
  LoseWeight = 'Perder Peso',
  GainMuscle = 'Ganhar Massa',
  Endurance = 'Resistência',
  Maintain = 'Manter Saúde'
}

export enum UserLevel {
  Beginner = 'Iniciante',
  Intermediate = 'Intermediário',
  Advanced = 'Avançado'
}

export interface User {
  email: string; // Substitui username como ID
  password?: string; // Opcional pois login social não tem senha local
  name: string;
  avatar?: string;
  provider: 'local' | 'google';
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: UserGoal;
  level: UserLevel;
  equipment: string; // Descrição combinada do equipamento
  dietaryRestrictions: string;
  // Novos campos do módulo de Metas
  targetWeight?: number;
  deadline?: number; // em semanas
  reminders?: boolean;
  weightHistory?: WeightEntry[];
  // Novos campos de Atividade e Suplementação
  dailyCommute?: string; // Ex: "Bike 16km", "Caminhada 2km", "Nenhum"
  extraActivity?: string; // Ex: "Corrida leve", "Futebol fds"
  wantsSupplements?: boolean;
  // Novos campos solicitados
  playsSoccer?: boolean;
  startingPhoto?: string; // Base64 da imagem
  // Novos campos de Preferências e Limitações
  foodCravings?: string; // 'Doces', 'Salgados', 'Massas/Pizza', 'Lanches', 'Nenhum'
  physicalLimitations?: string; // Texto livre descrevendo lesões
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
  videoQuery?: string; // Para busca no youtube
}

export interface WorkoutDay {
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface MealItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
}

export interface Meal {
  type: string; // Café, Almoço, Jantar
  items: MealItem[];
  totalCalories: number;
  substitutions: string[]; // Lista de textos descrevendo substituições completas
}

export interface GeneratedPlan {
  motivation: string;
  workoutRoutine: WorkoutDay[];
  nutritionPlan: Meal[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string; // e.g., "15 min"
  exercises: Exercise[];
  color: string;
}
