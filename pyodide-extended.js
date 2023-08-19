class Python {
    constructor(){
        let pyodideReadyPromise = (async function(){
            let py = await loadPyodide();
            return py
        }());

    this.pyodide = pyodideReadyPromise;

    this.pip = {
        list : [],

        loaded : Promise.resolve(),

        micropip : (async () => {
            let pyodide = await pyodideReadyPromise;
            await pyodide.loadPackage('micropip');
            let micropip = pyodide.pyimport('micropip');
            return micropip
        })(),

        async install(module_name){
            this.loaded = new Promise(async (resolve) => {
                let pyodide = await pyodideReadyPromise;
                let micropip = await this.micropip;
                await micropip.install(module_name);
                this.list.push(module_name);
                resolve();
            })

            },

        async requirements(){
            this.loaded = new Promise(async (resolve) => {
                let pyodide = await pyodideReadyPromise;
                let micropip = await this.micropip;
                for(var i=0; i<arguments.length; i++){
                    await micropip.install(arguments[i]);
                    this.list.push(arguments[i]);
                };
                resolve();
            })

        },
    };

    this.package = {

        list : [],

        loaded : Promise.resolve(),

        async install(module_name){
            this.loaded = new Promise(async (resolve) => {
                let pyodide = await pyodideReadyPromise;
                await pyodide.loadPackage(module_name);
                this.list.push(module_name);
                resolve();
            })

            } 
        };

};
    
    async run(code){
        await this.pip.loaded;
        await this.package.loaded;
        let pyodide = await this.pyodide;
        return pyodide.runPython(code);
    
    };

    async runasync(code){
        await this.pip.loaded;
        await this.package.loaded;
        let pyodide = await this.pyodide;
        return this.pyodide.runPythonAsync(code);
    };

    async src(url){
        await this.pip.loaded;
        await this.package.loaded;
        let pyodide = await this.pyodide;
        return pyodide.runPython(await ( async () => {
            await fetch(url)
                .then((res) => {return res.text()})
        })());
    }
};