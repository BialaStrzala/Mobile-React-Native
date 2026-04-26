import { supabase } from "@/lib/supabase";

// Set colors
const bookColors = [
  "#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12",
  "#1abc9c", "#e67e22", "#34495e", "#16a085", "#c0392b"
];

export const addNewBook = async (title: string, author: string) => {
    //Duplicates
    const { data: existingBooks } = await supabase
        .from("books")
        .select("id")
        .eq("title", title)
        .maybeSingle();
    
    let bookId: number;
    
    if (existingBooks) {
        //Book already exists
        bookId = existingBooks.id;
    } else {
        //Add new book
        const { data: newBook, error: insertError } = await supabase
            .from("books")
            .insert({ title: title, author: author })
            .select("id")
            .single();
        
        if (insertError) {
            throw new Error(insertError.message);
        }
        
        bookId = newBook.id;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error("User not authenticated");
    }
    
    const { data: existingUserBook } = await supabase
        .from("user_books")
        .select("id")
        .eq("user_uid", user.id)
        .eq("book_id", bookId)
        .maybeSingle();
    
    if (existingUserBook) {
        throw new Error("You already have this book in your list");
    }
    
    const { error: userBookError } = await supabase
        .from("user_books")
        .insert({
            user_uid: user.id,
            book_id: bookId,
            status: "Planning"
        });
    
    if (userBookError) {
        throw new Error(userBookError.message);
    }
    
    return { bookId, message: "Book added successfully" };
}

export const addUserBook = async (bookId: number, title: string, author: string, status: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("User not authenticated");
    }
    
    // Check if user already has this book
    const { data: existing } = await supabase
        .from("user_books")
        .select("id")
        .eq("user_uid", user.id)
        .eq("book_id", bookId)
        .maybeSingle();
    
    if (existing) {
        throw new Error("You already have this book in your list");
    }
    
    const { error: insertError } = await supabase
        .from("user_books")
        .insert({
            book_id: bookId,
            user_uid: user.id,
            status: status,
            rating: 0,
        });
        
    if (insertError) {
        throw new Error(insertError.message);
    }
}

export const bookNameToColor = (title: string): string => {
    if (!title) return bookColors[0];
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
        sum += title.charCodeAt(i);
    }
    return bookColors[sum % bookColors.length];
};


export const pullUserBooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
        .from("user_books")
        .select(`
            id,
            status,
            rating,
            notes,
            book_id,
            books (
                id,
                title,
                author
            )
        `)
        .eq("user_uid", user.id);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data || [];
};

export const pullAllBooks = async () => {
    const { data, error } = await supabase
        .from("books")
        .select("id, title, author")
        .order("title");
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data || [];
};

export const pull3NewBooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
        .from("user_books")
        .select(`
            id,
            status,
            rating,
            book_id,
            books (
                id,
                title,
                author
            )
        `)
        .order("created_at", { ascending: false })
        .limit(3);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data || [];
};

export const updateBookStatus = async (userBookId: string, status: string) => {
    const { error } = await supabase
        .from("user_books")
        .update({ status })
        .eq("id", userBookId);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return { message: "Status updated successfully" };
};

export const updateBookRating = async (userBookId: string, rating: number) => {
    const { error } = await supabase
        .from("user_books")
        .update({ rating })
        .eq("id", userBookId);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return { message: "Rating updated successfully" };
};

export const updateBookNotes = async (userBookId: string, notes: string) => {
    const { error } = await supabase
        .from("user_books")
        .update({ notes })
        .eq("id", userBookId);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return { message: "Notes updated successfully" };
}

export const deleteBookFromUser = async (userBookId: string) => {
    const { error } = await supabase
        .from("user_books")
        .delete()
        .eq("id", userBookId);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return { message: "Book removed successfully" };
};

// Get book details with average rating and user counts
export const getBookDetails = async (bookId: number) => {
    // Get book info
    const { data: book, error: bookError } = await supabase
        .from("books")
        .select("id, title, author, created_at")
        .eq("id", bookId)
        .single();
    
    if (bookError) {
        throw new Error(bookError.message);
    }
    
    // Get all user_books for this book
    const { data: userBooks, error: userBooksError } = await supabase
        .from("user_books")
        .select("rating, status")
        .eq("book_id", bookId);
    
    if (userBooksError) {
        throw new Error(userBooksError.message);
    }
    
    // Calculate average rating
    const ratings = userBooks?.filter(ub => ub.rating !== null).map(ub => ub.rating) || [];
    const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
        : 0;
    
    // Count by status
    const readingCount = userBooks?.filter(ub => ub.status === "Reading").length || 0;
    const planningCount = userBooks?.filter(ub => ub.status === "Planning").length || 0;
    const finishedCount = userBooks?.filter(ub => ub.status === "Finished").length || 0;
    
    return {
        ...book,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
        readingCount,
        planningCount,
        finishedCount,
    };
};

// Check if user has this book in their list
export const checkUserHasBook = async (bookId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return null;
    }
    
    const { data } = await supabase
        .from("user_books")
        .select("id, status, rating, notes")
        .eq("user_uid", user.id)
        .eq("book_id", bookId)
        .maybeSingle();
    
    return data;
};