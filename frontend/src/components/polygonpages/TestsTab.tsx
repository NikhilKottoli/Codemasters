import React, { useState, useEffect } from "react";
import { fetchendpoint } from "@/services/polygon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
export const TestsTab: React.FC<{ apiKey: string, secret: string, problemId: string }> = ({apiKey, secret, problemId }) => {
    const [tests, setTests] = useState<any[]>([]);
    const [newTest, setNewTest] = useState({ testInput: '', testGroup: '', testDescription: '' });
    const [selectedTest, setSelectedTest] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchTests();
        console.log("Tests:", tests);
    }, []);

    const fetchTests = async () => {
        const testsData= await fetchendpoint(apiKey, secret,problemId,'tests');
            setTests(testsData.tests);
            console.log("tests",testsData);
    }

    const handleTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTest({
            ...newTest,
            [name]: value
        });
    };

    const handleAddTest = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:3000/polygon/save-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    secret,
                    problemId,
                    testset: 'tests',
                    testIndex: tests.length + 1,
                    testInput: newTest.testInput,
                    testGroup: newTest.testGroup || undefined,
                    testDescription: newTest.testDescription || undefined,
                    checkExisting: true
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setMessage('Test added successfully');
                setNewTest({ testInput: '', testGroup: '', testDescription: '' });
                // Refresh tests
                // You would need to call fetchTests here to update the list
            } else {
                setMessage(`Error: ${data.message || 'Failed to add test'}`);
            }
        } catch (error) {
            setMessage('Error adding test');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleViewTest = (index: number) => {
        setSelectedTest(index);
    };

    return (
        <div className="tests-tab">
            <h2>Test Cases</h2>

            {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</div>}

            <div className="tests-list">
                <h3>Existing Tests</h3>
                <table className="">
                    <thead>
                        <tr className="gap-1">
                            <th>Index</th>
                            <th>Group</th>
                            <th>Manual</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="gap-1">
                        {tests.map((test, idx) => (
                            <tr key={idx} className=" ">
                                <td>{test.index}</td>
                                <td>{test.group || '-'}</td>
                                <td>{test.manual ? 'Yes' : 'No'}</td>
                                <td>{test.description || '-'}</td>
                                <td>
                                    <Button onClick={() => handleViewTest(idx)}>View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTest !== null && (
                <div className="test-details">
                    <h3>Test #{tests[selectedTest].index}</h3>
                    <pre>{tests[selectedTest].input || 'Generated test (no input available)'}</pre>
                    <Button onClick={() => setSelectedTest(null)}>Close</Button>
                </div>
            )}

            <div className="add-test">
                <h3>Add Manual Test</h3>
                <form onSubmit={handleAddTest} className="flex flex-col gap-4 ">
                    <div className="form-group">
                        <label>Test Input</label>
                        <Textarea
                            name="testInput"
                            value={newTest.testInput}
                            onChange={handleTestChange}
                            rows={10}
                            placeholder="Enter test input data"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Test Group</label>
                        <Input
                            type="text"
                            name="testGroup"
                            value={newTest.testGroup}
                            onChange={handleTestChange}
                            placeholder="Optional group name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <Input
                            type="text"
                            name="testDescription"
                            value={newTest.testDescription}
                            onChange={handleTestChange}
                            placeholder="Optional test description"
                        />
                    </div>

                    <Button type="submit" disabled={saving}>
                        {saving ? 'Adding Test...' : 'Add Test'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
