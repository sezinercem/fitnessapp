import type { MealLog, NutritionTarget, TrainingDay } from "@/lib/types";

function sum(items: MealLog[]) {
  return items.flatMap((meal) => meal.meal_log_items ?? []).reduce(
    (totals, item) => ({
      calories: totals.calories + Number(item.total_calories ?? 0),
      protein: totals.protein + Number(item.total_protein ?? 0),
      carbs: totals.carbs + Number(item.total_carbs ?? 0),
      fat: totals.fat + Number(item.total_fat ?? 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function nutritionSuggestions(target: NutritionTarget | null, mealLogs: MealLog[], today?: TrainingDay | null) {
  if (!target) return ["Finish onboarding to generate calorie and macro targets."];

  const totals = sum(mealLogs);
  const suggestions: string[] = [];
  const proteinProgress = target.protein_target ? totals.protein / target.protein_target : 0;
  const calorieProgress = target.daily_calories ? totals.calories / target.daily_calories : 0;
  const carbProgress = target.carbs_target ? totals.carbs / target.carbs_target : 0;

  if (proteinProgress < 0.55) {
    suggestions.push("Protein is currently low. Consider adding chicken, eggs, Greek yoghurt or tuna.");
  }

  if (calorieProgress > 0.85) {
    suggestions.push("You are close to your calorie target. Choose lean protein and vegetables for the next meal.");
  }

  if (today && !today.is_rest_day && carbProgress < 0.45) {
    suggestions.push("You have training today. A carb source like rice, oats or banana may help performance.");
  }

  if (!suggestions.length) {
    suggestions.push("Your nutrition is tracking well today. Keep meals simple and consistent.");
  }

  return suggestions;
}
