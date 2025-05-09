// نموذج ثلاثي الأبعاد للمخترع (توضيحي)
function loadInventor3DModel() {
  const container = document.getElementById('inventor-3d-model');
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 3;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(200, 200);
  container.appendChild(renderer.domElement);

  // إضاءة
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 5);
  scene.add(light);

  // نموذج هندسي بسيط يمثل المخترع (رأس وجسم)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.5, 1.2, 32),
    new THREE.MeshStandardMaterial({ color: 0x1e9c7c })
  );
  scene.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xf7c873 })
  );
  head.position.y = 0.8;
  scene.add(head);

  function animate() {
    body.rotation.y += 0.01;
    head.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// عرض ثلاثي الأبعاد للخدمات (توضيحي)
function loadFeatures3D() {
  const container = document.getElementById('features-3d-carousel');
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / 180, 0.1, 1000);
  camera.position.z = 3;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.offsetWidth, 180);
  container.appendChild(renderer.domElement);

  // أشكال هندسية تمثل الخدمات
  const colors = [0x0a4d3c, 0xf7c873, 0x1e9c7c];
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshStandardMaterial({ color: colors[i] })
    );
    mesh.position.x = (i - 1) * 1.2;
    scene.add(mesh);
  }
  const light = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(light);

  function animate() {
    scene.children.forEach((obj, idx) => {
      if (obj.isMesh) obj.rotation.y += 0.01 + idx * 0.005;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// خطوات تسجيل الاختراع (توضيح ثلاثي الأبعاد)
function loadSteps3D() {
  const container = document.getElementById('steps-3d-illustration');
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / 180, 0.1, 1000);
  camera.position.z = 4;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.offsetWidth, 180);
  container.appendChild(renderer.domElement);

  // كرات متدرجة تمثل الخطوات
  for (let i = 0; i < 4; i++) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e9c7c + i * 0x222222 })
    );
    sphere.position.x = (i - 1.5) * 1.2;
    scene.add(sphere);
  }
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(0, 2, 4);
  scene.add(light);

  function animate() {
    scene.children.forEach((obj, idx) => {
      if (obj.isMesh) obj.rotation.y += 0.01 + idx * 0.003;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// لوحة تحكم المخترع (توضيح ثلاثي الأبعاد)
function loadDashboard3D() {
  const container = document.getElementById('dashboard-3d-demo');
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / 180, 0.1, 1000);
  camera.position.z = 4;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.offsetWidth, 180);
  container.appendChild(renderer.domElement);

  // مستطيلات تمثل إحصائيات
  for (let i = 0; i < 3; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7 + i * 0.3, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xf7c873 - i * 0x222222 })
    );
    bar.position.x = (i - 1) * 1.1;
    bar.position.y = -0.2 + i * 0.1;
    scene.add(bar);
  }
  const light = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(light);

  function animate() {
    scene.children.forEach((obj, idx) => {
      if (obj.isMesh) obj.rotation.y += 0.01 + idx * 0.002;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// قصص النجاح (عرض ثلاثي الأبعاد توضيحي)
function loadStories3D() {
  const container = document.getElementById('stories-3d-carousel');
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / 180, 0.1, 1000);
  camera.position.z = 3.5;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.offsetWidth, 180);
  container.appendChild(renderer.domElement);

  // نجوم ذهبية تمثل قصص النجاح
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.TetrahedronGeometry(0.4 + i * 0.1);
    const material = new THREE.MeshStandardMaterial({ color: 0xf7c873 });
    const star = new THREE.Mesh(geometry, material);
    star.position.x = (i - 1) * 1.2;
    scene.add(star);
  }
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(0, 2, 4);
  scene.add(light);

  function animate() {
    scene.children.forEach((obj, idx) => {
      if (obj.isMesh) obj.rotation.y += 0.01 + idx * 0.004;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// تعبئة الأسئلة الشائعة
function fillFAQ() {
  const faqList = document.getElementById('faq-list');
  if (!faqList) return;
  const faqs = [
    { q: "كيف أسجل اختراعي في المنصة؟", a: "من خلال نموذج التسجيل ورفع المستندات المطلوبة." },
    { q: "هل المنصة توفر حماية للملكية الفكرية؟", a: "نعم، المنصة متكاملة مع الهيئة السعودية للملكية الفكرية." },
    { q: "كيف أستفيد مادياً من اختراعي؟", a: "يمكنك عرض اختراعك للمستثمرين وتحصيل العوائد عبر المنصة." },
    { q: "هل يمكنني إضافة نموذج ثلاثي الأبعاد لاختراعي؟", a: "نعم، المنصة تدعم رفع النماذج ثلاثية الأبعاد والفيديوهات." }
  ];
  faqs.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'faq-item';
    div.textContent = item.q;
    div.onclick = () => {
      if (div.nextSibling && div.nextSibling.className === 'faq-answer') {
        div.nextSibling.remove();
      } else {
        const ans = document.createElement('div');
        ans.className = 'faq-answer';
        ans.style = "background:#fff;padding:8px 14px;border-radius:8px;margin-bottom:8px;";
        ans.textContent = item.a;
        div.after(ans);
      }
    };
    faqList.appendChild(div);
  });
}

// محادثة ذكية مبسطة
function setupFAQChatbot() {
  const input = document.getElementById('faq-input');
  const btn = document.getElementById('faq-send-btn');
  const responseDiv = document.getElementById('faq-chat-response');
  if (!input || !btn || !responseDiv) return;
  btn.onclick = () => {
    const val = input.value.trim();
    if (!val) return;
    // ردود ذكية مبسطة
    let response = "يرجى مراجعة الأسئلة الشائعة أعلاه أو التواصل مع الدعم.";
    if (val.includes("ملكية")) response = "المنصة متكاملة مع الهيئة السعودية للملكية الفكرية لحماية اختراعاتك.";
    if (val.includes("عائد") || val.includes("ربح")) response = "يمكنك تحصيل العوائد من خلال عرض اختراعك للمستثمرين عبر المنصة.";
    if (val.includes("نموذج ثلاثي")) response = "نعم، يمكنك رفع نموذج ثلاثي الأبعاد لاختراعك بسهولة.";
    responseDiv.textContent = response;
    input.value = "";
  };
}

// تفعيل الرابط النشط في شريط التنقل عند التمرير أو النقر
function setupNavActiveLinks() {
  const links = document.querySelectorAll('.nav-link');
  const sections = [
    { id: 'welcome', link: links[0] },
    { id: 'features', link: links[1] },
    { id: 'dashboard', link: links[2] },
    { id: 'support', link: links[3] },
    { id: 'faq', link: links[4] }
  ];
  function onScroll() {
    let found = false;
    for (let i = 0; i < sections.length; i++) {
      const sec = document.getElementById(sections[i].id);
      if (sec && window.scrollY + 100 >= sec.offsetTop) {
        links.forEach(l => l.classList.remove('active'));
        sections[i].link.classList.add('active');
        found = true;
      }
    }
    if (!found) links.forEach(l => l.classList.remove('active'));
  }
  window.addEventListener('scroll', onScroll);

  // عند النقر على الرابط
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// نموذج التسجيل
document.addEventListener('DOMContentLoaded', () => {
  loadInventor3DModel();
  loadFeatures3D();
  loadSteps3D();
  loadDashboard3D();
  loadStories3D();
  fillFAQ();
  setupFAQChatbot();
  setupNavActiveLinks();

  // تجربة الواقع المعزز (تجريبية)
  const arBtn = document.getElementById('ar-explore-btn');
  if (arBtn) {
    arBtn.onclick = () => {
      const viewer = document.getElementById('ar-viewer');
      if (viewer) {
        viewer.innerHTML = '<iframe src="https://arvr.google.com/scene-viewer" style="width:100%;height:200px;border:none"></iframe><p>تجربة افتراضية توضيحية للمنصة.</p>';
      }
    };
  }

  // أزرار التسجيل/الدخول
  document.getElementById('register-invention-btn')?.addEventListener('click', () => {
    document.querySelector('.register-section').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('inventor-login-btn')?.addEventListener('click', () => {
    alert('سيتم تحويلك إلى صفحة تسجيل الدخول للمخترعين.');
  });
  document.getElementById('nafath-register-btn')?.addEventListener('click', () => {
    alert('سيتم تحويلك إلى بوابة نفاذ الوطني.');
  });

  // نموذج التسجيل
  document.getElementById('inventor-register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('تم استلام طلب التسجيل! سيتم التحقق من بياناتك.');
  });
});