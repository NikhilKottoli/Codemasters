import React,{useState,useEffect} from "react";
import { fetchendpoint } from "@/services/polygon";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import config from "@/config";

export const StatementsTab: React.FC<{  apiKey: string, secret: string, problemId: string }> = ({apiKey, secret, problemId }) => {
    const [statements, setStatements] = useState<any>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [statementData, setStatementData] = useState({
        encoding: '',
        name: '',
        legend: '',
        input: '',
        output: '',
        notes: '',
        tutorial: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);


    useEffect(() => {
        console.log("Fetching Statements");
        fetchStatementData();
        
    }, []);


    useEffect(() => {
        if (statements && Object.keys(statements).length > 0) {
            const langs=Object.keys(statements);
            const firstLang = langs[0];
            setSelectedLanguage(firstLang);
            loadStatementData(firstLang);
            setAvailableLanguages(langs);
            console.log("Available Languages:",availableLanguages);
        }
    }, [statements]);

    const fetchStatementData = async() => {
        const statementsData=await  fetchendpoint(apiKey, secret,problemId,'statements');
          setStatements(statementsData.statements);
          
          console.log("Statements:",statementsData);
        //   console.log("Available Languages:",availableLanguages);
    }

    const loadStatementData = (lang: string) => {
        console.log("statements:",statements[lang]);
        if (statements && statements[lang]) {
            const statement = statements[lang];
            setStatementData({
                encoding: statement.encoding || '',
                input: statement.input || '',
                legend: statement.legend || '',
                name: statement.name || '',
                output: statement.output || '',
                notes: statement.notes || '',
                tutorial: statement.tutorial || ''
            });
        } else {
            // Reset form if no statement exists for this language
            setStatementData({
                encoding: '',
                name: '',
                legend: '',
                input: '',
                output: '',
                notes: '',
                tutorial: ''
            });
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        loadStatementData(lang);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStatementData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveStatement = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        
        try {
            const response = await fetch(`http://${config.HOST}/polygon/save-statement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    lang: selectedLanguage,
                    ...statementData
                })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                setMessage('Statement saved successfully');
                // Refresh statements
                await fetchStatementData();
            } else {
                setMessage(`Error: ${data.message || 'Failed to save statement'}`);
            }
        } catch (error) {
            setMessage('Error saving statement');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    
    

    return (
        <div className="statements-tab">
            <h2 className="">Problem Statements</h2>
            
            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}
            
            <div className="language-selector flex gap-3">
                <label>Select Language:</label>
                <select value={selectedLanguage} onChange={handleLanguageChange}>
                    <option value="">-- Select a language --</option>
                    {availableLanguages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
                <Button onClick={() => setSelectedLanguage('en')}>Add English</Button>
                <Button onClick={() => setSelectedLanguage('ru')}>Add Russian</Button>
            </div>
            
            {selectedLanguage && (
                <form onSubmit={handleSaveStatement}>
                    <div className="form-group">
                        <label>Problem Name:</label>
                        <Input
                            type="text"
                            name="name"
                            value={statementData.name}
                            onChange={handleInputChange}
                            placeholder="Problem name"
                        />
                    </div>
                    <div>
                        <label>Encoding:</label>
                        <Input
                            type="text"
                            name="encoding"
                            value={statementData.encoding}
                            onChange={handleInputChange}
                            placeholder="Encoding"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Problem Statement:</label>
                        <Textarea
                            name="legend"
                            value={statementData.legend}
                            onChange={handleInputChange}
                            rows={10}
                            placeholder="Problem statement"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Input Format:</label>
                        <Textarea
                            name="input"
                            value={statementData.input}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Input format"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Output Format:</label>
                        <Textarea
                            name="output"
                            value={statementData.output}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Output format"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Notes:</label>
                        <Textarea
                            name="notes"
                            value={statementData.notes}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Notes"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Tutorial:</label>
                        <Textarea
                            name="tutorial"
                            value={statementData.tutorial}
                            onChange={handleInputChange}
                            rows={5}
                            placeholder="Tutorial"
                        />
                    </div>
                    
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Statement'}
                    </Button>
                </form>
            )}
        </div>
    );
};
