// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    INITIAL_BALANCE: 1200000000000,
    STORAGE_KEY: 'gold_wallet_data',
    MAX_TRANSACTIONS: 50,
};

// ===== СОСТОЯНИЕ =====
let state = {
    balance: CONFIG.INITIAL_BALANCE,
    transactions: [],
};

// ===== DOM-ЭЛЕМЕНТЫ =====
const elements = {
    balanceDisplay: document.getElementById('balanceDisplay'),
    transactionsList: document.getElementById('transactionsList'),
    transferBtn: document.getElementById('transferBtn'),
    shopBtn: document.getElementById('shopBtn'),
    resetBtn: document.getElementById('resetBtn'),
    seeAllBtn: document.getElementById('seeAllBtn'),
    cardNumber: document.getElementById('cardNumber'),
    cardExpiry: document.getElementById('cardExpiry'),
    // Модалка перевода
    transferModal: document.getElementById('transferModal'),
    transferModalClose: document.getElementById('transferModalClose'),
    transferRecipient: document.getElementById('transferRecipient'),
    transferAmount: document.getElementById('transferAmount'),
    transferNote: document.getElementById('transferNote'),
    transferConfirm: document.getElementById('transferConfirm'),
    // Модалка покупки
    shopModal: document.getElementById('shopModal'),
    shopModalClose: document.getElementById('shopModalClose'),
    shopStore: document.getElementById('shopStore'),
    shopItem: document.getElementById('shopItem'),
    shopAmount: document.getElementById('shopAmount'),
    shopConfirm: document.getElementById('shopConfirm'),
};

// ===== ФОРМАТИРОВАНИЕ =====
function formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(timestamp) {
    return formatDate(timestamp) + ' в ' + formatTime(timestamp);
}

// ===== LOCALSTORAGE =====
function loadState() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.balance = parsed.balance ?? CONFIG.INITIAL_BALANCE;
            state.transactions = parsed.transactions ?? [];
            return true;
        }
    } catch (e) {
        console.warn('Ошибка загрузки:', e);
    }
    return false;
}

function saveState() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
            balance: state.balance,
            transactions: state.transactions,
        }));
    } catch (e) {
        console.warn('Ошибка сохранения:', e);
    }
}

// ===== ДОБАВЛЕНИЕ ТРАНЗАКЦИИ =====
function addTransaction(type, amount, title, description = '') {
    const transaction = {
        id: Date.now() + Math.random().toString(36).substr(2, 6),
        type: type, // 'earn', 'spend', 'transfer', 'shop'
        amount: Math.round(amount * 100) / 100,
        title: title,
        description: description,
        timestamp: Date.now(),
    };
    state.transactions.unshift(transaction);
    if (state.transactions.length > CONFIG.MAX_TRANSACTIONS) {
        state.transactions = state.transactions.slice(0, CONFIG.MAX_TRANSACTIONS);
    }
    saveState();
    renderTransactions();
}

// ===== ОБНОВЛЕНИЕ БАЛАНСА =====
function updateBalance(newBalance) {
    state.balance = Math.round(newBalance * 100) / 100;
    saveState();
    renderBalance();
}

// ===== РЕНДЕР БАЛАНСА =====
function renderBalance() {
    const formatted = formatCurrency(state.balance);
    if (elements.balanceDisplay.textContent !== formatted) {
        elements.balanceDisplay.textContent = formatted;
        elements.balanceDisplay.classList.remove('pop');
        void elements.balanceDisplay.offsetWidth;
        elements.balanceDisplay.classList.add('pop');
    }
}

// ===== РЕНДЕР ТРАНЗАКЦИЙ =====
function renderTransactions() {
    const list = elements.transactionsList;
    if (state.transactions.length === 0) {
        list.innerHTML = `<div class="empty-transactions">Нет операций</div>`;
        return;
    }

    let html = '';
    const showCount = 5;
    const transactionsToShow = state.transactions.slice(0, showCount);

    transactionsToShow.forEach(tx => {
        let sign, amountClass, icon;
        const amount = formatCurrency(tx.amount);

        switch (tx.type) {
            case 'earn':
                sign = '+';
                amountClass = 'positive';
                icon = '💰 ';
                break;
            case 'spend':
                sign = '−';
                amountClass = 'negative';
                icon = '💳 ';
                break;
            case 'transfer':
                sign = '−';
                amountClass = 'transfer';
                icon = '⇄ ';
                break;
            case 'shop':
                sign = '−';
                amountClass = 'negative';
                icon = '🛍 ';
                break;
            default:
                sign = '';
                amountClass = '';
                icon = '';
        }

        const title = icon + tx.title;
        const date = formatFullDate(tx.timestamp);
        const desc = tx.description ? tx.description : '';

        html += `
            <li class="transaction-item">
                <div class="transaction-info">
                    <span class="transaction-title">${title}</span>
                    ${desc ? `<span class="transaction-desc">${desc}</span>` : ''}
                    <span class="transaction-date">${date}</span>
                </div>
                <span class="transaction-amount ${amountClass}">${sign}${amount}</span>
            </li>
        `;
    });

    list.innerHTML = html;
}

// ===== ОТКРЫТИЕ/ЗАКРЫТИЕ МОДАЛОК =====
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// ===== ПЕРЕВОД =====
function handleTransfer() {
    const recipient = elements.transferRecipient.value.trim();
    const amount = parseFloat(elements.transferAmount.value);
    const note = elements.transferNote.value.trim();

    if (!recipient) {
        alert('Укажите получателя');
        return;
    }
    if (!amount || amount <= 0) {
        alert('Введите корректную сумму');
        return;
    }
    if (amount > state.balance) {
        alert('Недостаточно средств на счете');
        return;
    }

    const newBalance = state.balance - amount;
    updateBalance(newBalance);
    addTransaction('transfer', amount, 'Перевод → ' + recipient, note || 'Без комментария');

    // Очистка полей
    elements.transferRecipient.value = '';
    elements.transferAmount.value = '';
    elements.transferNote.value = '';
    closeModal(elements.transferModal);
}

// ===== ПОКУПКА =====
function handleShop() {
    const store = elements.shopStore.value;
    const item = elements.shopItem.value.trim();
    const amount = parseFloat(elements.shopAmount.value);

    if (!item) {
        alert('Введите название товара');
        return;
    }
    if (!amount || amount <= 0) {
        alert('Введите корректную сумму');
        return;
    }
    if (amount > state.balance) {
        alert('Недостаточно средств на счете');
        return;
    }

    const newBalance = state.balance - amount;
    updateBalance(newBalance);
    addTransaction('shop', amount, store, item);

    // Очистка полей
    elements.shopItem.value = '';
    elements.shopAmount.value = '';
    closeModal(elements.shopModal);
}

// ===== СБРОС =====
function handleReset() {
    if (confirm('Сбросить баланс и историю?')) {
        state.balance = CONFIG.INITIAL_BALANCE;
        state.transactions = [];
        saveState();
        renderBalance();
        renderTransactions();
    }
}

// ===== ПОКАЗАТЬ ВСЕ =====
function handleSeeAll() {
    const count = state.transactions.length;
    if (count === 0) {
        alert('Нет операций');
        return;
    }
    let message = '📋 ВСЕ ОПЕРАЦИИ\n' + '═'.repeat(35) + '\n\n';
    state.transactions.forEach((tx, index) => {
        let sign;
        switch (tx.type) {
            case 'earn': sign = '+'; break;
            case 'spend': sign = '−'; break;
            case 'transfer': sign = '⇄ −'; break;
            case 'shop': sign = '🛍 −'; break;
            default: sign = '';
        }
        const date = formatFullDate(tx.timestamp);
        message += `${index + 1}. ${tx.title}\n`;
        if (tx.description) message += `   ${tx.description}\n`;
        message += `   ${date}  ${sign}${formatCurrency(tx.amount)}\n\n`;
    });
    message += '═'.repeat(35) + '\n';
    message += `💰 Баланс: ${formatCurrency(state.balance)}`;
    alert(message);
}

// ===== ГЕНЕРАЦИЯ ДАННЫХ КАРТЫ =====
function generateCardNumber() {
    const parts = [];
    for (let i = 0; i < 4; i++) {
        const part = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        parts.push(part);
    }
    return parts.join('  ');
}

function generateExpiry() {
    const now = new Date();
    const year = now.getFullYear() + 4 + Math.floor(Math.random() * 4);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    return `${month}/${String(year).slice(2)}`;
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    // Загрузка состояния
    const loaded = loadState();
    if (!loaded) {
        state.balance = CONFIG.INITIAL_BALANCE;
        state.transactions = [];
        saveState();
    }

    // Данные карты
    elements.cardNumber.textContent = generateCardNumber();
    elements.cardExpiry.textContent = generateExpiry();

    // Рендер
    renderBalance();
    renderTransactions();

    // === Обработчики ===

    // Перевод
    elements.transferBtn.addEventListener('click', () => openModal(elements.transferModal));
    elements.transferModalClose.addEventListener('click', () => closeModal(elements.transferModal));
    elements.transferConfirm.addEventListener('click', handleTransfer);
    // Закрытие по клику на фон
    elements.transferModal.addEventListener('click', (e) => {
        if (e.target === elements.transferModal) closeModal(elements.transferModal);
    });
    // Enter в полях
    elements.transferAmount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleTransfer();
    });

    // Покупка
    elements.shopBtn.addEventListener('click', () => openModal(elements.shopModal));
    elements.shopModalClose.addEventListener('click', () => closeModal(elements.shopModal));
    elements.shopConfirm.addEventListener('click', handleShop);
    elements.shopModal.addEventListener('click', (e) => {
        if (e.target === elements.shopModal) closeModal(elements.shopModal);
    });
    elements.shopAmount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleShop();
    });

    // Сброс и "Все"
    elements.resetBtn.addEventListener('click', handleReset);
    elements.seeAllBtn.addEventListener('click', handleSeeAll);
}

document.addEventListener('DOMContentLoaded', init);
