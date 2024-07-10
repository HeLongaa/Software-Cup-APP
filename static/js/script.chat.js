const socket = io();

        let currentBotMessage = null;
        let blinkingDot = null;

        socket.on('response', function(data) {
            const messagesDiv = document.getElementById('messages');

            if (!currentBotMessage) {
                currentBotMessage = document.createElement('div');
                currentBotMessage.classList.add('message', 'bot');

                const botImage = document.createElement('img');
                botImage.src = '/static/images/gpt.png';
                currentBotMessage.appendChild(botImage);

                const content = document.createElement('div');
                content.classList.add('content');
                currentBotMessage.appendChild(content);

                blinkingDot = document.createElement('span');
                blinkingDot.classList.add('blinking-dot');
                content.appendChild(blinkingDot);

                messagesDiv.appendChild(currentBotMessage);
            }

            currentBotMessage.querySelector('.content').textContent = currentBotMessage.querySelector('.content').textContent.replace('...', '') + data.content;
            currentBotMessage.querySelector('.content').appendChild(blinkingDot);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });

        socket.on('complete', function() {
            if (blinkingDot) {
                blinkingDot.remove();
                blinkingDot = null;
            }
            currentBotMessage = null;
        });

        function sendMessage() {
            const messageInput = document.getElementById('message');
            const message = messageInput.value;
            if (message.trim() === '') return;

            const messagesDiv = document.getElementById('messages');
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');

            const userContent = document.createElement('div');
            userContent.classList.add('content');
            userContent.textContent = message;

            const userImage = document.createElement('img');
            userImage.src = '/static/images/man.png';

            userMessage.appendChild(userContent);
            userMessage.appendChild(userImage);
            messagesDiv.appendChild(userMessage);

            socket.emit('message', { question: message });
            messageInput.value = '';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function applyDarkMode() {
            document.body.classList.add('dark-mode');
        }

        function checkDarkMode() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('themes') === 'dark') {
                applyDarkMode();
            }
        }

        checkDarkMode();