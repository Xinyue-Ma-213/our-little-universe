// 1. 把这里改成你们在一起的日期：年, 月-1, 日
// JavaScript 的月份从 0 开始，所以 5 月要写 4。
const loveStartDate = new Date(2026, 4, 30);

const today = new Date();
const oneDay = 1000 * 60 * 60 * 24;
const daysTogether = Math.max(1, Math.floor((today - loveStartDate) / oneDay) + 1);
document.querySelector("#daysTogether").textContent = daysTogether.toLocaleString("zh-CN");

// 照片还没放进去时，隐藏损坏图片图标，保留漂亮的占位背景。
document.querySelectorAll(".photo-frame img").forEach((image) => {
  image.addEventListener("error", () => {
    image.style.display = "none";
  });
});

// 元素滚动到视野中时淡入。
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

// 打开与关闭情书。
const letterDialog = document.querySelector("#letterDialog");
const openButtons = ["#openLetter", "#openLetterTop", "#openEnvelope"];
openButtons.forEach((selector) => {
  document.querySelector(selector).addEventListener("click", () => letterDialog.showModal());
});
document.querySelector("#closeLetter").addEventListener("click", () => letterDialog.close());
letterDialog.addEventListener("click", (event) => {
  if (event.target === letterDialog) letterDialog.close();
});

// 小惊喜：点击后从按钮位置飞出爱心。
const canvas = document.querySelector("#heartCanvas");
const context = canvas.getContext("2d");
let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchHearts() {
  const button = document.querySelector("#surpriseButton");
  const rect = button.getBoundingClientRect();
  for (let i = 0; i < 42; i += 1) {
    hearts.push({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 7 - 2,
      gravity: 0.07,
      size: Math.random() * 16 + 9,
      life: 1,
      color: ["#fff3ef", "#f1b7bb", "#d86f7d", "#ffffff"][Math.floor(Math.random() * 4)]
    });
  }
  animateHearts();
}

let animationId;
function animateHearts() {
  cancelAnimationFrame(animationId);
  function frame() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    hearts.forEach((heart) => {
      heart.x += heart.vx;
      heart.y += heart.vy;
      heart.vy += heart.gravity;
      heart.life -= 0.012;
      context.globalAlpha = Math.max(0, heart.life);
      context.fillStyle = heart.color;
      context.font = `${heart.size}px serif`;
      context.fillText("♥", heart.x, heart.y);
    });
    hearts = hearts.filter((heart) => heart.life > 0);
    context.globalAlpha = 1;
    if (hearts.length) animationId = requestAnimationFrame(frame);
  }
  frame();
}
document.querySelector("#surpriseButton").addEventListener("click", launchHearts);
