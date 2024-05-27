# WebAssembly + ZK Proofs

This example shows how to import WebAssembly files (`.wasm`) and use them inside of a React component that is server rendered. So the WebAssembly code is executed on the server too. In the case of this example we're showing Rust compiled to WebAssembly.

## How to use

```bash
yarn dev
```

This example uses Rust compiled to wasm, the wasm file is included in the example, but to compile your own Rust code you'll have to [install](https://www.rust-lang.org/learn/get-started) Rust.

To compile `src/add.rs` to `add.wasm` run:

```bash
npm run build-rust
# or
yarn build-rust
# or
pnpm build-rust
```

### Bonus: To decompile the WASM file for inspection:
View a text representation of the WASM file with the WebAssembly Binary Toolkit, that can be edited and recompiled back into a WASM file.

```bash
brew install wabt
wasm2wat public/pkg/file_processor_bg.wasm -o public/pkg/file_processor_decompiled.wat
cat public/pkg/file_processor_decompiled.wat
```
