// Search Page JavaScript

let currentCategory = 'all';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', function() {
    // Get search term from URL
    const urlParams = new URLSearchParams(window.location.search);
    searchTerm = urlParams.get('q') || '';
    
    // Set search input value
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchTerm) {
        searchInput.value = searchTerm;
    }
    
    // Initialize search
    initializeSearch();
    performSearch();
});

function initializeSearch() {
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const newSearch = searchInput.value.trim();
            if (newSearch) {
                window.location.href = `search.html?q=${encodeURIComponent(newSearch)}`;
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const newSearch = searchInput.value.trim();
                if (newSearch) {
                    window.location.href = `search.html?q=${encodeURIComponent(newSearch)}`;
                }
            }
        });
    }
    
    // Category filter
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            performSearch();
        });
    });
}

function performSearch() {
    const results = getSearchResults();
    displaySearchResults(results);
    updateSearchInfo(results.length);
}

function getSearchResults() {
    let results = articlesData;
    
    // Filter by search term
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(article => 
            article.title.toLowerCase().includes(term) ||
            article.excerpt.toLowerCase().includes(term) ||
            article.categoryName.toLowerCase().includes(term) ||
            article.content.toLowerCase().includes(term)
        );
    }
    
    // Filter by category
    if (currentCategory !== 'all') {
        results = results.filter(article => article.category === currentCategory);
    }
    
    return results;
}

function displaySearchResults(results) {
    const grid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noResults');
    
    if (results.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Display all results
    grid.innerHTML = results.map(article => `
        <article class="article-card" onclick="navigateToArticle('${article.slug}')">
            <img src="${article.image}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <div class="article-category">${article.categoryName}</div>
                <h2 class="article-title">${highlightText(article.title, searchTerm)}</h2>
                <p class="article-excerpt">${highlightText(article.excerpt, searchTerm)}</p>
                <div class="article-meta">
                    <span>${formatDate(article.date)}</span>
                    <a href="article.html?slug=${article.slug}" class="read-more">Read More →</a>
                </div>
            </div>
        </article>
    `).join('');
}

function highlightText(text, term) {
    if (!term) return text;
    
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return text.replace(regex, '<mark style="background: #fff3cd; padding: 0 2px;">$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateSearchInfo(count) {
    const searchInfo = document.getElementById('searchInfo');
    
    if (searchTerm) {
        if (count === 0) {
            searchInfo.innerHTML = `
                <p style="color: #666; font-size: 1.1rem; margin: 2rem 0;">
                    No results found for "<strong>${searchTerm}</strong>"
                </p>
            `;
        } else {
            const categoryText = currentCategory === 'all' ? 'all categories' : getCategoryName(currentCategory);
            searchInfo.innerHTML = `
                <p style="color: #666; font-size: 1.1rem; margin: 2rem 0;">
                    Found <strong>${count}</strong> result${count !== 1 ? 's' : ''} for "<strong>${searchTerm}</strong>" in ${categoryText}
                </p>
            `;
        }
    } else {
        searchInfo.innerHTML = `
            <p style="color: #666; font-size: 1.1rem; margin: 2rem 0;">
                Enter a search term to find articles
            </p>
        `;
    }
}

function getCategoryName(category) {
    const categories = {
        'fashion': 'Fashion & Accessories',
        'health': 'Health & Beauty',
        'home': 'Home & Garden',
        'travel': 'Travel & Accommodation',
        'finance': 'Finance & Insurance',
        'food': 'Food & Beverage'
    };
    return categories[category] || category;
}


function navigateToArticle(slug) {
    window.location.href = `article.html?slug=${slug}`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

