declare module '*/pkg/file_processor' {
    export function extract_file_from_zip(zipData: Uint8Array, fileName: string): Uint8Array;
    export default function init(input?: RequestInfo | URL | Response | BufferSource | WebAssembly.Module): Promise<void>;
}
