import {useEffect, useState} from "react";

const TestComponent = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/test/hello")
            .then((response) => response.text())
            .then((data) => setMessage(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>API Response:</h1>
            <p>{message || "Loading..."}</p>
        </div>
    );
};

export default TestComponent;
