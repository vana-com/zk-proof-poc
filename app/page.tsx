"use client";

import { ChangeEvent, useEffect, useState } from 'react';
import init, { extract_file_from_zip, verify_proof } from "../public/pkg/file_processor";

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
        <pre>{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>
      </div>
    ));
  };

  return (
    <div>
      <h1>Upload Zip File</h1>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      <div>
        <h2>Extracted File Content:</h2>
        <div>{fileContent && renderJsonContent(fileContent)}</div>
      </div>
      <div>
        <h2>Verify Proof and Verifying Key</h2>
        <textarea
          placeholder="Serialized Proof"
          value={serializedProof}
          onChange={handleProofChange}
          style={{ width: '100%', height: '100px' }}
        />
        <textarea
          placeholder="Serialized Verifying Key"
          value={serializedVk}
          onChange={handleVkChange}
          style={{ width: '100%', height: '100px' }}
        />
        <button onClick={handleVerifyClick} disabled={loading}>
          Verify
        </button>
        <div>
          <h3>Verification Result:</h3>
          <pre>{verificationResult}</pre>
        </div>
      </div>
    </div>
  );
};

export default Home;
