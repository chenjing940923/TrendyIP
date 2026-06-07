/* ==========================================================================
   朝陽科大視傳系 IP 角色創作競賽 - 互動邏輯 JavaScript
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // 1. 初始化 Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. 倒數計時器 (Countdown Timer)
    // 設定截止日期：2027 年 10 月 30 日 23:59:59
    const deadline = new Date("2027-10-30T23:59:59").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = deadline - now;
        
        // 取得時間單元
        const dSpan = document.getElementById("days");
        const hSpan = document.getElementById("hours");
        const mSpan = document.getElementById("minutes");
        const sSpan = document.getElementById("seconds");
        const mbbSpan = document.getElementById("mbb-countdown");
        
        if (difference < 0) {
            // 截止
            const timerContainer = document.getElementById("countdown-timer");
            if (timerContainer) {
                timerContainer.innerHTML = "<div class='deadline-reached'>徵件截止</div>";
            }
            if (mbbSpan) {
                mbbSpan.textContent = "徵件截止";
            }
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // 補零
        const dStr = days.toString().padStart(2, "0");
        const hStr = hours.toString().padStart(2, "0");
        const mStr = minutes.toString().padStart(2, "0");
        const sStr = seconds.toString().padStart(2, "0");
        
        if (dSpan) dSpan.textContent = dStr;
        if (hSpan) hSpan.textContent = hStr;
        if (mSpan) mSpan.textContent = mStr;
        if (sSpan) sSpan.textContent = sStr;
        
        if (mbbSpan) {
            mbbSpan.textContent = `${dStr}天 ${hStr}:${mStr}:${sStr}`;
        }
    }
    
    // 立即更新一次並每秒執行
    updateCountdown();
    setInterval(updateCountdown, 1000);


    // 3. 滾動監聽導覽列 (ScrollSpy)
    const sections = document.querySelectorAll(".content-section");
    const tabItems = document.querySelectorAll(".tab-item");
    const headerHeight = 70; // Header height
    const tabHeight = 60;    // Tabs height
    const offset = headerHeight + tabHeight + 20; // 總偏移量防止內容被擋住
    
    // 平滑錨點滾動偏移微調
    tabItems.forEach(tab => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - offset + 10;
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 監聽滾動以點亮對應 Tab
    window.addEventListener("scroll", function () {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + offset + 50; // 微調臨界點
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute("id");
            }
        });
        
        if (currentSectionId) {
            tabItems.forEach(tab => {
                tab.classList.remove("active");
                if (tab.getAttribute("href") === `#${currentSectionId}`) {
                    tab.classList.add("active");
                    
                    // 自動滑動 Tabs 選單使其在行動裝置上可見
                    const stickyTabs = document.getElementById("sticky-tabs");
                    if (stickyTabs) {
                        const tabRect = tab.getBoundingClientRect();
                        const parentRect = stickyTabs.getBoundingClientRect();
                        if (tabRect.left < parentRect.left) {
                            stickyTabs.scrollLeft -= (parentRect.left - tabRect.left + 15);
                        } else if (tabRect.right > parentRect.right) {
                            stickyTabs.scrollLeft += (tabRect.right - parentRect.right + 15);
                        }
                    }
                }
            });
        }
    });


    // 4. 五大設計人格卡片 3D 翻轉控制
    const personaCards = document.querySelectorAll(".persona-card");
    personaCards.forEach(card => {
        card.addEventListener("click", function (e) {
            // 如果點擊的是背面的「返回」按鈕
            if (e.target.classList.contains("btn-card-close")) {
                e.stopPropagation();
                this.classList.remove("flipped");
                return;
            }
            
            // 切換翻轉狀態
            this.classList.toggle("flipped");
        });
    });


    // 5. 互動分頁面板切換 (資格試算、模擬投票、報名表單)
    const interactTabBtns = document.querySelectorAll(".interact-tab-btn");
    const interactPanels = document.querySelectorAll(".interact-panel");
    
    interactTabBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const targetPanelId = this.getAttribute("data-target");
            
            // 切換按鈕 active 樣式
            interactTabBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            
            // 切換面板顯示
            interactPanels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.getAttribute("id") === targetPanelId) {
                    panel.classList.add("active");
                }
            });
        });
    });


    // 6. 報名資格與團隊獎金試算器 (Calc)
    const btnCalc = document.getElementById("btn-calc");
    if (btnCalc) {
        btnCalc.addEventListener("click", function () {
            const teamSizeInput = document.getElementById("team-size");
            const submissionInput = document.getElementById("submission-count");
            const resultBox = document.getElementById("calc-result");
            const qualifyBadge = document.getElementById("qualify-badge");
            const qualifyText = document.getElementById("qualify-text");
            const maxRewardText = document.getElementById("max-reward-text");
            
            const size = parseInt(teamSizeInput.value) || 0;
            const count = parseInt(submissionInput.value) || 0;
            
            resultBox.classList.remove("hide");
            
            let isSizeOk = (size >= 2 && size <= 3);
            let isCountOk = (count >= 1 && count <= 5);
            
            if (isSizeOk && isCountOk) {
                // 符合資格
                qualifyBadge.textContent = "符合資格";
                qualifyBadge.className = "badge pass";
                qualifyText.innerHTML = `您的團隊為 <strong>${size} 人</strong>，預估投稿 <strong>${count} 組</strong> 系列作品。<br>✓ 符合企劃書規定（組隊 2-3 人，每組投稿上限 5 組）。`;
                
                // 計算預估團隊最大爭取獎金：金獎首獎 10萬，若多組參賽可包辦多獎項 (最高 33萬總額)
                // 首獎為 10萬
                maxRewardText.textContent = "NT$ 100,000 (首獎金獎)";
            } else {
                // 不符合資格
                qualifyBadge.textContent = "不符合資格";
                qualifyBadge.className = "badge fail";
                
                let errReason = [];
                if (!isSizeOk) {
                    errReason.push(`⚠️ 團隊人數為 ${size} 人不合規（規定每組須 2 至 3 人）。`);
                }
                if (!isCountOk) {
                    if (count < 1) {
                        errReason.push(`⚠️ 投稿組數不可為 0（需至少投稿 1 組作品）。`);
                    } else {
                        errReason.push(`⚠️ 投稿為 ${count} 組超出規定（每組參賽團隊最多可投稿 5 組作品）。`);
                    }
                }
                qualifyText.innerHTML = errReason.join("<br>");
                maxRewardText.textContent = "NT$ 0";
            }
        });
    }


    // 7. 設計人格人氣投票 (Vote)
    // 預設打氣票數
    const defaultVotes = {
        1: 324,
        2: 485,
        3: 291,
        4: 198,
        5: 356
    };
    
    // 初始化或讀取本地投票狀態
    let votedPersonaId = localStorage.getItem("contest_voted_id");
    
    // 載入與計算百分比函數
    function renderVotes(votedId = null) {
        // 算總票數
        let totalVotes = 0;
        for (let key in defaultVotes) {
            // 如果本地有投過某人，增加那人的票數
            if (votedId && parseInt(votedId) === parseInt(key)) {
                defaultVotes[key] = defaultVotes[key] + 1; // 假裝投了一票
            }
            totalVotes += defaultVotes[key];
        }
        
        // 更新顯示與進度條
        for (let key in defaultVotes) {
            const countSpan = document.getElementById(`count-${key}`);
            const bar = document.getElementById(`bar-${key}`);
            const btn = document.querySelector(`.btn-vote[data-id='${key}']`);
            
            const currentVotes = defaultVotes[key];
            const percent = ((currentVotes / totalVotes) * 100).toFixed(1);
            
            if (countSpan) countSpan.textContent = `${currentVotes} 票 (${percent}%)`;
            if (bar) bar.style.width = `${percent}%`;
            
            if (votedId) {
                if (btn) {
                    if (parseInt(votedId) === parseInt(key)) {
                        btn.textContent = "已為他打氣";
                        btn.classList.add("voted");
                    } else {
                        btn.textContent = "投票結束";
                        btn.disabled = true;
                        btn.style.opacity = "0.5";
                        btn.style.cursor = "default";
                    }
                }
            }
        }
    }
    
    // 初次載入
    renderVotes(votedPersonaId);
    
    // 綁定投票按鈕點擊
    const voteButtons = document.querySelectorAll(".btn-vote");
    voteButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            if (votedPersonaId) {
                alert("您已經投過票囉！每人限為一種人格打氣一次。");
                return;
            }
            
            const id = this.getAttribute("data-id");
            votedPersonaId = id;
            localStorage.setItem("contest_voted_id", id);
            
            // 重新渲染並增加票數
            renderVotes(id);
            alert("感謝您的支持！投票打氣成功！");
        });
    });


    // 8. 模擬報名表單檔案上傳區美化 (Form File Upload)
    function setupFileUpload(dropZoneId, inputId, textDisplayId) {
        const dropZone = document.getElementById(dropZoneId);
        const input = document.getElementById(inputId);
        const textDisplay = document.getElementById(textDisplayId);
        
        if (!dropZone || !input || !textDisplay) return;
        
        dropZone.addEventListener("click", () => input.click());
        
        input.addEventListener("change", function () {
            if (this.files && this.files.length > 0) {
                const fileName = this.files[0].name;
                textDisplay.textContent = fileName;
                dropZone.classList.add("file-selected");
            } else {
                textDisplay.textContent = "未選取檔案";
                dropZone.classList.remove("file-selected");
            }
        });
        
        // 拖曳處理 Drag and Drop
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.style.borderColor = "var(--color-neon-pink)";
        });
        
        dropZone.addEventListener("dragleave", () => {
            dropZone.style.borderColor = "var(--glass-border)";
        });
        
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.style.borderColor = "var(--glass-border)";
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                input.files = e.dataTransfer.files;
                const fileName = e.dataTransfer.files[0].name;
                textDisplay.textContent = fileName;
                dropZone.classList.add("file-selected");
                
                // 觸發手動 change 驗證
                const event = new Event('change');
                input.dispatchEvent(event);
            }
        });
    }
    
    setupFileUpload("drop-zone-img", "file-img", "file-name-img");
    setupFileUpload("drop-zone-ai", "file-ai", "file-name-ai");


    // 9. 模擬報名表單防呆驗證
    const mockForm = document.getElementById("mock-register-form");
    const formSuccessBox = document.getElementById("form-success-box");
    
    if (mockForm) {
        mockForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // 取得各個輸入欄位與錯誤提示
            const teamName = document.getElementById("team-name");
            const leader = document.getElementById("member-leader");
            const phone = document.getElementById("leader-phone");
            const email = document.getElementById("leader-email");
            const school = document.getElementById("school-name");
            const fileImg = document.getElementById("file-img");
            const fileAi = document.getElementById("file-ai");
            const agreement = document.getElementById("agreement");
            
            let isValid = true;
            
            // 1. 驗證隊伍名稱
            if (!teamName.value.trim()) {
                showError("err-team-name", "請填寫參賽隊伍名稱");
                teamName.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-team-name");
                teamName.style.borderColor = "";
            }
            
            // 2. 驗證隊長姓名
            if (!leader.value.trim()) {
                showError("err-leader", "請填寫隊長姓名");
                leader.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-leader");
                leader.style.borderColor = "";
            }
            
            // 3. 驗證電話
            const phonePattern = /^09\d{8}$/;
            if (!phone.value.trim()) {
                showError("err-phone", "請填寫聯絡電話");
                phone.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else if (!phonePattern.test(phone.value.trim())) {
                showError("err-phone", "請輸入格式正確的台灣手機號碼 (例如: 0912345678)");
                phone.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-phone");
                phone.style.borderColor = "";
            }
            
            // 4. 驗證 Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError("err-email", "請填寫聯絡 Email");
                email.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else if (!emailPattern.test(email.value.trim())) {
                showError("err-email", "請輸入正確的 Email 信箱格式");
                email.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-email");
                email.style.borderColor = "";
            }
            
            // 5. 驗證學校科系
            if (!school.value.trim()) {
                showError("err-school", "請填寫就讀學校與科系");
                school.style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-school");
                school.style.borderColor = "";
            }
            
            // 6. 驗證圖檔上傳
            if (!fileImg.files || fileImg.files.length === 0) {
                showError("err-file-img", "請上傳五隻角色合成的設計圖檔 (JPG/PNG)");
                document.getElementById("drop-zone-img").style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-file-img");
                document.getElementById("drop-zone-img").style.borderColor = "";
            }
            
            // 7. 驗證 AI 檔上傳
            if (!fileAi.files || fileAi.files.length === 0) {
                showError("err-file-ai", "請上傳 Illustrator 原始設計檔 (.ai)");
                document.getElementById("drop-zone-ai").style.borderColor = "var(--color-neon-pink)";
                isValid = false;
            } else {
                hideError("err-file-ai");
                document.getElementById("drop-zone-ai").style.borderColor = "";
            }
            
            // 8. 驗證同意條款
            if (!agreement.checked) {
                showError("err-agreement", "您必須勾選並同意大賽注意事項與原創聲明才能報名");
                isValid = false;
            } else {
                hideError("err-agreement");
            }
            
            // 如果全部驗證通過
            if (isValid) {
                mockForm.classList.add("hide");
                formSuccessBox.classList.remove("hide");
                
                // 動態累加瀏覽人次與關注人數作為模擬效果
                const followCount = document.getElementById("follow-count");
                if (followCount) {
                    let currentFollow = parseInt(followCount.textContent.replace(",", "")) || 843;
                    followCount.textContent = (currentFollow + 1).toLocaleString();
                }
            }
        });
        
        // 重置表單按鈕
        const btnResetForm = document.getElementById("btn-reset-form");
        if (btnResetForm) {
            btnResetForm.addEventListener("click", function () {
                mockForm.reset();
                mockForm.classList.remove("hide");
                formSuccessBox.classList.add("hide");
                
                // 重置上傳區視覺
                document.getElementById("drop-zone-img").classList.remove("file-selected");
                document.getElementById("file-name-img").textContent = "未選取檔案";
                document.getElementById("drop-zone-ai").classList.remove("file-selected");
                document.getElementById("file-name-ai").textContent = "未選取檔案";
            });
        }
    }
    
    function showError(elementId, message) {
        const errSpan = document.getElementById(elementId);
        if (errSpan) {
            errSpan.textContent = message;
            errSpan.style.display = "block";
        }
    }
    
    function hideError(elementId) {
        const errSpan = document.getElementById(elementId);
        if (errSpan) {
            errSpan.style.display = "none";
        }
    }


    // 10. 分享按鈕模擬邏輯 (FB, Line, Copy Link)
    const btnShareFb = document.getElementById("share-fb");
    const btnShareLine = document.getElementById("share-line");
    const btnShareLink = document.getElementById("share-link");
    
    const pageUrl = window.location.href;
    const pageTitle = encodeURIComponent("快來參加朝陽科大視傳系設計人格 IP 角色創作競賽，總獎金高達 33 萬元！");
    
    if (btnShareFb) {
        btnShareFb.addEventListener("click", function () {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");
        });
    }
    
    if (btnShareLine) {
        btnShareLine.addEventListener("click", function () {
            window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${pageTitle}`, "_blank");
        });
    }
    
    if (btnShareLink) {
        btnShareLink.addEventListener("click", function () {
            navigator.clipboard.writeText(pageUrl).then(() => {
                alert("網頁連結已複製到剪貼簿，快分享給身邊的設計好手吧！");
            }).catch(err => {
                // fallback
                const tempInput = document.createElement("input");
                tempInput.value = pageUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
                alert("網頁連結已複製到剪貼簿！");
            });
        });
    }
});
