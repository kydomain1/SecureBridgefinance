// Main JavaScript for SecureBridgefinance

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }

    // Initialize articles on home page
    if (document.getElementById('articlesGrid')) {
        initializeArticles();
    }

    // Initialize article detail page
    if (document.querySelector('.article-detail')) {
        loadArticleDetail();
    }
});

// Articles Management
let currentCategory = 'all';

function initializeArticles() {
    // Category filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            displayArticles();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Initial display
    displayArticles();
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
}

function getFilteredArticles() {
    let filtered = articlesData;

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(article => article.category === currentCategory);
    }

    return filtered;
}

function displayArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    const filtered = getFilteredArticles();

    // Display all articles
    if (filtered.length === 0) {
        articlesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: #666;">No articles found. Try a different category.</p>';
    } else {
        articlesGrid.innerHTML = filtered.map(article => `
            <article class="article-card" onclick="navigateToArticle('${article.slug}')">
                <img src="${article.image}" alt="${article.title}" class="article-image">
                <div class="article-content">
                    <div class="article-category">${article.categoryName}</div>
                    <h2 class="article-title">${article.title}</h2>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span>${formatDate(article.date)}</span>
                        <a href="article.html?slug=${article.slug}" class="read-more">Read More →</a>
                    </div>
                </div>
            </article>
        `).join('');
    }
}


function navigateToArticle(slug) {
    window.location.href = `article.html?slug=${slug}`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Article Detail Page
function loadArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'index.html';
        return;
    }
    
    const article = articlesData.find(a => a.slug === slug);
    
    if (!article) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${article.title} - SecureBridgefinance`;
    
    // Populate article content
    document.querySelector('.article-detail-category').textContent = article.categoryName;
    document.querySelector('.article-detail-title').textContent = article.title;
    document.querySelector('.article-detail-date').textContent = formatDate(article.date);
    document.querySelector('.featured-image').src = article.image;
    document.querySelector('.featured-image').alt = article.title;
    document.querySelector('.article-body').innerHTML = article.content;
    
    // Add smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Smooth scroll animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe article cards
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelectorAll('.article-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
});

