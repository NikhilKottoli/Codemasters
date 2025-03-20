// export const basicProblemInfo =async(apiKey:string,secret:string,problemId:string)=>{
//     try {
//         console.log( `apiKey: ${apiKey} secret: ${secret} id: ${problemId}`);
//         const response = await fetch('http://localhost:3000/polygon/problems', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ apiKey:apiKey, secret:secret, id: problemId })
//         });
//         const data = await response.json();
//         console.log("API response:", data);
//         if (data.status === 'OK') {
//             return data.result;
//         } else {
//             console.error("API error:", data);
//         }
//     } catch (error) {
//         console.error("Fetch error:", error);
//     }
// }


// // export const fetchProblemInfo =async(apiKey:string,secret:string,problemId:string)=>{
// //     try {
// //         console.log( `apiKey: ${apiKey} secret: ${secret} id: ${problemId}`);
// //         const response = await fetch('http://localhost:3000/polygon/problem-info', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ apiKey:apiKey, secret:secret, problemId })
// //         });
// //         const data = await response.json();
// //         console.log("API response:", data);
// //         if (data.status === 'success') {
// //             console.log("Problem info data:",data.problemInfo);
// //             return data.problemInfo;
// //         } else {
// //             console.error("API error:", data);
// //         }
// //     } catch (error) {
// //         console.error("Fetch error:", error);
// //     }
// // }


export const fetchendpoint = async (apiKey: string, secret: string, problemId:string, methodName:string) => {
    try {
        const response = await fetch(`http://localhost:3000/polygon/${methodName}`, {
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