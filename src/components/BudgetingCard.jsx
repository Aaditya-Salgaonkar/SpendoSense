import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Ensure the correct import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BudgetingCard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      const currentUserId = userData.user.id;
      setUserId(currentUserId);

      // Fetch categories for the logged-in user
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("userid", currentUserId);

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="m-5">
      <Card className="w-[350px] bg-[#101628] text-white">
        <CardHeader>
          <CardTitle>Create a Budget</CardTitle>
          <CardDescription>Set targets for monitoring your expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="categories">Category</label>
                <Select>
                  <SelectTrigger id="categories">
                    <SelectValue placeholder={loading ? "Loading..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        {loading ? "Loading..." : "No categories found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="Enter the amount" />
            </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="text-black">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BudgetingCard;
