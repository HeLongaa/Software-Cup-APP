document.addEventListener('DOMContentLoaded', function() {
    var dataContainer = document.getElementById('data-container');

    // 假设这是获取数据的函数
    function fetchData() {
        // 模拟异步获取数据
        return new Promise((resolve) => {
            setTimeout(() => {
                // 假设这是获取到的数据
                var data = '这是获取到的数据内容';
                resolve(data);
            }, 20000); // 模拟2秒后获取数据
        });
    }

    // 调用获取数据的函数
    fetchData().then((data) => {
        // 数据获取成功后，更新DOM显示数据
        dataContainer.textContent = data;
        // 可以添加额外的逻辑，比如移除占位符类
        dataContainer.classList.remove('box box1');
    }).catch((error) => {
        // 处理错误情况
        console.error('获取数据失败:', error);
        // 更新DOM显示错误信息
        dataContainer.textContent = '获取数据失败，请稍后再试。';
    });
});

//获取当前选中的Theme
const { selectedIndex } = document.querySelector('s-segmented-button')
console.log('当前选中', selectedIndex)