// ==========================================
// 1. INISIALISASI SCENE, KAMERA & RENDERER 3D
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9be1fb);
scene.fog = new THREE.FogExp2(0xd8f3ff, 0.032);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0.3, 2.3, 6.2);
camera.lookAt(0.1, 1.15, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// ==========================================
// 2. PENCAHAYAAN TAMAN HANGAT
// ==========================================
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8bc34a, 0.85);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff5d6, 1.15);
sunLight.position.set(5, 8, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

// ==========================================
// 3. LINGKUNGAN TAMAN (LANTAI BATU, PAGAR & PENYIRAM)
// ==========================================
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.9 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grassGeo = new THREE.PlaneGeometry(30, 15);
const grassMat = new THREE.MeshStandardMaterial({ color: 0x7cb342, roughness: 0.85 });
const grass = new THREE.Mesh(grassGeo, grassMat);
grass.rotation.x = -Math.PI / 2;
grass.position.set(0, 0.01, -6.5);
scene.add(grass);

const fenceGroup = new THREE.Group();
const woodMat = new THREE.MeshStandardMaterial({ color: 0xbcaaa4, roughness: 0.8 });
for (let i = -8; i <= 8; i++) {
  const plank = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.6, 0.12), woodMat);
  plank.position.set(i * 0.72, 1.3, -3.5);
  plank.castShadow = true;
  plank.receiveShadow = true;
  fenceGroup.add(plank);
}
const railTop = new THREE.Mesh(new THREE.BoxGeometry(13, 0.18, 0.14), woodMat);
railTop.position.set(0, 2.0, -3.45);
const railBot = new THREE.Mesh(new THREE.BoxGeometry(13, 0.18, 0.14), woodMat);
railBot.position.set(0, 0.7, -3.45);
fenceGroup.add(railTop, railBot);
scene.add(fenceGroup);

const canGroup = new THREE.Group();
const canMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.3, roughness: 0.5 });
const canBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.85, 20), canMat);
canBody.position.y = 0.425;
canBody.castShadow = true;
const canSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.75, 12), canMat);
canSpout.position.set(0.4, 0.55, 0);
canSpout.rotation.z = -Math.PI / 4;
canGroup.add(canBody, canSpout);
canGroup.position.set(-2.5, 0, -1.6);
canGroup.rotation.y = 0.4;
scene.add(canGroup);

// ==========================================
// 4. KARAKTER ANAK KECIL 3D (CHIBI)
// ==========================================
const childGroup = new THREE.Group();

const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfc4, roughness: 0.6 });
const hoodieMat = new THREE.MeshStandardMaterial({ color: 0xf3e5d8, roughness: 0.85 });
const jeansMat = new THREE.MeshStandardMaterial({ color: 0x3b6998, roughness: 0.8 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.75 });
const shoeRedMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
const shoeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2b1b12, roughness: 0.2 });

const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.85, 16), jeansMat);
legLeft.rotation.set(Math.PI / 2, 0, -0.5);
legLeft.position.set(0.15, 0.22, 0.35);
legLeft.castShadow = true;

const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.85, 16), jeansMat);
legRight.rotation.set(Math.PI / 2, 0, 0.45);
legRight.position.set(0.05, 0.2, -0.25);
legRight.castShadow = true;

function createShoe() {
  const shoe = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.24), shoeRedMat);
  body.position.y = 0.12;
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.26), shoeWhiteMat);
  sole.position.y = 0.03;
  const toe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), shoeWhiteMat);
  toe.position.set(0.18, 0.1, 0);
  shoe.add(body, sole, toe);
  return shoe;
}
const shoe1 = createShoe();
shoe1.position.set(0.42, 0.02, 0.15);
shoe1.rotation.y = -0.3;
const shoe2 = createShoe();
shoe2.position.set(0.25, 0.02, -0.35);
shoe2.rotation.y = 0.5;

const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 0.85, 20), hoodieMat);
torso.position.set(-0.08, 0.65, 0);
torso.rotation.z = -0.22;
torso.castShadow = true;

const hood = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), hoodieMat);
hood.position.set(-0.38, 0.92, 0);
hood.scale.set(1.1, 0.8, 1.15);

const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.55, 14), hoodieMat);
armL.position.set(0.28, 0.88, 0.25);
armL.rotation.set(0.2, 0, -0.5);

const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.55, 14), hoodieMat);
armR.position.set(0.28, 0.88, -0.25);
armR.rotation.set(-0.2, 0, -0.5);

const handL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), skinMat);
handL.position.set(0.38, 1.12, 0.24);
const handR = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), skinMat);
handR.position.set(0.38, 1.12, -0.24);

const headGroup = new THREE.Group();
headGroup.position.set(0.16, 1.48, 0);
headGroup.rotation.z = -0.22;

const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 28, 28), skinMat);
head.castShadow = true;
headGroup.add(head);

const blushMat = new THREE.MeshBasicMaterial({ color: 0xff8a80, transparent: true, opacity: 0.45 });
const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), blushMat);
blushL.position.set(0.49, -0.1, 0.26);
blushL.scale.set(0.4, 0.7, 1.1);
const blushR = blushL.clone();
blushR.position.z = -0.26;
headGroup.add(blushL, blushR);

function createEye() {
  const eyeG = new THREE.Group();
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), eyeMat);
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), shoeWhiteMat);
  shine.position.set(0.08, 0.04, 0.03);
  eyeG.add(pupil, shine);
  return eyeG;
}
const eyeL = createEye();
eyeL.position.set(0.48, -0.02, 0.2);
const eyeR = createEye();
eyeR.position.set(0.48, -0.02, -0.2);
headGroup.add(eyeL, eyeR);

const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), hairMat);
hairBase.position.set(-0.06, 0.1, 0);
headGroup.add(hairBase);

for (let i = 0; i < 14; i++) {
  const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 10), hairMat);
  const angle = (i / 14) * Math.PI * 2;
  tuft.position.set(Math.cos(angle) * 0.42, 0.35 + Math.sin(i) * 0.08, Math.sin(angle) * 0.42);
  tuft.rotation.set(Math.sin(angle) * 0.6, 0, -Math.cos(angle) * 0.7);
  headGroup.add(tuft);
}

childGroup.add(legLeft, legRight, shoe1, shoe2, torso, hood, armL, armR, handL, handR, headGroup);
childGroup.position.set(-0.95, 0, 0.1);
childGroup.rotation.y = -0.15;
scene.add(childGroup);

// ==========================================
// 5. POT TERAKOTA & BUNGA DANDELION 3D
// ==========================================
const potGroup = new THREE.Group();
const terracottaMat = new THREE.MeshStandardMaterial({ color: 0xc8643b, roughness: 0.75 });
const soilMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 1.0 });

const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.35, 0.68, 24), terracottaMat);
potBody.position.y = 0.34;
potBody.castShadow = true;
potBody.receiveShadow = true;

const potRim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.48, 0.12, 24), terracottaMat);
potRim.position.y = 0.68;
potRim.castShadow = true;

const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 20), soilMat);
soil.position.y = 0.66;

potGroup.add(potBody, potRim, soil);
potGroup.position.set(0.85, 0, 0.25);
scene.add(potGroup);

const plantGroup = new THREE.Group();
plantGroup.position.set(0.85, 0.68, 0.25);
scene.add(plantGroup);

const stemMat = new THREE.MeshStandardMaterial({ color: 0x689f38, roughness: 0.6 });
const stemGeo = new THREE.CylinderGeometry(0.025, 0.035, 1, 12);
stemGeo.translate(0, 0.5, 0);
const stem = new THREE.Mesh(stemGeo, stemMat);
stem.scale.set(1, 0.15, 1);
plantGroup.add(stem);

const leafMat = new THREE.MeshStandardMaterial({ color: 0x7cb342, side: THREE.DoubleSide });
for (let i = 0; i < 4; i++) {
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), leafMat);
  leaf.scale.set(1.8, 0.15, 0.6);
  const ang = (i * Math.PI) / 2 + 0.4;
  leaf.position.set(Math.cos(ang) * 0.14, 0.05, Math.sin(ang) * 0.14);
  leaf.rotation.y = -ang;
  leaf.rotation.z = 0.3;
  plantGroup.add(leaf);
}

const flowerHead = new THREE.Group();
flowerHead.position.y = 0.15;
plantGroup.add(flowerHead);

const yellowFlower = new THREE.Mesh(
  new THREE.SphereGeometry(0.14, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0xffb300, emissiveIntensity: 0.2 })
);
yellowFlower.scale.set(1.2, 0.6, 1.2);
yellowFlower.visible = false;
flowerHead.add(yellowFlower);

const puffGroup = new THREE.Group();
puffGroup.visible = false;
flowerHead.add(puffGroup);

const seeds = [];
const seedCount = 90;
const seedMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });

for (let i = 0; i < seedCount; i++) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / seedCount);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;

  const dir = new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  );

  const seedUnit = new THREE.Group();
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22, 5), seedMat);
  stalk.position.y = 0.11;
  const fluff = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.05, 7, 1, true), seedMat);
  fluff.position.y = 0.22;
  fluff.rotation.x = Math.PI;

  seedUnit.add(stalk, fluff);
  seedUnit.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  puffGroup.add(seedUnit);
  seeds.push({
    mesh: seedUnit,
    flying: false,
    velocity: new THREE.Vector3(),
    rotSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05
    ),
    delay: Math.random() * 1.5
  });
}

// ==========================================
// 6. PERCIKAN CAHAYA & EFEK ANGIN
// ==========================================
const sparkleCount = 160;
const sparkleGeo = new THREE.BufferGeometry();
const sparklePos = new Float32Array(sparkleCount * 3);

for (let i = 0; i < sparkleCount; i++) {
  sparklePos[i * 3] = (Math.random() - 0.5) * 10;
  sparklePos[i * 3 + 1] = Math.random() * 6;
  sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 8;
}
sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));

const sparkleMat = new THREE.PointsMaterial({
  color: 0xfff59d,
  size: 0.11,
  transparent: true,
  opacity: 0.0,
  blending: THREE.AdditiveBlending
});
const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
scene.add(sparkles);

const windLines = [];
const windMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
for (let i = 0; i < 12; i++) {
  const line = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.015, 0.015), windMat);
  line.position.set(-5 - Math.random() * 5, 0.8 + Math.random() * 2.5, (Math.random() - 0.5) * 3);
  scene.add(line);
  windLines.push(line);
}

const tapParticles = [];
function spawnTapSparkle() {
  for (let i = 0; i < 10; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff176, transparent: true, opacity: 1 })
    );
    p.position.set(
      0.85 + (Math.random() - 0.5) * 0.4,
      0.85 + Math.random() * 0.4,
      0.25 + (Math.random() - 0.5) * 0.4
    );
    scene.add(p);
    tapParticles.push({
      mesh: p,
      vy: 0.02 + Math.random() * 0.03,
      vx: (Math.random() - 0.5) * 0.03,
      vz: (Math.random() - 0.5) * 0.03,
      life: 1.0
    });
  }
}

// Fungsi Munculnya Kunang-Kunang dari Kotak Teks Akhir
function spawnFirefliesFromQuote() {
  const quoteBox = document.querySelector('.quote-box');
  if (!quoteBox) return;

  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      
      firefly.style.left = '50%';
      firefly.style.top = '50%';

      const randomX = (Math.random() - 0.5) * 380;
      const randomY = (Math.random() - 0.7) * 280;
      
      firefly.style.setProperty('--tx', `${randomX}px`);
      firefly.style.setProperty('--ty', `${randomY}px`);
      firefly.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';

      quoteBox.appendChild(firefly);

      setTimeout(() => {
        firefly.remove();
      }, 4000);
    }, i * 140);
  }
}

// ==========================================
// 7. LOGIKA INTERAKSI & AUDIO
// ==========================================
let growth = 0;
let stage = 'growing';
let blowTimer = 0;

const progressBar = document.getElementById('progress-bar');
const tapHint = document.getElementById('tap-hint');
const uiContainer = document.getElementById('ui-container');
const quoteOverlay = document.getElementById('quote-overlay');
const btnReplay = document.getElementById('btn-replay');

const bgMusic = document.getElementById('bg-music');
const btnAudio = document.getElementById('btn-audio');
const uploadMp3 = document.getElementById('upload-mp3');
let isPlaying = false;

btnAudio.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      isPlaying = true;
      btnAudio.textContent = '🔊 Musik Aktif';
    }).catch(err => console.log("Audio play blocked:", err));
  } else {
    bgMusic.pause();
    isPlaying = false;
    btnAudio.textContent = '🔇 Musik Jeda';
  }
});

uploadMp3.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    bgMusic.src = url;
    bgMusic.play().then(() => {
      isPlaying = true;
      btnAudio.textContent = '🔊 Dandelions';
    });
  }
});

function handleScreenTap() {
  if (!isPlaying && bgMusic.paused) {
    bgMusic.play().then(() => {
      isPlaying = true;
      btnAudio.textContent = '🔊 Musik Aktif';
    }).catch(() => {});
  }

  if (stage !== 'growing') return;

  growth = Math.min(100, growth + 10);
  progressBar.style.width = growth + '%';
  spawnTapSparkle();

  headGroup.rotation.z = -0.12;
  setTimeout(() => {
    if (stage === 'growing') headGroup.rotation.z = -0.22;
  }, 180);

  const stemHeight = 0.15 + (growth / 100) * 1.15;
  stem.scale.y = stemHeight;
  flowerHead.position.y = stemHeight;

  if (growth >= 40 && growth < 80) {
    yellowFlower.visible = true;
    puffGroup.visible = false;
    const s = 0.5 + ((growth - 40) / 40) * 0.7;
    yellowFlower.scale.set(1.2 * s, 0.6 * s, 1.2 * s);
    tapHint.textContent = '🌼 Bunga mulai mekar! Terus tap layar...';
  } else if (growth >= 80 && growth < 100) {
    yellowFlower.visible = false;
    puffGroup.visible = true;
    const s = 0.7 + ((growth - 80) / 20) * 0.35;
    puffGroup.scale.set(s, s, s);
    tapHint.textContent = '🤍 Sedikit lagi! Siap menyambut angin...';
  } else if (growth >= 100) {
    puffGroup.scale.set(1.05, 1.05, 1.05);
    stage = 'blowing';
    tapHint.textContent = '🍃 Angin berembus menerbangkan harapan...';
    setTimeout(() => {
      uiContainer.style.opacity = '0';
    }, 1500);
  }
}

container.addEventListener('pointerdown', handleScreenTap);

btnReplay.addEventListener('click', () => {
  growth = 0;
  stage = 'growing';
  blowTimer = 0;
  progressBar.style.width = '0%';
  tapHint.textContent = '✨ Tap layar untuk menumbuhkan Dandelion ✨';
  uiContainer.style.opacity = '1';
  quoteOverlay.classList.remove('visible');

  stem.scale.y = 0.15;
  flowerHead.position.y = 0.15;
  yellowFlower.visible = false;
  puffGroup.visible = false;

  seeds.forEach((s, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / seedCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
    s.mesh.position.set(0, 0, 0);
    s.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    s.flying = false;
  });

  scene.background.setHex(0x9be1fb);
  scene.fog.color.setHex(0xd8f3ff);
  sparkleMat.opacity = 0;
  windMat.opacity = 0;
  camera.position.set(0.3, 2.3, 6.2);
});

// ==========================================
// 8. LOOP ANIMASI UTAMA (60 FPS)
// ==========================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  childGroup.position.y = Math.sin(t * 2) * 0.015;
  if (stage === 'growing') {
    headGroup.rotation.y = Math.sin(t * 1.2) * 0.06;
  }

  plantGroup.rotation.z = Math.sin(t * 1.8) * 0.03;

  for (let i = tapParticles.length - 1; i >= 0; i--) {
    const p = tapParticles[i];
    p.mesh.position.y += p.vy;
    p.mesh.position.x += p.vx;
    p.mesh.position.z += p.vz;
    p.life -= 0.025;
    p.mesh.material.opacity = Math.max(0, p.life);
    if (p.life <= 0) {
      scene.remove(p.mesh);
      tapParticles.splice(i, 1);
    }
  }

  if (stage === 'blowing' || stage === 'ending') {
    blowTimer += 0.016;

    headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.25, 0.02);
    plantGroup.rotation.z = Math.sin(t * 5) * 0.12 - 0.1;

    windMat.opacity = Math.min(0.45, blowTimer * 0.3);
    windLines.forEach((line, idx) => {
      line.position.x += 0.14 + idx * 0.005;
      if (line.position.x > 6) line.position.x = -6;
    });

    seeds.forEach((s) => {
      if (blowTimer > s.delay) {
        if (!s.flying) {
          s.flying = true;
          s.velocity.set(
            0.035 + Math.random() * 0.03,
            0.022 + Math.random() * 0.025,
            (Math.random() - 0.5) * 0.03
          );
        }
        s.mesh.position.add(s.velocity);
        s.mesh.position.y += Math.sin(t * 3 + s.delay) * 0.004;
        s.mesh.rotation.x += s.rotSpeed.x;
        s.mesh.rotation.y += s.rotSpeed.y;
        s.mesh.rotation.z += s.rotSpeed.z;
      }
    });

    scene.background.lerp(new THREE.Color(0x0f172a), 0.008);
    scene.fog.color.lerp(new THREE.Color(0x0a0e1c), 0.008);
    sparkleMat.opacity = Math.min(0.85, sparkleMat.opacity + 0.005);
    sparkles.rotation.y += 0.001;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 1.2, 0.01);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.0, 0.01);

    if (blowTimer > 5.5 && stage === 'blowing') {
      stage = 'ending';
      quoteOverlay.classList.add('visible');
      spawnFirefliesFromQuote(); // Memunculkan efek kunang-kunang dari kotak teks
    }
  }

  renderer.render(scene, camera);
}

animate();
