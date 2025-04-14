let squares = [];
let tailAngle = 0; // 尾巴的角度
let tailDirection = 1; // 尾巴擺動的方向
let isMouthOpen = false; // 狀態變數，判斷小貓是否張嘴

function setup() {
  createCanvas(windowWidth, windowHeight); // 設定畫布大小為視窗大小
  background('blue');

  // 顯示自我介紹
  const intro = createDiv('自我介紹<br>我叫謝昕娟, 18歲, Keito');
  intro.position(10, 10);
  intro.style('color', 'white');
  intro.style('font-size', '16px');
  intro.style('background', 'rgba(0, 0, 0, 0.5)');
  intro.style('padding', '10px');
  intro.style('border-radius', '5px');

  // 建立選單按鈕
  const menuButton = createButton('顯示選單');
  menuButton.position(10, 80);
  menuButton.mousePressed(showMenu);

  // 初始化 40 個正方形
  for (let i = 0; i < 40; i++) {
    squares.push(new MovingSquare(random(width), random(height), random(20, 50)));
  }

  // 初始化畫布
  noStroke();
}

function draw() {
  background('blue'); // 確保背景覆蓋整個畫布

  // 繪製小貓
  drawCat(150, 100); // 小貓的位置 (x: 150, y: 100)

  // 更新並顯示所有正方形
  squares.forEach(square => {
    square.move();
    square.display();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布大小
  background('blue'); // 重新設定背景
}

// 顯示選單的函式
function showMenu() {
  // 清除舊的選單（如果有）
  const existingMenu = select('#menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  // 清除舊的 iframe（如果有）
  const existingIframe = select('#iframeContainer');
  if (existingIframe) {
    existingIframe.remove();
  }

  // 建立選單容器
  const menu = createDiv();
  menu.id('menu');
  menu.position(10, 120);

  // 選單項目與對應的網站
  const items = [
    { name: '作品集', url: 'https://keito14.github.io/4137303090317/' },
    { name: '測驗卷', url: 'https://keito14.github.io/test/' },
    { name: '教學影片', action: showVideo } // 修改為執行播放影片的函式
  ];

  items.forEach(item => {
    const menuItem = createButton(item.name);
    menuItem.parent(menu);
    menuItem.style('display', 'block');
    if (item.url) {
      menuItem.mousePressed(() => showIframe(item.url)); // 顯示對應的 iframe
    } else if (item.action) {
      menuItem.mousePressed(item.action);
    }
  });
}

function showIframe(url) {
  // 清除舊的 iframe（如果有）
  const existingIframe = select('#iframeContainer');
  if (existingIframe) {
    existingIframe.remove();
  }

  // 設定 iframe 的大小
  const iframeWidth = 800 * 2; // 原始寬度的兩倍
  const iframeHeight = 600 * 2; // 原始高度的兩倍

  // 建立 iframe 容器
  const iframeContainer = createDiv();
  iframeContainer.id('iframeContainer');
  iframeContainer.position((windowWidth - iframeWidth) / 2, (windowHeight - iframeHeight) / 2); // 置於視窗中間

  // 建立 iframe 元素
  const iframe = createElement('iframe');
  iframe.attribute('src', url);
  iframe.attribute('width', iframeWidth); // 設定 iframe 寬度
  iframe.attribute('height', iframeHeight); // 設定 iframe 高度
  iframe.attribute('frameborder', '0'); // 移除邊框
  iframe.parent(iframeContainer);
}

function showVideo() {
  // 清除舊的 iframe 或影片（如果有）
  const existingIframe = select('#iframeContainer');
  if (existingIframe) {
    existingIframe.remove();
  }
  const existingVideo = select('#videoContainer');
  if (existingVideo) {
    existingVideo.remove();
  }

  // 設定影片大小
  const videoWidth = 640 * 2; // 原始寬度的兩倍
  const videoHeight = 360 * 2; // 原始高度的兩倍

  // 建立影片容器
  const videoContainer = createDiv();
  videoContainer.id('videoContainer');
  videoContainer.position((windowWidth - videoWidth) / 2, (windowHeight - videoHeight) / 2); // 置於視窗中間

  // 建立影片元素
  const video = createVideo(['20250217_092821.mp4']);
  video.parent(videoContainer);
  video.size(videoWidth, videoHeight); // 設定影片大小
  video.attribute('controls', ''); // 顯示播放控制
  video.play(); // 自動播放影片
}

// 定義移動的正方形類別
class MovingSquare {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color(random(255), random(255), random(255));
    this.xSpeed = random(-3, 3);
    this.ySpeed = random(-3, 3);
    this.lastNearTime = millis(); // 記錄最近滑鼠靠近的時間
  }

  move() {
    // 計算滑鼠與方塊的距離
    const distance = dist(mouseX, mouseY, this.x + this.size / 2, this.y + this.size / 2);

    // 如果滑鼠靠近方塊，增加速度並更新計時器
    if (distance < 100) { // 距離小於 100 時加速
      this.xSpeed *= 1.1;
      this.ySpeed *= 1.1;
      this.lastNearTime = millis(); // 更新最近靠近的時間
    } else if (millis() - this.lastNearTime > 2000) { // 如果遠離超過兩秒，減速
      this.xSpeed *= 0.9;
      this.ySpeed *= 0.9;

      // 確保速度不會完全停止
      if (abs(this.xSpeed) < 0.5) this.xSpeed = random(-1, 1);
      if (abs(this.ySpeed) < 0.5) this.ySpeed = random(-1, 1);
    }

    // 限制速度的最大值和最小值，避免過快或停止
    this.xSpeed = constrain(this.xSpeed, -10, 10);
    this.ySpeed = constrain(this.ySpeed, -10, 10);

    // 更新位置
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // 碰到邊界反彈
    if (this.x < 0 || this.x + this.size > width) {
      this.xSpeed *= -1;
    }
    if (this.y < 0 || this.y + this.size > height) {
      this.ySpeed *= -1;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

function drawCat(x, y) {
  // 身體（坐姿）
  fill(200, 150, 100);
  ellipse(x, y + 60, 60, 80); // 身體為橢圓形，位置稍微向下

  // 頭
  fill(200, 150, 100);
  ellipse(x, y, 50, 50); // 頭部為圓形

  // 耳朵
  triangle(x - 20, y - 25, x - 10, y - 10, x - 30, y - 10); // 左耳
  triangle(x + 20, y - 25, x + 10, y - 10, x + 30, y - 10); // 右耳

  // 眼睛
  fill(0);
  ellipse(x - 10, y, 5, 5); // 左眼
  ellipse(x + 10, y, 5, 5); // 右眼

  // 鼻子
  fill(255, 100, 100);
  triangle(x - 3, y + 5, x + 3, y + 5, x, y + 10); // 鼻子

  // 嘴巴
  if (isMouthOpen) {
    fill(255, 100, 100);
    ellipse(x, y + 20, 15, 10); // 張開的嘴巴
  } else {
    stroke(0);
    line(x - 5, y + 15, x + 5, y + 15); // 閉合的嘴巴
    noStroke();
  }

  // 前腳
  fill(200, 150, 100);
  ellipse(x - 15, y + 70, 15, 30); // 左前腳
  ellipse(x + 15, y + 70, 15, 30); // 右前腳

  // 後腳
  ellipse(x - 25, y + 80, 20, 40); // 左後腳
  ellipse(x + 25, y + 80, 20, 40); // 右後腳

  // 尾巴
  push();
  translate(x + 30, y + 70); // 尾巴的基點
  rotate(radians(tailAngle)); // 旋轉尾巴
  fill(200, 150, 100);
  rect(0, -5, 40, 10, 5); // 繪製尾巴
  pop();

  // 更新尾巴角度
  tailAngle += tailDirection * 2;
  if (tailAngle > 30 || tailAngle < -30) {
    tailDirection *= -1; // 改變尾巴擺動方向
  }
}

function mousePressed() {
  // 檢查滑鼠是否點擊在小貓的範圍內
  const catX = 150; // 小貓的 x 座標
  const catY = 100; // 小貓的 y 座標
  const headRadius = 25; // 小貓頭部的半徑

  const distance = dist(mouseX, mouseY, catX, catY);
  if (distance < headRadius) {
    isMouthOpen = !isMouthOpen; // 切換嘴巴狀態
  }
}