/* =====================================
LIFEPHONE CORE
===================================== */

let balance = 45600000000;
let debt = 0;

const notifications = [];

/* =====================================
CLOCK
===================================== */

function updateClock() {

```
const now = new Date();

const hours =
    String(now.getHours())
    .padStart(2,"0");

const minutes =
    String(now.getMinutes())
    .padStart(2,"0");

const timeString =
    hours + ":" + minutes;

const lockTime =
    document.getElementById("lockTime");

const statusTime =
    document.getElementById("statusTime");

if(lockTime)
    lockTime.textContent = timeString;

if(statusTime)
    statusTime.textContent = timeString;

const dateElement =
    document.getElementById("lockDate");

if(dateElement){

    dateElement.textContent =
        now.toLocaleDateString(
            "en-US",
            {
                weekday:"long",
                month:"long",
                day:"numeric"
            }
        );
}
```

}

updateClock();
setInterval(updateClock,1000);

/* =====================================
BALANCE
===================================== */

function formatMoney(amount){

```
return "$" +
Number(amount)
.toLocaleString("en-US");
```

}

function updateBalance(){

```
const balanceElements =
    document.querySelectorAll(
        "#balanceValue,.card-balance"
    );

balanceElements.forEach(el => {

    el.textContent =
        formatMoney(balance);

});
```

}

updateBalance();

/* =====================================
NOTIFICATIONS
===================================== */

function pushNotification(
title,
message
){

```
notifications.unshift({
    title,
    message
});

renderNotifications();
```

}

function renderNotifications(){

```
const container =
    document.getElementById(
        "notifications"
    );

if(!container) return;

container.innerHTML = "";

notifications.forEach(item=>{

    const div =
        document.createElement("div");

    div.className =
        "notification";

    div.innerHTML = `

        <strong>
            ${item.title}
        </strong>

        <br>

        ${item.message}

    `;

    div.style.padding = "15px";
    div.style.marginBottom = "10px";
    div.style.background = "#151515";
    div.style.borderRadius = "18px";

    container.appendChild(div);

});
```

}

/* =====================================
LOCKSCREEN
===================================== */

const lockscreen =
document.getElementById(
"lockscreen"
);

let unlockStart = 0;

if(lockscreen){

```
lockscreen.addEventListener(
    "touchstart",
    () => {

        unlockStart =
        Date.now();

    }
);

lockscreen.addEventListener(
    "click",
    unlockPhone
);
```

}

function unlockPhone(){

```
lockscreen.classList.add(
    "hidden"
);

pushNotification(
    "LifePhone",
    "Phone unlocked"
);
```

}

/* =====================================
APPS OPEN
===================================== */

const apps =
document.querySelectorAll(
".app"
);

apps.forEach(app=>{

```
app.addEventListener(
    "click",
    () => {

        const id =
        app.dataset.app;

        openApp(id);

    }
);
```

});

function openApp(id){

```
const screen =
document.getElementById(id);

if(!screen) return;

screen.style.display =
"flex";

requestAnimationFrame(()=>{

    screen.classList.add(
        "open"
    );

});
```

}

function closeApp(screen){

```
screen.classList.remove(
    "open"
);

setTimeout(()=>{

    screen.style.display =
    "none";

},250);
```

}

document
.querySelectorAll(".closeApp")
.forEach(btn=>{

```
btn.addEventListener(
    "click",
    ()=>{

        const screen =
        btn.closest(".screen");

        closeApp(screen);

    }
);
```

});

/* =====================================
NOTIFICATION CENTER
===================================== */

const notificationCenter =
document.getElementById(
"notificationCenter"
);

let notificationOpen =
false;

const statusBar =
document.getElementById(
"statusBar"
);

if(statusBar){

```
statusBar.addEventListener(
    "click",
    ()=>{

        notificationOpen =
        !notificationOpen;

        if(notificationOpen){

            notificationCenter
            .classList
            .add("open");

        }
        else{

            notificationCenter
            .classList
            .remove("open");

        }

    }
);
```

}

/* =====================================
WALLET
===================================== */

const walletPay =
document.getElementById(
"walletPay"
);

if(walletPay){

```
walletPay.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "Amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        balance -= amount;

        updateBalance();

        pushNotification(
            "Wallet",
            "-" +
            formatMoney(amount)
        );

    }
);
```

}

const walletTransfer =
document.getElementById(
"walletTransfer"
);

if(walletTransfer){

```
walletTransfer.addEventListener(
    "click",
    ()=>{

        const card =
        prompt(
            "Card Number"
        );

        if(!card) return;

        const amount =
        Number(
            prompt(
                "Amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        balance -= amount;

        updateBalance();

        pushNotification(
            "Transfer",
            formatMoney(amount)
        );

    }
);
```

}

/* =====================================
START NOTIFICATIONS
===================================== */

pushNotification(
"Bank",
"Balance available"
);

pushNotification(
"Crypto",
"Market opened"
);

pushNotification(
"Business",
"Ready for investment"
);

/* =====================================
RANDOM EVENTS
===================================== */

setInterval(()=>{

```
const events = [

    "Bitcoin moved",
    "New business available",
    "Loan rates updated",
    "Store discount available",
    "Market opportunity found"

];

const event =
events[
    Math.floor(
        Math.random() *
        events.length
    )
];

pushNotification(
    "LifePhone",
    event
);
```

},30000);
/* =====================================
PART 2
LOANS + SHOP + FOOD + TRANSACTIONS
===================================== */

/* =====================================
TRANSACTIONS
===================================== */

const transactions = [];

function addTransaction(
type,
amount,
description
){

```
transactions.unshift({

    type,
    amount,
    description,
    date:new Date()

});
```

}

function transactionDate(date){

```
return date.toLocaleString(
    "en-US"
);
```

}

function openTransactions(){

```
let text = "";

if(
    transactions.length === 0
){

    text =
    "No transactions";

}
else{

    transactions.forEach(t=>{

        text +=

        "[" +
        transactionDate(t.date) +
        "] " +

        t.type +

        " " +

        formatMoney(
            t.amount
        ) +

        " - " +

        t.description +

        "\n\n";

    });

}

alert(text);
```

}

/* =====================================
HISTORY BUTTON
===================================== */

const historyButton =
document.getElementById(
"historyButton"
);

if(historyButton){

```
historyButton.addEventListener(
    "click",
    openTransactions
);
```

}

/* =====================================
BANK RECEIVE
===================================== */

const receiveMoney =
document.getElementById(
"receiveMoney"
);

if(receiveMoney){

```
receiveMoney.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "Receive amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        balance += amount;

        updateBalance();

        addTransaction(
            "IN",
            amount,
            "Money received"
        );

        pushNotification(
            "Bank",
            "+" +
            formatMoney(amount)
        );

    }
);
```

}

/* =====================================
BANK SEND
===================================== */

const sendMoney =
document.getElementById(
"sendMoney"
);

if(sendMoney){

```
sendMoney.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "Send amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        if(
            amount > balance
        ){

            alert(
                "Not enough money"
            );

            return;
        }

        balance -= amount;

        updateBalance();

        addTransaction(
            "OUT",
            amount,
            "Bank transfer"
        );

        pushNotification(
            "Bank",
            "-" +
            formatMoney(amount)
        );

    }
);
```

}

/* =====================================
LOANS
===================================== */

function takeLoan(amount){

```
balance += amount;

debt += amount;

updateBalance();

addTransaction(
    "IN",
    amount,
    "Loan"
);

pushNotification(
    "Loan Approved",
    formatMoney(amount)
);
```

}

document
.querySelectorAll(".loanButton")
.forEach(button=>{

```
button.addEventListener(
    "click",
    ()=>{

        const text =
        button.textContent;

        const amount =
        Number(
            text
            .replace("Loan","")
            .replace("$","")
            .replaceAll(",","")
            .trim()
        );

        takeLoan(amount);

    }
);
```

});

/* =====================================
REPAY
===================================== */

const repayLoan =
document.getElementById(
"repayLoan"
);

if(repayLoan){

```
repayLoan.addEventListener(
    "click",
    ()=>{

        if(
            debt <= 0
        ){

            alert(
                "No debt"
            );

            return;
        }

        const amount =
        Number(
            prompt(
                "Repay amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        if(
            amount > balance
        ){

            alert(
                "Not enough money"
            );

            return;
        }

        const payment =
        Math.min(
            amount,
            debt
        );

        balance -= payment;

        debt -= payment;

        updateBalance();

        addTransaction(
            "OUT",
            payment,
            "Loan payment"
        );

        pushNotification(
            "Loan",
            "Remaining debt: " +
            formatMoney(debt)
        );

    }
);
```

}

/* =====================================
SHOP
===================================== */

function buyItem(
name,
price
){

```
if(
    balance < price
){

    alert(
        "Not enough money"
    );

    return;
}

balance -= price;

updateBalance();

addTransaction(
    "OUT",
    price,
    name
);

pushNotification(
    "Purchase",
    name
);
```

}

document
.querySelectorAll(
".buyProduct"
)
.forEach(button=>{

```
button.addEventListener(
    "click",
    ()=>{

        const product =
        button.parentElement;

        const text =
        product.textContent;

        const match =
        text.match(
            /\$([\d,]+)/
        );

        if(!match) return;

        const price =
        Number(
            match[1]
            .replaceAll(",","")
        );

        const name =
        text.split("-")[0]
        .trim();

        buyItem(
            name,
            price
        );

    }
);
```

});

/* =====================================
FOOD
===================================== */

document
.querySelectorAll(
".food-item button"
)
.forEach(button=>{

```
button.addEventListener(
    "click",
    ()=>{

        const item =
        button.parentElement;

        const text =
        item.textContent;

        const match =
        text.match(
            /\$([\d,]+)/
        );

        if(!match) return;

        const price =
        Number(
            match[1]
            .replaceAll(",","")
        );

        const name =
        text.split("-")[0]
        .trim();

        if(
            balance < price
        ){

            alert(
                "Not enough money"
            );

            return;
        }

        balance -= price;

        updateBalance();

        addTransaction(
            "OUT",
            price,
            "Food: " + name
        );

        pushNotification(
            "Order",
            name +
            " arriving soon"
        );

    }
);
```

});

/* =====================================
DEBT CHECK
===================================== */

setInterval(()=>{

```
if(
    debt <= 0
) return;

const interest =
Math.floor(
    debt * 0.002
);

debt += interest;

pushNotification(
    "Loan Interest",
    "+" +
    formatMoney(
        interest
    )
);
```

},120000);

/* =====================================
START TRANSACTION
===================================== */

addTransaction(
"SYSTEM",
balance,
"Initial Balance"
);
/* =====================================
PART 3
CRYPTO + BUSINESSES + PASSIVE INCOME
===================================== */

/* =====================================
CRYPTO MARKET
===================================== */

let cryptoPortfolio = {

```
btc:0,
eth:0
```

};

let cryptoPrices = {

```
btc:68542,
eth:3521
```

};

function updateCryptoUI(){

```
const btcPrice =
document.getElementById(
    "btcPrice"
);

const ethPrice =
document.getElementById(
    "ethPrice"
);

const btcOwned =
document.getElementById(
    "btcOwned"
);

const ethOwned =
document.getElementById(
    "ethOwned"
);

if(btcPrice)
    btcPrice.textContent =
    "$" +
    cryptoPrices.btc.toLocaleString();

if(ethPrice)
    ethPrice.textContent =
    "$" +
    cryptoPrices.eth.toLocaleString();

if(btcOwned)
    btcOwned.textContent =
    cryptoPortfolio.btc.toFixed(4);

if(ethOwned)
    ethOwned.textContent =
    cryptoPortfolio.eth.toFixed(4);
```

}

function randomPriceChange(){

```
const btcChange =
(Math.random() * 8) - 4;

const ethChange =
(Math.random() * 10) - 5;

cryptoPrices.btc +=
cryptoPrices.btc *
(btcChange / 100);

cryptoPrices.eth +=
cryptoPrices.eth *
(ethChange / 100);

updateCryptoUI();
```

}

setInterval(
randomPriceChange,
30000
);

/* =====================================
BUY BTC
===================================== */

const buyBTC =
document.getElementById(
"buyBTC"
);

if(buyBTC){

```
buyBTC.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "USD amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        if(
            amount > balance
        ){

            alert(
                "Not enough money"
            );

            return;

        }

        const coins =
        amount /
        cryptoPrices.btc;

        balance -= amount;

        cryptoPortfolio.btc +=
        coins;

        updateBalance();
        updateCryptoUI();

        addTransaction(
            "OUT",
            amount,
            "BTC purchase"
        );

        pushNotification(
            "Crypto",
            "Bought BTC"
        );

    }
);
```

}

/* =====================================
SELL BTC
===================================== */

const sellBTC =
document.getElementById(
"sellBTC"
);

if(sellBTC){

```
sellBTC.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "BTC amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        if(
            amount >
            cryptoPortfolio.btc
        ){

            alert(
                "Not enough BTC"
            );

            return;

        }

        const value =
        amount *
        cryptoPrices.btc;

        cryptoPortfolio.btc -=
        amount;

        balance += value;

        updateBalance();
        updateCryptoUI();

        addTransaction(
            "IN",
            value,
            "BTC sold"
        );

        pushNotification(
            "Crypto",
            "BTC sold"
        );

    }
);
```

}

/* =====================================
BUY ETH
===================================== */

const buyETH =
document.getElementById(
"buyETH"
);

if(buyETH){

```
buyETH.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "USD amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        if(
            amount > balance
        ){

            alert(
                "Not enough money"
            );

            return;

        }

        const coins =
        amount /
        cryptoPrices.eth;

        balance -= amount;

        cryptoPortfolio.eth +=
        coins;

        updateBalance();
        updateCryptoUI();

        addTransaction(
            "OUT",
            amount,
            "ETH purchase"
        );

        pushNotification(
            "Crypto",
            "Bought ETH"
        );

    }
);
```

}

/* =====================================
SELL ETH
===================================== */

const sellETH =
document.getElementById(
"sellETH"
);

if(sellETH){

```
sellETH.addEventListener(
    "click",
    ()=>{

        const amount =
        Number(
            prompt(
                "ETH amount"
            )
        );

        if(
            !amount ||
            amount <= 0
        ) return;

        if(
            amount >
            cryptoPortfolio.eth
        ){

            alert(
                "Not enough ETH"
            );

            return;

        }

        const value =
        amount *
        cryptoPrices.eth;

        cryptoPortfolio.eth -=
        amount;

        balance += value;

        updateBalance();
        updateCryptoUI();

        addTransaction(
            "IN",
            value,
            "ETH sold"
        );

        pushNotification(
            "Crypto",
            "ETH sold"
        );

    }
);
```

}

/* =====================================
BUSINESSES
===================================== */

const businesses = [];

function buyBusiness(
name,
cost,
income
){

```
if(
    balance < cost
){

    alert(
        "Not enough money"
    );

    return;

}

balance -= cost;

businesses.push({

    name,
    income

});

updateBalance();

addTransaction(
    "OUT",
    cost,
    name
);

pushNotification(
    "Business",
    "Purchased " +
    name
);
```

}

document
.querySelectorAll(
".buyBusiness"
)
.forEach(button=>{

```
button.addEventListener(
    "click",
    ()=>{

        const type =
        button.dataset.type;

        switch(type){

            case "restaurant":

                buyBusiness(
                    "Restaurant",
                    500000,
                    3000
                );

            break;

            case "hotel":

                buyBusiness(
                    "Hotel",
                    5000000,
                    22000
                );

            break;

            case "factory":

                buyBusiness(
                    "Factory",
                    50000000,
                    150000
                );

            break;

            case "airline":

                buyBusiness(
                    "Airline",
                    500000000,
                    750000
                );

            break;

        }

    }
);
```

});

/* =====================================
BUSINESS LIST
===================================== */

function updateBusinessList(){

```
const list =
document.getElementById(
    "businessList"
);

if(!list) return;

list.innerHTML = "";

businesses.forEach(b=>{

    const div =
    document.createElement(
        "div"
    );

    div.textContent =
    b.name +
    " | $" +
    b.income.toLocaleString() +
    "/cycle";

    list.appendChild(
        div
    );

});
```

}

/* =====================================
PASSIVE INCOME
===================================== */

setInterval(()=>{

```
let total = 0;

businesses.forEach(b=>{

    total += b.income;

});

if(
    total <= 0
) return;

balance += total;

updateBalance();

addTransaction(
    "IN",
    total,
    "Business Income"
);

pushNotification(
    "Income",
    "+" +
    formatMoney(total)
);

updateBusinessList();
```

},60000);

/* =====================================
CRYPTO START
===================================== */

updateCryptoUI();
updateBusinessList();
/* =====================================
PART 4
APP STORE + SAFARI + STOCKS
REAL ESTATE + ACHIEVEMENTS
===================================== */

/* =====================================
APP STORE
===================================== */

const installedApps = [

```
"Wallet",
"Bank",
"Crypto",
"Business",
"Safari",
"Settings"
```

];

const storeApps = [

```
{
    name:"Amazon",
    price:0
},

{
    name:"Ozon",
    price:0
},

{
    name:"Wildberries",
    price:0
},

{
    name:"Food",
    price:0
},

{
    name:"Stocks",
    price:0
},

{
    name:"Real Estate",
    price:0
}
```

];

function installApp(name){

```
if(
    installedApps.includes(
        name
    )
){

    alert(
        "Already installed"
    );

    return;

}

installedApps.push(name);

addTransaction(
    "SYSTEM",
    0,
    "Installed " + name
);

pushNotification(
    "App Store",
    name + " installed"
);

updateInstalledApps();
```

}

function updateInstalledApps(){

```
const container =
document.getElementById(
    "installedApps"
);

if(!container) return;

container.innerHTML = "";

installedApps.forEach(app=>{

    const div =
    document.createElement(
        "div"
    );

    div.className =
    "installed-app";

    div.textContent =
    app;

    container.appendChild(
        div
    );

});
```

}

document
.querySelectorAll(
".installApp"
)
.forEach(button=>{

```
button.addEventListener(
    "click",
    ()=>{

        installApp(
            button.dataset.app
        );

    }
);
```

});

/* =====================================
SAFARI
===================================== */

const fakeSites = [

```
{
    name:"Luxury Cars",
    cost:250000
},

{
    name:"Private Jet",
    cost:50000000
},

{
    name:"Mega Yacht",
    cost:150000000
},

{
    name:"Gaming PC",
    cost:7000
},

{
    name:"Premium Villa",
    cost:45000000
}
```

];

function openFakeSite(){

```
let text = "";

fakeSites.forEach(site=>{

    text +=

    site.name +

    " - $" +

    site.cost
    .toLocaleString()

    + "\n";

});

const choice =
prompt(

    text +

    "\nType exact item name"

);

if(!choice) return;

const site =
fakeSites.find(

    s=>

    s.name
    .toLowerCase()

    ===

    choice
    .toLowerCase()

);

if(!site){

    alert(
        "Item not found"
    );

    return;

}

if(
    balance < site.cost
){

    alert(
        "Not enough money"
    );

    return;

}

balance -= site.cost;

updateBalance();

addTransaction(
    "OUT",
    site.cost,
    site.name
);

pushNotification(
    "Safari Purchase",
    site.name
);
```

}

const safariShop =
document.getElementById(
"safariShop"
);

if(safariShop){

```
safariShop.addEventListener(
    "click",
    openFakeSite
);
```

}

/* =====================================
STOCK MARKET
===================================== */

let stocks = {

```
apple:194,
tesla:266,
nvidia:174
```

};

const stockPortfolio = {

```
apple:0,
tesla:0,
nvidia:0
```

};

function updateStocks(){

```
Object.keys(stocks)
.forEach(key=>{

    const element =
    document.getElementById(
        key + "Price"
    );

    if(element){

        element.textContent =
        "$" +
        stocks[key]
        .toFixed(2);

    }

});
```

}

setInterval(()=>{

```
stocks.apple +=
stocks.apple *
((Math.random()*6)-3)/100;

stocks.tesla +=
stocks.tesla *
((Math.random()*8)-4)/100;

stocks.nvidia +=
stocks.nvidia *
((Math.random()*10)-5)/100;

updateStocks();
```

},25000);

function buyStock(
symbol
){

```
const shares =
Number(
    prompt(
        "Shares"
    )
);

if(
    !shares ||
    shares <= 0
) return;

const cost =
shares *
stocks[symbol];

if(
    cost > balance
){

    alert(
        "Not enough money"
    );

    return;

}

balance -= cost;

stockPortfolio[symbol] +=
shares;

updateBalance();

addTransaction(
    "OUT",
    cost,
    symbol + " stock"
);
```

}

function sellStock(
symbol
){

```
const shares =
Number(
    prompt(
        "Shares"
    )
);

if(
    !shares ||
    shares <= 0
) return;

if(
    shares >
    stockPortfolio[symbol]
){

    alert(
        "Not enough shares"
    );

    return;

}

const value =
shares *
stocks[symbol];

stockPortfolio[symbol] -=
shares;

balance += value;

updateBalance();

addTransaction(
    "IN",
    value,
    symbol + " stock"
);
```

}

/* =====================================
REAL ESTATE
===================================== */

const properties = [];

function buyProperty(
name,
cost,
rent
){

```
if(
    balance < cost
){

    alert(
        "Not enough money"
    );

    return;

}

balance -= cost;

properties.push({

    name,
    rent

});

updateBalance();

addTransaction(
    "OUT",
    cost,
    name
);

pushNotification(
    "Property",
    name + " acquired"
);
```

}

setInterval(()=>{

```
let totalRent = 0;

properties.forEach(p=>{

    totalRent +=
    p.rent;

});

if(
    totalRent <= 0
) return;

balance += totalRent;

updateBalance();

addTransaction(
    "IN",
    totalRent,
    "Rent Income"
);
```

},90000);

/* =====================================
ACHIEVEMENTS
===================================== */

const achievements = [];

function unlockAchievement(
title
){

```
if(
    achievements.includes(
        title
    )
) return;

achievements.push(
    title
);

pushNotification(
    "Achievement",
    title
);
```

}

setInterval(()=>{

```
if(
    balance >=
    100000000
){

    unlockAchievement(
        "100 Million Club"
    );

}

if(
    balance >=
    1000000000
){

    unlockAchievement(
        "Billionaire"
    );

}

if(
    businesses.length >= 5
){

    unlockAchievement(
        "Business Empire"
    );

}

if(
    cryptoPortfolio.btc >= 10
){

    unlockAchievement(
        "Bitcoin Whale"
    );

}
```

},10000);

/* =====================================
RANDOM EVENTS
===================================== */

const events = [

```
{
    title:"Investment Success",
    reward:500000
},

{
    title:"Startup Exit",
    reward:2500000
},

{
    title:"Market Crash",
    reward:-500000
},

{
    title:"Tax Audit",
    reward:-1000000
}
```

];

setInterval(()=>{

```
const event =
events[
    Math.floor(
        Math.random() *
        events.length
    )
];

balance +=
event.reward;

updateBalance();

addTransaction(
    "EVENT",
    event.reward,
    event.title
);

pushNotification(
    event.title,
    formatMoney(
        event.reward
    )
);
```

},300000);

/* =====================================
FINAL BOOT
===================================== */

updateInstalledApps();
updateStocks();

pushNotification(
"iLife",
"System Ready"
);
/* =====================================
PART 5
CORE SYSTEM
===================================== */

let balance = 45600000000;
let debt = 0;

/* =====================================
FORMAT MONEY
===================================== */

function formatMoney(value){

```
return "$" +
Number(value)
.toLocaleString(
    "en-US",
    {
        maximumFractionDigits:2
    }
);
```

}

/* =====================================
UPDATE BALANCE
===================================== */

function updateBalance(){

```
const balanceValue =
document.getElementById(
    "balanceValue"
);

if(balanceValue){

    balanceValue.textContent =
    formatMoney(balance);

}
```

}

/* =====================================
CLOCK
===================================== */

function updateClock(){

```
const now =
new Date();

const time =
now.toLocaleTimeString(
    "en-US",
    {
        hour:"2-digit",
        minute:"2-digit"
    }
);

const date =
now.toLocaleDateString(
    "en-US",
    {
        weekday:"long",
        month:"long",
        day:"numeric"
    }
);

const lockTime =
document.getElementById(
    "lockTime"
);

const statusTime =
document.getElementById(
    "statusTime"
);

const lockDate =
document.getElementById(
    "lockDate"
);

if(lockTime)
    lockTime.textContent =
    time;

if(statusTime)
    statusTime.textContent =
    time;

if(lockDate)
    lockDate.textContent =
    date;
```

}

updateClock();

setInterval(
updateClock,
1000
);

/* =====================================
LOCKSCREEN
===================================== */

const lockscreen =
document.getElementById(
"lockscreen"
);

const homeScreen =
document.getElementById(
"homeScreen"
);

if(lockscreen){

```
lockscreen.addEventListener(
    "click",
    ()=>{

        lockscreen.style.display =
        "none";

        if(homeScreen){

            homeScreen.style.display =
            "flex";

        }

    }
);
```

}

/* =====================================
APPS
===================================== */

const apps =
document.querySelectorAll(
".app"
);

const screens =
document.querySelectorAll(
".screen"
);

apps.forEach(app=>{

```
app.addEventListener(
    "click",
    ()=>{

        const id =
        app.dataset.app;

        screens.forEach(s=>{

            s.style.display =
            "none";

        });

        const target =
        document.getElementById(
            id
        );

        if(target){

            target.style.display =
            "flex";

        }

    }
);
```

});

document
.querySelectorAll(
".closeApp"
)
.forEach(button=>{

```
button.addEventListener(
    "click",
    ()=>{

        screens.forEach(s=>{

            s.style.display =
            "none";

        });

    }
);
```

});

/* =====================================
NOTIFICATIONS
===================================== */

function pushNotification(
title,
text
){

```
const notifications =
document.getElementById(
    "notifications"
);

if(!notifications)
    return;

const div =
document.createElement(
    "div"
);

div.className =
"notification";

div.innerHTML =

    "<strong>" +
    title +
    "</strong><br>" +

    text;

notifications.prepend(
    div
);

setTimeout(()=>{

    div.remove();

},30000);
```

}

/* =====================================
STARTUP
===================================== */

pushNotification(
"LifePhone",
"Welcome back"
);

/* =====================================
SAFARI
===================================== */

const browserInput =
document.getElementById(
"browserAddress"
);

const browserContent =
document.getElementById(
"browserContent"
);

function loadSite(name){

```
if(!browserContent)
    return;

switch(
    name.toLowerCase()
){

    case "marketplace":

        browserContent.innerHTML =

        "<h2>Marketplace</h2>" +

        "<p>Buy products</p>";

    break;

    case "luxury cars":

        browserContent.innerHTML =

        "<h2>Luxury Cars</h2>" +

        "<p>Supercars available</p>";

    break;

    case "crypto news":

        browserContent.innerHTML =

        "<h2>Crypto News</h2>" +

        "<p>BTC is moving today.</p>";

    break;

    case "food delivery":

        browserContent.innerHTML =

        "<h2>Food Delivery</h2>" +

        "<p>Order food.</p>";

    break;

    default:

        browserContent.innerHTML =

        "<h2>" +
        name +
        "</h2>" +

        "<p>Website not found.</p>";

}
```

}

document
.querySelectorAll(
".site"
)
.forEach(site=>{

```
site.addEventListener(
    "click",
    ()=>{

        loadSite(
            site.textContent
        );

    }
);
```

});

if(browserInput){

```
browserInput.addEventListener(
    "keydown",
    e=>{

        if(
            e.key === "Enter"
        ){

            loadSite(
                browserInput.value
            );

        }

    }
);
```

}

/* =====================================
WALLET
===================================== */

const walletTransfer =
document.getElementById(
"walletTransfer"
);

if(walletTransfer){

```
walletTransfer.onclick =
()=>{

    const card =
    prompt(
        "Card Number"
    );

    if(!card) return;

    const amount =
    Number(
        prompt(
            "Amount"
        )
    );

    if(
        !amount ||
        amount <= 0
    ) return;

    if(
        amount > balance
    ){

        alert(
            "Not enough money"
        );

        return;

    }

    balance -= amount;

    updateBalance();

    pushNotification(
        "Transfer",
        formatMoney(amount)
    );

};
```

}
