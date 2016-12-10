export class LoaderService {
    constructor() {

    }



    loadOBJ(path : string) {
        const manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
        const loader = new THREE.OBJLoader( manager );
        const texture = new THREE.TextureLoader().load(require('../../../assets/textures/grey.png'));

        return new Promise((resolve, reject) => {
            loader.load(path, (object : any) => {
                object.traverse( function ( child :any ) {
                    if ( child instanceof THREE.Mesh ) {
                        child.material.map = texture;
                    }
                });
                resolve(object);
            });
        });
    }
}