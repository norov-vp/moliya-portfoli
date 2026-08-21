// =============================================
// 1. PRELOADER
// =============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 800);
});

// =============================================
// 2. MOBILE MENU
// =============================================
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// =============================================
// 3. HEADER SCROLL EFFECT
// =============================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// =============================================
// 4. BACK TO TOP
// =============================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// 5. AOS ANIMATION
// =============================================
AOS.init({
    once: true,
    duration: 800,
    offset: 50,
});

// =============================================
// 6. COUNTER ANIMATION
// =============================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.dataset.target);
    let current = 0;
    const increment = target / 60;
    const stepTime = 2000 / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target === 98 ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
        }
    }, stepTime);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => counterObserver.observe(num));

// =============================================
// 7. MINI CHARTS
// =============================================
function createMiniChart(id, color, data) {
    const container = document.getElementById(id);
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: color + '20',
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            animation: {
                duration: 1000
            }
        }
    });
}

const miniData1 = Array.from({ length: 20 }, () => Math.random() * 100 + 50);
const miniData2 = Array.from({ length: 20 }, () => Math.random() * 100 + 50);
const miniData3 = Array.from({ length: 20 }, () => Math.random() * 100 + 50);
const miniData4 = Array.from({ length: 20 }, () => Math.random() * 100 + 50);

setTimeout(() => {
    createMiniChart('miniChart1', '#22c55e', miniData1);
    createMiniChart('miniChart2', '#f59e0b', miniData2);
    createMiniChart('miniChart3', '#3b82f6', miniData3);
    createMiniChart('miniChart4', '#f472b6', miniData4);
}, 200);

// =============================================
// 8. MAIN CHART – BITCOIN
// =============================================
const ctx = document.getElementById('btcChart').getContext('2d');

function generateData(days, basePrice = 42000) {
    const labels = [];
    const prices = [];
    let price = basePrice;
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        labels.push(date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' }));
        price = price * (1 + (Math.random() - 0.5) * 0.02);
        prices.push(price);
    }
    return { labels, prices };
}

let currentData = generateData(30);
let chartInstance = null;

function createMainChart(labels, prices) {
    if (chartInstance) chartInstance.destroy();

    // SMA 30
    const sma = [];
    for (let i = 0; i < prices.length; i++) {
        if (i < 29) sma.push(null);
        else {
            const slice = prices.slice(i - 29, i + 1);
            sma.push(slice.reduce((a, b) => a + b, 0) / slice.length);
        }
    }

    // Bollinger Bands
    const bbUpper = [];
    const bbLower = [];
    for (let i = 0; i < prices.length; i++) {
        if (i < 29) {
            bbUpper.push(null);
            bbLower.push(null);
        } else {
            const slice = prices.slice(i - 29, i + 1);
            const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
            const std = Math.sqrt(slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length);
            bbUpper.push(mean + 2 * std);
            bbLower.push(mean - 2 * std);
        }
    }

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'BTC/USD',
                    data: prices,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.05)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: 2.5,
                },
                {
                    label: 'SMA 30',
                    data: sma,
                    borderColor: '#3b82f6',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'BB Upper',
                    data: bbUpper,
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderDash: [3, 3],
                    pointRadius: 0,
                    borderWidth: 1.5,
                    fill: false,
                },
                {
                    label: 'BB Lower',
                    data: bbLower,
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderDash: [3, 3],
                    pointRadius: 0,
                    borderWidth: 1.5,
                    fill: '+1',
                    backgroundColor: 'rgba(139, 92, 246, 0.03)',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.y === null) return 'Maʼlumot yoʻq';
                            return `$${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: value => `$${value.toFixed(0)}`,
                        color: textColor,
                    },
                    grid: { color: gridColor }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: textColor,
                        maxTicksLimit: 12,
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            }
        }
    });
}

createMainChart(currentData.labels, currentData.prices);

// =============================================
// 9. CHART FILTERS
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const range = parseInt(this.dataset.range);
        const newData = generateData(range);
        currentData = newData;
        createMainChart(newData.labels, newData.prices);
    });
});

// =============================================
// 10. DARK MODE – CHARTNI QAYTA CHIZISH
// =============================================
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTimeout(() => {
        createMainChart(currentData.labels, currentData.prices);
    }, 100);
});

// =============================================
// 11. CONTACT FORM
// =============================================
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Yuborildi!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.boxShadow = '';
            this.reset();
        }, 3000);

        console.log('Xabar yuborildi:', { name, email, message });
    }
});

// =============================================
// 12. SMOOTH SCROLL NAV
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('🚀 FinCore – Moliyaviy veb-sayt ishga tushdi!');
console.log('📱 Telegram: @norov_vp');