import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "./authStore";
import { decrypt, encrypt } from "../utils/Crypto";

export interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  setNotes: (notes: Note[]) => void;
  setCurrentNote: (note: Note | null) => void;
  fetchNotes: () => Promise<void>;
  createNote: () => Promise<Note>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  setNotes: (notes) => set({ notes }),
  setCurrentNote: (note) => set({ currentNote: note }),

  fetchNotes: async () => {
    const secret = useAuthStore.getState().password;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    const newNotes: Note[] = data.map((note) => ({
      ...note,
      content: secret ? decrypt(note.content, secret) : note.content,
      title: secret ? decrypt(note.title, secret) : note.title,
    }));
    // const { notes } = get();
    set({ notes: newNotes });
  },

  createNote: async () => {
    const title = "",
      content = "";
    const table = "notes";
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          title: encrypt(title, useAuthStore.getState().password),
          content: encrypt(content, useAuthStore.getState().password),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const newNote = {
      ...data,
      title,
      content,
    };
    const { notes } = get();
    set({
      notes: [newNote, ...notes],
    });
    return newNote;
  },

  updateNote: async (id, title, content) => {
    const table = "notes";
    const { error } = await supabase
      .from(table)
      .update({
        title: encrypt(title, useAuthStore.getState().password),
        content: encrypt(content, useAuthStore.getState().password),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    const { notes } = get();
    set({
      notes: notes.map((note) =>
        note.id === id ? { ...note, title, content } : note
      ),
    });
  },

  deleteNote: async (id) => {
    const table = "notes";
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;

    const { notes } = get();
    set({ notes: notes.filter((note) => note.id !== id) });
  },
}));
