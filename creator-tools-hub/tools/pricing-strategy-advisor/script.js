const productType = document.getElementById('productType');
const costInput = document.getElementById('cost');
const marketValueInput = document.getElementById('marketValue');
const adviseBtn = document.getElementById('adviseBtn');
const recommendations = document.getElementById('recommendations');

const multipliers = {
    digital: 3,
    course: 5,
    consulting: 2.5,
    service: 2
};

function getAdvice() {
    const type = productType.value;
    const cost = parseFloat(costInput.value) || 0;
    const marketValue = parseFloat(marketValueInput.value) || 0;
    
    if (cost === 0 && marketValue === 0) {
        alert('Please enter cost or market value');
        return;
    }
    
    let recommendedPrice = 0;
    if (marketValue > 0) {
        recommendedPrice = marketValue * 0.9; // 10% below market
    } else {
        recommendedPrice = cost * multipliers[type];
    }
    
    const minPrice = recommendedPrice * 0.8;
    const maxPrice = recommendedPrice * 1.2;
    
    recommendations.innerHTML = `
        <div class="price-card">
            <div class="price-label">Recommended Price</div>
            <div class="price-value">$${recommendedPrice.toFixed(2)}</div>
        </div>
        <div class="price-range">
            <div class="range-item">
                <div class="range-label">Minimum</div>
                <div class="range-value">$${minPrice.toFixed(2)}</div>
            </div>
            <div class="range-item">
                <div class="range-label">Maximum</div>
                <div class="range-value">$${maxPrice.toFixed(2)}</div>
            </div>
        </div>
        <div class="advice-text">
            <p>💡 Price your ${type} product between $${minPrice.toFixed(2)} and $${maxPrice.toFixed(2)} for optimal conversion.</p>
            <p>Consider A/B testing different price points to find what works best for your audience.</p>
        </div>
    `;
}

adviseBtn.addEventListener('click', getAdvice);

