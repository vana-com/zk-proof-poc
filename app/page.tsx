"use client";

import {ChangeEvent, useEffect, useState} from 'react';
import init, {extract_file_from_zip, verify_proof} from "../public/pkg/file_processor";

const Home = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [serializedProof, setSerializedProof] = useState<string>('');
  const [serializedVk, setSerializedVk] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');

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

  const handleProofChange = (event) => {
    setSerializedProof(event.target.value);
  };

  const handleVkChange = (event) => {
    setSerializedVk(event.target.value);
  };

  const handleVerifyClick = () => {
    try {
      const result = verify_proof(serializedProof, serializedVk);
      setVerificationResult(result ? "Proof is valid" : "Proof is invalid");
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult("Verification failed");
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
      <div>
        <h2>Verify Proof and Verifying Key</h2>
        <textarea placeholder="Serialized Proof" value={serializedProof} onChange={handleProofChange} />
        <textarea placeholder="Serialized Verifying Key" value={serializedVk} onChange={handleVkChange} />
        <button onClick={handleVerifyClick}>Verify</button>
        <div>
          <h3>Verification Result:</h3>
          <pre>{verificationResult}</pre>
        </div>
      </div>
    </div>
  );
};

export default Home;
