import { supabase } from "@/lib/supabase";

export const addBook = async (title: string) => {
    const { error } = await supabase.from("books").insert({title: title});
}