import { fetchendpoint } from '@/services/polygon';
import { PolygonProblemType } from '@/types/polygon';
import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {ProblemInfoTab} from "../components/polygonpages/ProblemInfoTab";
import { StatementsTab } from '../components/polygonpages/StatementsTab';
import { FilesTab } from '../components/polygonpages/FilesTab';
import { CheckerTab } from '../components/polygonpages/CheckerTab';
import { ScriptTab } from '../components/polygonpages/ScriptTab';
import { SolutionsTab } from '../components/polygonpages/SolutionsTab';
import { TestsTab } from '../components/polygonpages/TestsTab';
const PolygonProblem: React.FC = () => {
    const {problemId} = useParams<{problemId: string}>();
     const [problem, setproblem] = useState<PolygonProblemType>();
     const [apiKey, setApiKey] = useState<string>('');
     const [secret, setSecret] = useState<string>('');
     const [activeTab, setActiveTab] = useState("info")
     const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => { 
        const credentials = loadCreadentials();
        if (credentials&&problemId) {
            fetchProblemData(credentials.apiKey, credentials.secret);
        }


    }, [problemId])

    const loadCreadentials = () => { 
        const creds =localStorage.getItem('polygoncreds');
        if(creds){
            try{
                const {apiKey,secret} = JSON.parse(creds);
                setApiKey(apiKey);
                setSecret(secret);
                console.log("Credentials:",apiKey,secret);
                return {apiKey,secret};
            }catch(e){
                console.error("Failed to parse credentials",e);
                return null;
            }
        }
        return null;
    };

    const fetchProblemData = async (apiKey:string,secret:string) => {
        setLoading(true);
        setError(null);

        try {
            //basic problem info
            if(!problemId){
                throw new Error("Problem not found");
            }
            const problemResponse= await fetchendpoint(apiKey,secret,problemId,'problem-info');
            console.log("Problem response:",problemResponse);
            
            setproblem(problemResponse.problemInfo);

            

        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.error("Fetch error:", error);
            } else {
                setError("An unknown error occurred");
                console.error("Fetch error:", error);
            }
        }
        finally {
            setLoading(false);
        }

    }


    if (loading) {
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error}</div>;
    }
    if(!problemId){
        return <div>Problem not found</div>;
    }
    if(!problem){
        return <div>Problem not found</div>;
    }

    return (
        <div className='items-center flex flex-col px-6' >

            <h1>{problem.name}</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full items-center ">
                <TabsList className="flex gap-2 overflow-x-auto">
                <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="statements">Statements</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="tests">Tests</TabsTrigger>
                    <TabsTrigger value="solutions">Solutions</TabsTrigger>
                    <TabsTrigger value="checker">Checker</TabsTrigger>
                    <TabsTrigger value="script">Script</TabsTrigger>   
                </TabsList>
            <TabsContent value="info" className='items-center'>
                <ProblemInfoTab  apiKey={apiKey} secret={secret} problemId={problemId}/>
            </TabsContent>
            <TabsContent value="statements">
                    <StatementsTab  apiKey={apiKey} secret={secret} problemId={problemId} />
                </TabsContent>
                <TabsContent value="files">
                    <FilesTab apiKey={apiKey}  secret={secret} problemId={problemId} />
                </TabsContent>
                <TabsContent value="tests">
                    <TestsTab   apiKey={apiKey} secret={secret} problemId={problemId} />
                </TabsContent>
                <TabsContent value="solutions" className='items-center'>
                    <SolutionsTab apiKey={apiKey} secret={secret} problemId={problemId} />
                </TabsContent>
                <TabsContent value="checker">
                    <CheckerTab   apiKey={apiKey} secret={secret} problemId={problemId} />
                </TabsContent>
                <TabsContent value="script">
                    <ScriptTab  apiKey={apiKey}   secret={secret} problemId={problemId} />
                </TabsContent>
            </Tabs>


            
        </div>
    );
};

export default PolygonProblem;