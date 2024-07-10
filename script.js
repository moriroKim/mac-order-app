// 열심히 했습니다.. 배열, 객체에 대한 이해도가 다소 향상된 것 같습니다.
// 텍스트 wrap되는거랑 로컬스토리지 저장 기능은 추가로 수정, 구현할 예정입니다.

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

const addCountBtn = document.querySelector('.add-count');
const subtractBtn = document.querySelector('.subtract-count');
const countNum = document.querySelector('.count-num');

const menuItem = document.querySelector('.grid-item');
const menuImg = document.querySelector('.menu-img');
const menuName = document.querySelector('.burger-name');
const cost = document.querySelector('.cost');
const payBtn = document.querySelector('.pay-btn');

// total 금액 표시하는 요소 불러오기
const total = document.querySelector('.total-price');

const pages = document.querySelector('.mb-display');    

// 디스플레이 개별 넓이
let displayLocationX = 0;
const displayWidth = 388;


const data = []; // 메뉴에서 선택되어 MyOrder에 추가될 list 객체를 담을 배열

const addMenu = function () {
    // 메뉴 정보를 담을 객체를 생성
    const menu = {
        id: Date.now(),
        name: '',
        cost: 0,
        count: 1,
        img: '',
    };

    // 메뉴 정보를 객체에 담음
    menu.name = menuName.innerText.trim();
    menu.cost = Number(cost.innerText);
    menu.img = menuImg.src;

    // 배열에 push
    data.push(menu);

    // 리스트 추가할 My Order 컨테이너 불러오기
    const myOrderContainer = document.querySelector('.order-list');

    // 리스트 요소 생성
    const myOrderList = document.createElement('li');
    const image = document.createElement('img');
    const burgerName = document.createElement('p');
    const burgerCost = document.createElement('p');
    const countBtnContainer = document.createElement('div');
    const subtractBtn = document.createElement('button');
    const addBtn = document.createElement('button');
    const numberCounter = document.createElement('span');

    // 요소에 내용 추가
    image.src = menu.img;
    burgerName.innerText = menu.name;
    burgerCost.innerText = menu.cost + '원';
    numberCounter.innerText = menu.count;
    subtractBtn.innerText = '-';
    addBtn.innerText = '+';

    // 생성한 리스트 요소에 스타일이 필요하면 클래스 추가
    countBtnContainer.classList.add('count-btn');
    subtractBtn.classList.add('subtract-count');
    addBtn.classList.add('add-count');
    numberCounter.classList.add('count-num');
    
    // 리스트 요소 DOM에 추가
    countBtnContainer.appendChild(subtractBtn);
    countBtnContainer.appendChild(numberCounter);
    countBtnContainer.appendChild(addBtn);
    myOrderList.appendChild(image);
    myOrderList.appendChild(burgerName);
    myOrderList.appendChild(burgerCost);
    myOrderList.appendChild(countBtnContainer);

    myOrderContainer.appendChild(myOrderList);

    // 클릭된 현재요소의 id를 finalOrderId에 할당 (index를 찾기 위함)
    let finalOrderId = menu.id;

    // 햄버거 수량 추가 버튼 이벤트리스너
    addBtn.addEventListener('click', () => {
        const itemIndex = data.findIndex((item) => item.id === finalOrderId);
        if (itemIndex > -1) {
            data[itemIndex].count++;
            numberCounter.innerText = data[itemIndex].count;
            totalPrice();
        }
    });

    // 햄버거 수량 감소 버튼 이벤트리스너
    subtractBtn.addEventListener('click', () => {
        const itemIndex = data.findIndex((item) => item.id === finalOrderId);
        if (itemIndex > -1) {

            // 햄버거 수량이 0이되면 리스트에서 제거하는 조건문 
            if(data[itemIndex].count < 1) {

                let checkOrder = confirm(`주문 리스트에서 ${data[itemIndex].name}을 제외하시겠습니까?`);
                if(checkOrder) {
                    data.splice(itemIndex, 1); // 원본배열에서 해당 인덱스 제거 후 앞으로 땡김.
                    myOrderList.remove(); //DOM의 MyOrderList에서 제거
                    totalPrice();
                }

            } else {
                data[itemIndex].count--;
                numberCounter.innerText = data[itemIndex].count;
                totalPrice();
            }
        }
    })
    totalPrice();
}

// 지불 버튼 함수
const pay = function () {
    //totalPrice함수를 재사용하여 반환값을 받아옴
    const payAuthorization = totalPrice();

   // 햄버거가 My Order list에 있고, payAuthorization의 값이 0원 이상일때 활성화
    if(data !== null && payAuthorization > 0) {
        displayLocationX -= displayWidth;
        pages.style.left = `${displayLocationX}px`;
    }
}

// 총 가격 계산해주는 함수 addMenu() 에서 쓰임
const totalPrice = function () {
    let calcResult = data.reduce((acc, curr) => {
        return acc + (curr.cost * curr.count);
    }, 0);

    total.innerText = calcResult + '원';
    return calcResult;
}

// 슬라이드 다음 버튼
const btnCtrlNext = function () {
    // 주문을 넣기전 또는 total금액이 0원 이상일 때 까지는 비활성화
    if(displayLocationX === -displayWidth || displayLocationX === -displayWidth*2) {
        displayLocationX = -displayWidth;
    } else {
        displayLocationX -= displayWidth;
        pages.style.left = `${displayLocationX}px`;
    }
}

// 슬라이드 이전 버튼
const btnCtrlPrev = function () {
    if(displayLocationX === 0) {
        displayLocationX = 0;
    } else {
        displayLocationX += displayWidth;
        pages.style.left = `${displayLocationX}px`;
    }
}

// 슬라이드 이벤트 리스너 등록
nextBtn.addEventListener('click', btnCtrlNext);
prevBtn.addEventListener('click', btnCtrlPrev);

// 메뉴 그리드 이벤트 리스너 등록
menuItem.addEventListener('click', addMenu);

// 지불 버튼 이벤트 리스너 등록
payBtn.addEventListener('click', pay);