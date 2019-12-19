class Tools{
    
    constructor(options) {
        this.debug = options.debug;
        this.guiData = {}
        this.gui = new dat.GUI();
        if (production) {
            this.gui.hide();
        } else {
            this.gui.hide();
        }
    }
    addGui(name, obj) {
        this.guiData[name] = obj.setVal;
        // //type: number, color, button, select, checkbox
        switch (obj.type) {
            case 'number':
                var tmpGui = this.gui.add(this.guiData, name, obj.min, obj.max);
                break;
            case 'select':
                var tmpGui = this.gui.add(this.guiData, name, obj.select);
                break;
            default:
                var tmpGui = this.gui.add(this.guiData, name);
                break;
        }
        if (obj.changeFn) {
            console.log(tmpGui)
            tmpGui.onChange(obj.changeFn);
        }
    }

    objCenter(obj, container, type) {
        // type: x => 水平, y => 垂直
        let centerX = (container.width - obj.width) / 2;
        let centerY = (container.height - obj.height) / 2;
        switch (type) {
            case 'x':
                obj.x = centerX;
                break;
            case 'y':
                obj.y = centerY;
                break;
            default:
                obj.x = centerX;
                obj.y = centerY;
        }
    }

    graphic(opt) {
        var graphice = new PIXI.Graphics();
        graphice.beginFill(opt.color);
        graphice.drawRect(opt.x || 0, opt.y || 0, opt.width, opt.height);
        return graphice
    }

    button(opt){
        var button = new PIXI.Container();
        var tmp;
        if(opt.src){
            tmp = new PIXI.Sprite.from(opt.src);
            tmp.name = 'btnObj';
        } else {
            tmp = this.graphic({
                color:opt.graphic.color,
                x: opt.graphic.x,
                y: opt.graphic.y,
                width: opt.graphic.width,
                height: opt.graphic.height
            })
        }
        button.on('pointerdown', async () => {
            if (this.doing) return false;
            this.doing = true;
            await opt.fn();
            this.doing = false;
        });
        button.addChild(tmp);
        button.interactive = true;
        return button
    }

}