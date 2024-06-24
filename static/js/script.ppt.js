var theme_a = "auto";
var switchState = false;

//加入空输入判别逻辑

document.addEventListener('DOMContentLoaded', function() {
    var userInput = document.getElementById('user-input');
    var checkButton = document.getElementById('checkButton');

    checkButton.addEventListener('click', function() {
        if (userInput.value.trim() === '') {
            customElements.get('s-snackbar').show('您输入的需求为空，请重新输入！')
            setTimeout(function() {
                window.location.href = '/PPT';
            }, 1500);
            //这是个延时，用来给提示框预留显示时间
        } else {
            //debug
            console.log("-------------------------------------------");
            console.log('The switch state is:', switchState);
            console.log('The theme of ppt is:', theme_a);
            console.log('Text is:',userInput.value);
            generatePPT();
            // 结果
            generatePPT().then((pptUrl) => {
                console.log('PPT URL:', pptUrl);
                // 需要加入逻辑，跳转到显示页面
            }).catch((error) => {
                console.error('Error during PPT generation:', error);
            });
        }
    });
});

function openTab(evt, themeIndex) {
  var i, tab, img, tablinks;

  // Remove the "active" class from all tabs
  for (i = 0; i < document.getElementsByClassName("tab").length; i++) {
    tab = document.getElementsByClassName("tab")[i];
    tab.classList.remove("active");
  }

  // Remove the "active" class from all tablinks
  for (i = 0; i < document.getElementsByClassName("tablinks").length; i++) {
    tablinks = document.getElementsByClassName("tablinks")[i];
    tablinks.classList.remove("active");
  }

  // Set the "active" class on the clicked tab
  evt.currentTarget.classList.add("active");

  // Get the image element to update
  img = document.getElementById("dynamicImage");

  // Update the image source based on the tab index
  img.src = '/static/images/ppt-theme/' + themeIndex + '.png';

  theme_a = themeIndex;

  console.log('The theme is:', theme_a);
}

// Set the first tab as active by default
document.getElementsByClassName("tablinks")[0].classList.add("active");
document.getElementById("dynamicImage").src = '/static/images/ppt-theme/auto.png';

var mySwitch = document.getElementById('mySwitch');

  // 监听开关状态的改变
  mySwitch.addEventListener('change', function() {
    // 打印开关的选中状态
    console.log('Switch state is now:', this.checked);
    switchState = this.checked; // 全局变量
  });

async function generatePPT() {
            const messageInput = document.getElementById('user-input');
            const message = messageInput.value;
            const response = await fetch('/generate_ppt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:
                    'message=' + encodeURIComponent(message) +
                    '&theme=' + encodeURIComponent(theme_a) +
                    '&is_card_note=' + encodeURIComponent(switchState),
            });
            const data = await response.json();
            return data.ppt_url;
        }

