import React from 'react';
import { PlusCircle, LogOut, Save, Trash, LoaderCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useNoteStore, Note } from '../../store/noteStore';
import Editor from './Editor';
import useSave from './useSave';

export default function Notes() {
  const { toast } = useToast()

  // const { setUserState, signOut } = useAuthStore();
  const { notes, currentNote, setCurrentNote, fetchNotes, createNote, deleteNote } = useNoteStore();
  const { error: saveError, loading: saveLoading, saveNote } = useSave();

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isPreview, setIsPreview] = React.useState(false);
  const [error, setError] = React.useState('');
  const [newNoteLoading, setNewNoteLoading] = React.useState(false);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  React.useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  const createNewNote = async () => {
    setNewNoteLoading(true);
    try {
      const newNote = await createNote();
      setCurrentNote(newNote);
      setIsPreview(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Oops! Can't create notes at the moment",
      })
    }
    setNewNoteLoading(false);
  }

  const onEditorChange = (title: string, content: string) => {
    setTitle(title);
    setContent(content);
    if (currentNote) {
      saveNote(currentNote.id, title, content);
    }
  }

  const handleDelete = async (note: Note) => {
    try {
      await deleteNote(note.id);
      if (currentNote?.id === note.id) {
        setCurrentNote(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const onLogoutClick = async () => {
    try {
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
          <button
            onClick={() => onLogoutClick()}
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* New Note Button */}
        <div className="p-4">
          <button
            onClick={createNewNote}
            disabled={newNoteLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5" />
            New Note
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {notes.map((note) => (
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
                    handleDelete(note);
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
          ))}
        </div>

      </div>

      {/* Editor */}
      {
        currentNote && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Note title"
                  value={title}
                  onChange={(e) => onEditorChange(e.target.value, content)}
                  className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
                {
                  isPreview && (
                    <button
                      onClick={() => setIsPreview(!isPreview)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Close
                    </button>
                  )
                }
              </div>
            </div>
            <Editor content={content} onChange={(content) => onEditorChange(title, content)} isPreview={isPreview} />
          </div>
        )
      }
      {
        saveLoading && (
          <div className='absolute bottom-2 right-2 flex items-center gap-3 text-sm p-4 shadow-lg bg-white rounded-lg'>
            <LoaderCircle className={`h-4 w-4 animate-spin`} />
            Saving...
          </div>
        )
      }
    </div >
  );
}