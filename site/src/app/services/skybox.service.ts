import {Injectable} from "@angular/core";

@Injectable()
export class SkyBoxService {

    init() {
        const skyGeo = new THREE.SphereGeometry(10000, 25, 25);

        const loader = new THREE.TextureLoader();
        return new Promise(
            (resolve, reject) => {
                loader.load(require("../../../assets/textures/skySphere_2.jpg"),
                    (texture : any) => {
                        const material = new THREE.MeshPhongMaterial({
                            map: texture,
                        });
                        const sky = new THREE.Mesh(skyGeo, material);
                        sky.material.side = THREE.BackSide;
                        resolve(sky)
                    });
            })
    }
}