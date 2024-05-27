"use client";

import {ChangeEvent, useEffect, useState} from 'react';
import init, {extract_file_from_zip} from "../public/pkg/file_processor";

const Home = () => {
    const [fileContent, setFileContent] = useState<string>('');

    useEffect(() => {
        init();
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const arrayBuffer = await file.arrayBuffer();
        const zipData = new Uint8Array(arrayBuffer);

        try {
            const result = extract_file_from_zip(zipData, 'conversations.json');
            const parsedResult = JSON.parse(result);
            console.log("Verification:", parsedResult.verification);
            console.log("Number of conversations:", parsedResult.num_conversations);
            if (parsedResult.verification === "succeeded") {
                console.log("Serialized Proof:", parsedResult.serialized_proof);
                console.log("Serialized Verifying Key:", parsedResult.serialized_vk);
            } else {
                console.error("Error:", parsedResult.error);
            }
            setFileContent(result); // or handle the parsedResult as needed
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div>
            <h1>Upload Zip File</h1>
            <input type="file" onChange={handleFileChange}/>
            <div>
                <h2>Extracted File Content:</h2>
                <pre>{fileContent}</pre>
            </div>
        </div>
    );
};

export default Home;
