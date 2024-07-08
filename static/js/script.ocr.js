function updateFileName(input) {
    const fileLabel = document.getElementById('file-label');
    const fileNameDisplay = document.getElementById('file-name');
    if (input.files && input.files.length > 0) {
        const fileName = input.files[0].name;
        fileLabel.textContent = fileName;
        fileNameDisplay.textContent = fileName;
    } else {
        fileLabel.textContent = '选择文件';
        fileNameDisplay.textContent = '';
    }
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/ocr/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        if (data.error) {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `<p>识别结果:</p><pre>${data.text.join('\n')}</pre>`;
        }

        document.getElementById('form-container').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


document.addEventListener("DOMContentLoaded", function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('themes') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    });