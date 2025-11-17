use std::{fs, path::PathBuf};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Ensure Cargo reruns this script if either the schema or the pregenerated
    // bindings change.
    println!("cargo:rerun-if-changed=./src/hash/proto.capnp");
    println!("cargo:rerun-if-changed=./src/hash/proto_capnp.rs");

    let tonic_build_result = tonic_build::configure()
        .build_server(true)
        .file_descriptor_set_path("src/daemon/file_descriptor_set.bin")
        .compile(
            &["./src/daemon/proto/turbod.proto"],
            &["./src/daemon/proto"],
        );
    let capnpc_result = capnpc::CompilerCommand::new()
        .file("./src/hash/proto.capnp")
        .default_parent_module(vec!["hash".to_string()])
        .run();

    let invocation = std::env::var("RUSTC_WRAPPER").unwrap_or_default();
    if invocation.ends_with("rust-analyzer") {
        if tonic_build_result.is_err() {
            println!("cargo:warning=tonic_build failed, but continuing with rust-analyzer");
        }

        if capnpc_result.is_err() {
            println!("cargo:warning=capnpc failed, but continuing with rust-analyzer");
        }

        return Ok(());
    }

    tonic_build_result.expect("tonic_build command");
    if let Err(err) = capnpc_result {
        if !use_pregenerated_capnp()? {
            // Preserve the previous behavior of failing the build when schema
            // compilation fails, but surface the underlying error.
            return Err(format!("schema compiler command failed: {err:?}").into());
        }
        println!("cargo:warning=capnpc failed ({err:?}); using pre-generated Cap'n Proto bindings");
    }

    Ok(())
}

fn use_pregenerated_capnp() -> Result<bool, Box<dyn std::error::Error>> {
    let manifest_dir = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR")?);
    let fallback = manifest_dir.join("src/hash/proto_capnp.rs");
    if !fallback.exists() {
        return Ok(false);
    }

    let out_dir = PathBuf::from(std::env::var("OUT_DIR")?);
    let destination = out_dir.join("src/hash/proto_capnp.rs");
    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::copy(&fallback, &destination)?;
    println!(
        "cargo:warning=Using pre-generated Cap'n Proto bindings from {}",
        fallback.display()
    );

    Ok(true)
}
