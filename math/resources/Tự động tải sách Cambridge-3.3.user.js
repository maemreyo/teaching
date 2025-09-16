// ==UserScript==
// @name         Tự động tải sách Cambridge
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Thêm tùy chọn độ trễ ngẫu nhiên và bỏ qua thông báo khi chụp ảnh.
// @author       Your Name & AI Assistant
// @match        https://elevate-s3.cambridge.org/*/extracted_books/*/OEBPS/text/page*.xhtml
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'cambridgeBatchDownloaderState';
    console.log("Cambridge Downloader Script v3.3: Đang chạy...");

    // =================================================================================
    // PHẦN 1: GIAO DIỆN ĐIỀU KHIỂN (Thêm ô nhập độ trễ)
    // =================================================================================
    function createControlPanel() {
        if (document.getElementById('batch-control-panel')) return;

        const panel = document.createElement('div');
        // ... (Mã tạo panel và các trường input cũ không đổi)
        panel.id = 'batch-control-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '10px', right: '10px', zIndex: '10000',
            backgroundColor: 'white', padding: '15px', border: '1px solid #ccc',
            borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontFamily: 'Arial, sans-serif'
        });

        const title = document.createElement('h3');
        title.textContent = 'Tải Hàng Loạt';
        Object.assign(title.style, { marginTop: '0', marginBottom: '10px', fontSize: '16px' });
        panel.appendChild(title);

        // Từ trang
        const startDiv = document.createElement('div');
        startDiv.style.marginBottom = '10px';
        const startLabel = document.createElement('label'); startLabel.textContent = 'Từ trang:'; startLabel.htmlFor = 'startPage'; Object.assign(startLabel.style, { display: 'inline-block', width: '90px' });
        const startInput = document.createElement('input'); startInput.type = 'number'; startInput.id = 'startPage'; startInput.value = '7'; Object.assign(startInput.style, { width: '60px', padding: '5px' });
        startDiv.appendChild(startLabel); startDiv.appendChild(startInput); panel.appendChild(startDiv);

        // Đến trang
        const endDiv = document.createElement('div');
        endDiv.style.marginBottom = '10px';
        const endLabel = document.createElement('label'); endLabel.textContent = 'Đến trang:'; endLabel.htmlFor = 'endPage'; Object.assign(endLabel.style, { display: 'inline-block', width: '90px' });
        const endInput = document.createElement('input'); endInput.type = 'number'; endInput.id = 'endPage'; endInput.value = '292'; Object.assign(endInput.style, { width: '60px', padding: '5px' });
        endDiv.appendChild(endLabel); endDiv.appendChild(endInput); panel.appendChild(endDiv);

        // **MỚI: Ô nhập độ trễ**
        const delayDiv = document.createElement('div');
        delayDiv.style.marginBottom = '15px';
        const delayLabel = document.createElement('label'); delayLabel.textContent = 'Độ trễ (giây):'; delayLabel.htmlFor = 'delaySeconds'; Object.assign(delayLabel.style, { display: 'inline-block', width: '90px' });
        const delayInput = document.createElement('input'); delayInput.type = 'number'; delayInput.id = 'delaySeconds'; delayInput.value = '3'; Object.assign(delayInput.style, { width: '60px', padding: '5px' });
        delayDiv.appendChild(delayLabel); delayDiv.appendChild(delayInput); panel.appendChild(delayDiv);

        // Các nút
        const startButton = document.createElement('button'); startButton.id = 'startButton'; startButton.textContent = 'Bắt đầu tải'; Object.assign(startButton.style, { width: '100%', padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }); panel.appendChild(startButton);
        const stopButton = document.createElement('button'); stopButton.id = 'stopButton'; stopButton.textContent = 'Dừng lại'; Object.assign(stopButton.style, { width: '100%', padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }); panel.appendChild(stopButton);

        document.body.appendChild(panel);
        startButton.addEventListener('click', startBatchDownload);
        stopButton.addEventListener('click', stopBatchDownload);
    }


    // =================================================================================
    // PHẦN 2: CÁC HÀM ĐIỀU KHIỂN (Cập nhật để dùng độ trễ mới)
    // =================================================================================

    function startBatchDownload() {
        const startPage = parseInt(document.getElementById('startPage').value, 10);
        const endPage = parseInt(document.getElementById('endPage').value, 10);
        const delay = parseInt(document.getElementById('delaySeconds').value, 10); // Lấy giá trị độ trễ

        if (isNaN(startPage) || isNaN(endPage) || startPage <= 0 || startPage > endPage) {
            alert('Vui lòng nhập số trang hợp lệ!'); return;
        }
        if (isNaN(delay) || delay < 0) {
            alert('Độ trễ không hợp lệ! Vui lòng nhập một số lớn hơn hoặc bằng 0.'); return;
        }

        const state = { isActive: true, startPage, endPage, currentPage: startPage, delay }; // Lưu độ trễ vào state
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        navigateToPage(startPage);
    }

    function stopBatchDownload() { /* ... không thay đổi ... */ localStorage.removeItem(STORAGE_KEY); alert('Đã dừng quá trình tải hàng loạt.'); location.reload(); }
    function navigateToPage(pageNumber) { /* ... không thay đổi ... */ const pageString = pageNumber.toString().padStart(3, '0'); const nextUrl = window.location.href.replace(/page\d+\.xhtml/, `page${pageString}.xhtml`); showStatusMessage(`Đang chuyển đến trang ${pageNumber}...`); window.location.href = nextUrl; }

    async function captureAndProceed() {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
        showStatusMessage(`Đang chụp trang ${state.currentPage} / ${state.endPage}...`);

        const backgroundImage = document.querySelector('body > div:first-of-type > img');
        const textContainer = document.querySelector('div.new');
        if (!backgroundImage || !textContainer) {
            alert('Lỗi: Không tìm thấy cấu trúc trang cần thiết. Đang dừng lại.'); stopBatchDownload(); return;
        }

        const originalTop = textContainer.style.top;
        textContainer.style.top = '0px';

        try {
            const canvas = await html2canvas(document.body, {
                width: backgroundImage.width, height: backgroundImage.height,
                x: 0, y: 0, scale: 2, useCORS: true, logging: false,
                // **MỚI: Bỏ qua thông báo trạng thái khi chụp ảnh**
                ignoreElements: (element) => element.id === 'status-message'
            });

            const link = document.createElement('a');
            const pageName = window.location.pathname.split('/').pop().replace('.xhtml', '');
            link.download = `cambridge-${pageName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            if (state.currentPage < state.endPage) {
                const nextState = { ...state, currentPage: state.currentPage + 1 };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));

                // **MỚI: Tính toán độ trễ thông minh**
                const baseDelayMs = (state.delay || 2) * 1000; // Độ trễ cơ bản từ người dùng
                const randomAdditionalDelayMs = Math.random() * 2000; // Cộng thêm ngẫu nhiên 0-2 giây
                const finalDelay = baseDelayMs + randomAdditionalDelayMs;

                showStatusMessage(`Tải thành công! Chờ ${Math.round(finalDelay / 1000)}s để sang trang ${nextState.currentPage}...`);
                setTimeout(() => navigateToPage(nextState.currentPage), finalDelay);
            } else {
                showStatusMessage('Hoàn tất! Đã tải xong tất cả các trang.', 5000);
                stopBatchDownload();
            }
        } catch (err) {
            console.error("Lỗi khi chụp ảnh trang:", err); alert(`Đã có lỗi xảy ra ở trang ${state.currentPage}.`); stopBatchDownload();
        } finally {
            textContainer.style.top = originalTop;
        }
    }

    function showStatusMessage(message, duration = 0) { /* ... không thay đổi ... */ let statusDiv = document.getElementById('status-message'); if (!statusDiv) { statusDiv = document.createElement('div'); statusDiv.id = 'status-message'; Object.assign(statusDiv.style, { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', padding: '15px 25px', borderRadius: '8px', zIndex: '10001', fontSize: '18px', }); document.body.appendChild(statusDiv); } statusDiv.textContent = message; if (duration > 0) { setTimeout(() => { if (statusDiv) statusDiv.remove(); }, duration); } }

    // =================================================================================
    // PHẦN 3: LOGIC CHÍNH KHI TẢI TRANG (Không thay đổi)
    // =================================================================================
    function main() { const state = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (state && state.isActive) { const urlMatch = window.location.href.match(/page(\d+)\.xhtml/); const currentPageInUrl = urlMatch ? parseInt(urlMatch[1], 10) : 0; if (currentPageInUrl === state.currentPage) { captureAndProceed(); } else { navigateToPage(state.currentPage); } } else { createControlPanel(); } }
    if (document.readyState === 'complete' || document.readyState === 'interactive') { main(); } else { document.addEventListener('DOMContentLoaded', main); }

})();