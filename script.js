document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalInfo = document.getElementById('originalInfo');
    const compressedInfo = document.getElementById('compressedInfo');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;
    let compressedImage = null;

    // 监听图片上传
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 显示原图信息
        originalInfo.textContent = `大小: ${formatFileSize(file.size)}`;
        
        // 读取并显示原图
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                originalPreview.src = originalImage.src;
                compressImage(); // 压缩图片
            }
        }
        reader.readAsDataURL(file);
    });

    // 监听质量滑块变化
    qualitySlider.addEventListener('input', function(e) {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 压缩图片函数
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置canvas尺寸
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        // 在canvas上绘制图片
        ctx.drawImage(originalImage, 0, 0);

        // 将canvas转换为压缩后的图片
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;

        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        compressedInfo.textContent = `大小: ${formatFileSize(compressedSize)}`;

        // 启用下载按钮
        downloadBtn.disabled = false;
        compressedImage = compressedDataUrl;
    }

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', function() {
        if (!compressedImage) return;

        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedImage;
        link.click();
    });

    // 文件大小格式化函数
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 