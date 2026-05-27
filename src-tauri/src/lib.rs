#[cfg_attr(mobile, tauri::mobile_entry_point)]
mod commands;
mod db;
mod error;
pub mod service;

pub use error::AppError;

use commands::{
    delete_entry, get_all_entries, get_entry, get_storage_path, import_entries,
    save_entry, save_image, save_image_from_bytes, update_entry,
};
use db::initialize_database;
use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Run SQLite database migrations on startup
            if let Err(e) = db::run_migrations(app.handle()) {
                eprintln!("Failed to run database migrations: {}", e);
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            app.handle().plugin(tauri_plugin_fs::init())?;
            app.handle().plugin(tauri_plugin_os::init())?;

            // Global Shortcut
            #[cfg(desktop)]
            {
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(|app, shortcut, event| {
                            if event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed
                            {
                                if shortcut.matches(
                                    tauri_plugin_global_shortcut::Modifiers::SUPER, // Use SUPER/CMD+Space or OPTION+Space
                                    tauri_plugin_global_shortcut::Code::Space,
                                ) || shortcut.matches(
                                    tauri_plugin_global_shortcut::Modifiers::ALT,
                                    tauri_plugin_global_shortcut::Code::Space,
                                ) {
                                    if let Some(window) = app.get_webview_window("main") {
                                        if window.is_visible().unwrap_or(false)
                                            && window.is_focused().unwrap_or(false)
                                        {
                                            let _ = window.hide();
                                        } else {
                                            let _ = window.show();
                                            let _ = window.set_focus();
                                        }
                                    }
                                }
                            }
                        })
                        .build(),
                )?;

                // Register default shortcut
                let shortcut = tauri_plugin_global_shortcut::Shortcut::new(
                    Some(tauri_plugin_global_shortcut::Modifiers::ALT),
                    tauri_plugin_global_shortcut::Code::Space,
                );
                match tauri_plugin_global_shortcut::Builder::new().with_shortcuts(vec![shortcut]) {
                    Ok(builder) => {
                        let _ = app.handle().plugin(builder.build());
                    }
                    Err(e) => {
                        eprintln!("Failed to register default shortcuts: {}", e);
                    }
                }
            }

            // System Tray
            #[cfg(desktop)]
            {
                let quit_i =
                    tauri::menu::MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
                let show_i = tauri::menu::MenuItem::with_id(
                    app,
                    "show",
                    "Show Bibliotheca",
                    true,
                    None::<&str>,
                )?;
                let menu = tauri::menu::Menu::with_items(app, &[&show_i, &quit_i])?;

                let mut tray_builder = tauri::tray::TrayIconBuilder::new()
                    .menu(&menu)
                    .tooltip("Bibliotheca Vitae")
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "quit" => {
                            app.exit(0);
                        }
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let tauri::tray::TrayIconEvent::Click { .. } = event {
                            if let Some(window) = tray.app_handle().get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    });

                if let Some(icon) = app.default_window_icon() {
                    tray_builder = tray_builder.icon(icon.clone());
                } else {
                    eprintln!("Warning: default_window_icon is None, skipping tray icon setting.");
                }

                let _tray = tray_builder.build(app)?;
            }

            #[cfg(desktop)]
            {
                if let Some(window) = app.handle().get_webview_window("main") {
                    #[cfg(target_os = "macos")]
                    {
                        let _ = window_vibrancy::apply_vibrancy(
                            &window,
                            window_vibrancy::NSVisualEffectMaterial::UnderWindowBackground,
                            Some(window_vibrancy::NSVisualEffectState::Active),
                            None,
                        );
                    }

                    #[cfg(target_os = "windows")]
                    {
                        let _ = window.set_decorations(false);
                        let _ = window_vibrancy::apply_blur(&window, Some((18, 18, 18, 125)));
                    }
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_entries,
            get_entry,
            save_entry,
            update_entry,
            delete_entry,
            save_image,
            save_image_from_bytes,
            get_storage_path,
            import_entries,
            initialize_database,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
