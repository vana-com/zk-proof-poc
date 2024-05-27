"use client";

import {ChangeEvent, useEffect, useState} from 'react';
import init, {extract_file_from_zip} from "../public/pkg/file_processor";

const Home = () => {
    const [fileContent, setFileContent] = useState<string>('');

    useEffect(() => {
        init();
    }, []);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const arrayBuffer = await file.arrayBuffer();
        const zipData = new Uint8Array(arrayBuffer);

        const content = extract_file_from_zip(zipData, 'conversations.json');
        setFileContent(content);
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
