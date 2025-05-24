// Biến toàn cục
let fingerprintScanned = false;
let contractFilled = false;
let fingerprintsStamped = { wife: false, husband: false, witness: false };

// Dữ liệu mẫu hợp đồng
const contractData = {
    serialNumber: "000001/VNMN",
    wifeName: "Vũ Tuyết Nhi",
    wifeBirthday: "06/03/2010",
    wifeEthnicity: "Kinh",
    wifeNationality: "Việt Nam",
    wifeAddress: "Thái Bình, Việt Nam.",
    wifeID: "xxxxxxxxxxx, xxxxxx, Thái Bình, Việt Nam.",
    husbandName: "Trần Tiến Tuân",
    husbandBirthday: "19/01/2007",
    husbandEthnicity: "Kinh",
    husbandNationality: "Việt Nam",
    husbandAddress: "Nam Định, Việt Nam.",
    husbandID: "xxxxxxxxxxx, xxxxxx, Nam Định, Việt Nam.",
    agreement1: "1. Hai bên cam kết cùng nhau xây dựng gia đình hạnh phúc, tôn trọng và yêu thương nhau.",
    agreement2: "2. Yêu Vũ Tuyết Nhi.",
    agreement3: "3. Yêu Tuân.",
    agreement4: "4. Luôn ở bên cạnh nhau, luôn che chở, giúp đỡ, là điểm tựa của nhau.",
    agreement5: "5. Một lòng chung thuỷ.",
    contractLocation: "Việt Nam",
    contractDate: "24 tháng 05 năm 2025"
};
 
// Hàm khởi tạo khi trang được tải
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fingerprintScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('btnWelcomeContinue').onclick = () => {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('fingerprintScreen').style.display = 'flex';
        // Thêm 2 vùng quét vân tay nếu chưa có
        const fingerprintArea = document.getElementById('fingerprintArea');
        if (!document.getElementById('finger1')) {
            fingerprintArea.innerHTML = `
                <p class="fingerprint-instruction" style="font-size:16px;margin-bottom:18px;color:#8B0000;font-weight:bold;">Đặt hai ngón tay vào 2 vùng bên dưới</p>
                <div style="display:flex;justify-content:center;align-items:center;gap:18px;position:relative;width:100%;height:110px;">
                    <div class="finger-zone" id="finger1" style="width:70px;height:100px;border:2.5px dashed #E75480;border-radius:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(255,240,245,0.7);position:relative;transition:box-shadow 0.2s;"></div>
                    <div class="fingerprint-icon" id="fingerprintIcon" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;pointer-events:none;">
                        <!-- SVG fingerprint đẹp, gradient -->
                        <svg width="70" height="90" viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="fpGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#E75480"/>
                                    <stop offset="100%" stop-color="#8B0000"/>
                                </linearGradient>
                            </defs>
                            <ellipse cx="35" cy="45" rx="28" ry="40" stroke="url(#fpGrad)" stroke-width="3"/>
                            <ellipse cx="35" cy="45" rx="20" ry="30" stroke="#8B0000" stroke-width="2"/>
                            <ellipse cx="35" cy="45" rx="12" ry="18" stroke="#E75480" stroke-width="1.5"/>
                            <path d="M35 80 Q40 70 35 60 Q30 70 35 80" stroke="#8B0000" stroke-width="1.5" fill="none"/>
                            <path d="M35 65 Q42 60 35 55 Q28 60 35 65" stroke="#E75480" stroke-width="1" fill="none"/>
                        </svg>
                    </div>
                    <div class="finger-zone" id="finger2" style="width:70px;height:100px;border:2.5px dashed #E75480;border-radius:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(255,240,245,0.7);position:relative;transition:box-shadow 0.2s;"></div>
                </div>
                <div class="fingerprint-progress" style="margin-top:18px;">
                    <div class="fingerprint-progress-bar" id="fingerprintProgressBar"></div>
                </div>
            `;
        }
        initWelcomeScreen();
    };
    // Cảnh báo khi người dùng muốn thoát trang
    let confirmExitActive = false;
    let exitFinger1 = false, exitFinger2 = false, exitInterval;
    function showExitOverlay() {
        if (document.getElementById('exitOverlay')) return;
        confirmExitActive = true;
        const overlay = document.createElement('div');
        overlay.id = 'exitOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(255,240,245,0.98)';
        overlay.style.zIndex = 9999;
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.innerHTML = `
            <div style="background:#fff;border:2px solid #E75480;padding:32px 24px;border-radius:12px;box-shadow:0 4px 24px #e7548033;text-align:center;max-width:90vw;">
                <h2 style="color:#8B0000;margin-bottom:16px;">Nếu bạn thoát thì bạn sẽ bị ế suốt cuộc đời đó!</h2>
                <p style="font-size:17px;">Nếu vẫn muốn thoát, hãy đặt đồng thời 2 ngón tay vào 2 vùng bên dưới trong 2 giây.</p>
                <div style="display:flex;justify-content:center;align-items:center;gap:32px;margin:32px 0 18px 0;">
                    <div id="exitFinger1" style="width:70px;height:100px;border:2px dashed #E75480;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;"></div>
                    <div style="width:70px;"></div>
                    <div id="exitFinger2" style="width:70px;height:100px;border:2px dashed #E75480;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;"></div>
                </div>
                <div id="exitProgressBar" style="width:80%;height:10px;background:#f0f0f0;border-radius:5px;margin:0 auto;overflow:hidden;">
                    <div id="exitProgress" style="width:0%;height:100%;background:#E75480;border-radius:5px;transition:width 0.3s;"></div>
                </div>
                <p style="margin-top:18px;color:#888;font-size:14px;">Chỉ khi giữ đồng thời cả 2 vùng thì mới xác nhận thoát.</p>
                <button id="exitCancelBtn" style="margin-top:18px;padding:8px 20px;border-radius:6px;background:#8B0000;color:#fff;border:none;font-size:15px;cursor:pointer;">Hủy</button>
            </div>
        `;
        document.body.appendChild(overlay);
        // Sự kiện giữ 2 ngón tay
        const ef1 = document.getElementById('exitFinger1');
        const ef2 = document.getElementById('exitFinger2');
        const progress = document.getElementById('exitProgress');
        let percent = 0;
        function bothDown() { return exitFinger1 && exitFinger2; }
        function startExitProgress() {
            if (exitInterval) return;
            percent = 0;
            progress.style.width = '0%';
            exitInterval = setInterval(() => {
                percent += 2.5;
                progress.style.width = percent + '%';
                if (percent >= 100) {
                    clearInterval(exitInterval);
                    window.removeEventListener('beforeunload', beforeUnloadHandler);
                    confirmExitActive = false;
                    document.body.removeChild(overlay);
                    window.location.href = 'about:blank';
                }
            }, 50);
        }
        function stopExitProgress() {
            clearInterval(exitInterval);
            exitInterval = null;
            progress.style.width = '0%';
        }
        // Mouse
        ef1.onmousedown = () => { exitFinger1 = true; if (bothDown()) startExitProgress(); };
        ef2.onmousedown = () => { exitFinger2 = true; if (bothDown()) startExitProgress(); };
        ef1.onmouseup = () => { exitFinger1 = false; stopExitProgress(); };
        ef2.onmouseup = () => { exitFinger2 = false; stopExitProgress(); };
        // Touch
        ef1.ontouchstart = (e) => { e.preventDefault(); exitFinger1 = true; if (bothDown()) startExitProgress(); };
        ef2.ontouchstart = (e) => { e.preventDefault(); exitFinger2 = true; if (bothDown()) startExitProgress(); };
        ef1.ontouchend = () => { exitFinger1 = false; stopExitProgress(); };
        ef2.ontouchend = () => { exitFinger2 = false; stopExitProgress(); };
        // Cancel
        document.getElementById('exitCancelBtn').onclick = () => {
            confirmExitActive = false;
            document.body.removeChild(overlay);
        };
    }
    function beforeUnloadHandler(e) {
        if (!confirmExitActive) {
            showExitOverlay();
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    }
    window.addEventListener('beforeunload', beforeUnloadHandler);
    // Chặn phím tắt đóng tab (Ctrl+W, Cmd+W)
    window.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W')) {
            showExitOverlay();
            e.preventDefault();
        }
    });
});

function initWelcomeScreen() {
    // Lấy lại các vùng quét mới
    const finger1 = document.getElementById('finger1');
    const finger2 = document.getElementById('finger2');
    const fingerprintIcon = document.getElementById('fingerprintIcon');
    const progressBar = document.getElementById('fingerprintProgressBar');
    let progress = 0;
    let finger1Down = false, finger2Down = false, progressInterval;

    function bothFingersDown() {
        return finger1Down && finger2Down;
    }
    function startScan() {
        if (fingerprintScanned) return;
        fingerprintIcon.classList.add('active');
        finger1.style.boxShadow = '0 0 12px 2px #E75480';
        finger2.style.boxShadow = '0 0 12px 2px #E75480';
        if (progressInterval) clearInterval(progressInterval); // fix: clear interval nếu còn
        progressInterval = setInterval(() => {
            progress += 2;
            progressBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(progressInterval);
                progressInterval = null; // fix: reset biến
                fingerprintScanned = true;
                fingerprintIcon.classList.remove('active');
                finger1.style.boxShadow = '';
                finger2.style.boxShadow = '';
                showFingerprintSuccessMessage();
            }
        }, 50);
    }
    function stopScan() {
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = null; // fix: reset biến
        fingerprintIcon.classList.remove('active');
        finger1.style.boxShadow = '';
        finger2.style.boxShadow = '';
        if (progress < 100) setTimeout(() => { progress = 0; progressBar.style.width = '0%'; }, 300);
    }
    // Mouse events
    finger1.onmousedown = () => { finger1Down = true; if (bothFingersDown() && !progressInterval && !fingerprintScanned) startScan(); };
    finger2.onmousedown = () => { finger2Down = true; if (bothFingersDown() && !progressInterval && !fingerprintScanned) startScan(); };
    finger1.onmouseup = () => { finger1Down = false; stopScan(); };
    finger2.onmouseup = () => { finger2Down = false; stopScan(); };
    // Touch events
    finger1.ontouchstart = (e) => { e.preventDefault(); finger1Down = true; if (bothFingersDown() && !progressInterval && !fingerprintScanned) startScan(); };
    finger2.ontouchstart = (e) => { e.preventDefault(); finger2Down = true; if (bothFingersDown() && !progressInterval && !fingerprintScanned) startScan(); };
    finger1.ontouchend = () => { finger1Down = false; stopScan(); };
    finger2.ontouchend = () => { finger2Down = false; stopScan(); };
}

function showFingerprintSuccessMessage() {
    const welcomeContent = document.querySelector('#fingerprintScreen .welcome-content');
    welcomeContent.innerHTML = `<h2 style="color:#8B0000;text-align:center;margin-top:32px;">✔️ Đã quét thành công vân tay của bạn!</h2><p style="font-size:18px;text-align:center;margin:16px 0 0 0;">Giấy kết hôn đang dần hoàn thiện...<br>Chờ một chút nhé, giấy đăng ký kết hôn sẽ hiện ra ngay...</p>`;
    document.getElementById('fingerprintScreen').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('fingerprintScreen').style.display = 'none';
        showContract();
    }, 3000);
}

function showContract() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('fingerprintScreen').style.display = 'none';
    document.getElementById('contractContainer').style.display = 'block';
    setTimeout(startTypingEffect, 500);
    initFingerprintBoxes();
}

function startTypingEffect() {
    // Đặt lại các dòng thỏa thuận về trạng thái ban đầu đều nhau
    for (let i = 1; i <= 5; i++) {
        const el = document.getElementById('agreement' + i);
        if (el) {
            el.innerHTML = '';
            el.style.display = 'block';
            el.style.width = '100%';
            el.style.maxWidth = '600px';
            el.style.margin = '8px auto';
            el.style.fontFamily = 'monospace';
            el.style.fontSize = '15px';
            el.style.letterSpacing = '1.5px';
            el.style.borderBottom = '1.5px dotted #b48b8b';
            el.style.background = 'rgba(255,255,255,0.7)';
            el.style.padding = '4px 0 4px 12px';
            el.style.borderRadius = '6px';
            el.textContent = '........................................................................................................';
        }
    }
    const fieldOrder = [
        'serialNumber',
        'wifeName', 'wifeBirthday', 'wifeEthnicity', 'wifeNationality', 'wifeAddress', 'wifeID',
        'husbandName', 'husbandBirthday', 'husbandEthnicity', 'husbandNationality', 'husbandAddress', 'husbandID',
        'agreement1', 'agreement2', 'agreement3', 'agreement4', 'agreement5',
        'contractLocation', 'contractDate'
    ];
    let currentFieldIndex = 0;
    function typeNextField() {
        if (currentFieldIndex >= fieldOrder.length) {
            contractFilled = true;
            showSaveButton();
            return;
        }
        const fieldId = fieldOrder[currentFieldIndex];
        const element = document.getElementById(fieldId);
        const text = contractData[fieldId] || '';
        if (!element) { currentFieldIndex++; typeNextField(); return; }
        let originalLine = element.innerText || element.textContent || '';
        originalLine = originalLine.replace(/\n/g, '');
        if (originalLine.length < text.length) {
            originalLine = originalLine + '.'.repeat(text.length - originalLine.length);
        }
        element.style.borderBottom = '1px dotted #666';
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.style.display = 'inline-block';
        cursor.style.width = '2px';
        cursor.style.height = '14px';
        cursor.style.backgroundColor = '#8B0000';
        cursor.style.animation = 'blink 1s infinite';
        cursor.style.marginLeft = '2px';
        cursor.style.verticalAlign = 'middle';
        element.innerHTML = '';
        element.appendChild(cursor);
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex <= text.length) {
                let filled = text.substring(0, charIndex);
                let remain = originalLine.substring(charIndex);
                element.innerHTML = '';
                element.appendChild(document.createTextNode(filled + remain));
                element.appendChild(cursor);
                playTypingSound();
                charIndex++;
            } else {
                clearInterval(typeInterval);
                element.innerHTML = text;
                element.style.borderBottom = '';
                if (element.contains(cursor)) element.removeChild(cursor);
                currentFieldIndex++;
                setTimeout(typeNextField, 300);
            }
        }, 50);
    }
    typeNextField();
}

function showSaveButton() {
    const oldBtn = document.getElementById('btnSaveImage');
    if (oldBtn) oldBtn.remove();
    const saveButton = document.createElement('button');
    saveButton.id = 'btnSaveImage';
    saveButton.className = 'btn-save-image';
    saveButton.textContent = 'Lưu ảnh giấy kết hôn';
    saveButton.onclick = () => {
        // Tải ảnh vừa chụp màn hình hợp đồng về máy
        const imgUrl = 'assets/img_love.png';
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = 'giay_ket_hon.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    document.getElementById('contractContainer').appendChild(saveButton);
}

function saveContractAsImage() {
    const contract = document.querySelector('.container');
    html2canvas(contract, { backgroundColor: '#fff', useCORS: true, scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        let jsPDFInstance;
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDFInstance = window.jspdf.jsPDF;
        } else if (window.jsPDF) {
            jsPDFInstance = window.jsPDF;
        } else {
            alert('Không tìm thấy jsPDF!');
            return;
        }
        const pdf = new jsPDFInstance({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = 210, pageHeight = 297;
        const imgWidth = canvas.width, imgHeight = canvas.height;
        const pdfImgWidth = imgWidth * 0.264583, pdfImgHeight = imgHeight * 0.264583;
        let pdfWidth = pageWidth, pdfHeight = (pdfImgHeight * pdfWidth) / pdfImgWidth;
        if (pdfHeight > pageHeight) {
            pdfHeight = pageHeight;
            pdfWidth = (pdfImgWidth * pdfHeight) / pdfImgHeight;
        }
        const x = (pageWidth - pdfWidth) / 2, y = 10;
        pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
        pdf.save('hop_dong_hon_nhan.pdf');
    });
}

function playTypingSound() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 800 + Math.random() * 400;
    gainNode.gain.value = 0.05;
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);
    oscillator.stop(context.currentTime + 0.1);
}

function initFingerprintBoxes() {
    // Nếu không có các ô vân tay thì bỏ qua
}
