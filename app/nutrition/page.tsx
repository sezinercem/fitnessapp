import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState } from "@/components/ui";
import { addMealAction, deleteMealAction, moveMealAction, updateMealAction, upsertNutritionAction } from "@/lib/actions";
import { getAuthedData } from "@/lib/data";
import type { NutritionMeal } from "@/lib/types";

export default async function NutritionPage() {
  const { nutrition } = await getAuthedData();
  const meals = ((nutrition?.nutrition_meals ?? []) as NutritionMeal[]).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Nutrition plan</p>
      <h1 className="mt-2 text-4xl font-black">Fuel targets and meals</h1>
      <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-2xl font-black">Daily targets</h2>
          <form action={upsertNutritionAction} className="mt-4 grid gap-3">
            <input name="goal" defaultValue={nutrition?.goal ?? "muscle gain"} placeholder="Goal" />
            <input name="dailyCalories" type="number" defaultValue={nutrition?.daily_calories ?? 2400} />
            <input name="proteinTarget" type="number" defaultValue={nutrition?.protein_target ?? 180} />
            <input name="carbsTarget" type="number" defaultValue={nutrition?.carbs_target ?? 260} />
            <input name="fatTarget" type="number" defaultValue={nutrition?.fat_target ?? 75} />
            <input name="mealsPerDay" type="number" defaultValue={nutrition?.meals_per_day ?? 4} />
            <input name="waterTargetLiters" type="number" step="0.1" defaultValue={nutrition?.water_target_liters ?? 3} />
            <textarea name="notes" defaultValue={nutrition?.notes ?? ""} placeholder="Notes" />
            <Button><Save className="h-4 w-4" />Save nutrition plan</Button>
          </form>
        </Card>

        <div className="grid gap-4">
          {nutrition ? (
            <Card>
              <h2 className="text-2xl font-black">Meals</h2>
              <div className="mt-4 grid gap-3">
                {meals.map((meal, index) => (
                  <div key={meal.id} className="rounded-lg border border-line bg-black p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Meal {index + 1}</p>
                    <form action={updateMealAction.bind(null, meal.id)} className="mt-3 grid gap-3 md:grid-cols-5">
                      <input name="mealName" defaultValue={meal.meal_name} className="md:col-span-2" />
                      <input name="calories" type="number" defaultValue={meal.calories} />
                      <input name="protein" type="number" defaultValue={meal.protein} />
                      <input name="carbs" type="number" defaultValue={meal.carbs} />
                      <input name="fat" type="number" defaultValue={meal.fat} />
                      <textarea name="ingredients" defaultValue={meal.ingredients ?? ""} className="md:col-span-2" />
                      <textarea name="notes" defaultValue={meal.notes ?? ""} className="md:col-span-2" />
                      <Button><Save className="h-4 w-4" />Update meal</Button>
                    </form>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <form action={moveMealAction.bind(null, meal.id, "up")}>
                        <button className="rounded-md border border-line p-2 text-zinc-300 hover:border-blood" aria-label="Move meal up"><ArrowUp className="h-4 w-4" /></button>
                      </form>
                      <form action={moveMealAction.bind(null, meal.id, "down")}>
                        <button className="rounded-md border border-line p-2 text-zinc-300 hover:border-blood" aria-label="Move meal down"><ArrowDown className="h-4 w-4" /></button>
                      </form>
                      <form action={deleteMealAction.bind(null, meal.id)}>
                        <button className="rounded-md border border-line p-2 text-zinc-300 hover:border-blood" aria-label="Delete meal"><Trash2 className="h-4 w-4" /></button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
              <form action={addMealAction} className="mt-5 grid gap-3 rounded-lg border border-line bg-black p-4 md:grid-cols-2">
                <input type="hidden" name="planId" value={nutrition.id} />
                <input name="mealName" placeholder="Meal name" required />
                <input name="calories" type="number" placeholder="Calories" required />
                <input name="protein" type="number" placeholder="Protein" required />
                <input name="carbs" type="number" placeholder="Carbs" required />
                <input name="fat" type="number" placeholder="Fat" required />
                <textarea name="ingredients" placeholder="Ingredients" className="md:col-span-2" />
                <textarea name="notes" placeholder="Notes" className="md:col-span-2" />
                <Button className="md:col-span-2"><Plus className="h-4 w-4" />Add meal</Button>
              </form>
            </Card>
          ) : (
            <EmptyState title="Create nutrition targets first" body="Save daily calories and macro targets, then add meals to your plan." />
          )}
        </div>
      </div>
    </AppShell>
  );
}
