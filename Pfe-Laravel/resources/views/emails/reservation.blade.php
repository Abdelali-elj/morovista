<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de Réservation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7f9; padding: 30px 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #c0241a, #e84c3d); padding: 35px 40px; text-align: center; }
        .header h1 { color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 6px; }
        .hotel-name { background: #fff8f8; border-left: 4px solid #c0241a; padding: 20px 40px; }
        .hotel-name h2 { color: #c0241a; font-size: 20px; }
        .hotel-name small { color: #64748b; font-size: 13px; }
        .section { padding: 30px 40px; }
        .section h3 { font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .info-item { background: #f8fafc; border-radius: 10px; padding: 14px 16px; }
        .info-item label { display: block; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-item span { font-size: 15px; font-weight: 600; color: #1e293b; }
        .full-width { grid-column: 1 / -1; }
        .message-box { background: #f8fafc; border-radius: 10px; padding: 16px; font-size: 14px; color: #334155; line-height: 1.6; margin-top: 16px; }
        .price-box { background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px; padding: 20px 24px; text-align: center; margin: 0 40px 30px; }
        .price-box p { color: rgba(255,255,255,0.7); font-size: 12px; margin-bottom: 6px; }
        .price-box .price { color: white; font-size: 28px; font-weight: 800; }
        .footer { background: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #94a3b8; font-size: 12px; }
        .badge { display: inline-block; background: #ecfdf5; color: #10b981; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .divider { height: 1px; background: #f1f5f9; margin: 0 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 Nouvelle Demande de Réservation</h1>
            <p>Reçue via la plateforme MoroVista</p>
        </div>

        <div class="hotel-name">
            <h2>{{ $data['hotel_nom'] }}</h2>
            <small>{{ $data['service_type'] === 'hotel' ? 'Hôtel' : 'Restaurant' }} • {{ $data['hotel_ville'] ?? '' }}</small>
        </div>

        <div class="section">
            <h3>👤 Informations du Client</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Nom complet</label>
                    <span>{{ $data['client_nom'] }}</span>
                </div>
                <div class="info-item">
                    <label>Email</label>
                    <span>{{ $data['client_email'] }}</span>
                </div>
                <div class="info-item">
                    <label>Téléphone</label>
                    <span>{{ $data['client_tel'] }}</span>
                </div>
                <div class="info-item">
                    <label>Nombre de personnes</label>
                    <span>{{ $data['nb_personnes'] }} personne(s)</span>
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="section">
            <h3>📅 Détails du Séjour</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Date d'arrivée</label>
                    <span>{{ $data['date_arrivee'] }}</span>
                </div>
                <div class="info-item">
                    <label>Date de départ</label>
                    <span>{{ $data['date_depart'] }}</span>
                </div>
                @if(!empty($data['message']))
                <div class="info-item full-width">
                    <label>Message / Demandes spéciales</label>
                </div>
                @endif
            </div>
            @if(!empty($data['message']))
            <div class="message-box">{{ $data['message'] }}</div>
            @endif
        </div>

        @if(!empty($data['prix_chambre']))
        <div class="price-box">
            <p>Prix indicatif par nuit</p>
            <div class="price">{{ number_format($data['prix_chambre'], 0, ',', ' ') }} MAD</div>
        </div>
        @endif

        <div class="footer">
            <p>Cette demande a été envoyée depuis <strong>MoroVista</strong></p>
            <p style="margin-top: 6px;">Répondre au client : <strong>{{ $data['client_email'] }}</strong></p>
            @if(!empty($data['hotel_email']) && $data['hotel_email'] !== 'rasotari336@gmail.com')
            <p style="margin-top: 6px; color: #64748b;">📧 Contact de l'établissement : <strong>{{ $data['hotel_email'] }}</strong></p>
            @endif
            <div class="badge">✅ Demande Vérifiée</div>
        </div>
    </div>
</body>
</html>
