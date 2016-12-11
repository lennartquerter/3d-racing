webpackJsonp([0],[function(e,t,i){"use strict";var n=i(1),o=i(23);n.platformBrowserDynamic().bootstrapModule(o.AppModule)},,,,,,,,,,,,,,,,,,,,,,,function(e,t,i){"use strict";var n=this&&this.__decorate||function(e,t,i,n){var o,s=arguments.length,r=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(s<3?o(r):s>3?o(t,i,r):o(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},o=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},s=i(3),r=i(21),a=i(24),c=function(){function AppModule(){}return AppModule}();c=n([s.NgModule({imports:[r.BrowserModule],declarations:[a.AppComponent],bootstrap:[a.AppComponent]}),o("design:paramtypes",[])],c),t.AppModule=c},function(e,t,i){(function(e){"use strict";var n=this&&this.__decorate||function(e,t,i,n){var o,s=arguments.length,r=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(s<3?o(r):s>3?o(t,i,r):o(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},o=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},s=i(3),r=i(26),a=i(27),c=i(28),p=i(30),h=i(31),d=function(){function AppComponent(t,i,n,o,s){this._updateService=t,this._lightComponent=i,this._loader=n,this._physicsService=o,this._skyboxComponent=s,this.gui={speed:0,gravity:0},this.loaded={level:!1,user:!1,skybox:!1},this.general={dt:0,last:0},this.keys={UP:!1,DOWN:!1,LEFT:!1,RIGHT:!1},this.state={dead:!1},this.scene=new e.Scene,this.camera=new e.PerspectiveCamera(75,1280/720,1,2e5),this.renderer=new e.WebGLRenderer}return AppComponent.prototype.handleKeyDown=function(e){this.onKeyPress(e,!0)},AppComponent.prototype.handleKeyUp=function(e){this.onKeyPress(e,!1)},AppComponent.prototype.onKeyPress=function(e,t){"w"==e.key||38==e.keyCode?this.keys.UP=t:"s"==e.key||40==e.keyCode?this.keys.DOWN=t:"a"==e.key||37==e.keyCode?this.keys.LEFT=t:"d"!=e.key&&39!=e.keyCode||(this.keys.RIGHT=t)},AppComponent.prototype.ngOnInit=function(){var e=this;this.light=this._lightComponent.init(),this.pointLight=this._lightComponent.addPointLight();var t=i(32),n=i(33);this._loader.loadOBJ(t,n).then(function(t){t.name="player",e.player=t,e.handleLoaded("user")});var o=i(34),s=i(35);this._loader.loadOBJ(o,s).then(function(t){t.name="model",e.level=t,e.handleLoaded("level")}),this._skyboxComponent.init().then(function(t){t.name="skyBox",e.skyBox=t,e.handleLoaded("skybox")})},AppComponent.prototype.handleLoaded=function(e){this.loaded[e]=!0;var t=!0;for(var i in this.loaded)this.loaded[i]||(t=!1);t&&this.setup()},AppComponent.prototype.setup=function(){this.setupInitState(),this.addObjectsToScene(),this.addBoundingBoxesToScene(),this._canvas.nativeElement.appendChild(this.renderer.domElement),this._physicsService.setupGravity(this.scene,30),this.animate()},AppComponent.prototype.setupInitState=function(){this.skyBox.position.copy(this.camera.position),this.pointLight.position.copy(this.camera.position),this.renderer.setSize(1280,720)},AppComponent.prototype.addObjectsToScene=function(){this.scene.add(this.player),this.scene.add(this.level),this.scene.add(this.light),this.scene.add(this.pointLight),this.scene.add(this.skyBox)},AppComponent.prototype.addBoundingBoxesToScene=function(){var t=new e.BoxGeometry(6e4,1,6e4),i=new e.MeshBasicMaterial;i.visible=!1;var n=new e.Mesh(t,i);n.position.y=-2e3,n.name="death",this.scene.add(n)},AppComponent.prototype.animate=function(){var e=this,t=(new Date).getTime();this.general.dt=Math.min(1,(t-this.general.last)/1e3),this.general.last=t;var i=this.render();i||requestAnimationFrame(function(){return e.animate()})},AppComponent.prototype.render=function(){this.gui.speed=this._updateService.update(this.player,this.camera,this.keys,this.general.dt);var e=this._physicsService.GravityCheck(this.player);return e.d?(this.state.dead=!0,!0):(this.gui.gravity=e.g,this.skyBox.position.copy(this.player.position),this.renderer.render(this.scene,this.camera),!1)},AppComponent}();n([s.ViewChild("canvas"),o("design:type",s.ElementRef)],d.prototype,"_canvas",void 0),n([s.HostListener("document:keydown",["$event"]),o("design:type",Function),o("design:paramtypes",[KeyboardEvent]),o("design:returntype",void 0)],d.prototype,"handleKeyDown",null),n([s.HostListener("document:keyup",["$event"]),o("design:type",Function),o("design:paramtypes",[KeyboardEvent]),o("design:returntype",void 0)],d.prototype,"handleKeyUp",null),d=n([s.Component({selector:"app",template:i(36),providers:[r.UpdateService,a.LightComponent,c.SkyboxComponent,p.LoaderService,h.PhysicsService]}),o("design:paramtypes",[r.UpdateService,a.LightComponent,p.LoaderService,h.PhysicsService,c.SkyboxComponent])],d),t.AppComponent=d}).call(t,i(25))},,function(e,t){"use strict";var i=function(){function UpdateService(){this.acceleration=0,this.generalCarSpeedMultiplier=1e3,this.direction={X:0,Z:0,Y:0}}return UpdateService.prototype.init=function(){},UpdateService.prototype.update=function(e,t,i,n){var o=n*this.generalCarSpeedMultiplier;return this.direction={X:0,Z:0,Y:0},this.acceleration>0?this.acceleration-=.0012:this.acceleration+=.0012,i.UP&&this.acceleration<4&&(this.acceleration<0?(e.rotateX(.004),this.acceleration+=.03):this.acceleration+=.02),i.DOWN&&this.acceleration>-1.4&&(this.acceleration>0?this.acceleration-=.03:this.acceleration-=.015),i.LEFT&&e.rotateY(.02),i.RIGHT&&e.rotateY(-.02),t.quaternion.slerp(e.quaternion,.1),Math.cos(e.rotation.z)>-1?this.direction.Z=o*this.acceleration*Math.cos(e.rotation.y):this.direction.Z=o*this.acceleration*-Math.cos(e.rotation.y),this.direction.X=o*this.acceleration*Math.sin(e.rotation.y),e.position.z-=this.direction.Z,e.position.x-=this.direction.X,e.position.y-=this.direction.Y,t.position.z-=this.direction.Z,t.position.x-=this.direction.X,t.position.y-=this.direction.Y,t.position.y=e.position.y+200,this.acceleration},UpdateService}();t.UpdateService=i},function(e,t,i){(function(e){"use strict";var i=function(){function LightComponent(){this.color=4210752,this.whiteColor=16777215}return LightComponent.prototype.init=function(){return new e.AmbientLight(this.whiteColor,1)},LightComponent.prototype.addPointLight=function(){return new e.DirectionalLight(this.color,1)},LightComponent}();t.LightComponent=i}).call(t,i(25))},function(e,t,i){(function(e){"use strict";var n=function(){function SkyboxComponent(){}return SkyboxComponent.prototype.init=function(){var t=new e.SphereGeometry(1e4,25,25),n=new e.TextureLoader;return new Promise(function(o,s){n.load(i(29),function(i){var n=new e.MeshPhongMaterial({map:i}),s=new e.Mesh(t,n);s.material.side=e.BackSide,o(s)})})},SkyboxComponent}();t.SkyboxComponent=n}).call(t,i(25))},function(e,t,i){e.exports=i.p+"assets/skySphere_2.66ae058ccbfea529122c6bdf47620ac5.jpg"},function(e,t,i){(function(e){"use strict";var i=function(){function LoaderService(){}return LoaderService.prototype.loadOBJ=function(t,i){var n=new e.LoadingManager;n.onProgress=function(e,t,i){console.log(e,t,i)};var o=new e.OBJLoader(n),s=(new e.TextureLoader).load(i);return s.wrapS=s.wrapT=e.RepeatWrapping,s.repeat.set(2,2),new Promise(function(i,n){o.load(t,function(t){t.traverse(function(t){t instanceof e.Mesh&&(t.material.map=s)}),i(t)})})},LoaderService}();t.LoaderService=i}).call(t,i(25))},function(e,t,i){(function(e){"use strict";var i=function(){function PhysicsService(){this.groundList=[],this.gravity=30,this.collidableMeshList=[],this.count=0,this.falltime=.4}return PhysicsService.prototype.setupGravity=function(t,i){this.gravity=i;var n,o;for(var s in t.children){if("model"==t.children[s].name){var r=new e.MeshBasicMaterial({color:65280});this.level=new e.Mesh(t.children[s].children[0].geometry,r),this.level.position.y=0,this.collidableMeshList.push(this.level)}"death"==t.children[s].name&&(o=t.children[s],this.deathBB=(new e.Box3).setFromObject(o)),"ground"==t.children[s].name&&(console.log("added ground"),n=t.children[s],this.groundList.push((new e.Box3).setFromObject(n)))}},PhysicsService.prototype.GravityCheck=function(t){var i={up:!1,down:!0};this.caster=new e.Raycaster,this.rays=[new e.Vector3(0,0,1),new e.Vector3(0,0,-1),new e.Vector3(1,0,0),new e.Vector3(1,0,1),new e.Vector3(1,0,-1),new e.Vector3(-1,0,0),new e.Vector3(-1,0,1),new e.Vector3(-1,0,-1),new e.Vector3(0,1,0),new e.Vector3(0,1,1),new e.Vector3(0,1,-1),new e.Vector3(1,1,0),new e.Vector3(-1,1,0),new e.Vector3(0,-1,0),new e.Vector3(0,-1,1),new e.Vector3(0,-1,-1),new e.Vector3(-1,-1,0),new e.Vector3(1,-1,0),new e.Vector3(0,0,0)],i=this.collision(t,i);var n=0;i.up&&(n+=this.distance,this.falltime=.4),i.down&&!i.up&&(this.falltime+=.004,n-=20*this.falltime),t.position.y+=n;var o=(new e.Box3).setFromObject(t),s=!1;return o.min.y<this.deathBB.max.y&&(s=!0),{d:s,g:t.position.y}},PhysicsService.prototype.collision=function(e,t){var i,n,o=64,s=!1,r=!0;for(n=0;n<this.rays.length;n+=1)this.caster.set(e.position,this.rays[n]),i=this.caster.intersectObject(this.level),i.length>0&&i[0].distance<=o&&(8!=n&&9!=n&&11!=n&&10!=n&&12!=n||(s=!0,11==n||10==n||12==n?r=!1:8==n&&(this.distance=i[0].distance)));return{up:!r,down:!0}},PhysicsService}();t.PhysicsService=i}).call(t,i(25))},function(e,t,i){e.exports=i.p+"assets/bike_2.c7f1bf100e585ceb1e1b7b83f5d58b60.obj"},function(e,t,i){e.exports=i.p+"assets/tron.587552ce4be37cfd05ac08b4142849dd.png"},function(e,t,i){e.exports=i.p+"assets/level_lennart_2.cab7d4088be847c0ce89fea322aae254.obj"},function(e,t,i){e.exports=i.p+"assets/road.93905e756f18ec7cef67d3cc4f3fabd9.jpg"},function(e,t){e.exports='<div #canvas class="main">\n    <div class="gui">\n        <progress class="speed-progress" max="400" [value]="gui.speed * 100"></progress>\n        <i class="speed">{{(gui.speed * 100).toFixed(0)}} km/h</i>\n        <i class="gravity">{{(gui.gravity.toFixed(0))}} m</i>\n        <h2 [hidden]="!state.dead">YOU DIEDEDEDED</h2>\n    </div>\n</div>'}]);
//# sourceMappingURL=app.bb5c1f4b3b402a9d10b5.js.map