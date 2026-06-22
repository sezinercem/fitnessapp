"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import { addMealLogItemAction, deleteMealLogItemAction, updateMealLogItemAction } from "@/lib/actions";
import { Button, Card } from "@/components/ui";
import type { Food, MealLog, MealType, NutritionTarget } from "@/lib/types";

type Props = {
  target: NutritionTarget | null;
  globalFoods: Food[];
  userFoods: Food[];
  mealLogs: MealLog[];
  suggestions: string[];
};

const mealSections: Array<{ key: MealType; label: string }> = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snacks", label: "Snacks" }
];

function totals(mealLogs: MealLog[]) {
  return mealLogs.flatMap((meal) => meal.meal_log_items ?? []).reduce(
    (sum, item) => ({
      calories: sum.calories + Number(item.total_calories ?? 0),
      protein: sum.protein + Number(item.total_protein ?? 0),
      carbs: sum.carbs + Number(item.total_carbs ?? 0),
      fat: sum.fat + Number(item.total_fat ?? 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function ProgressBar({ label, value, target, unit = "g" }: { label: string; value: number; target: number; unit?: string }) {
  const percent = target ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold">{label}</span>
        <span className="text-slate-500">{Math.round(value)}{unit} / {target}{unit}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-blood" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function FoodSearchForm({ mealType, foods }: { mealType: MealType; foods: Array<Food & { library: "global" | "user" }> }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(Food & { library: "global" | "user" }) | null>(null);
  const [manual, setManual] = useState(false);
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return foods.slice(0, 6);
    return foods
      .filter((food) => `${food.food_name} ${food.brand ?? ""}`.toLowerCase().includes(value))
      .slice(0, 6);
  }, [foods, query]);

  return (
    <div className="rounded-lg border border-line bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-emerald-600" />
        <p className="font-black">Add food</p>
      </div>
      <div className="mt-3 grid gap-3">
        <input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} placeholder="Search food, e.g. eggs, chicken rice, Tesco sourdough" />
        {query || matches.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {matches.map((food) => (
              <button
                key={`${food.library}-${food.id}`}
                type="button"
                onClick={() => { setSelected(food); setManual(false); setQuery(food.brand ? `${food.brand} ${food.food_name}` : food.food_name); }}
                className={`rounded-md border px-3 py-2 text-left text-sm hover:border-emerald-300 ${selected?.id === food.id ? "border-emerald-300 bg-emerald-100" : "border-line bg-panel"}`}
              >
                <span className="block font-bold">{food.brand ? `${food.brand} ${food.food_name}` : food.food_name}</span>
                <span className="text-xs text-slate-500">{food.calories} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g per {food.serving_size} {food.serving_unit}</span>
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" onClick={() => { setManual((value) => !value); setSelected(null); }} className="w-fit rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300">
          Can’t find it? Add it manually.
        </button>
      </div>

      <form action={addMealLogItemAction} className="mt-4 grid gap-3 md:grid-cols-6">
        <input type="hidden" name="mealType" value={mealType} />
        <input type="hidden" name="foodId" value={selected?.id ?? ""} />
        <input type="hidden" name="foodSource" value={selected?.library ?? "manual"} />
        <input name="quantity" type="number" step="0.01" placeholder="Quantity, e.g. 2" defaultValue="1" required />
        <input name="servingUnit" placeholder="servings, slices, grams, pieces" defaultValue={selected?.serving_unit ?? ""} />
        {!manual && selected ? (
          <div className="rounded-md border border-line bg-panel px-3 py-2 text-sm text-slate-600 md:col-span-4">
            Selected: <span className="font-bold text-slate-950">{selected.food_name}</span> · {selected.calories} calories per serving
          </div>
        ) : null}
        {manual ? (
          <>
            <input name="manualFoodName" placeholder="Food name, e.g. Chicken rice bowl" className="md:col-span-2" required />
            <input name="manualBrand" placeholder="Brand optional, e.g. Tesco" />
            <input name="manualServingSize" type="number" step="0.01" placeholder="Serving size, e.g. 1" required />
            <input name="manualServingUnit" placeholder="Serving unit, e.g. bowl, slice, grams" required />
            <input name="manualCalories" type="number" step="0.01" placeholder="Enter calories if known, e.g. 350" required />
            <input name="manualProtein" type="number" step="0.01" placeholder="Protein, e.g. 35g" />
            <input name="manualCarbs" type="number" step="0.01" placeholder="Carbs, e.g. 45g" />
            <input name="manualFat" type="number" step="0.01" placeholder="Fat, e.g. 12g" />
            <label className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold md:col-span-2">
              <input name="saveToMyFoods" type="checkbox" className="h-4 w-4" />
              Save to my foods
            </label>
          </>
        ) : null}
        <textarea name="notes" placeholder="Notes, e.g. Ate after training" className="md:col-span-6" />
        <Button className="md:col-span-6"><Plus className="h-4 w-4" />Add to {mealType}</Button>
      </form>
    </div>
  );
}

export function FoodLogger({ target, globalFoods, userFoods, mealLogs, suggestions }: Props) {
  const allFoods = useMemo(
    () => [
      ...userFoods.map((food) => ({ ...food, library: "user" as const })),
      ...globalFoods.map((food) => ({ ...food, library: "global" as const }))
    ],
    [globalFoods, userFoods]
  );
  const dayTotals = totals(mealLogs);
  const caloriesRemaining = Math.max(0, (target?.daily_calories ?? 0) - dayTotals.calories);

  return (
    <div className="mt-6 grid gap-4">
      <Card className="border-emerald-300">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Nutrition Today</h2>
            <p className="mt-1 text-sm text-slate-500">Log real foods as you eat them and compare daily totals against your Apex target.</p>
          </div>
          <p className="rounded-md border border-line bg-slate-50 px-3 py-2 text-sm font-bold">{Math.round(caloriesRemaining)} calories remaining</p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Daily totals</p>
            <p className="mt-3 text-3xl font-black">{Math.round(dayTotals.calories)} kcal</p>
            <p className="mt-1 text-sm text-slate-500">Target: {target?.daily_calories ?? 0} calories</p>
          </div>
          <div className="grid gap-4">
            <ProgressBar label="Calories" value={dayTotals.calories} target={target?.daily_calories ?? 0} unit="" />
            <ProgressBar label="Protein" value={dayTotals.protein} target={target?.protein_target ?? 0} />
            <ProgressBar label="Carbs" value={dayTotals.carbs} target={target?.carbs_target ?? 0} />
            <ProgressBar label="Fat" value={dayTotals.fat} target={target?.fat_target ?? 0} />
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          {suggestions.map((suggestion) => (
            <p key={suggestion} className="rounded-md border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800">{suggestion}</p>
          ))}
        </div>
      </Card>

      {mealSections.map((section) => {
        const log = mealLogs.find((meal) => meal.meal_type === section.key);
        const items = log?.meal_log_items ?? [];
        const mealTotal = items.reduce((sum, item) => sum + Number(item.total_calories ?? 0), 0);
        return (
          <Card key={section.key}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-black">{section.label}</h3>
                <p className="mt-1 text-sm text-slate-500">Meal total: {Math.round(mealTotal)} calories</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {items.length ? items.map((item) => (
                <div key={item.id} className="rounded-lg border border-line bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black">{item.brand ? `${item.brand} ${item.food_name}` : item.food_name}</p>
                      <p className="mt-1 text-sm text-slate-500">{Math.round(Number(item.total_calories))} calories · P {Math.round(Number(item.total_protein))}g · C {Math.round(Number(item.total_carbs))}g · F {Math.round(Number(item.total_fat))}g</p>
                    </div>
                    <form action={deleteMealLogItemAction.bind(null, item.id)}>
                      <button className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300">
                        <Trash2 className="h-4 w-4" />Delete
                      </button>
                    </form>
                  </div>
                  <form action={updateMealLogItemAction.bind(null, item.id)} className="mt-3 grid gap-3 md:grid-cols-6">
                    <input name="quantity" type="number" step="0.01" defaultValue={item.quantity} placeholder="Quantity, e.g. 2" />
                    <input name="servingUnit" defaultValue={item.serving_unit} placeholder="servings, slices, grams, pieces" />
                    <input name="caloriesPerServing" type="number" step="0.01" defaultValue={item.calories_per_serving} placeholder="Calories per serving, e.g. 120" />
                    <input name="proteinPerServing" type="number" step="0.01" defaultValue={item.protein_per_serving} placeholder="Protein, e.g. 4g" />
                    <input name="carbsPerServing" type="number" step="0.01" defaultValue={item.carbs_per_serving} placeholder="Carbs, e.g. 22g" />
                    <input name="fatPerServing" type="number" step="0.01" defaultValue={item.fat_per_serving} placeholder="Fat, e.g. 1g" />
                    <textarea name="notes" defaultValue={item.notes ?? ""} placeholder="Notes, e.g. Felt full after this meal" className="md:col-span-6" />
                    <Button className="md:col-span-6"><Save className="h-4 w-4" />Save logged food</Button>
                  </form>
                </div>
              )) : (
                <p className="rounded-lg border border-dashed border-line bg-slate-50 p-4 text-sm text-slate-500">No foods logged for {section.label.toLowerCase()} yet.</p>
              )}
            </div>

            <div className="mt-4">
              <FoodSearchForm mealType={section.key} foods={allFoods} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
