(function (Scratch) {
    "use strict";

    class Silicon {
        constructor() {
            this.loader = "Fabric";
            this.loaded = false;
            this.loading = false;
            this.loadingScreenVisible = false;
            this.loadingScreenMode = "builtin";
            this.loadingScreenConfig = {
                title: "Silicon",
                subtitle: "Booting project...",
                logo: "",
                background: "#0b1020",
                foreground: "#ffffff",
                accent: "#4b8cff",
                progress: "#4b8cff",
                error: "#ff4b4b",
                animation: "pulse",
                showProgress: true,
                showStatus: true,
                showPercent: true,
                showLoader: true,
                showError: true
            };
            this.progress = 0;
            this.loadingStatus = "Silicon ready";
            this.status = "Silicon ready";
            this.error = "";
            this.projectName = "Gandi Project";
            this.projectVersion = "1.0.0";
            this.projectId = "gandi-project";
            this.loaderVersion = "1.2.0";
            this.debug = false;
            this.modules = {};
            this.config = {};
            this.loaderConfig = {};
            this.events = [];
            this.lastEventText = "";
            this.bootToken = 0;
            this.startedAt = 0;
        }

        getInfo() {
            return {
                id: "silicon",
                name: "Silicon",
                color1: "#4b8cff",
                color2: "#3266c7",
                color3: "#244c99",
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "LOADER" },
                    { opcode: "loadProject", blockType: Scratch.BlockType.COMMAND, text: "load project with [LOADER]", arguments: { LOADER: { type: Scratch.ArgumentType.STRING, menu: "loaders", defaultValue: "Fabric" } } },
                    { opcode: "setLoader", blockType: Scratch.BlockType.COMMAND, text: "set loader to [LOADER]", arguments: { LOADER: { type: Scratch.ArgumentType.STRING, menu: "loaders", defaultValue: "Fabric" } } },
                    { opcode: "reloadProject", blockType: Scratch.BlockType.COMMAND, text: "reload project" },
                    { opcode: "unloadProject", blockType: Scratch.BlockType.COMMAND, text: "unload project" },
                    { opcode: "isLoaded", blockType: Scratch.BlockType.BOOLEAN, text: "project loaded?" },
                    { opcode: "getLoader", blockType: Scratch.BlockType.REPORTER, text: "current loader" },
                    { opcode: "loaderSupported", blockType: Scratch.BlockType.BOOLEAN, text: "[LOADER] supported?", arguments: { LOADER: { type: Scratch.ArgumentType.STRING, menu: "loaders", defaultValue: "Fabric" } } },
                    { opcode: "getLoaderVersion", blockType: Scratch.BlockType.REPORTER, text: "Silicon loader version" },

                    { blockType: Scratch.BlockType.LABEL, text: "LOADER CONFIGURATION" },
                    { opcode: "setLoaderConfig", blockType: Scratch.BlockType.COMMAND, text: "set loader config [KEY] to [VALUE]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "environment" }, VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "gandi" } } },
                    { opcode: "getLoaderConfig", blockType: Scratch.BlockType.REPORTER, text: "loader config [KEY]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "environment" } } },
                    { opcode: "loaderConfigExists", blockType: Scratch.BlockType.BOOLEAN, text: "loader config [KEY] exists?", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "environment" } } },
                    { opcode: "clearLoaderConfig", blockType: Scratch.BlockType.COMMAND, text: "clear loader configuration" },
                    { opcode: "listLoaderConfig", blockType: Scratch.BlockType.REPORTER, text: "list loader configuration" },

                    { blockType: Scratch.BlockType.LABEL, text: "LOADING SCREEN" },
                    { opcode: "showLoading", blockType: Scratch.BlockType.COMMAND, text: "show Silicon loading screen" },
                    { opcode: "hideLoading", blockType: Scratch.BlockType.COMMAND, text: "hide Silicon loading screen" },
                    { opcode: "loadingVisible", blockType: Scratch.BlockType.BOOLEAN, text: "loading screen visible?" },
                    { opcode: "loadingScreenTest", blockType: Scratch.BlockType.REPORTER, text: "loading screen test" },
                    { opcode: "setLoadingMode", blockType: Scratch.BlockType.COMMAND, text: "set loading screen mode to [MODE]", arguments: { MODE: { type: Scratch.ArgumentType.STRING, menu: "screenModes", defaultValue: "Stage" } } },
                    { opcode: "getLoadingMode", blockType: Scratch.BlockType.REPORTER, text: "loading screen mode" },
                    { opcode: "setLoadingConfig", blockType: Scratch.BlockType.COMMAND, text: "set Silicon loading config [KEY] to [VALUE]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "title" }, VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "Silicon" } } },
                    { opcode: "getLoadingConfig", blockType: Scratch.BlockType.REPORTER, text: "Silicon loading config [KEY]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "title" } } },
                    { opcode: "loadingConfigExists", blockType: Scratch.BlockType.BOOLEAN, text: "loading config [KEY] exists?", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "title" } } },
                    { opcode: "resetLoadingConfig", blockType: Scratch.BlockType.COMMAND, text: "reset Silicon loading config" },
                    { opcode: "loadingScreenData", blockType: Scratch.BlockType.REPORTER, text: "loading screen data" },
                    { opcode: "loadingScreenFrame", blockType: Scratch.BlockType.REPORTER, text: "loading screen animation frame" },
                    { opcode: "loadingScreenText", blockType: Scratch.BlockType.REPORTER, text: "Silicon loading screen text v line [LINE]", arguments: { LINE: { type: Scratch.ArgumentType.NUMBER, menu: "loadingLines", defaultValue: 1 } } },
                    { opcode: "setLoadingStatus", blockType: Scratch.BlockType.COMMAND, text: "set loading status to [TEXT]", arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Initializing..." } } },
                    { opcode: "getLoadingStatus", blockType: Scratch.BlockType.REPORTER, text: "loading status" },
                    { opcode: "setProgress", blockType: Scratch.BlockType.COMMAND, text: "set loading progress to [NUMBER] %", arguments: { NUMBER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },
                    { opcode: "getProgress", blockType: Scratch.BlockType.REPORTER, text: "loading progress" },

                    { blockType: Scratch.BlockType.LABEL, text: "PROJECT CONFIGURATION" },
                    { opcode: "setConfig", blockType: Scratch.BlockType.COMMAND, text: "set config [KEY] to [VALUE]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "mode" }, VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "normal" } } },
                    { opcode: "getConfig", blockType: Scratch.BlockType.REPORTER, text: "config [KEY]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "mode" } } },
                    { opcode: "configExists", blockType: Scratch.BlockType.BOOLEAN, text: "config [KEY] exists?", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "mode" } } },
                    { opcode: "clearConfig", blockType: Scratch.BlockType.COMMAND, text: "clear configuration" },
                    { opcode: "listConfig", blockType: Scratch.BlockType.REPORTER, text: "list configuration" },

                    { blockType: Scratch.BlockType.LABEL, text: "MODULES" },
                    { opcode: "registerModule", blockType: Scratch.BlockType.COMMAND, text: "register module [NAME] version [VERSION]", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" }, VERSION: { type: Scratch.ArgumentType.STRING, defaultValue: "1.0.0" } } },
                    { opcode: "removeModule", blockType: Scratch.BlockType.COMMAND, text: "remove module [NAME]", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleLoaded", blockType: Scratch.BlockType.BOOLEAN, text: "module [NAME] loaded?", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleVersion", blockType: Scratch.BlockType.REPORTER, text: "module [NAME] version", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleLoader", blockType: Scratch.BlockType.REPORTER, text: "module [NAME] loader", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleCount", blockType: Scratch.BlockType.REPORTER, text: "number of modules" },
                    { opcode: "listModules", blockType: Scratch.BlockType.REPORTER, text: "list modules" },

                    { blockType: Scratch.BlockType.LABEL, text: "PROJECT METADATA" },
                    { opcode: "getProjectName", blockType: Scratch.BlockType.REPORTER, text: "loaded project name" },
                    { opcode: "getProjectVersion", blockType: Scratch.BlockType.REPORTER, text: "project version" },
                    { opcode: "getProjectId", blockType: Scratch.BlockType.REPORTER, text: "project ID" },
                    { opcode: "setProjectMetadata", blockType: Scratch.BlockType.COMMAND, text: "set project [KEY] to [VALUE]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "name" }, VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "Gandi Project" } } },
                    { opcode: "getProjectMetadata", blockType: Scratch.BlockType.REPORTER, text: "project metadata [KEY]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "name" } } },

                    { blockType: Scratch.BlockType.LABEL, text: "DEBUGGING & ERRORS" },
                    { opcode: "enableDebug", blockType: Scratch.BlockType.COMMAND, text: "enable debug mode" },
                    { opcode: "disableDebug", blockType: Scratch.BlockType.COMMAND, text: "disable debug mode" },
                    { opcode: "debugMode", blockType: Scratch.BlockType.BOOLEAN, text: "debug mode?" },
                    { opcode: "lastError", blockType: Scratch.BlockType.REPORTER, text: "last error" },
                    { opcode: "clearError", blockType: Scratch.BlockType.COMMAND, text: "clear error" },
                    { opcode: "siliconLog", blockType: Scratch.BlockType.REPORTER, text: "Silicon log" },

                    { blockType: Scratch.BlockType.LABEL, text: "RUNTIME & EVENTS" },
                    { opcode: "getStatus", blockType: Scratch.BlockType.REPORTER, text: "Silicon status" },
                    { opcode: "runtimeState", blockType: Scratch.BlockType.REPORTER, text: "runtime state" },
                    { opcode: "runtimeUptime", blockType: Scratch.BlockType.REPORTER, text: "runtime uptime" },
                    { opcode: "lastEvent", blockType: Scratch.BlockType.REPORTER, text: "last event" },
                    { opcode: "fireEvent", blockType: Scratch.BlockType.COMMAND, text: "fire event [EVENT]", arguments: { EVENT: { type: Scratch.ArgumentType.STRING, defaultValue: "ready" } } },
                    { opcode: "resetSilicon", blockType: Scratch.BlockType.COMMAND, text: "reset Silicon" }
                ],
                menus: {
                    loaders: { acceptReporters: true, items: ["Fabric", "NeoVirus"] },
                    screenModes: { acceptReporters: true, items: ["Stage", "Custom", "Off"] },
                    loadingLines: { acceptReporters: true, items: ["1", "2", "3", "4", "5", "6"] }
                }
            };
        }

        _log(message) {
            const entry = "[" + new Date().toLocaleTimeString() + "] " + message;
            this.events.push(entry);
            if (this.events.length > 50) this.events.shift();
            this.lastEventText = message;
        }

        _setStage(progress, status) {
            this.progress = Math.max(0, Math.min(100, Number(progress) || 0));
            this.loadingStatus = String(status);
            this.status = String(status);
            this._log(this.loadingStatus);
        }

        _fail(message) {
            this.bootToken++;
            this.loading = false;
            this.loaded = false;
            this.loadingScreenVisible = true;
            this.loadingScreenMode = "stage";
            this.error = String(message);
            this.status = "Silicon error";
            this.loadingStatus = "ERROR: " + this.error;
            this._log("ERROR: " + this.error);
        }

        _loaderMessages(loader) {
            return loader.toLowerCase() === "fabric"
                ? [[8,"Starting Fabric Loader"],[18,"Checking Fabric environment"],[30,"Loading Fabric API"],[44,"Resolving Fabric modules"],[60,"Initializing Fabric runtime"]]
                : [[8,"Starting NeoVirus Loader"],[18,"Scanning NeoVirus environment"],[30,"Loading NeoVirus core"],[44,"Resolving NeoVirus modules"],[60,"Initializing NeoVirus runtime"]];
        }

        loaderSupported(args) {
            const loader = String(args && args.LOADER || "").trim().toLowerCase();
            return loader === "fabric" || loader === "neovirus";
        }

        getLoaderVersion() { return this.loaderVersion; }

        setLoader(args) {
            const loader = String(args.LOADER || "Fabric");
            if (!this.loaderSupported({LOADER: loader})) {
                this._fail("Unsupported loader: " + loader);
                return;
            }
            if (this.loading) {
                this._fail("Cannot change loader while Silicon is loading");
                return;
            }
            this.loader = loader;
            this.loaded = false;
            this._setStage(0, loader + " selected");
        }

        async loadProject(args) {
            const loader = String(args.LOADER || this.loader);
            if (!this.loaderSupported({LOADER: loader})) {
                this._fail("Unsupported loader: " + loader);
                return;
            }

            this.bootToken++;
            this.loader = loader;
            this.loaded = false;
            this.loading = true;
            this.loadingScreenVisible = true;
            if (this.loadingScreenMode === "off") this.loadingScreenMode = "stage";
            this.error = "";
            this.progress = 0;
            this.startedAt = Date.now();

            // Silicon must have a real loader backend before it can report success.
            // Fabric and NeoVirus are not JavaScript loaders built into Gandi, so do not
            // claim they loaded unless a backend was explicitly provided to Silicon.
            const backends = (typeof globalThis !== "undefined" && globalThis.SiliconLoaders) || {};
            let backend = backends[loader] || backends[loader.toLowerCase()];

            // NeoVirus is served separately so Silicon can load the real backend
            // into this extension sandbox before starting it.
            if (!backend && loader.toLowerCase() === "neovirus") {
                const url = "https://cubehub-studio.github.io/NeoVirus-Loader/loader.js";
                try {
                    const fetcher =
                        typeof Scratch.fetch === "function"
                            ? Scratch.fetch.bind(Scratch)
                            : (typeof globalThis !== "undefined" && typeof globalThis.fetch === "function")
                                ? globalThis.fetch.bind(globalThis)
                                : null;

                    if (!fetcher) {
                        throw new Error("Silicon cannot fetch the NeoVirus Loader in this extension sandbox.");
                    }

                    const response = await fetcher(url);
                    if (!response || !response.ok) {
                        throw new Error("HTTP " + (response ? response.status : "request failed"));
                    }

                    const source = await response.text();
                    const runLoader = new Function(source + "\n//# sourceURL=" + url);
                    runLoader();

                    const loadedBackends = (typeof globalThis !== "undefined" && globalThis.SiliconLoaders) || {};
                    backend = loadedBackends.neovirus || loadedBackends.NeoVirus;
                } catch (e) {
                    this._fail("NeoVirus Loader could not be loaded: " + (e && e.message ? e.message : String(e)));
                    return;
                }
            }

            if (!backend || typeof backend.boot !== "function") {
                this._fail(loader + " loader backend is not installed. Silicon will not pretend it loaded.");
                return;
            }

            const stages = [
                [5, "Initializing Silicon core"],
                [10, "Starting " + loader + " Loader"],
                [25, "Checking " + loader + " environment"],
                [45, "Initializing " + loader + " modules"]
            ];
            for (const stage of stages) this._setStage(stage[0], stage[1]);

            try {
                const result = backend.boot({loader: loader, silicon: this});
                if (result === false) throw new Error(loader + " loader backend rejected startup");
                this._setStage(70, loader + " runtime initialized");
                this._setStage(85, "Loading project metadata");
                this._setStage(95, "Starting Silicon runtime");
                this._setStage(100, loader + " loaded successfully");
                this.loading = false;
                this.loaded = true;
                this.fireEvent({EVENT: "ready"});
            } catch (e) {
                this._fail(loader + " loader failed: " + (e && e.message ? e.message : String(e)));
            }
        }

        reloadProject() {
            if (!this.loaded) {
                this._fail("No project is currently loaded");
                return;
            }
            this.loadProject({LOADER:this.loader});
        }

        unloadProject() {
            this.bootToken++;
            this.loading = false;
            this.loadingScreenVisible = false;
            this.loaded = false;
            this.progress = 0;
            this.projectName = "";
            this._setStage(0, "Project unloaded");
            this.fireEvent({EVENT:"unloaded"});
        }

        showLoading() {
            if (this.loadingScreenMode === "off") this.loadingScreenMode = "stage";
            this.loadingScreenVisible = true;
        }

        hideLoading() {
            this.loadingScreenVisible = false;
        }

        loadingVisible() { return this.loadingScreenVisible; }
        getLoader() { return this.loader; }
        isLoaded() { return this.loaded; }

        isLoadingScreenVisible() { return this.loadingScreenVisible; }
        loadingScreenTest() { return this.loadingScreenVisible ? "VISIBLE" : "HIDDEN"; }

        setLoadingMode(args) {
            const mode = String(args.MODE || "Stage").toLowerCase();
            if (mode === "stage" || mode === "built-in" || mode === "builtin") this.loadingScreenMode = "stage";
            else if (mode === "custom") this.loadingScreenMode = "custom";
            else {
                this.loadingScreenMode = "off";
                this.loadingScreenVisible = false;
            }
            this._log("Loading screen mode: " + this.loadingScreenMode);
        }

        getLoadingMode() { return this.loadingScreenMode; }

        setLoadingConfig(args) {
            const key = String(args.KEY || "").trim();
            if (!key) return;
            let value = String(args.VALUE == null ? "" : args.VALUE);
            if (["showProgress","showStatus","showPercent","showLoader","showError"].includes(key)) value = value.toLowerCase() === "true";
            this.loadingScreenConfig[key] = value;
            this._log("Loading config changed: " + key);
        }

        getLoadingConfig(args) {
            const value = this.loadingScreenConfig[String(args.KEY || "")];
            if (value === undefined) return "";
            return typeof value === "boolean" ? String(value) : value;
        }

        loadingConfigExists(args) {
            return Object.prototype.hasOwnProperty.call(this.loadingScreenConfig, String(args.KEY || ""));
        }

        resetLoadingConfig() {
            this.loadingScreenConfig = {
                title:"Silicon", subtitle:"Booting project...", logo:"S",
                background:"#0b1020", foreground:"#ffffff", accent:"#4b8cff",
                progress:"#4b8cff", error:"#ff4b4b", animation:"pulse",
                showProgress:true, showStatus:true, showPercent:true,
                showLoader:true, showError:true
            };
            this._log("Loading screen configuration reset");
        }

        loadingScreenData() {
            return JSON.stringify({
                mode:this.loadingScreenMode,
                visible:this.loadingScreenVisible,
                title:this.loadingScreenConfig.title,
                subtitle:this.loadingScreenConfig.subtitle,
                logo:this.loadingScreenConfig.logo,
                background:this.loadingScreenConfig.background,
                foreground:this.loadingScreenConfig.foreground,
                accent:this.loadingScreenConfig.accent,
                progressColor:this.loadingScreenConfig.progress,
                errorColor:this.loadingScreenConfig.error,
                animation:this.loadingScreenConfig.animation,
                progress:Math.round(this.progress),
                status:this.loadingStatus,
                loader:this.loader,
                error:this.error,
                showProgress:this.loadingScreenConfig.showProgress,
                showStatus:this.loadingScreenConfig.showStatus,
                showPercent:this.loadingScreenConfig.showPercent,
                showLoader:this.loadingScreenConfig.showLoader,
                showError:this.loadingScreenConfig.showError
            });
        }

        loadingScreenText(args) {
            const c = this.loadingScreenConfig;
            const barLength = 20;
            const filled = Math.round((this.progress / 100) * barLength);
            const bar = "█".repeat(filled) + "░".repeat(barLength - filled);
            const lines = [];
            lines.push("Silicon");
            if (c.subtitle) lines.push(String(c.subtitle));
            if (c.showLoader) lines.push("Loader: " + this.loader);
            if (c.showStatus) lines.push(String(this.loadingStatus));
            if (c.showProgress) lines.push("[" + bar + "] " + Math.round(this.progress) + "%");
            if (this.error && c.showError) lines.push("ERROR: " + this.error);
            const lineNumber = Math.floor(Number(args && args.LINE));
            if (Number.isFinite(lineNumber) && lineNumber >= 1) {
                return lines[lineNumber - 1] || "";
            }
            return lines.join("\n");
        }

        setLoadingStatus(args) {
            this.loadingStatus = String(args.TEXT == null ? "" : args.TEXT);
            this.status = this.loadingStatus;
            this._log(this.loadingStatus);
        }

        getLoadingStatus() { return this.loadingStatus; }

        setProgress(args) {
            const value = Number(args.NUMBER);
            this.progress = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
        }

        getProgress() { return Math.round(this.progress); }
        loadingScreenFrame() { return Math.floor(Date.now() / 120) % 12; }

        setLoaderConfig(args) {
            const key = String(args.KEY || "").trim();
            if (!key) return;
            this.loaderConfig[key] = String(args.VALUE == null ? "" : args.VALUE);
            this._log("Loader config changed: " + key);
        }

        getLoaderConfig(args) {
            const key = String(args.KEY || "");
            return Object.prototype.hasOwnProperty.call(this.loaderConfig,key) ? this.loaderConfig[key] : "";
        }

        loaderConfigExists(args) { return Object.prototype.hasOwnProperty.call(this.loaderConfig,String(args.KEY || "")); }
        clearLoaderConfig() { this.loaderConfig = {}; this._log("Loader configuration cleared"); }
        listLoaderConfig() { return Object.keys(this.loaderConfig).join(", "); }

        setConfig(args) {
            const key = String(args.KEY || "").trim();
            if (!key) return;
            this.config[key] = String(args.VALUE == null ? "" : args.VALUE);
            this._log("Config changed: " + key);
        }

        getConfig(args) {
            const key = String(args.KEY || "");
            return Object.prototype.hasOwnProperty.call(this.config,key) ? this.config[key] : "";
        }

        configExists(args) { return Object.prototype.hasOwnProperty.call(this.config,String(args.KEY || "")); }
        clearConfig() { this.config = {}; this._log("Configuration cleared"); }
        listConfig() { return Object.keys(this.config).join(", "); }

        registerModule(args) {
            const name = String(args.NAME || "").trim();
            if (!name) return;
            this.modules[name] = {version:String(args.VERSION || "1.0.0"), loaded:true, loader:this.loader};
            this._log("Module loaded: " + name + " " + this.modules[name].version);
        }

        removeModule(args) {
            const name = String(args.NAME || "").trim();
            if (!name) return;
            delete this.modules[name];
            this._log("Module removed: " + name);
        }

        moduleLoaded(args) { const m = this.modules[String(args.NAME || "").trim()]; return !!(m && m.loaded); }
        moduleVersion(args) { const m = this.modules[String(args.NAME || "").trim()]; return m ? m.version : ""; }
        moduleLoader(args) { const m = this.modules[String(args.NAME || "").trim()]; return m ? m.loader : ""; }
        moduleCount() { return Object.keys(this.modules).length; }
        listModules() { return Object.keys(this.modules).join(", "); }

        getProjectName() { return this.projectName; }
        getProjectVersion() { return this.projectVersion; }
        getProjectId() { return this.projectId; }

        setProjectMetadata(args) {
            const key = String(args.KEY || "").toLowerCase().trim();
            const value = String(args.VALUE == null ? "" : args.VALUE);
            if (key === "name") this.projectName = value;
            else if (key === "version") this.projectVersion = value;
            else if (key === "id") this.projectId = value;
            else this.config["project." + key] = value;
            this._log("Project metadata changed: " + key);
        }

        getProjectMetadata(args) {
            const key = String(args.KEY || "").toLowerCase().trim();
            if (key === "name") return this.projectName;
            if (key === "version") return this.projectVersion;
            if (key === "id") return this.projectId;
            const configKey = "project." + key;
            return Object.prototype.hasOwnProperty.call(this.config,configKey) ? this.config[configKey] : "";
        }

        enableDebug() { this.debug = true; this._log("Debug mode enabled"); }
        disableDebug() { this.debug = false; this._log("Debug mode disabled"); }
        debugMode() { return this.debug; }
        lastError() { return this.error; }

        clearError() {
            this.error = "";
            if (this.loadingStatus.indexOf("ERROR: ") === 0) this.loadingStatus = "Silicon ready";
        }

        siliconLog() { return this.events.join("\n"); }
        getStatus() { return this.status; }

        runtimeState() {
            if (this.error) return "error";
            if (this.loading) return "loading";
            if (this.loaded) return "running";
            return "idle";
        }

        runtimeUptime() {
            return this.startedAt ? Math.max(0,Math.floor((Date.now()-this.startedAt)/1000)) : 0;
        }

        lastEvent() { return this.lastEventText; }

        fireEvent(args) {
            const eventName = String(args.EVENT || "");
            this.lastEventText = eventName;
            this._log("Event: " + eventName);
        }

        resetSilicon() {
            this.bootToken++;
            this.loader = "Fabric";
            this.loaded = false;
            this.loading = false;
            this.loadingScreenVisible = false;
            this.loadingScreenMode = "stage";
            this.resetLoadingConfig();
            this.progress = 0;
            this.loadingStatus = "Silicon ready";
            this.status = "Silicon ready";
            this.error = "";
            this.projectName = "Gandi Project";
            this.projectVersion = "1.0.0";
            this.projectId = "gandi-project";
            this.debug = false;
            this.modules = {};
            this.config = {};
            this.loaderConfig = {};
            this.events = [];
            this.lastEventText = "";
            this.startedAt = 0;
        }
    }

    Scratch.extensions.register(new Silicon());
})(Scratch);
