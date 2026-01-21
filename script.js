const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");

const startFrame = 1;
const frameCount = 126;

const images = [];
let imagesLoaded = 0;
let currentFrame = 0;

// Hi-DPI support
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Frame path (✔ matches your files)
function getFramePath(index) {
  return `images/ezgif-frame-${String(index + startFrame).padStart(3, "0")}.jpg`;
}

// Preload
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = getFramePath(i);

  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === frameCount) {
      loader.style.display = "none";
      drawFrame(0);
    }
  };

  img.onerror = () => {
    console.error("Missing image:", img.src);
  };

  images.push(img);
}

// Draw frame
function drawFrame(index) {
  const img = images[index];
  if (!img) return;

  const scale = Math.max(
    canvas.width / img.width,
    canvas.height / img.height
  );

  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

// Scroll animation
function animate() {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.body.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / scrollHeight;
  const targetFrame = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  currentFrame += (targetFrame - currentFrame) * 0.1;
  drawFrame(Math.floor(currentFrame));

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);