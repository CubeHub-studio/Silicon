(function (Scratch) {
    "use strict";

    class Silicon {
        constructor() {
            this.loader = "Fabric";
            this.loaded = false;
            this.loading = false;
            this.loadingVisible = false;
            this.progress = 0;
            this.loadingStatus = "Silicon ready";
            this.status = "Silicon ready";
            this.error = "";
            this.projectName = "Gandi Project";
            this.projectVersion = "1.0.0";
            this.projectId = "gandi-project";
            this.loaderVersion = "1.0.0";
            this.debug = false;
            this.modules = {};
            this.config = {};
            this.events = [];
            this.lastEvent = "";
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
                    { opcode: "loadProject", blockType: Scratch.BlockType.COMMAND, text: "load project with [LOADER]", arguments: { LOADER: { type: Scratch.ArgumentType.STRING, menu: "loaders", defaultValue: "Fabric" } } },
                    { opcode: "setLoader", blockType: Scratch.BlockType.COMMAND, text: "set loader to [LOADER]", arguments: { LOADER: { type: Scratch.ArgumentType.STRING, menu: "loaders", defaultValue: "Fabric" } } },
                    { opcode: "reloadProject", blockType: Scratch.BlockType.COMMAND, text: "reload project" },
                    { opcode: "unloadProject", blockType: Scratch.BlockType.COMMAND, text: "unload project" },

                    { opcode: "showLoading", blockType: Scratch.BlockType.COMMAND, text: "show Silicon loading screen" },
                    { opcode: "hideLoading", blockType: Scratch.BlockType.COMMAND, text: "hide Silicon loading screen" },
                    { opcode: "loadingVisible", blockType: Scratch.BlockType.BOOLEAN, text: "loading screen visible?" },
                    { opcode: "getProgress", blockType: Scratch.BlockType.REPORTER, text: "loading progress" },
                    { opcode: "getLoadingStatus", blockType: Scratch.BlockType.REPORTER, text: "loading status" },
                    { opcode: "setLoadingStatus", blockType: Scratch.BlockType.COMMAND, text: "set loading status to [TEXT]", arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Initializing..." } } },
                    { opcode: "setProgress", blockType: Scratch.BlockType.COMMAND, text: "set loading progress to [NUMBER] %", arguments: { NUMBER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

                    { opcode: "isLoaded", blockType: Scratch.BlockType.BOOLEAN, text: "project loaded?" },
                    { opcode: "getLoader", blockType: Scratch.BlockType.REPORTER, text: "current loader" },
                    { opcode: "getStatus", blockType: Scratch.BlockType.REPORTER, text: "Silicon status" },
                    { opcode: "getLoaderVersion", blockType: Scratch.BlockType.REPORTER, text: "loader version" },
                    { opcode: "getProjectName", blockType: Scratch.BlockType.REPORTER, text: "loaded project name" },
                    { opcode: "getProjectVersion", blockType: Scratch.BlockType.REPORTER, text: "project version" },
                    { opcode: "getProjectId", blockType: Scratch.BlockType.REPORTER, text: "project ID" },
                    { opcode: "loaderSupported", blockType: Scratch.BlockType.BOOLEAN, text: "[LOADER] supported?", arguments: { LOADER: { type: Scratch.ArgumentType.STRING, menu: "loaders", defaultValue: "Fabric" } } },

                    { opcode: "registerModule", blockType: Scratch.BlockType.COMMAND, text: "register module [NAME] version [VERSION]", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" }, VERSION: { type: Scratch.ArgumentType.STRING, defaultValue: "1.0.0" } } },
                    { opcode: "removeModule", blockType: Scratch.BlockType.COMMAND, text: "remove module [NAME]", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleLoaded", blockType: Scratch.BlockType.BOOLEAN, text: "module [NAME] loaded?", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleVersion", blockType: Scratch.BlockType.REPORTER, text: "module [NAME] version", arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "Example" } } },
                    { opcode: "moduleCount", blockType: Scratch.BlockType.REPORTER, text: "number of modules" },
                    { opcode: "listModules", blockType: Scratch.BlockType.REPORTER, text: "list modules" },

                    { opcode: "setConfig", blockType: Scratch.BlockType.COMMAND, text: "set config [KEY] to [VALUE]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "mode" }, VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "normal" } } },
                    { opcode: "getConfig", blockType: Scratch.BlockType.REPORTER, text: "config [KEY]", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "mode" } } },
                    { opcode: "configExists", blockType: Scratch.BlockType.BOOLEAN, text: "config [KEY] exists?", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "mode" } } },
                    { opcode: "clearConfig", blockType: Scratch.BlockType.COMMAND, text: "clear configuration" },

                    { opcode: "enableDebug", blockType: Scratch.BlockType.COMMAND, text: "enable debug mode" },
                    { opcode: "disableDebug", blockType: Scratch.BlockType.COMMAND, text: "disable debug mode" },
                    { opcode: "debugMode", blockType: Scratch.BlockType.BOOLEAN, text: "debug mode?" },
                    { opcode: "lastError", blockType: Scratch.BlockType.REPORTER, text: "last error" },
                    { opcode: "clearError", blockType: Scratch.BlockType.COMMAND, text: "clear error" },
                    { opcode: "siliconLog", blockType: Scratch.BlockType.REPORTER, text: "Silicon log" },

                    { opcode: "runtimeState", blockType: Scratch.BlockType.REPORTER, text: "runtime state" },
                    { opcode: "runtimeUptime", blockType: Scratch.BlockType.REPORTER, text: "runtime uptime" },
                    { opcode: "lastEvent", blockType: Scratch.BlockType.REPORTER, text: "last event" },
                    { opcode: "fireEvent", blockType: Scratch.BlockType.COMMAND, text: "fire event [EVENT]", arguments: { EVENT: { type: Scratch.ArgumentType.STRING, defaultValue: "ready" } } },
                    { opcode: "resetSilicon", blockType: Scratch.BlockType.COMMAND, text: "reset Silicon" }
                ],
                menus: {
                    loaders: { acceptReporters: true, items: ["Fabric", "NeoVirus"] }
                }
            };
        }

        _log(message) {
            const entry = "[" + new Date().toLocaleTimeString() + "] " + message;
            this.events.push(entry);
            if (this.events.length > 30) this.events.shift();
            this.lastEvent = message;
        }

        _setStage(progress, status) {
            this.progress = Math.max(0, Math.min(100, progress));
            this.loadingStatus = status;
            this.status = status;
            this._log(status);
        }

        _loaderMessages(loader) {
            if (loader.toLowerCase() === "fabric") {
                return [
                    ["Starting Fabric Loader", 8],
                    ["Checking Fabric environment", 18],
                    ["Loading Fabric API", 30],
                    ["Resolving Fabric modules", 44],
                    ["Initializing Fabric runtime", 60]
                ];
            }
            return [
                ["Starting NeoVirus Loader", 8],
                ["Scanning NeoVirus environment", 18],
                ["Loading NeoVirus core", 30],
                ["Resolving NeoVirus modules", 44],
                ["Initializing NeoVirus runtime", 60]
            ];
        }

        setLoader(args) {
            const loader = String(args.LOADER || "Fabric");
            if (!this.loaderSupported({ LOADER: loader })) {
                this._fail("Unsupported loader: " + loader);
                return;
            }
            if (this.loading) this._fail("Cannot change loader while Silicon is loading");
            this.loader = loader;
            this.loaded = false;
            this._setStage(0, loader + " selected");
        }

        loadProject(args) {
            const loader = String(args.LOADER || this.loader);
            if (!this.loaderSupported({ LOADER: loader })) {
                this._fail("Unsupported loader: " + loader);
                return;
            }

            this.bootToken++;
            const token = this.bootToken;
            this.loader = loader;
            this.loaded = false;
            this.loading = true;
            this.loadingVisible = true;
            this.error = "";
            this.progress = 0;
            this.startedAt = Date.now();
            this._setStage(0, "Silicon Bootloader starting...");

            const stages = [
                [450, 5, "Initializing Silicon core"],
                [850, 10, "Detecting " + loader + " Loader"],
                ...this._loaderMessages(loader).map(x => [550, x[1], x[0]]),
                [650, 68, "Loading project metadata"],
                [500, 76, "Initializing project modules"],
                [500, 86, "Starting Silicon runtime"],
                [550, 94, "Finalizing startup"],
                [450, 100, "Silicon startup complete"]
            ];

            let i = 0;
            const next = () => {
                if (token !== this.bootToken) return;
                if (i >= stages.length) {
                    this.loading = false;
                    this.loaded = true;
                    this.projectName = "Gandi Project";
                    this._setStage(100, loader + " loaded successfully");
                    setTimeout(() => {
                        if (token === this.bootToken) this.loadingVisible = false;
                    }, 900);
                    return;
                }
                const [delay, progress, status] = stages[i++];
                this._setStage(progress, status);
                setTimeout(next, delay);
            };
            next();
        }

        reloadProject() {
            if (!this.loaded) {
                this._fail("No project is currently loaded");
                return;
            }
            this.loadProject({ LOADER: this.loader });
        }

        unloadProject() {
            this.bootToken++;
            this.loading = false;
            this.loadingVisible = false;
            this.loaded = false;
            this.progress = 0;
            this.projectName = "";
            this._setStage(0, "Project unloaded");
        }

        _fail(message) {
            this.bootToken++;
            this.loading = false;
            this.loaded = false;
            this.loadingVisible = true;
            this.error = message;
            this.status = "Silicon error";
            this.loadingStatus = "ERROR: " + message;
            this._log("ERROR: " + message);
        }

        showLoading() { this.loadingVisible = true; }
        hideLoading() { this.loadingVisible = false; }
        loadingVisible() { return this.loadingVisible; }
        getProgress() { return Math.round(this.progress); }
        getLoadingStatus() { return this.loadingStatus; }
        setLoadingStatus(args) { this.loadingStatus = String(args.TEXT); this.status = this.loadingStatus; this._log(this.loadingStatus); }
        setProgress(args) { this.progress = Math.max(0, Math.min(100, Number(args.NUMBER) || 0)); }

        isLoaded() { return this.loaded; }
        getLoader() { return this.loader; }
        getStatus() { return this.status; }
        getLoaderVersion() { return this.loaderVersion; }
        getProjectName() { return this.projectName; }
        getProjectVersion() { return this.projectVersion; }
        getProjectId() { return this.projectId; }

        loaderSupported(args) {
            const loader = String(args.LOADER || "").toLowerCase();
            return loader === "fabric" || loader === "neovirus";
        }

        registerModule(args) {
            const name = String(args.NAME || "").trim();
            const version = String(args.VERSION || "1.0.0");
            if (!name) return;
            this.modules[name] = { version: version, loaded: true, loader: this.loader };
            this._log("Module loaded: " + name + " " + version);
        }

        removeModule(args) {
            const name = String(args.NAME || "").trim();
            delete this.modules[name];
            this._log("Module removed: " + name);
        }

        moduleLoaded(args) {
            const m = this.modules[String(args.NAME || "").trim()];
            return !!(m && m.loaded);
        }

        moduleVersion(args) {
            const m = this.modules[String(args.NAME || "").trim()];
            return m ? m.version : "";
        }

        moduleCount() { return Object.keys(this.modules).length; }
        listModules() { return Object.keys(this.modules).join(", "); }

        setConfig(args) {
            this.config[String(args.KEY)] = String(args.VALUE);
            this._log("Config changed: " + args.KEY);
        }

        getConfig(args) { return Object.prototype.hasOwnProperty.call(this.config, String(args.KEY)) ? this.config[String(args.KEY)] : ""; }
        configExists(args) { return Object.prototype.hasOwnProperty.call(this.config, String(args.KEY)); }
        clearConfig() { this.config = {}; this._log("Configuration cleared"); }

        enableDebug() { this.debug = true; this._log("Debug mode enabled"); }
        disableDebug() { this.debug = false; this._log("Debug mode disabled"); }
        debugMode() { return this.debug; }
        lastError() { return this.error; }
        clearError() { this.error = ""; }
        siliconLog() { return this.events.join("\n"); }

        runtimeState() {
            if (this.error) return "error";
            if (this.loading) return "loading";
            if (this.loaded) return "running";
            return "idle";
        }

        runtimeUptime() {
            return this.startedAt ? Math.max(0, Math.floor((Date.now() - this.startedAt) / 1000)) : 0;
        }

        lastEvent() { return this.lastEvent; }
        fireEvent(args) { this.lastEvent = String(args.EVENT); this._log("Event: " + this.lastEvent); }

        resetSilicon() {
            this.bootToken++;
            this.loader = "Fabric";
            this.loaded = false;
            this.loading = false;
            this.loadingVisible = false;
            this.progress = 0;
            this.loadingStatus = "Silicon ready";
            this.status = "Silicon ready";
            this.error = "";
            this.modules = {};
            this.config = {};
            this.events = [];
            this.lastEvent = "";
            this.startedAt = 0;
        }
    }

    Scratch.extensions.register(new Silicon());
})(Scratch);
