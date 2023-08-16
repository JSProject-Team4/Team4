// 캔버스 위에 그래픽을 렌더링하기 위해서
// 캔버스 엘리먼트에 대한 참조를 [ canvas ] 변수에 저장함
// 그림을 그리는 실질적 도구인 2D rendering context를 [ ctx ]변수에 저장함
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

// 공의 시작위치 지정 ( 화면 중앙 + 하단부터 30px 윗칸)
let x = canvas.width / 2;
let y = canvas.height - 30;
// 공의 좌표를 계속 변하게 해야함
let dx = 2;
let dy = -2;

// 그리기 함수 (10밀리초마다 호출됨 = 무한작동)
function draw() {
  ctx.beginPath();  // 그리기 시작
  ctx.arc(x, y, 10, 0, Math.PI * 2); // x: 50, y: 50, 반지름: 10, 시작각도: 0, 끝 각도: 3.14 * 2 
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
  x += dx;
  y += dy;
}
setInterval(draw, 10);
