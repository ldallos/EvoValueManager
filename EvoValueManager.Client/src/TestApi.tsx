import { useEffect, useState } from "react";

const TestComponent = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
       /* fetch("/api/valaki/hello")
            .then((response) => response.text()) // Since it returns plain text
            .then((data) => setMessage(data))
            .catch((error) => console.error("Error fetching data:", error)); */

        const fetchData = async () => {
            try {
                const response = await fetch("/api/valaki/hello");
                const data = await response.text();
                setMessage(data); 
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>API Response:</h1>
            <p>{message || "Loading..."}</p>
        </div>
    );
};

export default TestComponent;
