<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    // 3D Animation for Hero Section
    (function() {
        const canvas = document.getElementById('hero-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Create 3D objects
        const geometry1 = new THREE.IcosahedronGeometry(3, 0);
        const material1 = new THREE.MeshPhongMaterial({
            color: 0x0e5e6f,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const shape1 = new THREE.Mesh(geometry1, material1);
        scene.add(shape1);
        
        const geometry2 = new THREE.OctahedronGeometry(2, 0);
        const material2 = new THREE.MeshPhongMaterial({
            color: 0x4fbdba,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const shape2 = new THREE.Mesh(geometry2, material2);
        shape2.position.set(-4, 2, -2);
        scene.add(shape2);
        
        const geometry3 = new THREE.TetrahedronGeometry(1.5, 0);
        const material3 = new THREE.MeshPhongMaterial({
            color: 0xdaa520,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const shape3 = new THREE.Mesh(geometry3, material3);
        shape3.position.set(5, -2, -1);
        scene.add(shape3);
        
        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 30;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xffffff
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Position camera
        camera.position.z = 15;
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            shape1.rotation.x += 0.003;
            shape1.rotation.y += 0.003;
            
            shape2.rotation.x -= 0.002;
            shape2.rotation.y -= 0.002;
            
            shape3.rotation.x += 0.004;
            shape3.rotation.y += 0.002;
            
            particlesMesh.rotation.y += 0.0005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    })();
    
    // Counter Animation
    const counters = document.querySelectorAll('.number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // Animation duration in ms
        const increment = target / (duration / 30); // Update every 30ms
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter animation when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
    
    // Story Slider
    const storySlide = document.querySelector('.story-slide');
    const storyCards = document.querySelectorAll('.story-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const cardWidth = 100; // 100%
    
    function goToSlide(index) {
        if (index < 0) {
            index = storyCards.length - 1;
        } else if (index >= storyCards.length) {
            index = 0;
        }
        
        currentIndex = index;
        storySlide.style.transform = `translateX(${100 * index}%)`;
        
        // Update indicators
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Next and Prev buttons
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Auto slide
    let autoSlide = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
    
    // Reset timer on manual navigation
    document.querySelector('.story-slider').addEventListener('click', () => {
        clearInterval(autoSlide);
        autoSlide = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    });
    
    // Animation on scroll
    const animatedElements = document.querySelectorAll('.animate');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        scrollObserver.observe(element);
    });