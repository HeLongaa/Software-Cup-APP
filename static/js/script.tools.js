const body=document.querySelector('body')
const sidebar=body.querySelector('nav')
const toggle=body.querySelector('.toggle')
const modeSwitch=body.querySelector('.toggle-switch')
const modeText=body.querySelector('.mode-text')
const navLinks = document.querySelectorAll('.nav-link');
const contents = document.querySelectorAll('.content');

toggle.addEventListener('click',()=>{
    sidebar.classList.toggle('close')
    
})
modeSwitch.addEventListener('click',()=>{
    body.classList.toggle('dark');
    if(body.classList.contains('dark')){
        modeText.innerText="亮色模式"
        updateIframesSrc('?themes=dark');
    }else{
        modeText.innerText="暗色模式"
        updateIframesSrc('?themes=light');
    }
})

function updateIframesSrc(suffix) {
    var iframes = document.querySelectorAll('iframe.link-if');
    iframes.forEach(function(iframe) {
        var currentSrc = iframe.src;
                // Check if the current src already has a query string
        if (currentSrc.includes('?')) {
            currentSrc = currentSrc.split('?')[0];
        }
        iframe.src = currentSrc + suffix;
    });
}

document.addEventListener('DOMContentLoaded', () => {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(navLink => {
            navLink.addEventListener('mouseenter', function(event) {
                const tooltipText = this.getAttribute('data-tooltip');
                if (tooltipText) {
                    let tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerText = tooltipText;
                    document.body.appendChild(tooltip);

                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
                    tooltip.style.opacity = 1;

                    this.tooltipElement = tooltip;
                }
            });

            navLink.addEventListener('mouseleave', function() {
                if (this.tooltipElement) {
                    this.tooltipElement.remove();
                    this.tooltipElement = null;
                }
            });
        });
    });

function checkScreenSize() {
            var
            if (window.innerWidth <= 1000) {
                sidebar.classList.toggle('close')
                
            } else {
                nav.removeAttribute('close');
                sidebar.classList.remove('close')
                
            }
        }

        // 初始检测屏幕大小
        checkScreenSize();

        // 窗口大小变化
        window.addEventListener('resize', checkScreenSize);
        
        
navLinks.forEach(navLink => {
            navLink.addEventListener('click', function() {
                // 移除所有 nav-link 元素的 selected 类
                navLinks.forEach(link => link.classList.remove('selected'));

                // 为当前点击的 nav-link 元素添加 selected 类
                this.classList.add('selected');
                contents.forEach(content => content.classList.remove('active'));

                // 显示对应的内容
                const targetId = this.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

// 功能：根据 URL 哈希值更新内容显示
function handleHashChange() {
    const hash = window.location.hash.substring(1); // 去掉前面的 #
    if (hash) {
        const targetContent = document.getElementById(hash);
        if (targetContent) {
            // 移除所有 nav-link 元素的 selected 类
            navLinks.forEach(link => link.classList.remove('selected'));
                // 为当前哈希值对应的 nav-link 元素添加 selected 类
            const targetNavLink = document.querySelector(`.nav-link[data-target="${hash}"]`);
            if (targetNavLink) {
                targetNavLink.classList.add('selected');
            }

            // 隐藏所有内容并显示对应的内容
            contents.forEach(content => content.classList.remove('active'));
            targetContent.classList.add('active');
        }
    }
}

// 初始加载时处理哈希值
handleHashChange();

// 哈希值变化
window.addEventListener('hashchange', handleHashChange);
