(function (Scratch) {
    "use strict";

    class Silicon {
        constructor() {
            this.loader = "Fabric";
            this.loaded = false;
            this.projectName = "Gandi Project";
            this.loaderVersion = "1.0.0";
            this.status = "Silicon ready";
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
                        blockType: Scratch.BlockType.COMMAND,
                        text: "load project with [LOADER]",
                        arguments: {
                            LOADER: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "loaders",
                                defaultValue: "Fabric"
                            }
                        }
                    },
                    {
                        opcode: "setLoader",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set loader to [LOADER]",
                        arguments: {
                            LOADER: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "loaders",
                                defaultValue: "Fabric"
                            }
                        }
                    },
                    {
                        opcode: "reloadProject",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "reload project"
                    },
                    {
                        opcode: "unloadProject",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "unload project"
                    },
                    {
                        opcode: "isLoaded",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "project loaded?"
                    },
                    {
                        opcode: "getLoader",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "current loader"
                    },
                    {
                        opcode: "getStatus",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Silicon status"
                    },
                    {
                        opcode: "getLoaderVersion",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "loader version"
                    },
                    {
                        opcode: "getProjectName",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "loaded project name"
                    },
                    {
                        opcode: "loaderSupported",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[LOADER] supported?",
                        arguments: {
                            LOADER: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "loaders",
                                defaultValue: "Fabric"
                            }
                        }
                    }
                ],

                menus: {
                    loaders: {
                        acceptReporters: true,
                        items: ["Fabric", "NeoVirus"]
                    }
                }
            };
        }

        setLoader(args) {
            const loader = String(args.LOADER);

            if (!this.loaderSupported({ LOADER: loader })) {
                this.status = "Unknown loader";
                return;
            }

            this.loader = loader;
            this.loaded = false;
            this.status = loader + " selected";
        }

        loadProject(args) {
            const loader = String(args.LOADER);

            if (!this.loaderSupported({ LOADER: loader })) {
                this.loaded = false;
                this.status = "Unknown loader";
                return;
            }

            this.loader = loader;
            this.loaded = true;
            this.projectName = "Gandi Project";
            this.status = "Loaded with " + loader;
        }

        reloadProject() {
            if (!this.loaded) {
                this.status = "No project loaded";
                return;
            }

            const loader = this.loader;
            this.loaded = false;
            this.status = "Reloading with " + loader + "...";

            setTimeout(() => {
                this.loaded = true;
                this.status = "Loaded with " + loader;
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

        loaderSupported(args) {
            const loader = String(args.LOADER).toLowerCase();
            return loader === "fabric" || loader === "neovirus";
        }
    }

    Scratch.extensions.register(new Silicon());
})(Scratch);
