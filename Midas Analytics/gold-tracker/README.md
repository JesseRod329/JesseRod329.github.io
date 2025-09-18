# Midas Analytics - Gold Tracker

A comprehensive digital platform that tracks gold prices in real-time while providing advanced analytics on correlations with inflation indicators and market influences.

## Features

- **Real-Time Gold Price Tracking**: Live spot gold prices with historical charts
- **Inflation Correlation Analysis**: CPI integration with correlation coefficients
- **Market Influence Dashboard**: VIX, Dollar Index, and Treasury yields
- **Advanced Analytics**: Statistical correlation analysis and visualizations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gold-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API keys**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your API keys:
   ```
   REACT_APP_FRED_API_KEY=your_fred_api_key_here
   REACT_APP_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
   ```

4. **Get your free API keys**:
   - **FRED API**: [Register here](https://fred.stlouisfed.org/docs/api/api_key.html) (FREE)
   - **Alpha Vantage**: [Get key here](https://www.alphavantage.co/support/#api-key) (500 requests/day FREE)
   - **Optional - API Ninjas**: [Get key here](https://api-ninjas.com/api/goldprice) (50,000 requests/month FREE)

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Query** for data fetching and caching
- **Lucide React** for icons

### APIs Used
- **FRED API**: Economic data (CPI, inflation rates)
- **Metals-API**: Gold and precious metals prices
- **Alpha Vantage**: Market indicators and additional data

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── GoldPriceCard.tsx
│   ├── PriceChart.tsx
│   ├── CorrelationAnalysis.tsx
│   ├── MarketIndicators.tsx
│   └── LoadingSpinner.tsx
├── services/           # API services
│   └── api.ts         # API integration
├── types/             # TypeScript type definitions
│   └── index.ts
└── App.tsx           # Main app component
```

## Features in Detail

### 1. Real-Time Gold Price Tracking
- Current spot gold prices in USD per ounce
- Price change indicators with percentage change
- Automatic refresh every 30 seconds
- Historical price charts with customizable timeframes

### 2. Inflation Correlation Analysis
- Consumer Price Index (CPI) data integration
- Real-time correlation coefficient calculations
- Rolling correlation analysis over multiple timeframes
- Visual correlation strength indicators

### 3. Market Indicators
- VIX (Volatility Index)
- US Dollar Index (DXY)
- 10-Year Treasury Yield
- Real-time updates and change tracking

### 4. Advanced Analytics
- Statistical correlation analysis
- R-squared calculations
- Interactive charts and visualizations
- Custom time period analysis

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Other Options
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting for public repos
- **Railway**: For full-stack applications

## API Rate Limits

- **FRED API**: 120 requests/minute (FREE)
- **Metals-API**: 1,000 requests/month (FREE)
- **Alpha Vantage**: 500 requests/day (FREE)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/gold-tracker/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Roadmap

### Phase 1 (Current)
- ✅ Basic gold price tracking
- ✅ CPI correlation analysis
- ✅ Market indicators dashboard
- ✅ Responsive design

### Phase 2 (Planned)
- [ ] Price alerts and notifications
- [ ] Multiple currency support
- [ ] Advanced charting tools
- [ ] Export functionality

### Phase 3 (Future)
- [ ] Machine learning predictions
- [ ] Portfolio tracking
- [ ] Social features
- [ ] Mobile app

---

**Built with ❤️ for gold investors and market analysts**