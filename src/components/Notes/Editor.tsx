import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type EditorProps = {
    content: string;
    onChange: (content: string) => void;
    isPreview: boolean;
}
export default function Editor({ content, onChange, isPreview }: EditorProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            {isPreview ? (
                <div className="prose max-w-none" id="preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
            ) : (
                <textarea
                    placeholder="What's in your mind..."
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full p-4 text-gray-900 placeholder-gray-400 bg-white rounded-lg focus:outline-none resize-none"
                />
            )}
        </div>
    )
}