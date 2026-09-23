class Silicon {
    constructor(runtime) {
        this.runtime = runtime;

        this.loader = "Fabric";
        this.loaded = false;
        this.projectName = "";
        this.loaderVersion = "1.0.0";
        this.status = "Not loaded";
    }

    getInfo() {
        return {
            id: "silicon",
            name: "Silicon",
            color1: "#4b8cff",
            color2: "#3266c7",
            color3: "#244c99",

            blocks: [
                {
                    opcode: "loadProject",
                    blockType: "command",
                    text: "load project with [LOADER]",
                    arguments: {
                        LOADER: {
                            type: "string",
                            menu: "loaders",
                            defaultValue: "Fabric"
                        }
                    }
                },

                {
                    opcode: "setLoader",
                    blockType: "command",
                    text: "set loader to [LOADER]",
                    arguments: {
                        LOADER: {
                            type: "string",
                            menu: "loaders",
                            defaultValue: "Fabric"
                        }
                    }
                },

                {
                    opcode: "reloadProject",
                    blockType: "command",
                    text: "reload project"
                },

                {
                    opcode: "unloadProject",
                    blockType: "command",
                    text: "unload project"
                },

                {
                    opcode: "isLoaded",
                    blockType: "Boolean",
                    text: "project loaded?"
                },

                {
                    opcode: "getLoader",
                    blockType: "reporter",
                    text: "current loader"
                },

                {
                    opcode: "getStatus",
                    blockType: "reporter",
                    text: "Silicon status"
                },

                {
                    opcode: "getLoaderVersion",
                    blockType: "reporter",
                    text: "loader version"
                },

                {
                    opcode: "getProjectName",
                    blockType: "reporter",
                    text: "loaded project name"
                },

                {
                    opcode: "loaderSupports",
                    blockType: "Boolean",
                    text: "[LOADER] supported?"
                }
            ],

            menus: {
                loaders: {
                    acceptReporters: true,
                    items: [
                        "Fabric",
                        "NeoVirus"
                    ]
                }
            }
        };
    }

    setLoader(args) {
        const loader = String(args.LOADER);

        if (!this.loaderSupports({ LOADER: loader })) {
            this.status = "Unknown loader";
            return;
        }

        this.loader = loader;
        this.loaded = false;
        this.status = loader + " selected";
    }

    loadProject(args) {
        const loader = String(args.LOADER);

        if (!this.loaderSupports({ LOADER: loader })) {
            this.loaded = false;
            this.status = "Unknown loader";
            return;
        }

        this.loader = loader;

        // Try to obtain the project name from the VM.
        try {
            if (this.runtime && this.runtime.getTargetForStage) {
                const stage = this.runtime.getTargetForStage();

                if (stage && stage.getName) {
                    this.projectName = stage.getName();
                }
            }
        } catch (e) {
            this.projectName = "";
        }

        if (!this.projectName) {
            this.projectName = "Gandi Project";
        }

        this.loaded = true;
        this.status = "Loaded with " + this.loader;
    }

    reloadProject() {
        if (!this.loaded) {
            this.status = "No project loaded";
            return;
        }

        const currentLoader = this.loader;

        this.loaded = false;
        this.status = "Reloading with " + currentLoader + "...";

        // Small asynchronous delay so the reload behaves like a loader.
        setTimeout(() => {
            this.loaded = true;
            this.status = "Loaded with " + currentLoader;
        }, 100);
    }

    unloadProject() {
        this.loaded = false;
        this.status = "Project unloaded";
        this.projectName = "";
    }

    isLoaded() {
        return this.loaded;
    }

    getLoader() {
        return this.loader;
    }

    getStatus() {
        return this.status;
    }

    getLoaderVersion() {
        return this.loaderVersion;
    }

    getProjectName() {
        return this.projectName;
    }

    loaderSupports(args) {
        const loader = String(args.LOADER).toLowerCase();

        return (
            loader === "fabric" ||
            loader === "neovirus"
        );
    }
}

(function() {
    const extension = new Silicon(runtime);
    runtime.registerExtension(extension);
})();
