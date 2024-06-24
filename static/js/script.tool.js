


document.querySelector('.main-2').style.display = 'none';
document.querySelector('.main-3').style.display = 'none';


const main1 = document.querySelector('.main-1');
const main2 = document.querySelector('.main-2');
const main3 = document.querySelector('.main-3');
const banner1 = document.getElementById('banner-1');
const banner2 = document.getElementById('banner-2');
const banner3 = document.getElementById('banner-3');

// 为 banner-1 添加点击事件监听器
banner1.addEventListener('click', function() {
  main1.style.display = '';
  main2.style.display = 'none';
  main3.style.display = 'none';
});

// 为 banner-2 添加点击事件监听器
banner2.addEventListener('click', function() {
  main2.style.display = 'block';
  main1.style.display = 'none';
  main3.style.display = 'none';
});

// 为 banner-3 添加点击事件监听器
banner3.addEventListener('click', function() {
  main2.style.display = 'none';
  main1.style.display = 'none';
  main3.style.display = 'block';
});

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  var tool1 = document.getElementById('tool-1');

  if (tool1) {
    // 为tool-1元素添加点击事件监听器
    tool1.addEventListener('click', function() {
      // 执行跳转操作
      window.open('https://baidu.com','_blank');
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var tool1 = document.getElementById('tool-2');

  if (tool1) {
    // 为tool-1元素添加点击事件监听器
    tool1.addEventListener('click', function() {
      // 执行跳转操作
      window.open('https://baidu.com','_blank');
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var tool1 = document.getElementById('tool-3');

  if (tool1) {
    // 为tool-1元素添加点击事件监听器
    tool1.addEventListener('click', function() {
      // 执行跳转操作
      window.open('https://baidu.com','_blank');
    });
  }
});