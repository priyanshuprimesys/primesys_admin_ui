
self.onmessage = async (path: MessageEvent) => {
    const { apiPath, token } = path.data;
    const apiAdminPath = "https://api.mykidtrackers.com/admin-service/admin-service";

    if (apiPath && token) {

        try {
            const response = await fetch(`${apiAdminPath + apiPath}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });



            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            self.postMessage(data);
        } catch (error: any) {
            console.error("Error in worker:", error.message);

            self.postMessage({ error: error.message });
        }
    }
};
