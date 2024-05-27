// main.rs
mod circuit;
mod proof_gen;

fn main() {
    let karma = bls12_381::Scalar::from(500u64);
    match proof_gen::generate_serialize_verify_proof(karma) {
        Ok(serialized_proof) => println!("Serialized Proof: {}", serialized_proof),
        Err(e) => println!("Error generating proof: {}", e),
    }
}
