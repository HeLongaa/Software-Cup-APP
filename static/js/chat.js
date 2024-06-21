//处理聊天请求，为PPT页面的功能处理
//2024.06.19 Long He

async function sendMessage() {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value;
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'message=' + encodeURIComponent(message)
            });
            const data = await response.json();
            document.getElementById('messages').innerHTML += `<p>You: ${message}</p>`;
            document.getElementById('messages').innerHTML += `<p>Xunfei: ${data.response}</p>`;
            messageInput.value = '';
        }

        async function generatePPT() {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value;
            const response = await fetch('/generate_ppt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'message=' + encodeURIComponent(message)
            });
            const data = await response.json();
            document.getElementById('messages').innerHTML += `<p>PPT URL: <a href="${data.ppt_url}" target="_blank">${data.ppt_url}</a></p>`;
            messageInput.value = '';
        }


