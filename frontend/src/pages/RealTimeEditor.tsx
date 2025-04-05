import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import "./RealTimeEditor.css";

export default function RealTimeCodeEditor() {
    const [socket, setSocket] = useState(null);
    const [editorReady, setEditorReady] = useState(false);
    const editorRef = useRef(null);
    const isEditing = useRef(false);

    // Initialize socket connection
    useEffect(() => {
        const s = io("http://localhost:8080");
        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
        setEditorReady(true);
    };

    useEffect(() => {
        if (!editorRef.current || !socket || !editorReady) return;
    
        // Set up the editor change event
        const handleEditorChange = () => {
            if (isEditing.current) return;
            
            const content = editorRef.current.getValue();
            socket.emit("send-changes", content);
        };
    
        const handleContentChange = (content) => {
            isEditing.current = true;
            editorRef.current.setValue(content);
            setTimeout(() => {
                isEditing.current = false;
            }, 0);
        };
    
        // Store the disposable and dispose it properly
        const disposable = editorRef.current.onDidChangeModelContent(handleEditorChange);
        socket.on("receive-changes", handleContentChange);
    
        return () => {
            disposable.dispose();
            socket.off("receive-changes", handleContentChange);
        };
    }, [socket, editorReady]);

    return (
        <div className="code-editor-container">
            <Editor
                height="1000px"
                width={"1000px"}
                defaultLanguage="javascript"
                defaultValue="// Start coding here..."
                theme="vs-dark"
                onMount={handleEditorMount}
                options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    lineNumbers: "on",
                    tabSize: 2
                }}
            />
        </div>
    );
}