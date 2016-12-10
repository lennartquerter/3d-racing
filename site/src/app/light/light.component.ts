export class LightComponent {

    color : number = 0x404040;
    whiteColor : number = 0xffffff;

    constructor() {

    }

    init() {
        return new THREE.AmbientLight( this.whiteColor, 1 );
    }

    addPointLight() {
        return new THREE.DirectionalLight( this.color, 1 )
}
}