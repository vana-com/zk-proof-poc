use bellman::groth16::{generate_random_parameters, create_random_proof, prepare_verifying_key, verify_proof, Proof, VerifyingKey};
use bls12_381::{Bls12, Scalar};
use rand::rngs::OsRng;
use base64::{encode, decode};
use std::io::{self, Write, Read};

use crate::circuit::KarmaDataCircuit;

pub fn generate_serialize_verify_proof(karma: Scalar) -> Result<(String, String), String> {
    let rng = &mut OsRng;

    let circuit = KarmaDataCircuit { karma: Some(karma) };
    let params = generate_random_parameters::<Bls12, _, _>(circuit, rng)
        .map_err(|e| format!("Error generating parameters: {:?}", e))?;

    let serialized_vk = serialize_vk(&params.vk)?;
    println!("Serialized Verifying Key: {}", serialized_vk);
    let deserialized_vk = deserialize_vk(&serialized_vk)?;

    let circuit_for_proof = KarmaDataCircuit { karma: Some(karma) };
    let proof = create_random_proof(circuit_for_proof, &params, rng)
        .map_err(|e| format!("Error generating proof: {:?}", e))?;

    let serialized_proof = serialize_proof(&proof)?;
    println!("Serialized Proof: {}", serialized_proof);
    let deserialized_proof = deserialize_proof(&serialized_proof)?;

    // let pvk = prepare_verifying_key(&params.vk);
    let pvk = prepare_verifying_key(&deserialized_vk);
    let public_inputs = vec![];
    // verify_proof(&pvk, &proof, &public_inputs)
    verify_proof(&pvk, &deserialized_proof, &public_inputs)
        .map(|_| (serialized_proof, serialized_vk))
        .map_err(|e| format!("Proof verification failed: {:?}", e))
}

fn serialize_proof(proof: &Proof<Bls12>) -> Result<String, String> {
    let mut proof_bytes = Vec::new();
    proof.write(&mut proof_bytes)
        .map_err(|_| "Failed to write proof bytes".to_string())?;
    Ok(encode(&proof_bytes))
}

fn deserialize_proof(encoded: &str) -> Result<Proof<Bls12>, String> {
    let proof_bytes = decode(encoded).map_err(|_| "Base64 decoding failed".to_string())?;
    Proof::read(&proof_bytes[..])
        .map_err(|_| "Failed to deserialize proof".to_string())
}

fn serialize_vk(vk: &VerifyingKey<Bls12>) -> Result<String, String> {
    let mut vk_bytes = Vec::new();
    vk.write(&mut vk_bytes)
        .map_err(|_| "Failed to write verifying key bytes".to_string())?;
    Ok(encode(&vk_bytes))
}

fn deserialize_vk(encoded: &str) -> Result<VerifyingKey<Bls12>, String> {
    let vk_bytes = decode(encoded).map_err(|_| "Base64 decoding failed".to_string())?;
    VerifyingKey::read(&vk_bytes[..])
        .map_err(|_| "Failed to deserialize verifying key".to_string())
}
