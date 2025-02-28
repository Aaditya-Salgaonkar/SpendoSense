import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Ensure the correct import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BudgetingDialog = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      const currentUserId = userData.user.id;
      setUserId(currentUserId);

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
    <>
      {/* Button to Open Dialog */}
      <Button className="top-10 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => setOpen(true)}>
        + Add Budget
      </Button>

      {/* Dialog Component */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#101628] text-white">
          <DialogHeader>
            <DialogTitle>Create a Budget</DialogTitle>
            <DialogDescription>Set targets for monitoring your expenses.</DialogDescription>
          </DialogHeader>
          
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="categories">Category</Label>
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
                  <Input id="amount" placeholder="Enter the amount" type="number" />
                </div>
              </div>
            </form>
          </CardContent>

          <DialogFooter className="flex justify-end">
            <Button variant="outline" className='text-black' onClick={() => setOpen(false)}>Cancel</Button>
            <Button  onClick={() => setOpen(false)}>Save Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BudgetingDialog;
