/** Country name to flag emoji mapping utility */
class CountryFlags {
    constructor() {
        // Mapping of country names to ISO country codes
        this.countryToCode = {
            'United States': 'US',
            'United Kingdom': 'GB',
            'Canada': 'CA',
            'Australia': 'AU',
            'Germany': 'DE',
            'France': 'FR',
            'Italy': 'IT',
            'Spain': 'ES',
            'Netherlands': 'NL',
            'Belgium': 'BE',
            'Switzerland': 'CH',
            'Austria': 'AT',
            'Sweden': 'SE',
            'Norway': 'NO',
            'Denmark': 'DK',
            'Finland': 'FI',
            'Poland': 'PL',
            'Portugal': 'PT',
            'Greece': 'GR',
            'Ireland': 'IE',
            'Czech Republic': 'CZ',
            'Hungary': 'HU',
            'Romania': 'RO',
            'Bulgaria': 'BG',
            'Croatia': 'HR',
            'Slovakia': 'SK',
            'Slovenia': 'SI',
            'Estonia': 'EE',
            'Latvia': 'LV',
            'Lithuania': 'LT',
            'Luxembourg': 'LU',
            'Malta': 'MT',
            'Cyprus': 'CY',
            'Japan': 'JP',
            'South Korea': 'KR',
            'China': 'CN',
            'India': 'IN',
            'Brazil': 'BR',
            'Mexico': 'MX',
            'Argentina': 'AR',
            'Chile': 'CL',
            'Colombia': 'CO',
            'Peru': 'PE',
            'Venezuela': 'VE',
            'Ecuador': 'EC',
            'Uruguay': 'UY',
            'Paraguay': 'PY',
            'Bolivia': 'BO',
            'Russia': 'RU',
            'Ukraine': 'UA',
            'Turkey': 'TR',
            'Israel': 'IL',
            'Saudi Arabia': 'SA',
            'United Arab Emirates': 'AE',
            'Egypt': 'EG',
            'South Africa': 'ZA',
            'Nigeria': 'NG',
            'Kenya': 'KE',
            'Thailand': 'TH',
            'Vietnam': 'VN',
            'Philippines': 'PH',
            'Indonesia': 'ID',
            'Malaysia': 'MY',
            'Singapore': 'SG',
            'New Zealand': 'NZ',
            'Unknown': 'UN'
        };
    }
    
    /**
     * Convert country name to flag emoji
     * @param {string} countryName - The country name
     * @returns {string} Flag emoji or 🌍 if not found
     */
    getFlag(countryName) {
        if (!countryName) return '🌍';
        
        const code = this.countryToCode[countryName];
        if (!code) {
            // Try to find partial match
            const found = Object.keys(this.countryToCode).find(key => 
                countryName.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(countryName.toLowerCase())
            );
            if (found) {
                return this.codeToFlag(this.countryToCode[found]);
            }
            return '🌍';
        }
        
        return this.codeToFlag(code);
    }
    
    /**
     * Convert ISO country code to flag emoji
     * @param {string} code - ISO 3166-1 alpha-2 country code
     * @returns {string} Flag emoji
     */
    codeToFlag(code) {
        if (!code || code.length !== 2) return '🌍';
        
        // Convert country code to flag emoji
        // Each letter is converted to regional indicator symbol
        const codePoints = code
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        
        return String.fromCodePoint(...codePoints);
    }
    
    /**
     * Get flag for a country with fallback
     * @param {string} countryName - The country name
     * @returns {string} Flag emoji
     */
    getFlagWithFallback(countryName) {
        const flag = this.getFlag(countryName);
        return flag || '🌍';
    }
}

// Initialize and export
const countryFlags = new CountryFlags();
window.countryFlags = countryFlags;



