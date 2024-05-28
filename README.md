# ZK Proofs in WebAssembly 

A zero-knowledge proof (ZKP) is a cryptographic method by which one party (the prover) can prove to another party (the verifier) that they know a value without conveying any information apart from the fact that they know the value. This means the verifier learns nothing about the value itself, only that the prover knows it.

This example allows a ChatGPT data export zip file to be uploaded, and is considered "valid" if the number of conversations inside the zip file exceeds 50. We can generate cryptographic proof that a file meets this requirement without revealing its contents (or even the exact number of conversations in the file).

To protect against tampering with the proof generation while maintaining privacy and ensuring the data doesn't leave the user's browser unencrypted, the proof is generated in a WebAssembly environment, which is much harder to tamper with than generating proofs in the browser in plain JavaScript.

## How to use
This example uses Rust compiled to wasm, the wasm file is included in the example, but to compile your own Rust code you'll have to [install](https://www.rust-lang.org/learn/get-started) Rust.

To compile the Rust `file_processor` module into a wasm file, run:

```bash
yarn build-rust
```

To start the development server, run:

```bash
yarn dev
```

### Bonus: To decompile the WASM file for inspection:
View a text representation of the WASM file with the WebAssembly Binary Toolkit, that can be edited and recompiled back into a WASM file.

```bash
brew install wabt
wasm2wat public/pkg/file_processor_bg.wasm -o public/pkg/file_processor_decompiled.wat
cat public/pkg/file_processor_decompiled.wat
```
