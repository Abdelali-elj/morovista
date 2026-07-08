import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaExchangeAlt, FaMoneyBillWave, FaChartLine, FaGlobe } from "react-icons/fa";

export default function Exchange() {
    const { t } = useTranslation();
    const [rates, setRates] = useState({});
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("MAD");
    const [result, setResult] = useState(0);
    const [loading, setLoading] = useState(true);
    const [swapped, setSwapped] = useState(false);

    const currencies = {
        USD: { name: t('tools.exchange_usd', 'US Dollar'), symbol: "$", flag: "us" },
        EUR: { name: t('tools.exchange_eur', 'Euro'), symbol: "€", flag: "eu" },
        MAD: { name: t('tools.exchange_mad', 'Moroccan Dirham'), symbol: "DH", flag: "ma" },
        GBP: { name: t('tools.exchange_gbp', 'British Pound'), symbol: "£", flag: "gb" },
        CAD: { name: t('tools.exchange_cad', 'Canadian Dollar'), symbol: "C$", flag: "ca" },
        AUD: { name: t('tools.exchange_aud', 'Australian Dollar'), symbol: "A$", flag: "au" },
        JPY: { name: t('tools.exchange_jpy', 'Japanese Yen'), symbol: "¥", flag: "jp" },
        CHF: { name: t('tools.exchange_chf', 'Swiss Franc'), symbol: "Fr", flag: "ch" },
        CNY: { name: t('tools.exchange_cny', 'Chinese Yuan'), symbol: "¥", flag: "cn" },
        SAR: { name: t('tools.exchange_sar', 'Saudi Riyal'), symbol: "SR", flag: "sa" }
    };

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
            .then(res => res.json())
            .then(data => {
                setRates(data.rates);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching rates:', err);
                setLoading(false);
            });
    }, [from]);

    useEffect(() => {
        if (rates[to]) {
            setResult((amount * rates[to]).toFixed(2));
        }
    }, [amount, to, rates]);

    const swapCurrencies = () => {
        setSwapped(true);
        const temp = from;
        setFrom(to);
        setTo(temp);
        setTimeout(() => setSwapped(false), 300);
    };

    return (
        <div className="page-container exchange-page-container">
            <Link to="/" className="back-btn exchange-back-btn">
                <FaArrowLeft /> {t('tools.back_home')}
            </Link>

            <div className="page-header exchange-header">
                <h2><FaMoneyBillWave /> {t('tools.currency_title')}</h2>
                <p className="subtitle">{t('tools.currency_subtitle')}</p>
            </div>

            <div className="converter-container">
                <div className="converter-card">
                    <div className="converter-header-row">
                        <div className="converter-header">
                            <FaGlobe className="globe-icon" />
                            <span className="live-indicator">{t('tools.live_rates')}</span>
                        </div>
                        
                        <div className="quick-amounts-inline">
                            <span className="quick-label">{t('tools.quick_amounts')}:</span>
                            <div className="quick-amount-buttons">
                                {[10, 50, 100, 500, 1000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val)}
                                        className={`quick-amount-btn-pill ${amount == val ? 'active' : ''}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="converter-grid-inputs">
                        <div className="amount-section">
                            <label className="input-label">{t('tools.amount_label')}</label>
                            <div className="amount-input-wrapper">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="amount-input"
                                    placeholder={t('tools.enter_amount')}
                                    min="0"
                                    step="0.01"
                                />
                                <span className="currency-symbol">{currencies[from]?.symbol}</span>
                            </div>
                        </div>

                        <div className="currencies-section-row">
                            <div className="currency-selector">
                                <label className="input-label">{t('tools.from_label')}</label>
                                <div className="select-wrapper">
                                    <div className="selected-flag-container">
                                        <img
                                            src={`https://flagcdn.com/w40/${currencies[from]?.flag}.png`}
                                            alt={from}
                                            className="select-flag-img"
                                        />
                                    </div>
                                    <select
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="currency-select"
                                    >
                                        {Object.keys(currencies).map(code => (
                                            <option key={code} value={code}>
                                                {code} - {currencies[code].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={swapCurrencies}
                                className={`swap-btn ${swapped ? 'swapped' : ''}`}
                                title="Swap currencies"
                            >
                                <FaExchangeAlt />
                            </button>

                            <div className="currency-selector">
                                <label className="input-label">{t('tools.to_label')}</label>
                                <div className="select-wrapper">
                                    <div className="selected-flag-container">
                                        <img
                                            src={`https://flagcdn.com/w40/${currencies[to]?.flag}.png`}
                                            alt={to}
                                            className="select-flag-img"
                                        />
                                    </div>
                                    <select
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="currency-select"
                                    >
                                        {Object.keys(currencies).map(code => (
                                            <option key={code} value={code}>
                                                {code} - {currencies[code].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="result-section">
                        {loading ? (
                            <div className="loading-result">
                                <div className="spinner"></div>
                                <span>{t('tools.loading_rates')}</span>
                            </div>
                        ) : (
                            <div className="result-display">
                                <div className="result-amount">
                                    <span className="result-value">{Number(amount).toLocaleString()}</span>
                                    <span className="result-currency">{from}</span>
                                    <span className="equals">=</span>
                                    <span className="result-value converted">{Number(result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span className="result-currency">{to}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {rates[to] && (
                        <div className="rate-info">
                            <FaChartLine className="rate-icon" />
                            <span>1 {from} = {rates[to]} {to}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
