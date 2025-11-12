'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';

export default function STLViewer({ stlUrl, label }) {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const animationFrameRef = useRef(null);

    const handleDownload = async () => {
        try {
            const response = await fetch(stlUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${label || '3D-Model'}.stl`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            alert('Fehler beim Herunterladen der Datei');
        }
    };

    useEffect(() => {
        if (!containerRef.current || !stlUrl) return;

        setLoading(true);
        setError(null);

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f8f8);
        sceneRef.current = scene;

        // Get container dimensions
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight || 300;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 2, 4);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        // Lighting setup - soft natural lighting for realistic skin
        const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.8);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xfff5e8, 1.2);
        mainLight.position.set(5, 6, 5);
        mainLight.castShadow = true;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffe8d8, 0.6);
        fillLight.position.set(-3, 2, -4);
        scene.add(fillLight);

        const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
        topLight.position.set(0, 8, 0);
        scene.add(topLight);

        const rimLight = new THREE.DirectionalLight(0xffd8c8, 0.4);
        rimLight.position.set(-5, 1, 3);
        scene.add(rimLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1;
        controls.maxDistance = 10;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.rotateSpeed = 0.8;

        // Load STL
        const loader = new STLLoader();
        loader.load(
            stlUrl,
            (geometry) => {
                geometry.center();
                geometry.computeBoundingBox();

                const size = new THREE.Vector3();
                geometry.boundingBox.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;
                geometry.scale(scale, scale, scale);

                const material = new THREE.MeshPhysicalMaterial({
                    color: 0xd4a89a,  // Natural peachy skin tone matching reference
                    metalness: 0.02,
                    roughness: 0.85,
                    clearcoat: 0.15,
                    clearcoatRoughness: 0.4,
                    sheen: 0.6,
                    sheenRoughness: 0.95,
                    sheenColor: 0xffd5c8,
                    transmission: 0.03,
                    thickness: 0.3,
                    reflectivity: 0.1
                });
                const mesh = new THREE.Mesh(geometry, material);

                mesh.rotation.x = -Math.PI / 2;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add(mesh);

                setLoading(false);
            },
            (xhr) => {
                // Progress callback
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log(Math.round(percentComplete) + '% loaded');
            },
            (error) => {
                console.error('Error loading STL:', error);
                setError('Fehler beim Laden der 3D-Datei');
                setLoading(false);
            }
        );

        // Animation loop
        function animate() {
            animationFrameRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Handle window resize
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight || 300;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
                container.removeChild(rendererRef.current.domElement);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [stlUrl]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                {label && (
                    <label className="text-sm font-medium text-gray-600">
                        {label}
                    </label>
                )}
                <Button
                    onClick={handleDownload}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer"
                    disabled={loading || error}
                >
                    <Download className="h-4 w-4" />
                    Download
                </Button>
            </div>
            <div className="relative w-full h-[300px] bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-600">3D-Modell wird geladen...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <div className="text-center text-red-600">
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}
                <div ref={containerRef} className="w-full h-full" />
            </div>
        </div>
    );
}

