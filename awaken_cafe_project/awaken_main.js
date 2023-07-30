var store_name = document.querySelector(".store_name");

store_name.onclick = function(){
    location.href= "awaken_main.html";
}
store_name.onmouseover = function(){
    store_name.style.cursor="pointer";

}

//스크롤 무빙시 이벤트처리
//header .wrap에 색변경 기능 이벤트달것임
var header = document.querySelector("header .wrap");
window.addEventListener('scroll', function(){
    // console.log( window.scrollY )
    if(this.window.scrollY >= 100){
        header.style.backgroundColor= "#111";
    } else if(this.window.scrollY < 100){
        header.style.backgroundColor= "rgb(255,127,80)";
    }
  });

// //스와이퍼 첫사진 좌측버튼하면 끝 사진으로 넘어가기
// //disabled="true"
// var swiper_button_prev = document.querySelector(".swiper-button-prev");
// var first_img = document.querySelector(".swiper-wrapper div:first-child img");
// var last_img = document.querySelector(".swiper-wrapper div:last-child img");

// if(first_img.parentElement.classList.contains("swiper-slide-active") === true){//첫슬라이드라면
//     //prev버튼 활성화 시키기
//     swiper_button_prev.classList.remove("swiper-button-disabled");
//     swiper_button_prev.ariaDisabled = "false";
// }

// swiper_button_prev.onclick = function(){
//     // console.log("check");
//     if(first_img.parentElement.classList.contains("swiper-slide-active") === true){
//         // console.log("check");
//         first_img.parentElement.classList.remove("swiper-slide-active")
//         last_img.parentElement.classList.add("swiper-slide-active")
//     }    
// }
// //스와이퍼 끝사진 우측버튼하면 처음 사진으로 넘어가기