import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
    LuUser,
    LuLock,
    LuMail,
    LuUserPlus,
    LuLogIn,
    LuPhone,
    LuUsers,
    LuBriefcase,
    LuMapPin
} from 'react-icons/lu';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function Login() {
    const { t } = useTranslation();
    const { setUser } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', userType: 'visitor', telephone: '' });
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/villes');
                setCities(response.data);
            } catch (err) {
                console.error("Failed to load cities", err);
            }
        };
        fetchCities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const response = await api.post('/login', {
                    email: formData.email,
                    password: formData.password
                });
                
                const { user: userData, access_token } = response.data;
                setUser(userData);
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                if (userData.role === 'admin' || userData.userType === 'admin') {
                    navigate('/AdminDashboard');
                } else {
                    navigate('/');
                }

            } else {
                const response = await api.post('/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.userType
                });
                
                const { user: userData, access_token } = response.data;
                setUser(userData);
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError(t('auth.errors.incorrect') || 'Email ou mot de passe incorrect');
            } else if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Erreur lors de la connexion: ' + err.message);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-system">
                <div className="auth-bg-layer active" style={{ backgroundImage: 'url("/bg final.jfif")' }} />
                <div className="auth-bg-overlay" />
            </div>
            <div className="auth-container">
                <div className="auth-glass glass-morph">
                    <div className="auth-toggle-switcher">
                        <button className={`toggle-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>{t('auth.login_tab')}</button>
                        <button className={`toggle-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>{t('auth.signup_tab')}</button>
                    </div>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label"><LuUser /> {t('auth.full_name') || "Nom Complet"}</label>
                                <input 
                                    className="form-input" 
                                    type="text" 
                                    placeholder="Ex: Ahmed Alaoui" 
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                    required 
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label"><LuMail /> {t('auth.email') || "Email"}</label>
                            <input 
                                className="form-input" 
                                type="email" 
                                placeholder="exemple@mail.com" 
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                required 
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label"><LuUsers /> {t('auth.account_type') || "Type de Compte"}</label>
                                <select 
                                    className="form-input" 
                                    value={formData.userType} 
                                    onChange={e => setFormData({ ...formData, userType: e.target.value })}
                                >
                                    <option value="visitor">{t('auth.visitor') || "Voyageur / Visiteur"}</option>
                                    <option value="provider">{t('auth.service_owner') || "Propriétaire de Service"}</option>
                                    <option value="guide">{t('auth.guide') || "Guide Touristique"}</option>
                                </select>
                            </div>
                        )}

                        {!isLogin && formData.userType !== 'visitor' && (
                            <div className="form-group">
                                <label className="form-label"><LuPhone /> {t('auth.telephone') || "Téléphone"}</label>
                                <input 
                                    className="form-input" 
                                    type="tel" 
                                    placeholder="+212 6 XX XX XX XX" 
                                    onChange={e => setFormData({ ...formData, telephone: e.target.value })} 
                                    required={formData.userType !== 'visitor'} 
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label"><LuLock /> {t('auth.password') || "Mot de passe"}</label>
                            <input 
                                className="form-input" 
                                type="password" 
                                placeholder="••••••••" 
                                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                                required 
                            />
                        </div>

                        {isLogin && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', color: 'white', fontSize: '0.85rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ accentColor: 'var(--p-red)' }} /> {t('auth.remember_me') || "Se souvenir de moi"}
                                </label>
                                <a href="#" style={{ color: '#FFD93D', textDecoration: 'none', fontWeight: '700' }}>{t('auth.forgot_password') || "Oublié ?"}</a>
                            </div>
                        )}

                        {error && <p className="auth-error" style={{ marginBottom: '20px' }}>{error}</p>}
                        
                        <button type="submit" className="auth-btn-primary">
                            {isLogin ? <><LuLogIn /> {t('auth.login_tab')}</> : <><LuUserPlus /> {t('auth.signup_tab')}</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
