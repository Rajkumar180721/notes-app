import { useNoteStore } from "@/store/noteStore";
import { useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'

export default function useSave() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { updateNote } = useNoteStore();

    const saveNote = useDebounceCallback((id: string, title: string, content: string) => {
        setLoading(true);
        updateNote(id, title, content)
            .then(() => {
                setError("");
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setError("Oops! Can't save note at the moment");
            })
    }, 500)

    return {
        loading,
        error,
        saveNote
    }
}