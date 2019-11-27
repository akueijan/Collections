"use strict";var WIDTH=800,HEIGHT=600,app=new PIXI.Application(WIDTH,HEIGHT);document.body.appendChild(app.view);var stage=app.stage=new PIXI.display.Stage,bg=new PIXI.extras.TilingSprite(PIXI.Texture.fromImage("required/assets/p2.jpeg"),WIDTH,HEIGHT);bg.tint=8421504,stage.addChild(bg);var diffuseLayer=new PIXI.display.Layer(PIXI.lights.diffuseGroup);stage.addChild(diffuseLayer);var diffuseBlackSprite=new PIXI.Sprite(diffuseLayer.getRenderTexture());diffuseBlackSprite.tint=0,stage.addChild(diffuseBlackSprite),stage.addChild(new PIXI.display.Layer(PIXI.lights.normalGroup)),stage.addChild(new PIXI.display.Layer(PIXI.lights.lightGroup));var sortGroup=new PIXI.display.Group(0,!0);sortGroup.on("sort",function(t){t.zOrder=-t.y}),sortGroup.sortPriority=1,stage.addChild(new PIXI.display.Layer(sortGroup));var dragGroup=new PIXI.display.Group(0,!0);dragGroup.sortPriority=1,stage.addChild(new PIXI.display.Layer(dragGroup)),stage.addChild(new PIXI.lights.AmbientLight(null,.6));var light=new PIXI.lights.PointLight(16777215,1);light.position.set(525,160),stage.addChild(light),app.ticker.add(function(){light.position.copy(app.renderer.plugins.interaction.mouse.global)});var lightLoader=new PIXI.loaders.Loader;function onAssetsLoaded(t,a){for(var r=0;r<8;r+=2)stage.addChild(createBlock(100+50*r,100+30*r));for(r=1;r<8;r+=2)stage.addChild(createBlock(100+50*r,100+30*r))}function createBlock(t,a){var r=new PIXI.Container;r.parentGroup=sortGroup,r.position.set(t,a);var e=new PIXI.Sprite(lightLoader.resources.block_diffuse.texture);e.parentGroup=PIXI.lights.diffuseGroup,e.anchor.set(.5);var i=new PIXI.Sprite(lightLoader.resources.block_normal.texture);return i.parentGroup=PIXI.lights.normalGroup,i.anchor.set(.5),r.addChild(e),r.addChild(i),subscribe(r),r}function subscribe(t){t.interactive=!0,t.on("mousedown",onDragStart).on("touchstart",onDragStart).on("mouseup",onDragEnd).on("mouseupoutside",onDragEnd).on("touchend",onDragEnd).on("touchendoutside",onDragEnd).on("mousemove",onDragMove).on("touchmove",onDragMove)}function onDragStart(t){this.dragging||(this.data=t.data,this.oldGroup=this.parentGroup,this.parentGroup=dragGroup,this.dragging=!0,this.scale.x*=1.1,this.scale.y*=1.1,this.dragPoint=t.data.getLocalPosition(this.parent),this.dragPoint.x-=this.x,this.dragPoint.y-=this.y)}function onDragEnd(){this.dragging&&(this.dragging=!1,this.parentGroup=this.oldGroup,this.scale.x/=1.1,this.scale.y/=1.1,this.data=null)}function onDragMove(){if(this.dragging){var t=this.data.getLocalPosition(this.parent);this.x=t.x-this.dragPoint.x,this.y=t.y-this.dragPoint.y}}lightLoader.baseUrl="https://cdn.rawgit.com/pixijs/pixi-lights/b7fd7924fdf4e6a6b913ff29161402e7b36f0c0f/",lightLoader.add("block_diffuse","test/block.png").add("block_normal","test/blockNormalMap.png").load(onAssetsLoaded);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4Mi5qcyJdLCJuYW1lcyI6WyJXSURUSCIsIkhFSUdIVCIsImFwcCIsIlBJWEkiLCJBcHBsaWNhdGlvbiIsImRvY3VtZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwidmlldyIsInN0YWdlIiwiVGlsaW5nU3ByaXRlIiwiZGlzcGxheSIsIlN0YWdlIiwiZnJvbUltYWdlIiwiYmciLCJ0aW50IiwiYWRkQ2hpbGQiLCJMYXllciIsImxpZ2h0cyIsImRpZmZ1c2VHcm91cCIsImRpZmZ1c2VMYXllciIsImRpZmZ1c2VCbGFja1Nwcml0ZSIsIlNwcml0ZSIsImdldFJlbmRlclRleHR1cmUiLCJub3JtYWxHcm91cCIsImxpZ2h0R3JvdXAiLCJzcHJpdGUiLCJzb3J0R3JvdXAiLCJzb3J0UHJpb3JpdHkiLCJHcm91cCIsImRyYWdHcm91cCIsIkFtYmllbnRMaWdodCIsImxpZ2h0IiwiUG9pbnRMaWdodCIsInBvc2l0aW9uIiwic2V0IiwiY29weSIsInJlbmRlcmVyIiwicGx1Z2lucyIsImludGVyYWN0aW9uIiwibW91c2UiLCJnbG9iYWwiLCJvbkFzc2V0c0xvYWRlZCIsImxvYWRlciIsInJlcyIsImkiLCJjcmVhdGVCbG9jayIsIngiLCJ5IiwiY29udGFpbmVyIiwiQ29udGFpbmVyIiwicGFyZW50R3JvdXAiLCJkaWZmdXNlU3ByaXRlIiwibGlnaHRMb2FkZXIiLCJyZXNvdXJjZXMiLCJibG9ja19kaWZmdXNlIiwidGV4dHVyZSIsImFuY2hvciIsIm5vcm1hbFNwcml0ZSIsImJsb2NrX25vcm1hbCIsInN1YnNjcmliZSIsIm9iaiIsImludGVyYWN0aXZlIiwib24iLCJvbkRyYWdTdGFydCIsIm9uRHJhZ0VuZCIsIm9uRHJhZ01vdmUiLCJldmVudCIsInRoaXMiLCJzY2FsZSIsImRyYWdQb2ludCIsImRyYWdnaW5nIiwiZGF0YSIsImdldExvY2FsUG9zaXRpb24iLCJwYXJlbnQiLCJvbGRHcm91cCIsIm5ld1Bvc2l0aW9uIiwiYmFzZVVybCJdLCJtYXBwaW5n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LFdBQWVFLFdBQ2hCRixHQUFBLGtCQUFBRSxXQUNBRixHQUFBLFlBQWdCRyxZQUNoQkgsR0FBQSxZQUFBRyxZQUdBLFNBQUFGLFlBQUFHLEdBQ0FDLEtBQUtDLFdBQ0xELEtBQUtFLEtBQUFBLEVBQVlILEtBQ2pCQyxLQUFLRSxTQUFMRixLQUFvQmpCLFlBQ3BCaUIsS0FBS0UsWUFBTHhDLFVBQ0hzQyxLQUFBRyxVQUFBLEVBTEdILEtBQUtDLE1BQU10QixHQUFLLElBUXhCcUIsS0FBU0gsTUFBVGpCLEdBQXFCLElBQ2JvQixLQUFLRyxVQUFVSixFQUFBSyxLQUFBQyxpQkFBQUwsS0FBQU0sUUFDZk4sS0FBS0csVUFBTHhCLEdBQWdCcUIsS0FBaEJyQixFQUNBcUIsS0FBS2pCLFVBQUFBLEdBQWNpQixLQUFLTyxHQUl4QixTQUFBVixZQUNIRyxLQUFBRyxXQUNKSCxLQUFBRyxVQUFBLEVBTk9ILEtBQUtqQixZQUFjaUIsS0FBS08sU0FRaENQLEtBQVNGLE1BQVRuQixHQUFzQixJQUNkcUIsS0FBS0csTUFBQUEsR0FBVSxJQUVmSCxLQUFLckIsS0FBSTZCLE1BSGpCLFNBQVNWLGFBQ0wsR0FBSUUsS0FBS0csU0FBVSxDQUNmLElBQUlLLEVBQWNSLEtBQUtJLEtBQUtDLGlCQUFpQkwsS0FBS00sUUFDbEROLEtBQUtyQixFQUFJNkIsRUFBWTdCLEVBQUlxQixLQUFLRSxVQUFVdkIsRUFDeENxQixLQUFLcEIsRUFBSTRCLEVBQVk1QixFQUFJb0IsS0FBS0UsVUFBVXRCLEdBaEYvQ0ssWUFGRHdCLFFBQUEsc0ZBTUF4QixZQUZJQSxJQUFBQSxnQkFBa0JsRCxrQkFDdEJrRCxJQUFBQSxlQUFzQiwyQkFDdEJBLEtBQUFBIiwiZmlsZSI6ImluZGV4Mi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBXSURUSCA9IDgwMCwgSEVJR0hUID0gNjAwO1xyXG5cclxuLy8gTEFZRVJTIHBsdWdpbiBpcyBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vcGl4aWpzL3BpeGktZGlzcGxheS90cmVlL2xheWVyc1xyXG4vLyBMSUdIVFMgcGx1Z2luIGlzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9waXhpanMvcGl4aS1saWdodHMvdHJlZS92NC54XHJcblxyXG52YXIgYXBwID0gbmV3IFBJWEkuQXBwbGljYXRpb24oV0lEVEgsIEhFSUdIVCk7XHJcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYXBwLnZpZXcpO1xyXG5cclxudmFyIHN0YWdlID0gYXBwLnN0YWdlID0gbmV3IFBJWEkuZGlzcGxheS5TdGFnZSgpO1xyXG5cclxuLy8gYmcgaXMgZmlyc3QsIGl0cyBub3QgbGlnaHRlZFxyXG52YXIgYmcgPSBuZXcgUElYSS5leHRyYXMuVGlsaW5nU3ByaXRlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoJ3JlcXVpcmVkL2Fzc2V0cy9wMi5qcGVnJyksIFdJRFRILCBIRUlHSFQpO1xyXG5iZy50aW50ID0gMHg4MDgwODA7XHJcbnN0YWdlLmFkZENoaWxkKGJnKTtcclxuXHJcbi8vIHB1dCBhbGwgbGF5ZXJzIGZvciBkZWZlcnJlZCByZW5kZXJpbmcgb2Ygbm9ybWFsc1xyXG52YXIgZGlmZnVzZUxheWVyID0gbmV3IFBJWEkuZGlzcGxheS5MYXllcihQSVhJLmxpZ2h0cy5kaWZmdXNlR3JvdXApO1xyXG5zdGFnZS5hZGRDaGlsZChkaWZmdXNlTGF5ZXIpO1xyXG52YXIgZGlmZnVzZUJsYWNrU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKGRpZmZ1c2VMYXllci5nZXRSZW5kZXJUZXh0dXJlKCkpO1xyXG5kaWZmdXNlQmxhY2tTcHJpdGUudGludCA9IDA7XHJcbi8vIHdpdGhvdXQgdGhlIGJsYWNrIHNwcml0ZSwgbGlnaHRlZCBlbGVtZW50cyB3aWxsIGJlIHRyYW5zcGFyZW50IHRvIGJhY2tncm91bmQuIFRyeSByZW1vdmUgdGhhdCBsaW5lXHJcbnN0YWdlLmFkZENoaWxkKGRpZmZ1c2VCbGFja1Nwcml0ZSk7XHJcbnN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoUElYSS5saWdodHMubm9ybWFsR3JvdXApKTtcclxuc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihQSVhJLmxpZ2h0cy5saWdodEdyb3VwKSk7XHJcblxyXG52YXIgc29ydEdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgwLCB0cnVlKTtcclxuc29ydEdyb3VwLm9uKCdzb3J0JywgZnVuY3Rpb24gKHNwcml0ZSkge1xyXG4gICAgLy9ncmVlbiBidW5uaWVzIGdvIGRvd25cclxuICAgIHNwcml0ZS56T3JkZXIgPSAtc3ByaXRlLnk7XHJcbn0pO1xyXG4vLyB0aGUgZ3JvdXAgd2lsbCBwcm9jZXNzIGFsbCBvZiBpdHMgbWVtYmVycyBjaGlsZHJlbiBhZnRlciB0aGUgc29ydFxyXG5zb3J0R3JvdXAuc29ydFByaW9yaXR5ID0gMTtcclxuc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzb3J0R3JvdXApKTtcclxuXHJcbnZhciBkcmFnR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDAsIHRydWUpO1xyXG4vLyBkcmFnZ2VkIG9iamVjdHMgaGFzIHRvIHByb2Nlc3NlZCBhZnRlciBzb3J0ZWQsIHNvIHdlIG5lZWQgYSBmbGFnIGhlcmUgdG9vXHJcbmRyYWdHcm91cC5zb3J0UHJpb3JpdHkgPSAxO1xyXG5zdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKGRyYWdHcm91cCkpO1xyXG5cclxuLy8gTElHSFQgYW5kIGl0cyBtb3ZlbWVudFxyXG5zdGFnZS5hZGRDaGlsZChuZXcgUElYSS5saWdodHMuQW1iaWVudExpZ2h0KG51bGwsIDAuNikpO1xyXG52YXIgbGlnaHQgPSBuZXcgUElYSS5saWdodHMuUG9pbnRMaWdodCgweGZmZmZmZiwgMSk7XHJcbmxpZ2h0LnBvc2l0aW9uLnNldCg1MjUsIDE2MCk7XHJcbnN0YWdlLmFkZENoaWxkKGxpZ2h0KTtcclxuYXBwLnRpY2tlci5hZGQoKCkgPT4ge1xyXG4gICAgbGlnaHQucG9zaXRpb24uY29weShhcHAucmVuZGVyZXIucGx1Z2lucy5pbnRlcmFjdGlvbi5tb3VzZS5nbG9iYWwpO1xyXG59KTtcclxuXHJcbnZhciBsaWdodExvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XHJcbmxpZ2h0TG9hZGVyLmJhc2VVcmwgPSAnaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9waXhpanMvcGl4aS1saWdodHMvYjdmZDc5MjRmZGY0ZTZhNmI5MTNmZjI5MTYxNDAyZTdiMzZmMGMwZi8nO1xyXG5saWdodExvYWRlclxyXG4gICAgLmFkZCgnYmxvY2tfZGlmZnVzZScsICd0ZXN0L2Jsb2NrLnBuZycpXHJcbiAgICAuYWRkKCdibG9ja19ub3JtYWwnLCAndGVzdC9ibG9ja05vcm1hbE1hcC5wbmcnKVxyXG4gICAgLmxvYWQob25Bc3NldHNMb2FkZWQpO1xyXG5cclxuZnVuY3Rpb24gb25Bc3NldHNMb2FkZWQobG9hZGVyLCByZXMpIHtcclxuICAgIGZvciAodmFyIGk9MDsgaTw4OyBpKz0yKSB7XHJcbiAgICAgICAgc3RhZ2UuYWRkQ2hpbGQoY3JlYXRlQmxvY2soMTAwICsgaSAqIDUwLCAxMDAgKyBpKjMwKSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpPTE7IGk8ODsgaSs9Mikge1xyXG4gICAgICAgIHN0YWdlLmFkZENoaWxkKGNyZWF0ZUJsb2NrKDEwMCArIGkgKiA1MCwgMTAwICsgaSozMCkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVCbG9jayh4LCB5KSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcbiAgICAvL3dlIG5lZWQgdG8gc29ydCB0aGVtIGJlZm9yZSBjaGlsZHJlbiBnbyB0byByZXNwZWN0aXZlIGxheWVyc1xyXG4gICAgY29udGFpbmVyLnBhcmVudEdyb3VwID0gc29ydEdyb3VwO1xyXG4gICAgY29udGFpbmVyLnBvc2l0aW9uLnNldCh4LCB5KTtcclxuICAgIHZhciBkaWZmdXNlU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKGxpZ2h0TG9hZGVyLnJlc291cmNlcy5ibG9ja19kaWZmdXNlLnRleHR1cmUpO1xyXG4gICAgZGlmZnVzZVNwcml0ZS5wYXJlbnRHcm91cCA9IFBJWEkubGlnaHRzLmRpZmZ1c2VHcm91cDtcclxuICAgIGRpZmZ1c2VTcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgdmFyIG5vcm1hbFNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShsaWdodExvYWRlci5yZXNvdXJjZXMuYmxvY2tfbm9ybWFsLnRleHR1cmUpO1xyXG4gICAgbm9ybWFsU3ByaXRlLnBhcmVudEdyb3VwID0gUElYSS5saWdodHMubm9ybWFsR3JvdXA7XHJcbiAgICBub3JtYWxTcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgY29udGFpbmVyLmFkZENoaWxkKGRpZmZ1c2VTcHJpdGUpO1xyXG4gICAgY29udGFpbmVyLmFkZENoaWxkKG5vcm1hbFNwcml0ZSk7XHJcblxyXG4gICAgc3Vic2NyaWJlKGNvbnRhaW5lcik7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcclxufVxyXG5cclxuLy8vID09PSBEUkFHIFpPTkUgPT09XHJcbmZ1bmN0aW9uIHN1YnNjcmliZShvYmopIHtcclxuICAgIG9iai5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICBvYmoub24oJ21vdXNlZG93bicsIG9uRHJhZ1N0YXJ0KVxyXG4gICAgICAgIC5vbigndG91Y2hzdGFydCcsIG9uRHJhZ1N0YXJ0KVxyXG4gICAgICAgIC5vbignbW91c2V1cCcsIG9uRHJhZ0VuZClcclxuICAgICAgICAub24oJ21vdXNldXBvdXRzaWRlJywgb25EcmFnRW5kKVxyXG4gICAgICAgIC5vbigndG91Y2hlbmQnLCBvbkRyYWdFbmQpXHJcbiAgICAgICAgLm9uKCd0b3VjaGVuZG91dHNpZGUnLCBvbkRyYWdFbmQpXHJcbiAgICAgICAgLm9uKCdtb3VzZW1vdmUnLCBvbkRyYWdNb3ZlKVxyXG4gICAgICAgIC5vbigndG91Y2htb3ZlJywgb25EcmFnTW92ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KGV2ZW50KSB7XHJcbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBldmVudC5kYXRhO1xyXG4gICAgICAgIHRoaXMub2xkR3JvdXAgPSB0aGlzLnBhcmVudEdyb3VwO1xyXG4gICAgICAgIHRoaXMucGFyZW50R3JvdXAgPSBkcmFnR3JvdXA7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuc2NhbGUueCAqPSAxLjE7XHJcbiAgICAgICAgdGhpcy5zY2FsZS55ICo9IDEuMTtcclxuICAgICAgICB0aGlzLmRyYWdQb2ludCA9IGV2ZW50LmRhdGEuZ2V0TG9jYWxQb3NpdGlvbih0aGlzLnBhcmVudCk7XHJcbiAgICAgICAgdGhpcy5kcmFnUG9pbnQueCAtPSB0aGlzLng7XHJcbiAgICAgICAgdGhpcy5kcmFnUG9pbnQueSAtPSB0aGlzLnk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRHJhZ0VuZCgpIHtcclxuICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGFyZW50R3JvdXAgPSB0aGlzLm9sZEdyb3VwO1xyXG4gICAgICAgIHRoaXMuc2NhbGUueCAvPSAxLjE7XHJcbiAgICAgICAgdGhpcy5zY2FsZS55IC89IDEuMTtcclxuICAgICAgICAvLyBzZXQgdGhlIGludGVyYWN0aW9uIGRhdGEgdG8gbnVsbFxyXG4gICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRHJhZ01vdmUoKSB7XHJcbiAgICBpZiAodGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHRoaXMuZGF0YS5nZXRMb2NhbFBvc2l0aW9uKHRoaXMucGFyZW50KTtcclxuICAgICAgICB0aGlzLnggPSBuZXdQb3NpdGlvbi54IC0gdGhpcy5kcmFnUG9pbnQueDtcclxuICAgICAgICB0aGlzLnkgPSBuZXdQb3NpdGlvbi55IC0gdGhpcy5kcmFnUG9pbnQueTtcclxuICAgIH1cclxufVxyXG4iXX0=