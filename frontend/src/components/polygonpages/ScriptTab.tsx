import React,{useState,useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchendpoint } from "@/services/polygon";
import config from "@/config";

export const ScriptTab: React.FC<{apiKey: string, secret: string, problemId: string }> = ({apiKey, secret, problemId }) => {
    const [script, setScript] = useState<string | null>(null);
    const [scriptCode, setScriptCode] = useState(script || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);


    useEffect(() => {
        fetchScriptCode();
    }, []);
    useEffect(() => {
        if (script) {setScriptCode(script || '');
        }
        
    }, [script]);
  
    const fetchScriptCode = async () => {
        const scriptData= await fetchendpoint(apiKey, secret,problemId,'script');
                setScript(scriptData.script);
    }
    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setScriptCode(e.target.value);
    };

    const handleSaveScript = async () => {
        setSaving(true);
        setMessage(null);
        
        try {
            const response = await fetch(`${config.HOST}/polygon/save-script`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    testset: 'tests',
                    source: scriptCode
                })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                setMessage('Script saved successfully');
            } else {
                setMessage(`Error: ${data.message || 'Failed to save script'}`);
            }
        } catch (error) {
            setMessage('Error saving script');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="script-tab">
            <h2>Test Generation Script</h2>
            
            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}
            
            <div className="script-info">
                <p>This script is used to generate test cases automatically. Write commands to generate tests.</p>
            </div>
            
            <div className="script-editor">
                <Textarea
                    value={scriptCode}
                    onChange={handleScriptChange}
                    rows={20}
                    placeholder="Enter test generation script here"
                />
                
                <Button onClick={handleSaveScript} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Script'}
                </Button>
            </div>
        </div>
    );
};
