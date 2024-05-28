use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::prelude::*;
use std::fs::File;
use std::io::{Write, Read};
use std::process::Command;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

#[derive(Serialize, Deserialize)]
pub struct ProofData {
    proof: serde_wasm_bindgen::JsValue,
    public_signals: serde_wasm_bindgen::JsValue,
}

#[wasm_bindgen]
pub fn generate_proof(number: u32, minimum: u32) -> JsValue {
    // Write the input file for SnarkJS
    let input = serde_json::json!({
        "number": number,
        "minimum": minimum
    });
    let mut input_file = File::create("/tmp/input.json").unwrap();
    write!(input_file, "{}", input.to_string()).unwrap();

    // Generate the proof using SnarkJS
    Command::new("snarkjs")
        .args(&["groth16", "prove", "greater_than_final.zkey", "/tmp/input.json", "/tmp/proof.json", "/tmp/public.json"])
        .output()
        .expect("Failed to generate proof");

    // Read the proof and public signals from the files
    let mut proof_file = File::open("/tmp/proof.json").unwrap();
    let mut proof_string = String::new();
    proof_file.read_to_string(&mut proof_string).unwrap();
    let proof: serde_wasm_bindgen::JsValue = serde_json::from_str(&proof_string).unwrap();

    let mut public_file = File::open("/tmp/public.json").unwrap();
    let mut public_string = String::new();
    public_file.read_to_string(&mut public_string).unwrap();
    let public_signals: serde_wasm_bindgen::JsValue = serde_json::from_str(&public_string).unwrap();

    let proof_data = ProofData {
        proof,
        public_signals,
    };

    serde_wasm_bindgen::to_value(&proof_data).unwrap()
}

#[wasm_bindgen]
pub fn verify_proof(proof_data: JsValue) -> bool {
    let proof_data: ProofData = serde_wasm_bindgen::from_value(proof_data).unwrap();

    // Write the proof and public signals to files for SnarkJS
    let mut proof_file = File::create("/tmp/proof.json").unwrap();
    write!(proof_file, "{}", proof_data.proof.to_string()).unwrap();

    let mut public_file = File::create("/tmp/public.json").unwrap();
    write!(public_file, "{}", proof_data.public_signals.to_string()).unwrap();

    // Verify the proof using SnarkJS
    let output = Command::new("snarkjs")
        .args(&["groth16", "verify", "verification_key.json", "/tmp/public.json", "/tmp/proof.json"])
        .output()
        .expect("Failed to verify proof");

    output.status.success()
}
