"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logMealAction } from "@/features/nutrition/actions";

interface AddMealDialogProps {
  userId: string;
  onMealAdded: () => void;
}

export default function AddMealDialog({ userId, onMealAdded }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mealData, setMealData] = useState({
    meal_type: "breakfast",
    description: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await logMealAction({
        meal_type: mealData.meal_type,
        notes: mealData.description,
        kcal: parseInt(mealData.calories) || 0,
        protein: parseFloat(mealData.protein) || 0,
        carbs: parseFloat(mealData.carbs) || 0,
        fat: parseFloat(mealData.fats) || 0,
        date: today
      });

      toast({
        title: "تم الإضافة!",
        description: "تم إضافة الوجبة بنجاح",
      });

      setMealData({
        meal_type: "breakfast",
        description: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
      });
      setOpen(false);
      onMealAdded();
    } catch (error) {
      console.warn("Error adding meal:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في إضافة الوجبة",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="meal_type">Meal Type</Label>
            <select
              id="meal_type"
              value={mealData.meal_type}
              onChange={(e) => setMealData({ ...mealData, meal_type: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={mealData.description}
              onChange={(e) => setMealData({ ...mealData, description: e.target.value })}
              placeholder="e.g., Grilled chicken with rice"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={mealData.calories}
                onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                placeholder="kcal"
                required
              />
            </div>

            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={mealData.protein}
                onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                placeholder="grams"
              />
            </div>

            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={mealData.carbs}
                onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                placeholder="grams"
              />
            </div>

            <div>
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                step="0.1"
                value={mealData.fats}
                onChange={(e) => setMealData({ ...mealData, fats: e.target.value })}
                placeholder="grams"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Meal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
