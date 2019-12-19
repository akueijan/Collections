class ScenesManager extends PIXI.Application{
    
    constructor(options) {
        super(options);
        this.scenes = {};
        this.currentScene = {};
    }

    
    create(eleId) {
        document.getElementById(eleId).appendChild(this.renderer.view);
        return this;
    }

    createScene(id) { 
        if (this.scenes[id]) return undefined;
        var scene = new PIXI.Container();
        scene.name = 'scene'
        this.scenes[id] = scene;
        return scene;
    }

    goToScene(id) {
        if (this.scenes[id]) {
            this.stage.removeChild(this.currentScene);
            this.currentScene = this.scenes[id];
            this.stage.addChild(this.currentScene);
            return true;
        }
        return false;
    }
    getScene(id) {
        if (this.scenes[id]) {
            return this.scenes[id]
        }
    }
}