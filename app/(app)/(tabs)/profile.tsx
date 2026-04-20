import { supabase } from "@/lib/supabase";
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface UserAuthData{
    id: any,
    username: any,
    email: any
}
interface UserBookData{
    book_id: any,
    created_at: any,
    notes: any,
    rating: any,
    //booksRead: number,
    //booksInProgress: number,
    //booksPlanned: number
}

const ProfileScreen = () => {
    const [ userData, setUserData ] = useState<UserAuthData | null>();
    const [ userBookData, setUserBookData ] = useState<UserBookData | null>();

    useEffect(() => {
        //user data
        const loadUserData = async () => {
            const { data: { user }, } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from("users")
                .select("id, username, email")
                .eq("id", user.id)
                .single();
            setUserData(data);
        }
        //book stats
        const loadUserBookData = async () => {
            const { data }  = await supabase.from("users_books").select("book_id, created_at, notes, rating").eq("user_id", userData?.id);
            if(!data) return;
        }
        
        //follows

        //favourite book + notes
        
        loadUserData();
        loadUserBookData();
    }, []);

    return (
        <View>
            <Text>Profile</Text>
            <View>
                <Text>Featured book</Text>
                <View>
                    <Text>...</Text>
                </View>
            </View>
            <View>
                <Text>Statistics</Text>
                <View>
                    <Text>Data dołączenia:</Text>
                    <Text>Liczba przeczytanych książek:</Text>
                    <Text>Książki w trakcie czytania:</Text>
                    <Text>Książki planowane:</Text>
                    <Text>Liczba wystawionych opinii:</Text>
                    <Text>Followers:</Text>
                    <Text>Following:</Text>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen
