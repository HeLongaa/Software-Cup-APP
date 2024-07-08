document.getElementById('ppt-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const messageInput = document.getElementById('message').value;

            if (!messageInput) {
                alert('请输入内容');
                return;
            }

            const formData = new FormData(this);
            const loadingOverlay = document.getElementById('loading-overlay');
            const resultDiv = document.getElementById('result');

            loadingOverlay.style.display = 'block';
            resultDiv.innerHTML = '';

            fetch('/ppt/generate_ppt', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                loadingOverlay.style.display = 'none';
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <iframe
                    src='https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.ppt_url)}'
                    class="ppt-result">
                    </iframe>
                    <button class="button1" id="exit">取消</button>
                    <button class="button2" id="download">下载</button>
                `;
                document.getElementById('exit').addEventListener('click', function() {
                    var divs = document.getElementsByClassName('result');
                    for (var i = 0; i < divs.length; i++) {
                        divs[i].style.display = 'none';
                    }
                });

                document.getElementById('download').addEventListener('click', function() {
                    fetch(data.ppt_url)
                        .then(response => response.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = 'generated_ppt.pptx';  // 指定下载文件的名称
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(error => console.error('下载错误:', error));
                });
            })
            .catch(error => {
                loadingOverlay.style.display = 'none';
                resultDiv.innerHTML = `<p>发生错误: ${error}</p>`;
                console.error('Error:', error);
            });
        });




