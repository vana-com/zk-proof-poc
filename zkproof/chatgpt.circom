pragma circom 2.1.9;

template IsGreaterThan() {
    signal input number;
    signal input minimum;
    signal output diff;

    assert(number >= minimum);

    diff <== number * minimum;
}

component main = IsGreaterThan();

// Download ptau file: wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -O pot12_final.ptau
// snarkjs groth16 setup chatgpt.r1cs pot12_final.ptau chatgpt.zkey
// snarkjs zkey contribute chatgpt.zkey chatgpt_final.zkey --name="chatgpt" -v
// snarkjs zkey export verificationkey chatgpt_final.zkey verification_key.json
