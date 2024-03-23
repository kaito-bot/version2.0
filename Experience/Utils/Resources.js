import EventEmitter from "events";
import Experience from "../Experience.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    this.assets = assets;
    //console.log(assets);
    this.items = {};
    this.queue = this.assets.length;
    //loading counter
    this.loaded = 0;
    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    //this.loaders.dracoLoader = new DRACOLoader();
    //this.loaders.dracoLoader.setDecoderPath("/draco/");
    //this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    for (const asset of this.assets) {
      if (asset.type === "glbModel") {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file);
        });
      }
    }
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file;
    this.loaded++;
    //console.log("asset is loading");
    if (this.loaded === this.queue) {
      //console.log("all assets are loaded");
      this.emit("ready");
    }
  }
}
