document.addEventListener('DOMContentLoaded', function() {
        var fabButton = document.getElementById('fabButton');
        fabButton.addEventListener('click', function() {
            window.location.href = '/';
         });
});

//这段用于处理用户输入为空的情况

document.addEventListener('DOMContentLoaded', function() {
    var userInput = document.getElementById('user-input');
    var checkButton = document.getElementById('checkButton');

    checkButton.addEventListener('click', function() {
        if (userInput.value.trim() === '') {
            customElements.get('s-snackbar').show('您输入的需求为空，请重新输入！')
            setTimeout(function() {
                window.location.href = '/PPT';
            }, 2000);
            //这是个延时，用来给提示框预留显示时间
        } else {
            // 这里添加PoST请求
            console.log('输入框有内容：', userInput.value);
        }
    });
});