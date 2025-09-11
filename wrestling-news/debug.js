// Debug version - very simple
console.log('Debug script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) {
        console.error('newsGrid not found!');
        return;
    }
    
    console.log('newsGrid found, loading news...');
    
    // Simple news data
    const news = [
        {
            title: "Roman Reigns Retains Universal Championship at WrestleMania 40",
            excerpt: "The Tribal Chief successfully defended his title against Cody Rhodes in a thrilling main event.",
            source: "WWE",
            date: "2024-04-08"
        },
        {
            title: "AEW Dynamite Draws Record Viewership",
            excerpt: "The latest episode of AEW Dynamite featuring a world championship bout drew the highest ratings.",
            source: "AEW", 
            date: "2024-04-07"
        },
        {
            title: "CM Punk Returns to WWE After 10 Years",
            excerpt: "In a shocking turn of events, CM Punk made his surprise return to WWE during Raw.",
            source: "WWE",
            date: "2024-04-06"
        }
    ];
    
    // Create news cards
    newsGrid.innerHTML = news.map(article => `
        <article class="news-card">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-excerpt">${article.excerpt}</p>
            <div class="news-meta">
                <span class="news-source">${article.source}</span>
                <span class="news-date">${article.date}</span>
            </div>
        </article>
    `).join('');
    
    console.log('News rendered successfully');
});
