export const fetchendpoint = async (apiKey: string, secret: string, problemId:string, methodName:string) => {
    try {

        console.log("fetch endpoint",problemId)
        const response = await fetch(`${config.HOST}/polygon/${methodName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey, secret, problemId })
        });
        const data = await response.json();
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        console.error("Error fetching statements:", error);
    }
};


export const loadCredentials = () => {
    const creds = localStorage.getItem('polygoncreds');
    if (creds) {
        try {
            const { apiKey, secret } = JSON.parse(creds);
            return { apiKey, secret };
        } catch (e) {
            console.error("Failed to parse credentials", e);
            return null;
        }
    }
   
};