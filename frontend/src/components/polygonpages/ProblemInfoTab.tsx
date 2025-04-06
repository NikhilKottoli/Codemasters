import React,{useEffect,useState} from "react";
import { Button } from "@/components/ui/button"
import { fetchendpoint } from "@/services/polygon";
import { Input } from "@/components/ui/input"

export const ProblemInfoTab: React.FC<{  apiKey: string, secret: string, problemId: string }> = ({ apiKey, secret, problemId }) => {
    const [problemInfo, setProblemInfo] = useState<any>();
    const [formData, setFormData] = useState({
        timeLimit:  0,
        memoryLimit: 0,
        inputFile: 'stdin',
        outputFile: 'stdout',
        interactive: false
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {     
        fetchProblemInfoData(apiKey,secret,problemId);
        
    }, []);
    useEffect(() => {
        console.log("Problem Info in useeffect:",problemInfo);
        if(problemInfo!==undefined){
        setFormData({
            timeLimit: problemInfo.timeLimit ,
            memoryLimit: problemInfo.memoryLimit,
            inputFile: 'stdin',
            outputFile: 'stdout',
            interactive: false
        });
    }
    },[problemInfo]);

    const fetchProblemInfoData = async (apiKey:string,secret:string,problemId:string) => {
        const problemResponse= await fetchendpoint(apiKey,secret,problemId,'problem-info');     
        setProblemInfo(problemResponse.problemInfo);
        console.log("Problem Info:",problemInfo.timeLimit,problemInfo.memoryLimit); 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData({
            ...formData,
            [name]:Number(value) 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
         console.log("Form Data:",formData);    
        try {
            const response = await fetch(`${config.HOST}/polygon/update-problem-info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    ...formData
                })
            });
            
            const data = await response.json();
            console.log("API response:", data);
            if (data.status === 'success') {
                setMessage('Problem info updated successfully');
                await fetchProblemInfoData(apiKey,secret,problemId);
            } else {
                setMessage(`Error: ${data.message || 'Failed to update problem info'}`);
            }
        } catch (error) {
            setMessage('Error updating problem info');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="problem-info-tab" >
            <h2>Problem Information</h2>
            
            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <div className="form-group">
                    <label>Time Limit (ms)</label>
                    <Input
                        type="number"
                        name="timeLimit"
                        value={formData.timeLimit}
                        onChange={handleChange}
                        min="100"
                        max="15000"
                    />
                </div>
                
                <div className="form-group">
                    <label>Memory Limit (MB)</label>
                    <Input
                        type="number"
                        name="memoryLimit"
                        value={formData.memoryLimit}
                        onChange={handleChange}
                        min="4"
                        max="1024"
                    />
                </div>

                <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </div>
    );
};
