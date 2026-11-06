import { onMounted, onUnmounted, ref, type Ref } from "vue";
import type {
  BufferGeometry,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";
import { portfolioSections, type SectionId } from "@/data/navigation";

type CameraWaypoint = {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
};

export const CAMERA_WAYPOINTS: Record<SectionId, CameraWaypoint> = {
  home: {
    position: { x: 1.93, y: 0.79, z: 0.93 },
    target: { x: 0.08, y: 0.21, z: -0.04 },
  },
  about: {
    position: { x: 0.36, y: 0.64, z: 0.13 },
    target: { x: 0.03, y: 0.52, z: -0.14 },
  },
  projects: {
    position: { x: 0.39, y: 0.64, z: -0.36 },
    target: { x: 0.03, y: 0.52, z: -0.14 },
  },
  contact: {
    position: { x: -0.23, y: 0.66, z: 0.18 },
    target: { x: 0.03, y: 0.52, z: -0.14 },
  },
};

function disposeSceneResources(root: Object3D) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (!mesh.material) return;

    const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    meshMaterials.forEach((material) => materials.add(material));
  });

  materials.forEach((material) => {
    Object.values(material).forEach((value: unknown) => {
      if (value && typeof value === "object" && "isTexture" in value) {
        textures.add(value as Texture);
      }
    });
    material.dispose();
  });
  const imageBitmaps = new Set<ImageBitmap>();
  textures.forEach((texture) => {
    if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) {
      imageBitmaps.add(texture.image);
    }
    texture.dispose();
  });
  imageBitmaps.forEach((bitmap) => bitmap.close());
  geometries.forEach((geometry) => geometry.dispose());
}

export function useOfficeScene(
  sceneContainer: Ref<HTMLDivElement | null>,
  activeSection: Ref<SectionId>,
  navigateToSection: (section: SectionId) => void,
) {
  const isTransitioning = ref(false);
  const isNavigationReady = ref(false);
  let scene: Scene | null = null;
  let camera: PerspectiveCamera | null = null;
  let cameraTarget: Vector3 | null = null;
  let renderer: WebGLRenderer | null = null;
  let animationLibrary: (typeof import("gsap"))["default"] | null = null;
  let cameraTransition: gsap.core.Timeline | null = null;
  let finishCameraTransition: (() => void) | null = null;
  let isSceneReady = false;
  let isDisposed = false;

  function renderScene() {
    if (!isSceneReady || !renderer || !scene || !camera || !cameraTarget || document.hidden) return;
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
  }

  function transitionToSection(
    fromSection: SectionId,
    targetSection: SectionId,
    onComplete: () => void,
  ) {
    if (isDisposed || isTransitioning.value) return;
    isNavigationReady.value = false;

    if (!camera || !cameraTarget || !animationLibrary || fromSection === targetSection) {
      onComplete();
      return;
    }

    // The shared intermediate view keeps longer flights clear of the room's walls.
    const flightPath: SectionId[] =
      fromSection === "about" || targetSection === "about"
        ? [targetSection]
        : ["about", targetSection];
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.01 : 1.3;
    isTransitioning.value = true;
    const transitionCamera = camera;
    const transitionTarget = cameraTarget;
    finishCameraTransition = () => {
      finishCameraTransition = null;
      cameraTransition = null;
      isTransitioning.value = false;
      onComplete();
    };
    const transition = animationLibrary.timeline({
      onUpdate: renderScene,
      onComplete: finishCameraTransition,
    });
    cameraTransition = transition;

    flightPath.forEach((section) => {
      const waypoint = CAMERA_WAYPOINTS[section];
      transition.to(transitionCamera.position, {
        ...waypoint.position,
        duration,
        ease: "power2.inOut",
      });
      transition.to(
        transitionTarget,
        {
          ...waypoint.target,
          duration,
          ease: "power2.inOut",
        },
        "<",
      );
    });
  }

  function handleWheel(event: WheelEvent) {
    if (isTransitioning.value || !isNavigationReady.value || Math.abs(event.deltaY) < 30) return;

    if (event.target instanceof Element) {
      if (event.target.closest('.holo-window, input, textarea, select, [contenteditable="true"]'))
        return;
      const homeScroller = event.target.closest(".portfolio-main.is-home");
      if (homeScroller && homeScroller.scrollHeight > homeScroller.clientHeight) return;
    }

    const currentIndex = portfolioSections.findIndex(
      (section) => section.id === activeSection.value,
    );
    const nextSection = portfolioSections[currentIndex + Math.sign(event.deltaY)];
    if (nextSection) navigateToSection(nextSection.id);
  }

  function resizeScene() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScene();
  }

  function releaseScene() {
    isSceneReady = false;
    cameraTransition?.kill();
    cameraTransition = null;
    if (!isDisposed) finishCameraTransition?.();
    finishCameraTransition = null;
    if (scene) {
      disposeSceneResources(scene);
      scene.clear();
    }
    renderer?.dispose();
    renderer?.domElement.remove();
    renderer = null;
    camera = null;
    cameraTarget = null;
    scene = null;
  }

  onMounted(async () => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("resize", resizeScene);
    document.addEventListener("visibilitychange", renderScene);

    try {
      const [THREE, { GLTFLoader }, { default: gsap }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("gsap"),
      ]);
      if (isDisposed || !sceneContainer.value) return;
      animationLibrary = gsap;
      const waypoint = CAMERA_WAYPOINTS[activeSection.value];
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#0a0a0c");
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
      camera.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z);
      cameraTarget = new THREE.Vector3(waypoint.target.x, waypoint.target.y, waypoint.target.z);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      sceneContainer.value.appendChild(renderer.domElement);
      resizeScene();

      scene.add(new THREE.AmbientLight(0x2a1b4e, 2));
      const keyLight = new THREE.DirectionalLight(0xd946ef, 3.5);
      keyLight.position.set(5, 10, 7);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0x8b5cf6, 2.5);
      fillLight.position.set(-5, 4, -4);
      scene.add(fillLight);
      const neonLight = new THREE.PointLight(0xf43f5e, 4, 10);
      neonLight.position.set(0, 2, -1);
      scene.add(neonLight);

      // This room is static; render only when its model, camera or viewport changes.
      const { scene: room } = await new GLTFLoader().loadAsync("/office.glb");
      if (isDisposed || !scene) {
        disposeSceneResources(room);
        return;
      }
      const roomCenter = new THREE.Box3().setFromObject(room).getCenter(new THREE.Vector3());
      room.position.sub(roomCenter);
      scene.add(room);
      const compilingRenderer = renderer;
      const compilingScene = scene;
      camera.lookAt(cameraTarget);
      // Precompile materials without letting resize or camera updates force a blocking first draw.
      await compilingRenderer.compileAsync(compilingScene, camera);
      if (isDisposed || renderer !== compilingRenderer || scene !== compilingScene) return;
      isSceneReady = true;
      renderScene();
    } catch (error) {
      if (isDisposed) return;
      console.warn("The 3D room is unavailable. Portfolio navigation remains active.", error);
      releaseScene();
    }
  });

  onUnmounted(() => {
    isDisposed = true;
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("resize", resizeScene);
    document.removeEventListener("visibilitychange", renderScene);
    releaseScene();
  });

  return { isTransitioning, isNavigationReady, transitionToSection };
}
