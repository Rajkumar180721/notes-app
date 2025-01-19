import { Trash } from 'lucide-react';
import { useNoteStore, Note } from '../../store/noteStore';

type NotesListProps = {
    notes: Note[];
}
export default function NotesList({ notes }: NotesListProps) {
    const { currentNote, setCurrentNote, deleteNote } = useNoteStore();

    return (
        <>
            {
                notes.map(note => (
                    <div
                        key={note.id}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${currentNote?.id === note.id ? 'bg-gray-50' : ''
                            }`}
                        onClick={() => setCurrentNote(note)}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 truncate">
                                {note.title || 'Untitled'}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // handleDelete(note);
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                            {note.content || 'No content'}
                        </p>
                    </div>
                ))
            }

        </>
    )
}