use std::io::{Cursor, Read};

use log::{error, info};
use serde_json::{from_str, Value};
use wasm_bindgen::prelude::*;
use zip::read::ZipArchive;

#[wasm_bindgen(start)]
pub fn main() {
    console_log::init_with_level(log::Level::Debug).expect("error initializing log");
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn extract_file_from_zip(zip_data: &[u8], file_name: &str) -> Result<String, String> {
    info!("Starting to extract file from zip");

    let reader = Cursor::new(zip_data);
    let mut archive = ZipArchive::new(reader).map_err(|e| format!("Failed to read zip archive: {:?}", e))?;

    let file_names = archive.file_names().collect::<Vec<_>>().join(", ");
    info!("archive: {file_names}");

    let mut file = archive.by_name(file_name).map_err(|e| format!("File not found in zip archive: {:?}", e))?;
    info!("file: {}", file.name());

    let mut contents = Vec::new();
    file.read_to_end(&mut contents).map_err(|e| format!("Failed to read file: {:?}", e))?;

    let contents_string = String::from_utf8(contents).map_err(|e| format!("Failed to convert file contents to string: {:?}", e))?;
    info!("File read successfully: {}", contents_string);

    let json_value = from_str::<Value>(&contents_string).map_err(|e| format!("Failed to parse file contents as JSON: {:?}", e))?;
    if !json_value.is_array() {
        return Err("The file does not contain a JSON array".to_string());
    }

    let num_conversations = json_value.as_array().unwrap().len();
    info!("Number of objects in JSON: {}", num_conversations);

    Ok(num_conversations.to_string())
}
