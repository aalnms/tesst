// رسم الإحصائيات المتحركة في قسم الترحيب
document.addEventListener('DOMContentLoaded', function() {
  // رسم إحصائيات الاستثمار
  const ctx = document.getElementById('investmentStatsChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['عائد الاستثمار', 'نمو السوق', 'فرص جديدة'],
      datasets: [{
        data: [68, 22, 10],
        backgroundColor: ['#ffd700', '#1d2a4d', '#0a1833'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      plugins: {
        legend: { display: true, position: 'bottom', labels: { color: '#ffd700', font: { size: 16 } } }
      },
      cutout: '70%',
      animation: { animateRotate: true, duration: 1800 }
    }
  });

  // تعبئة فلاتر القطاعات والتكلفة والعائد
  const sectors = ['الصحة', 'التقنية', 'الصناعة', 'الطاقة'];
  const costs = ['أقل من 100 ألف', '100-500 ألف', 'أكثر من 500 ألف'];
  const rois = ['10-20%', '20-40%', 'أكثر من 40%'];
  sectors.forEach(s => {
    let opt = document.createElement('option');
    opt.textContent = s;
    document.getElementById('sectorFilter').appendChild(opt);
  });
  costs.forEach(c => {
    let opt = document.createElement('option');
    opt.textContent = c;
    document.getElementById('costFilter').appendChild(opt);
  });
  rois.forEach(r => {
    let opt = document.createElement('option');
    opt.textContent = r;
    document.getElementById('roiFilter').appendChild(opt);
  });

  // عرض اختراعات افتراضية مع مؤشرات أداء
  const inventions = [
    { name: 'جهاز طبي ذكي', sector: 'الصحة', cost: '100-500 ألف', roi: '20-40%', ai: 'موصى به', perf: 92 },
    { name: 'منصة ذكاء صناعي', sector: 'التقنية', cost: 'أكثر من 500 ألف', roi: 'أكثر من 40%', ai: 'ممتاز', perf: 97 },
    { name: 'حلول طاقة متجددة', sector: 'الطاقة', cost: '100-500 ألف', roi: '10-20%', ai: 'جيد', perf: 81 }
  ];
  function renderInventions() {
    const list = document.getElementById('gallery-list');
    list.innerHTML = '';
    inventions.forEach(inv => {
      const card = document.createElement('div');
      card.className = 'invention-card';
      card.innerHTML = `
        <h4>${inv.name}</h4>
        <p>القطاع: ${inv.sector}</p>
        <p>التكلفة: ${inv.cost}</p>
        <p>العائد المتوقع: ${inv.roi}</p>
        <p>توصية الذكاء الاصطناعي: <b>${inv.ai}</b></p>
        <div style="margin-top:8px;">
          <progress value="${inv.perf}" max="100"></progress>
          <span style="color:#ffd700;">${inv.perf}%</span>
        </div>
        <button class="secondary-btn" style="margin-top:10px;">معاينة النموذج ثلاثي الأبعاد</button>
      `;
      list.appendChild(card);
    });
  }
  renderInventions();

  // تفعيل نموذج التسجيل
  document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('تم استلام طلب التسجيل! سيتم التواصل معك قريبًا.');
    this.reset();
  });

  // زر التسجيل عبر نفاذ الأعمال
  document.querySelector('.nafath-btn').addEventListener('click', function() {
    alert('سيتم تحويلك إلى بوابة نفاذ الأعمال...');
    // window.location.href = 'https://nafath.sa/';
  });

  // أماكن مخصصة للعروض ثلاثية الأبعاد (Three.js)
  // مثال: نموذج ثلاثي الأبعاد رمزي في قسم الترحيب
  if (window.THREE) {
    const hero3d = document.getElementById('hero-3d-model');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, hero3d.offsetWidth / hero3d.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(hero3d.offsetWidth, hero3d.offsetHeight);
    hero3d.appendChild(renderer.domElement);

    // نموذج رمزي: مكعب ذهبي يدور (يمثل تحويل الابتكار إلى فرصة)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.3 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.PointLight(0xffffff, 1.2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 3.5;
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01;
      cube.rotation.x += 0.005;
      renderer.render(scene, camera);
    }
    animate();
  }
});
