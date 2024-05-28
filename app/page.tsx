"use client";

import {ChangeEvent, useEffect, useState} from 'react';
import init, {extract_file_from_zip, verify_proof} from "../public/pkg/file_processor";
import "../styles/globals.css";

const Home = () => {
    const [fileContent, setFileContent] = useState<any>(null);
    const [serializedProof, setSerializedProof] = useState<string>('');
    const [serializedVk, setSerializedVk] = useState<string>('');
    const [verificationResult, setVerificationResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        init();
    }, []);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setSerializedVk('');
        setSerializedProof('');
        setVerificationResult('');
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
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
                setSerializedProof(parsedResult.serialized_proof);
                setSerializedVk(parsedResult.serialized_vk);
            } else {
                console.error("Error:", parsedResult.error);
            }
            setFileContent(parsedResult);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProofChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setSerializedProof(event.target.value.trim());
    };

    const handleVkChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setSerializedVk(event.target.value.trim());
    };

    const handleVerifyClick = () => {
        setLoading(true);
        try {
            const result = verify_proof(serializedProof, serializedVk);
            setVerificationResult(result ? "Proof is valid" : "Proof is invalid");
        } catch (error) {
            console.error("Verification error:", error);
            setVerificationResult("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const renderJsonContent = (content: any) => {
        return Object.entries(content).map(([key, value]) => (
            <div key={key}>
                <strong>{key}:</strong>
                <pre
                    className="bg-gray-100 p-2 rounded break-words whitespace-pre-wrap">{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-4xl font-bold mb-8 text-center">ChatGPT Zero-Knowledge Proof</h1>
                <p className="text-sm mb-4">Upload a <a className={"text-blue-500"}
                                                        href={"https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data"}
                                                        target={"_blank"}>ChatGPT data export zip file</a> and generate
                    a zero-knowledge proof that verifies that the number of conversations in the zip file is greater
                    than 50, without having to share the zip file.</p>
                <p className="text-sm mb-4">The proof is generated within WebAssembly, making it harder to tamper with
                    the proof generation.</p>
                <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
                />

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Generate Proof</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        {fileContent && renderJsonContent(fileContent)}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Verify Proof</h2>
                    <label className={"text-lg font-semibold"}>Proof</label>
                    <textarea
                        placeholder="Serialized Proof"
                        value={serializedProof}
                        onChange={handleProofChange}
                        className="block w-full p-2 mb-4 border border-gray-300 rounded"
                        style={{height: '100px'}}
                    />
                    <label className={"text-lg font-semibold"}>Verifying Key</label>
                    <textarea
                        placeholder="Serialized Verifying Key"
                        value={serializedVk}
                        onChange={handleVkChange}
                        className="block w-full p-2 mb-4 border border-gray-300 rounded"
                        style={{height: '100px'}}
                    />
                    <button
                        onClick={handleVerifyClick}
                        disabled={loading}
                        className="block w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Verification Result:</h3>
                        <pre className="bg-gray-100 p-4 rounded">{verificationResult}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
