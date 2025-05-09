// --------- 1. Smooth Section Navigation ---------
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    sections.forEach(sec => sec.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// --------- 2. Language Switch (RTL/LTR) ---------
const langSwitch = document.getElementById('lang-switch');
const translations = {
  ar: {
    dir: 'rtl',
    home: {
      h1: 'منصة ابتكار',
      p: 'حلقة الوصل بين المخترعين السعوديين والمستثمرين لتحويل الأفكار إلى منتجات تجارية ناجحة.',
      cta: 'ابدأ الآن'
    },
    inventors: 'المخترعين',
    investors: 'المستثمرين',
    ai: 'ذكاء ابتكار',
    contact: 'تواصل معنا',
    // ...يمكن إضافة المزيد حسب الحاجة...
  },
  en: {
    dir: 'ltr',
    home: {
      h1: 'IbtiKar Platform',
      p: 'The link between Saudi inventors and investors to turn ideas into successful commercial products.',
      cta: 'Get Started'
    },
    inventors: 'Inventors',
    investors: 'Investors',
    ai: 'IbtiKar AI',
    contact: 'Contact Us',
    // ...يمكن إضافة المزيد حسب الحاجة...
  }
};

langSwitch.addEventListener('change', e => {
  const lang = e.target.value;
  document.documentElement.lang = lang;
  document.documentElement.dir = translations[lang].dir;
  // تحديث النصوص الأساسية
  document.querySelector('.hero-content h1').textContent = translations[lang].home.h1;
  document.querySelector('.hero-content p').textContent = translations[lang].home.p;
  document.querySelector('.cta-btn').textContent = translations[lang].home.cta;
  // تحديث روابط التنقل
  navLinks[0].textContent = lang === 'ar' ? 'الرئيسية' : 'Home';
  navLinks[1].textContent = translations[lang].inventors;
  navLinks[2].textContent = translations[lang].investors;
  navLinks[3].textContent = translations[lang].ai;
  navLinks[4].textContent = translations[lang].contact;
  // ...تحديث باقي النصوص إذا لزم الأمر...
});

// --------- 3. 3D Background (Three.js) ---------
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  const canvas = document.getElementById('bg3d');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // رموز هندسية ثلاثية الأبعاد (مثّل الابتكار)
  const geometry = new THREE.IcosahedronGeometry(8, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x006c35, metalness: 0.5, roughness: 0.3 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // إضاءة
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(20, 20, 20);
  scene.add(light);

  function animate() {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.004;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
});

// --------- 4. 3D Gallery/Market (Inventors/Investors) ---------
function render3DGallery(containerId, color) {
  import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const width = container.offsetWidth || 320;
    const height = 250;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
    camera.position.z = 15;

    // رموز هندسية تمثل الاختراعات/البراءات
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusKnotGeometry(2, 0.6, 100, 16);
      const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (i - 1) * 6;
      mesh.rotation.y = Math.PI / 4 * i;
      scene.add(mesh);
    }

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    function animate() {
      scene.children.forEach(obj => {
        if (obj.isMesh) obj.rotation.y += 0.01;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
}

// عند تفعيل القسم المناسب
document.getElementById('inventors').addEventListener('transitionend', () => {
  if (document.getElementById('inventors').classList.contains('active')) {
    render3DGallery('inventor-gallery-3d', 0x006c35);
  }
});
document.getElementById('investors').addEventListener('transitionend', () => {
  if (document.getElementById('investors').classList.contains('active')) {
    render3DGallery('patent-market-3d', 0xf7c873);
  }
});

// --------- 5. AI Chat (Gemini API Integration - Mock) ---------
const aiChatForm = document.getElementById('ai-chat-form');
const aiChatWindow = document.getElementById('ai-chat-window');

aiChatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const input = aiChatForm.querySelector('input');
  const userMsg = input.value.trim();
  if (!userMsg) return;
  appendAIMessage('user', userMsg);
  input.value = '';
  // محاكاة استجابة Gemini API
  appendAIMessage('ai', '...جاري المعالجة...');
  setTimeout(() => {
    // هنا يمكن ربط Gemini API الحقيقي لاحقًا
    aiChatWindow.lastChild.textContent = 'هذه إجابة ذكية من ذكاء ابتكار (Gemini API).';
  }, 1200);
});

function appendAIMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-msg' : 'ai-msg';
  msg.style.margin = '0.5rem 0';
  msg.style.textAlign = sender === 'user' ? 'right' : 'left';
  msg.style.color = sender === 'user' ? '#006c35' : '#444';
  msg.textContent = text;
  aiChatWindow.appendChild(msg);
  aiChatWindow.scrollTop = aiChatWindow.scrollHeight;
}

// --------- 6. Forms (Login/Contact) ---------
document.getElementById('inventor-login').addEventListener('submit', e => {
  e.preventDefault();
  alert('تم تسجيل دخول المخترع بنجاح (تجريبي)');
});
document.getElementById('investor-login').addEventListener('submit', e => {
  e.preventDefault();
  alert('تم تسجيل دخول المستثمر بنجاح (تجريبي)');
});
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('تم إرسال رسالتك بنجاح. سنعاود التواصل معك قريبًا.');
});

// ===== 1. Hero 3D Model (Animated) =====
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  const container = document.getElementById('hero-3d-model');
  if (!container) return;
  container.innerHTML = '';
  const width = container.offsetWidth || 320;
  const height = container.offsetHeight || 320;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
  camera.position.z = 18;

  // نموذج ثلاثي الأبعاد يرمز للربط (حلقتان متداخلتان)
  const geo1 = new THREE.TorusGeometry(5, 1, 16, 100);
  const mat1 = new THREE.MeshStandardMaterial({ color: 0x006c35, metalness: 0.7, roughness: 0.2 });
  const torus1 = new THREE.Mesh(geo1, mat1);
  torus1.rotation.x = Math.PI / 2;

  const geo2 = new THREE.TorusGeometry(5, 1, 16, 100);
  const mat2 = new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 0.7, roughness: 0.2 });
  const torus2 = new THREE.Mesh(geo2, mat2);
  torus2.rotation.x = Math.PI / 2;
  torus2.rotation.y = Math.PI / 3;

  scene.add(torus1);
  scene.add(torus2);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(20, 20, 20);
  scene.add(light);

  function animate() {
    torus1.rotation.z += 0.01;
    torus2.rotation.z -= 0.012;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});

// ===== 2. Stats 3D Icons & Animated Counters =====
function animateStatCounters() {
  document.querySelectorAll('.stat-3d-num').forEach(el => {
    const target = +el.getAttribute('data-target');
    let count = 0;
    const step = Math.ceil(target / 60);
    function update() {
      count += step;
      if (count >= target) {
        el.textContent = target.toLocaleString();
      } else {
        el.textContent = count.toLocaleString();
        requestAnimationFrame(update);
      }
    }
    update();
  });
}
window.addEventListener('DOMContentLoaded', animateStatCounters);

// رسم رموز 3D للإحصائيات
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  [
    { id: 'stat-inventors', color: 0x006c35 },
    { id: 'stat-patents', color: 0x6c63ff },
    { id: 'stat-investors', color: 0x00cba9 },
    { id: 'stat-deals', color: 0xf7c873 }
  ].forEach(({ id, color }) => {
    const icon = document.querySelector(`#${id} .stat-3d-icon`);
    if (!icon) return;
    icon.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(48, 48);
    icon.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 25;

    let mesh;
    if (id === 'stat-inventors') {
      mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(15, 1),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (id === 'stat-patents') {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(18, 18, 18),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (id === 'stat-investors') {
      mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(10, 3, 100, 16),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(12, 12, 8, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    }
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(20, 20, 20);
    scene.add(light);

    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.012;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
});

// ===== 3. How It Works 3D Icons =====
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  [
    { id: 'howitworks-inventor', geo: 'sphere', color: 0x006c35 },
    { id: 'howitworks-ai', geo: 'octa', color: 0x6c63ff },
    { id: 'howitworks-investor', geo: 'torus', color: 0x00cba9 }
  ].forEach(({ id, geo, color }) => {
    const icon = document.getElementById(id);
    if (!icon) return;
    icon.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(80, 80);
    icon.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 40;

    let mesh;
    if (geo === 'sphere') {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(20, 32, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (geo === 'octa') {
      mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(20, 0),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(12, 3, 100, 16),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    }
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(20, 20, 20);
    scene.add(light);

    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.012;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
});

// ===== 4. Success Stories 3D Icons =====
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  ['success-3d-1', 'success-3d-2', 'success-3d-3'].forEach((id, idx) => {
    const icon = document.getElementById(id);
    if (!icon) return;
    icon.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(80, 80);
    icon.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 40;

    let mesh;
    if (idx === 0) {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(24, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x006c35, metalness: 0.7, roughness: 0.2 })
      );
    } else if (idx === 1) {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(20, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x6c63ff, metalness: 0.7, roughness: 0.2 })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(18, 18, 12, 32),
        new THREE.MeshStandardMaterial({ color: 0x00cba9, metalness: 0.7, roughness: 0.2 })
      );
    }
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(20, 20, 20);
    scene.add(light);

    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.012;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
});

// ===== 5. Features 3D Icons =====
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  [
    { id: 'feature-ai', geo: 'octa', color: 0x6c63ff },
    { id: 'feature-ip', geo: 'box', color: 0x006c35 },
    { id: 'feature-match', geo: 'torus', color: 0x00cba9 },
    { id: 'feature-market', geo: 'cylinder', color: 0xf7c873 }
  ].forEach(({ id, geo, color }) => {
    const icon = document.getElementById(id);
    if (!icon) return;
    icon.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(60, 60);
    icon.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 30;

    let mesh;
    if (geo === 'octa') {
      mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(15, 0),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (geo === 'box') {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(18, 18, 18),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (geo === 'torus') {
      mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(10, 3, 100, 16),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(12, 12, 8, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    }
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(20, 20, 20);
    scene.add(light);

    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.012;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
});

// ===== 6. Partners 3D Logos =====
import('https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js').then(THREE => {
  [
    { id: 'partner-sipa', color: 0x006c35 },
    { id: 'partner-misk', color: 0x6c63ff },
    { id: 'partner-monsha’at', color: 0x00cba9 },
    { id: 'partner-stc', color: 0xf7c873 }
  ].forEach(({ id, color }) => {
    const icon = document.getElementById(id);
    if (!icon) return;
    icon.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(80, 80);
    icon.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 40;

    // شعار رمزي ثلاثي الأبعاد (دائرة/مكعب/حلقة/أسطوانة)
    let mesh;
    if (id === 'partner-sipa') {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(24, 24, 12, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (id === 'partner-misk') {
      mesh = new THREE.Mesh(
        new THREE.TorusGeometry(20, 6, 16, 100),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else if (id === 'partner-monsha’at') {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(32, 32, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(22, 32, 32),
        new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2 })
      );
    }
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(20, 20, 20);
    scene.add(light);

    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.012;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
});

// ===== 7. News Ticker Pause on Hover =====
const newsList = document.getElementById('news-list');
if (newsList) {
  newsList.addEventListener('mouseenter', () => {
    newsList.style.animationPlayState = 'paused';
  });
  newsList.addEventListener('mouseleave', () => {
    newsList.style.animationPlayState = 'running';
  });
}

// ===== 8. Quick Registration Form =====
const quickRegForm = document.getElementById('quickreg-form');
if (quickRegForm) {
  quickRegForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('تم تسجيلك بنجاح! سيتم التواصل معك قريبًا.');
    quickRegForm.reset();
  });
  quickRegForm.querySelector('.nafath-btn').addEventListener('click', () => {
    alert('سيتم تحويلك إلى بوابة نفاذ الوطني قريبًا.');
  });
}
