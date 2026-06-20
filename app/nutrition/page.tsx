import { Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState, StatCard } from "@/components/ui";
import { addEasyMealAction, deleteEasyMealAction, updateEasyMealAction } from "@/lib/actions";
import { getGuidedData } from "@/lib/data";
import type { Meal, NutritionTarget } from "@/lib/types";

export default async function NutritionPage() {
  const { nutritionTarget, easyMeals } = await getGuidedData();
  const target = nutritionTarget as NutritionTarget | null;
  const meals = ((easyMeals ?? []) as Meal[]).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Nutrition</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Simple daily targets</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">Use this page as a plain-English nutrition plan: what to aim for, why it fits your goal, and what meals make those numbers easier.</p>

      {target ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Calories" value={`${target.daily_calories}`} icon="flame" />
            <StatCard label="Protein" value={`${target.protein_target}g`} icon="dumbbell" />
            <StatCard label="Carbs" value={`${target.carbs_target}g`} icon="target" />
            <StatCard label="Fat" value={`${target.fat_target}g`} icon="salad" />
          </div>

          <Card className="mt-6 border-blood/30">
            <h2 className="text-2xl font-black">Why this fits your goal</h2>
            <p className="mt-3 text-zinc-400">{target.explanation}</p>
            <p className="mt-3 text-sm font-bold text-zinc-300">Water target: {target.water_target_liters}L per day</p>
          </Card>

          <div className="mt-6 grid gap-4">
            <Card>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Meal structure</h2>
                  <p className="mt-1 text-sm text-zinc-400">Edit meal names, time of day, foods, macros, and the purpose of each meal.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {meals.map((meal) => (
                  <div key={meal.id} className="rounded-lg border border-line bg-black p-4">
                    <form action={updateEasyMealAction.bind(null, meal.id)} className="grid gap-3 md:grid-cols-6">
                      <input name="mealName" defaultValue={meal.meal_name} placeholder="Meal name, e.g. Chicken rice bowl" className="md:col-span-2" />
                      <input name="timeOfDay" defaultValue={meal.time_of_day} placeholder="Time of day, e.g. Lunch" />
                      <input name="calories" type="number" defaultValue={meal.calories} placeholder="Calories, e.g. 650" />
                      <input name="protein" type="number" defaultValue={meal.protein} placeholder="Protein, e.g. 45g" />
                      <input name="carbs" type="number" defaultValue={meal.carbs} placeholder="Carbs, e.g. 70g" />
                      <input name="fat" type="number" defaultValue={meal.fat} placeholder="Fat, e.g. 18g" />
                      <textarea name="foods" defaultValue={meal.foods ?? ""} placeholder="Foods, e.g. chicken breast, rice, peppers, olive oil" className="md:col-span-3" />
                      <textarea name="purpose" defaultValue={meal.purpose ?? ""} placeholder="Simple explanation, e.g. High-protein meal to support recovery." className="md:col-span-3" />
                      <textarea name="notes" defaultValue={meal.notes ?? ""} placeholder="Notes, e.g. Swap rice for potatoes if preferred." className="md:col-span-6" />
                      <div className="flex flex-wrap gap-2 md:col-span-6">
                        <Button><Save className="h-4 w-4" />Save meal</Button>
                      </div>
                    </form>
                    <form action={deleteEasyMealAction.bind(null, meal.id)} className="mt-3">
                      <button className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood"><Trash2 className="h-4 w-4" />Remove meal</button>
                    </form>
                  </div>
                ))}
              </div>

              <form action={addEasyMealAction} className="mt-5 grid gap-3 rounded-lg border border-line bg-black p-4 md:grid-cols-6">
                <input type="hidden" name="nutritionTargetId" value={target.id} />
                <input name="mealName" placeholder="Meal name, e.g. Chicken rice bowl" className="md:col-span-2" required />
                <input name="timeOfDay" placeholder="Time of day, e.g. Lunch" required />
                <input name="calories" type="number" placeholder="Calories, e.g. 650" required />
                <input name="protein" type="number" placeholder="Protein, e.g. 45g" required />
                <input name="carbs" type="number" placeholder="Carbs, e.g. 70g" required />
                <input name="fat" type="number" placeholder="Fat, e.g. 18g" required />
                <textarea name="foods" placeholder="Foods, e.g. chicken, rice, vegetables" className="md:col-span-3" />
                <textarea name="purpose" placeholder="Purpose, e.g. High-protein lunch to support muscle repair." className="md:col-span-3" />
                <textarea name="notes" placeholder="Notes, e.g. Prep two servings tonight." className="md:col-span-6" />
                <Button className="md:col-span-6"><Plus className="h-4 w-4" />Add meal</Button>
              </form>
            </Card>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <EmptyState title="Finish onboarding first" body="Your calorie target, macros, and starter meals are generated after onboarding." />
        </div>
      )}
    </AppShell>
  );
}
