import { useEffect, useState } from "react";
import { authToken } from "../../api/services/AuthService";

const useWebAPIWorker = (path: string) => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

   
    useEffect(() => {
        // Safely read the token — localStorage may hold "undefined"/"" if a
        // login/refresh stored a bad value; never let JSON.parse crash the app.
        let bearer = "";
        try {
            const raw = localStorage.getItem(authToken);
            const parsed = raw ? JSON.parse(raw) : "";
            if (parsed && parsed !== "undefined") bearer = `Bearer ${parsed}`;
        } catch {
            bearer = "";
        }
        const myWorker = new Worker(new URL("./apiWorker.ts", import.meta.url), { type: "module" });

        if (!path) {
            setError("Path is required");
            setLoading(false);
            return;
        }



        if(path && myWorker)
            {
                myWorker.postMessage({ apiPath: path, token: bearer });
            }

 

        myWorker.onmessage = (event) => {
            if (event.data.error) {
                setError(event.data.error);
            } else {
                setData(event.data);
            }
            setLoading(false);
            myWorker.terminate(); 
        };

        myWorker.onerror = (workerError) => {
            setError(`Worker error: ${workerError.message}`);
            setLoading(false);
        };

        return () => {
            myWorker.terminate();
        };

    }, [path]);

    return { data, error, loading };
};

export default useWebAPIWorker;
