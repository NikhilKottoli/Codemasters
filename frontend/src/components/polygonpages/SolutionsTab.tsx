import React,{useState,useEffect} from "react";
import {fetchendpoint} from "@/services/polygon";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
export const SolutionsTab: React.FC<{  apiKey: string, secret: string, problemId: string }> = ({  apiKey, secret, problemId }) => {
    const [solutions, setSolutions] = useState<any[]>([]);
    const [newSolution, setNewSolution] = useState({
        name: '',
        file: '',
        sourceType: 'cpp.g++',
        tag: 'MA'
    });
    const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
    const [solutionContent, setSolutionContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchSolutions();
    }, []);

    const fetchSolutions = async () => {
        const solutionsData = await fetchendpoint(apiKey, secret, problemId, 'solutions');
        setSolutions(solutionsData.solutions);
    };

    const handleSolutionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewSolution({
            ...newSolution,
            [name]: value
        });
    };

    const handleViewSolution = async (name: string) => {
        setSelectedSolution(name);
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:3000/polygon/view-solution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    name
                })
            });
            
            const content = await response.text();
            setSolutionContent(content);
        } catch (error) {
            console.error("Error viewing solution:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        
        try {
            const response = await fetch('http://localhost:3000/polygon/save-solution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    name: newSolution.name,
                    file: newSolution.file,
                    sourceType: newSolution.sourceType,
                    tag: newSolution.tag,
                    checkExisting: true
                })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                setMessage('Solution saved successfully');
                setNewSolution({
                    name: '',
                    file: '',
                    sourceType: 'cpp.g++',
                    tag: 'MA'
                });
            } else {
                setMessage(`Error: ${data.message || 'Failed to save solution'}`);
            }
        } catch (error) {
            setMessage('Error saving solution');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="solutions-tab">
            <h2>Solutions</h2>
            
            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}
            
            <div className="solutions-list">
                <h3>Existing Solutions</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tag</th>
                            <th>Source Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.map((solution, idx) => (
                            <tr key={idx}>
                                <td>{solution.name}</td>
                                <td>{solution.tag}</td>
                                <td>{solution.sourceType}</td>
                                <td>
                                    <Button onClick={() => handleViewSolution(solution.name)}>View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {selectedSolution && (
                <div className="solution-viewer">
                    <h3>Viewing: {selectedSolution}</h3>
                    {loading ? (
                        <div className="loading">Loading solution...</div>
                    ) : (
                        <pre className="solution-content">{solutionContent}</pre>
                    )}
                    <Button onClick={() => setSelectedSolution(null)}>Close</Button>
                </div>
            )}
            
            <div className="add-solution">
                <h3>Add Solution</h3>
                <form onSubmit={handleSaveSolution} className="flex flex-col gap-4 ">
                    <div className="form-group">
                        <label>Solution Name:</label>
                        <Input
                            type="text"
                            name="name"
                            value={newSolution.name}
                            onChange={handleSolutionChange}
                            placeholder="Enter solution name"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Source Type:</label>
                        <select name="sourceType" value={newSolution.sourceType} onChange={handleSolutionChange}>
                            <option value="cpp.g++">C++ (g++)</option>
                            <option value="cpp.msvc">C++ (MSVC)</option>
                            <option value="java.8">Java 8</option>
                            <option value="python.3">Python 3</option>
                        </select>
                    </div>
                    
                    <div className="form-group ">
                        <label>Tag:</label>
                        <select name="tag" value={newSolution.tag} onChange={handleSolutionChange}>
                            <option value="MA">Main</option>
                            <option value="OK">Accepted</option>
                            <option value="RJ">Rejected</option>
                            <option value="TL">Time Limit</option>
                            <option value="WA">Wrong Answer</option>
                            <option value="PE">Presentation Error</option>
                            <option value="ML">Memory Limit</option>
                            <option value="RE">Runtime Error</option>
                        </select>
                    </div>
                    
                    <div className="form-group flex flex-col gap-4">
                        <label>Solution Code:</label>
                        <Textarea
                            name="file"
                            value={newSolution.file}
                            onChange={handleSolutionChange}
                            rows={15}
                            placeholder="Enter solution code"
                            required
                        />
                    </div>
                    
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Solution'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
