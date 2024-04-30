
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const LESSOPEN: string;
	export const USER: string;
	export const npm_config_user_agent: string;
	export const TAURI_DEBUG: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_node_execpath: string;
	export const LD_LIBRARY_PATH: string;
	export const SHLVL: string;
	export const TAURI_PLATFORM_VERSION: string;
	export const npm_config_noproxy: string;
	export const CONDA_SHLVL: string;
	export const HOME: string;
	export const OLDPWD: string;
	export const DESKTOP_SESSION: string;
	export const NVM_BIN: string;
	export const npm_package_json: string;
	export const NVM_INC: string;
	export const TAURI_ARCH: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GTK_MODULES: string;
	export const ROS_PYTHON_VERSION: string;
	export const npm_config_local_prefix: string;
	export const npm_config_userconfig: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const SYSTEMD_EXEC_PID: string;
	export const TAURI_PLATFORM_TYPE: string;
	export const npm_config_engine_strict: string;
	export const COLOR: string;
	export const COLORTERM: string;
	export const _CE_M: string;
	export const NVM_DIR: string;
	export const MANDATORY_PATH: string;
	export const ROS_DISTRO: string;
	export const GTK_IM_MODULE: string;
	export const LOGNAME: string;
	export const SUMO_HOME: string;
	export const TAURI_FAMILY: string;
	export const _: string;
	export const npm_config_npm_version: string;
	export const npm_config_prefix: string;
	export const CONDA_AUTO_ACTIVATE_BASE: string;
	export const DEFAULTS_PATH: string;
	export const ROS_VERSION: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const USERNAME: string;
	export const npm_config_cache: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const ROS_LOCALHOST_ONLY: string;
	export const _CE_CONDA: string;
	export const WINDOWPATH: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const GTK3_MODULES: string;
	export const NODE: string;
	export const SESSION_MANAGER: string;
	export const npm_package_name: string;
	export const GNOME_TERMINAL_SCREEN: string;
	export const XDG_MENU_PREFIX: string;
	export const XDG_RUNTIME_DIR: string;
	export const DISPLAY: string;
	export const TAURI_PLATFORM: string;
	export const LANG: string;
	export const MACOSX_DEPLOYMENT_TARGET: string;
	export const RMW_IMPLEMENTATION: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const GNOME_TERMINAL_SERVICE: string;
	export const LS_COLORS: string;
	export const XAUTHORITY: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XMODIFIERS: string;
	export const npm_lifecycle_script: string;
	export const AMENT_PREFIX_PATH: string;
	export const CONDA_PYTHON_EXE: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const SSH_AUTH_SOCK: string;
	export const SHELL: string;
	export const npm_lifecycle_event: string;
	export const npm_package_version: string;
	export const GDMSESSION: string;
	export const QT_ACCESSIBILITY: string;
	export const LESSCLOSE: string;
	export const GPG_AGENT_INFO: string;
	export const QT_IM_MODULE: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const CONDA_EXE: string;
	export const NVM_CD_FLAGS: string;
	export const TAURI_TARGET_TRIPLE: string;
	export const XDG_CONFIG_DIRS: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_global_prefix: string;
	export const PYTHONPATH: string;
	export const npm_command: string;
	export const VTE_VERSION: string;
	export const EDITOR: string;
	export const INIT_CWD: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		LESSOPEN: string;
		USER: string;
		npm_config_user_agent: string;
		TAURI_DEBUG: string;
		XDG_SESSION_TYPE: string;
		npm_node_execpath: string;
		LD_LIBRARY_PATH: string;
		SHLVL: string;
		TAURI_PLATFORM_VERSION: string;
		npm_config_noproxy: string;
		CONDA_SHLVL: string;
		HOME: string;
		OLDPWD: string;
		DESKTOP_SESSION: string;
		NVM_BIN: string;
		npm_package_json: string;
		NVM_INC: string;
		TAURI_ARCH: string;
		GNOME_SHELL_SESSION_MODE: string;
		GTK_MODULES: string;
		ROS_PYTHON_VERSION: string;
		npm_config_local_prefix: string;
		npm_config_userconfig: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		SYSTEMD_EXEC_PID: string;
		TAURI_PLATFORM_TYPE: string;
		npm_config_engine_strict: string;
		COLOR: string;
		COLORTERM: string;
		_CE_M: string;
		NVM_DIR: string;
		MANDATORY_PATH: string;
		ROS_DISTRO: string;
		GTK_IM_MODULE: string;
		LOGNAME: string;
		SUMO_HOME: string;
		TAURI_FAMILY: string;
		_: string;
		npm_config_npm_version: string;
		npm_config_prefix: string;
		CONDA_AUTO_ACTIVATE_BASE: string;
		DEFAULTS_PATH: string;
		ROS_VERSION: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		USERNAME: string;
		npm_config_cache: string;
		GNOME_DESKTOP_SESSION_ID: string;
		ROS_LOCALHOST_ONLY: string;
		_CE_CONDA: string;
		WINDOWPATH: string;
		npm_config_node_gyp: string;
		PATH: string;
		GTK3_MODULES: string;
		NODE: string;
		SESSION_MANAGER: string;
		npm_package_name: string;
		GNOME_TERMINAL_SCREEN: string;
		XDG_MENU_PREFIX: string;
		XDG_RUNTIME_DIR: string;
		DISPLAY: string;
		TAURI_PLATFORM: string;
		LANG: string;
		MACOSX_DEPLOYMENT_TARGET: string;
		RMW_IMPLEMENTATION: string;
		XDG_CURRENT_DESKTOP: string;
		GNOME_TERMINAL_SERVICE: string;
		LS_COLORS: string;
		XAUTHORITY: string;
		XDG_SESSION_DESKTOP: string;
		XMODIFIERS: string;
		npm_lifecycle_script: string;
		AMENT_PREFIX_PATH: string;
		CONDA_PYTHON_EXE: string;
		SSH_AGENT_LAUNCHER: string;
		SSH_AUTH_SOCK: string;
		SHELL: string;
		npm_lifecycle_event: string;
		npm_package_version: string;
		GDMSESSION: string;
		QT_ACCESSIBILITY: string;
		LESSCLOSE: string;
		GPG_AGENT_INFO: string;
		QT_IM_MODULE: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		PWD: string;
		npm_execpath: string;
		CONDA_EXE: string;
		NVM_CD_FLAGS: string;
		TAURI_TARGET_TRIPLE: string;
		XDG_CONFIG_DIRS: string;
		XDG_DATA_DIRS: string;
		npm_config_global_prefix: string;
		PYTHONPATH: string;
		npm_command: string;
		VTE_VERSION: string;
		EDITOR: string;
		INIT_CWD: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
