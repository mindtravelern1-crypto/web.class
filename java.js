console.log('JavaScript 已連接，準備進行互動...');

let visitorname = prompt('請輸入你的姓名');

if (visitorname === '' || visitorname === null){
    visitorname = '訪客'
}

window.alert('Hello '+ visitorname + ', 歡迎來到我的網站 ');

const logoElement = document.getElementById('main-logo');
logoElement.innerText  = '13135012 ' + visitorname  ;

const titleElement = document.getElementById('hero-logo');
titleElement.innerHTML  = '我的未來由<span class="highlight">'+ visitorname + '</span>主宰';

function changeColor (){
    const highlight = document.querySelector('.highlight');
    if (highlight.style.color === 'red'){
        highlight.style.color = ' #7cbcfd'
    }else {
        highlight.style.color = 'red';
    }
}

function ensureNotificationPermission() {
    if (window.Notification && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", { body: `Time for: ${task} at ${time}` });
    }
}

function scheduleReminder(task, time) {
    const now = new Date();
    const reminderTime = new Date(time);
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => notifyUser(task, time), delay);
    }
}

function createTodoItem(task, time) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const textSpan = document.createElement('span');
    textSpan.textContent = task;

    const timeSpan = document.createElement('span');
    timeSpan.textContent = time ? `提醒時間：${new Date(time).toLocaleString()}` : '沒有設定提醒時間';

    li.appendChild(textSpan);
    li.appendChild(timeSpan);

    li.onclick = function () {
        this.classList.toggle('completed');
    };

    li.ondblclick = function () {
        this.remove();
    };

    document.getElementById('todo-list').appendChild(li);

    if (time) {
        scheduleReminder(task, time);
    }
}

function populateTimeSelectors() {
    const hourSelect = document.getElementById('todo-hour');
    const minuteSelect = document.getElementById('todo-minute');

    for (let h = 0; h < 24; h++) {
        const option = document.createElement('option');
        option.value = String(h).padStart(2, '0');
        option.textContent = String(h).padStart(2, '0') + '時';
        hourSelect.appendChild(option);
    }

    for (let m = 0; m < 60; m++) {
        const option = document.createElement('option');
        option.value = String(m).padStart(2, '0');
        option.textContent = String(m).padStart(2, '0') + '分';
        minuteSelect.appendChild(option);
    }
}

populateTimeSelectors();

function addTodo() {
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const hourSelect = document.getElementById('todo-hour');
    const minuteSelect = document.getElementById('todo-minute');
    const newTodoText = input.value.trim();
    const reminderTime = dateInput.value ? dateInput.value + 'T' + hourSelect.value + ':' + minuteSelect.value : null;

    if (newTodoText !== '') {
        if (reminderTime) {
            ensureNotificationPermission();
        }
        createTodoItem(newTodoText, reminderTime);
        input.value = '';
        dateInput.value = '';
        hourSelect.selectedIndex = 0;
        minuteSelect.selectedIndex = 0;
    }
}

function parseChineseDateTime(message) {
    const now = new Date();
    let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const removeParts = [];
    let hasDate = false;
    let hasTime = false;

    const relativeDayMap = { '大後天': 3, '後天': 2, '明天': 1, '明日': 1, '今天': 0, '今日': 0 };
    for (const word in relativeDayMap) {
        if (message.includes(word)) {
            date.setDate(date.getDate() + relativeDayMap[word]);
            removeParts.push(word);
            hasDate = true;
            break;
        }
    }

    if (!hasDate) {
        const isoMatch = message.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
        if (isoMatch) {
            date = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
            removeParts.push(isoMatch[0]);
            hasDate = true;
        } else {
            const monthDayMatch = message.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[號日]/);
            if (monthDayMatch) {
                date.setMonth(parseInt(monthDayMatch[1], 10) - 1);
                date.setDate(parseInt(monthDayMatch[2], 10));
                removeParts.push(monthDayMatch[0]);
                hasDate = true;
            }
        }
    }

    let hour = null;
    let minute = 0;

    const hm24Match = message.match(/(\d{1,2}):(\d{2})/);
    if (hm24Match) {
        hour = parseInt(hm24Match[1], 10);
        minute = parseInt(hm24Match[2], 10);
        removeParts.push(hm24Match[0]);
        hasTime = true;
    } else {
        const cnHourMatch = message.match(/(上午|早上|凌晨|中午|下午|晚上|傍晚)?\s*(\d{1,2})\s*點\s*(\d{1,2})?\s*分?/);
        if (cnHourMatch) {
            hour = parseInt(cnHourMatch[2], 10);
            minute = cnHourMatch[3] ? parseInt(cnHourMatch[3], 10) : 0;
            const period = cnHourMatch[1];
            if ((period === '下午' || period === '晚上' || period === '傍晚') && hour < 12) {
                hour += 12;
            }
            removeParts.push(cnHourMatch[0]);
            hasTime = true;
        }
    }

    if (!hasDate && !hasTime) {
        return null;
    }

    date.setHours(hour !== null ? hour : 9, minute, 0, 0);

    return { date: date, removeParts: removeParts };
}

const todoToggleBtn = document.getElementById('todo-toggle-btn');
const todoSection = document.getElementById('todo-section');

todoToggleBtn.addEventListener('click', function () {
    todoSection.classList.toggle('hidden');
    ensureNotificationPermission();
});

const SendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const aiResponse = document.getElementById('ai-response');

SendBtn.addEventListener('click' , function(){
    const userMessage = userInput.value;

    if (userMessage===""){
        alert('請輸入指令')
        return;
    }

    setTimeout(function(){

    if (userMessage.startsWith('新增待辦') || userMessage.startsWith('提醒我')){
        const prefixLength = userMessage.startsWith('新增待辦') ? 4 : 3;
        let taskText = userMessage.slice(prefixLength).trim();

        const parsed = parseChineseDateTime(taskText);
        let reminderTime = null;

        if (parsed){
            reminderTime = parsed.date;
            parsed.removeParts.forEach(function(part){
                taskText = taskText.replace(part, '').trim();
            });
        }

        if (taskText === ''){
            aiResponse.innerText = 'AI 助理：請告訴我待辦事項內容，例如「新增待辦 買牛奶 明天下午6點」';
        } else {
            todoSection.classList.remove('hidden');
            if (reminderTime) {
                ensureNotificationPermission();
            }
            createTodoItem(taskText, reminderTime);
            aiResponse.innerText = reminderTime
                ? 'AI 助理：已新增待辦事項「' + taskText + '」，並設定提醒時間 ' + reminderTime.toLocaleString()
                : 'AI 助理：已新增待辦事項「' + taskText + '」，未設定提醒時間';
        }
    }
    else if (userMessage.includes('你好') || userMessage.includes('哈囉')){
        aiResponse.innerText='AI 助理：您好呀～今天過得好嗎？'
    } 
    else if (userMessage.includes('淺色') || userMessage.includes('白天')){
        document.body.className = "theme-light";
        aiResponse.innerText='AI 助理：已切換為淺色模式'
    }
    else if (userMessage.includes('駭客') || userMessage.includes('晚上')){
        document.body.className = "theme-matrix";
        aiResponse.innerText='AI 助理：已切換為駭客模式'
    } 
    else if (userMessage.includes('學校') || userMessage.includes('東吳大學')){
        aiResponse.innerText='AI 助理：東吳大學是一所歷史悠久的學校'
    } 
    else if (userMessage.includes('功能') || userMessage.includes('介紹')){
        aiResponse.innerText='AI 助理：我可以與您進行簡單的對話和介紹'
    } 
    else {
        aiResponse.innerText='AI 助理：我收到你的訊息「 ' + userMessage + ' 」了！請等下週接上雲端我就能完全理解了！'
    }

    },300);

    userInput.value = ""
});
