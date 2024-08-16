import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (!isMobile) {
    const container3D = document.getElementById("container3D");
    if (container3D) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const targetPosition = new THREE.Vector3();

        let object = null;
        let objToRender = 'asteroid';

        const loader = new GLTFLoader();
        loader.load(
            `assets/models/${objToRender}/scene.gltf`,
            function (gltf) {
                object = gltf.scene;
                object.position.set(200, 130, 300);
                scene.add(object);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('Error loading model:', error);
                alert('Failed to load 3D model. Please try again later.');
            }
        );

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container3D.appendChild(renderer.domElement);

        camera.position.z = objToRender === "scene" ? 25 : 400;

        const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight.position.set(-1, 0, 0);
        scene.add(directionalLight);

        function animate() {
            requestAnimationFrame(animate);

            if (object && objToRender === "asteroid") {
                object.position.x -= 0.32;
                object.position.z -= 0.4;
                object.position.y -= 0.04;

                object.rotation.y += 0.0008;
                object.rotation.z -= 0.002;
            }

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        container3D.addEventListener("click", function(event) {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            if (object) {
                const intersects = raycaster.intersectObject(object, true);
                if (intersects.length > 0) {
                    targetPosition.copy(intersects[0].point);
                }
            }
        });
    }
}
