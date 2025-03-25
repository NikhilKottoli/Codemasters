import React,{useState,useEffect} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {fetchendpoint} from "@/services/polygon";
export const FilesTab: React.FC<{ apiKey: string, secret: string, problemId: string }> = ({  apiKey, secret, problemId }) => {
    const [files, setFiles] = useState<{ sourceFiles?: any[], resourceFiles?: any[], auxFiles?: any[] }>({});
    const [fileType, setFileType] = useState('source');
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [sourceType, setSourceType] = useState('cpp.g++');
    const [selectedFile, setSelectedFile] = useState<{type: string, name: string} | null>(null);
    const [viewingContent, setViewingContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchFilesData();
        console.log("Files:",files);
    }
    , []);


    const fetchFilesData = async () => {
        const filesData = await fetchendpoint(apiKey, secret, problemId, 'files');
        setFiles(filesData.files);
        console.log("Files:",filesData.files);
    }

    const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFileType(e.target.value);
    };

    const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };

    const handleFileContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFileContent(e.target.value);
    };

    const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSourceType(e.target.value);
    };

    const handleSaveFile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        
        try {
            const params: any = {
                apiKey,
                secret,
                problemId,
                type: fileType,
                name: fileName,
                file: fileContent
            };
            
            if (fileType === 'source') {
                params.sourceType = sourceType;
            }
            
            const response = await fetch('http://localhost:3000/polygon/save-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                setMessage('File saved successfully');
                setFileName('');
                setFileContent('');
            } else {
                setMessage(`Error: ${data.message || 'Failed to save file'}`);
            }
        } catch (error) {
            setMessage('Error saving file');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleViewFile = async (type: string, name: string) => {
        setSelectedFile({ type, name });
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:3000/polygon/view-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    type,
                    name
                })
            });
            
            
            const data =await response.text();
            const content = JSON.parse(data);
            setViewingContent(content.file);
        } catch (error) {
            console.error("Error viewing file:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderFilesList = (fileType: string, filesList: any[]) => {
        return (
            <div className="files-list flex flex-col  gap-4">
                <h3>{fileType.charAt(0).toUpperCase() + fileType.slice(1)} Files</h3>
                <ul className="flex flex-col gap-2">
                    {filesList.map((file, index) => (
                        <li key={index} className="file-item flex gap-2">
                            <span>{file.name}</span>
                            <Button onClick={() => handleViewFile(fileType, file.name)}>View</Button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="files-tab flex flex-col gap-2">
            <h2 className=" ">Files</h2>
            
            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}
            
            <div className="files-container ">
                <div className="files-lists">
                    {renderFilesList('source', files.sourceFiles || [])}
                    {renderFilesList('resource', files.resourceFiles || [])}
                    {renderFilesList('aux', files.auxFiles || [])}
                </div>
                
                <div className="file-viewer flex flex-col gap-2">
                    {selectedFile && (
                        <div>
                            <h3>Viewing: {selectedFile.name}</h3>
                            {loading ? (
                                <div className="loading">Loading file content...</div>
                            ) : (
                                <pre className="file-content">{viewingContent}</pre>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="add-file flex flex-col gap-2">
                <h3>Add/Edit File</h3>
                <form onSubmit={handleSaveFile}>
                    <div className="form-group">
                        <label>File Type:</label>
                        <select value={fileType} onChange={handleFileTypeChange}>
                            <option value="source">Source</option>
                            <option value="resource">Resource</option>
                            <option value="aux">Auxiliary</option>
                        </select>
                    </div>
                    
                    {fileType === 'source' && (
                        <div className="form-group">
                            <label>Source Type:</label>
                            <select value={sourceType} onChange={handleSourceTypeChange}>
                                <option value="cpp.g++">C++ (g++)</option>
                                <option value="cpp.msvc">C++ (MSVC)</option>
                                <option value="java.8">Java 8</option>
                                <option value="python.3">Python 3</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>File Name:</label>
                        <Input
                            type="text"
                            value={fileName}
                            onChange={handleFileNameChange}
                            placeholder="Enter file name"
                            required
                        />
                    </div>
                    
                    <div className="form-group ">
                        <label>File Content:</label>
                                <textarea
                                value={fileContent}
                                onChange={handleFileContentChange}
                                rows={15}
                                placeholder="Enter file content"
                                required
                            />
                        </div>
                        
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save File'}
                        </Button>
                    </form>
                </div>
            </div>
        );
    };
    