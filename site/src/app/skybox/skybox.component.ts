import {ISkyBoxMapping} from "../interface";
export class SkyboxComponent {
    urlPrefix = "../../../assets/textures/skybox_";

    skyboxImages: ISkyBoxMapping = {
        posx: require("../../../assets/textures/skybox_posx.jpg"),
        negy: require("../../../assets/textures/skybox_negy.jpg"),
        posy: require("../../../assets/textures/skybox_posy.jpg"),
        posz: require("../../../assets/textures/skybox_posz.jpg"),
        negz: require("../../../assets/textures/skybox_negz.jpg"),
        negx: require("../../../assets/textures/skybox_negx.jpg")
    };

    init() {
        const materials: any[] = [];
        for (let x in this.skyboxImages) {
            materials.push(this.createMaterial(this.skyboxImages[x]))
        }
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 30000, 30000, 1, 1, 1), new THREE.MeshFaceMaterial(this.materialObject));
        mesh.scale.set(-1, 1, 1);

        return mesh

    }

    materialObject: any[] = [];
    createMaterial(path: string) {
        const loader = new THREE.TextureLoader();
        loader.load(path, texture => {
                this.materialObject.push(new THREE.MeshBasicMaterial({
                    map: texture,
                    overdraw: 0.5
                }))
            });
    }
}