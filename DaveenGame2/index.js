// ============ 주인"공"을 캔버스 위에 그리는 파트 ============ //

// 캔버스 위에 그래픽을 렌더링하기 위해서
// 캔버스 엘리먼트에 대한 참조를 [ canvas ] 변수에 저장함
// 그림을 그리는 실질적 도구인 2D rendering context를 [ ctx ]변수에 저장함
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

// 공의 시작위치 지정 ( 화면 중앙 + 하단부터 30px 윗칸)
let x = canvas.width / 2;
let y = canvas.height - 30;
// 공의 좌표를 계속 변하게 하기 위해서 프레임마다 x와 y에 추가될 값
let dx = 2;
let dy = -2;
// 공의 반지름
const ballRadius = 10;

// 그리기 함수 (10밀리초마다 호출됨 = 무한작동)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 공을 그리기 전에 기존에 공을 지운다
  drawBall(); // 주인"공" 그리기 함수 호출
  x += dx; // x의 값 +2
  y += dy; // y의 값 -2


// ============ 주인"공"을 벽에 튕기게 하는 파트 ============ //
// 만약에 현재의 높이에서 + dy( -2 )를 했을때 0보다 작아지는경우(벽을넘어감)
// dy를 양수로 바꿔서 반대로 움직이게해서 벽에 튕기는것처럼 보이게 한다
// (화면 위를 넘어가거나 화면 아래로 넘어가거나)
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
  // (화면 왼쪽을 넘어가거나 화면 오른쪽으로 넘어가거나)
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
}

// 주인"공"을 그리는 함수
function drawBall() {
  ctx.beginPath(); // 그리기 시작
  ctx.arc(x, y, ballRadius, 0, 10); // x: 50, y: 50, 반지름: 10, 시작각도, 끝 각도
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath(); // 그리기 끝
}
setInterval(draw, 10); // 10밀리초 간격 반복호출
