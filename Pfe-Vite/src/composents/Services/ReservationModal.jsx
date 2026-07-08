import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaUsers, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import api from '../../api';
import './reservation.css';

export default function ReservationModal({ service, serviceType, onClose }) {
    const [form, setForm] = useState({
        client_nom: '',
        client_email: '',
        client_tel: '',
        date_arrivee: '',
        date_depart: '',
        nb_personnes: 1,
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const prix = serviceType === 'hotel' ? service.prix_chambre : service.prix_moyen;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/reservation', {
                hotel_id: service.id,
                service_type: serviceType,
                ...form,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="reservation-overlay" onClick={onClose}>
            <div className="reservation-modal" onClick={e => e.stopPropagation()}>
                <div className="res-modal-inner">
                    <button className="reservation-close-btn" onClick={onClose}><FaTimes /></button>

                    {success ? (
                        <div className="reservation-success">
                            <div className="success-icon-wrap"><FaCheckCircle /></div>
                            <h3>Demande Envoyée !</h3>
                            <p>Votre demande pour <strong>{service.nom}</strong> a été transmise. Notre équipe vous contactera bientôt.</p>
                            <button className="close-success-btn" onClick={onClose}>Fermer</button>
                        </div>
                    ) : (
                        <>
                            <div className="reservation-header">
                                <div className="res-header-content">
                                    <span className="res-subtitle">{serviceType === 'hotel' ? 'Réservation d\'Hôtel' : 'Réservation de Table'}</span>
                                    <h3>{service.nom}</h3>
                                    {prix && (
                                        <div className="reservation-price">
                                            <span>{serviceType === 'hotel' ? 'Tarif indicatif' : 'Budget moyen'}</span>
                                            <strong>{Number(prix).toLocaleString()} MAD</strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form className="reservation-form" onSubmit={handleSubmit}>
                                <div className="res-section-title">
                                    <span>01</span> Informations Personnelles
                                </div>
                                <div className="res-form-grid">
                                    <div className="res-form-group">
                                        <label><FaUser /> Nom complet</label>
                                        <input type="text" name="client_nom" placeholder="Ex: Ahmed Alami" value={form.client_nom} onChange={handleChange} required />
                                    </div>
                                    <div className="res-form-group">
                                        <label><FaEnvelope /> Email</label>
                                        <input type="email" name="client_email" placeholder="votre@email.com" value={form.client_email} onChange={handleChange} required />
                                    </div>
                                    <div className="res-form-group">
                                        <label><FaPhone /> Téléphone</label>
                                        <input type="tel" name="client_tel" placeholder="+212 6XX XXX XXX" value={form.client_tel} onChange={handleChange} required />
                                    </div>
                                    <div className="res-form-group">
                                        <label><FaUsers /> {serviceType === 'hotel' ? 'Personnes' : 'Couverts'}</label>
                                        <input type="number" name="nb_personnes" min="1" max="20" value={form.nb_personnes} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="res-section-title">
                                    <span>02</span> Détails
                                </div>
                                <div className="res-form-grid">
                                    {serviceType === 'hotel' ? (
                                        <>
                                            <div className="res-form-group">
                                                <label><FaCalendarAlt /> Arrivée</label>
                                                <input type="date" name="date_arrivee" min={today} value={form.date_arrivee} onChange={handleChange} required />
                                            </div>
                                            <div className="res-form-group">
                                                <label><FaCalendarAlt /> Départ</label>
                                                <input type="date" name="date_depart" min={form.date_arrivee || today} value={form.date_depart} onChange={handleChange} required />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="res-form-group">
                                                <label><FaCalendarAlt /> Date</label>
                                                <input type="date" name="date_arrivee" min={today} value={form.date_arrivee} onChange={handleChange} required />
                                            </div>
                                            <div className="res-form-group">
                                                <label><FaPaperPlane /> Heure</label>
                                                <input type="time" name="date_depart" value={form.date_depart} onChange={handleChange} required />
                                            </div>
                                        </>
                                    )}

                                    <div className="res-form-group res-full-width">
                                        <label>Message (optionnel)</label>
                                        <textarea name="message" rows="2" placeholder="..." value={form.message} onChange={handleChange} />
                                    </div>
                                </div>

                                {error && <div className="res-error">{error}</div>}

                                <button type="submit" className="res-submit-btn" disabled={loading}>
                                    {loading ? (
                                        <span className="res-loading">Envoi...</span>
                                    ) : (
                                        <><FaPaperPlane /> Confirmer la Réservation</>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
