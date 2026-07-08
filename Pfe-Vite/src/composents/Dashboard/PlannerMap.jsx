import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Fix Leaflet default icon (Vite asset resolution issue) ──────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Moroccan city geographic centres + bounding spans ───────────────────────
const CITY_BOUNDS = {
    'Marrakech': { center: [31.6295, -7.9811], latSpan: 0.13, lngSpan: 0.20 },
    'Fès':       { center: [34.0181, -5.0078], latSpan: 0.11, lngSpan: 0.16 },
    'Casablanca':{ center: [33.5731, -7.5898], latSpan: 0.11, lngSpan: 0.16 },
    'Agadir':    { center: [30.4278, -9.5981], latSpan: 0.10, lngSpan: 0.14 },
    'Tanger':    { center: [35.7595, -5.8340], latSpan: 0.10, lngSpan: 0.14 },
    'Rabat':     { center: [33.9716, -6.8498], latSpan: 0.10, lngSpan: 0.14 },
};

// ─── Category colour map ─────────────────────────────────────────────────────
const CAT_COLORS = {
    hotels:      '#6366f1',
    restaurants: '#f59e0b',
    transport:   '#3b82f6',
    activities:  '#10b981',
    monuments:   '#ec4899',
    places:      '#f97316',
};

const CAT_LABELS = {
    hotels:      'Hébergement',
    restaurants: 'Restaurant',
    transport:   'Transport',
    activities:  'Activité',
    monuments:   'Monument',
    places:      'Lieu / Site',
};

// ─── Convert x/y percentages → real lat/lng ──────────────────────────────────
function toLatLng(city, x, y) {
    const b = CITY_BOUNDS[city] || CITY_BOUNDS['Marrakech'];
    const [cLat, cLng] = b.center;
    const lng = cLng - b.lngSpan / 2 + (x / 100) * b.lngSpan;
    const lat = cLat + b.latSpan / 2 - (y / 100) * b.latSpan;
    return [lat, lng];
}

// ─── Custom teardrop pin icon ─────────────────────────────────────────────────
function makeIcon(color, num) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="50" viewBox="0 0 38 50">
      <filter id="sh" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.35"/>
      </filter>
      <path d="M19 1C9.06 1 1 9.06 1 19c0 13.5 18 30 18 30s18-16.5 18-30C37 9.06 28.94 1 19 1z"
            fill="${color}" stroke="white" stroke-width="2" filter="url(#sh)"/>
      <circle cx="19" cy="19" r="11" fill="white" opacity="0.97"/>
      <text x="19" y="24" text-anchor="middle" font-size="11.5" font-weight="900"
            fill="${color}" font-family="Outfit,Inter,sans-serif">${num}</text>
    </svg>`;
    return L.divIcon({
        html: svg,
        iconSize:    [38, 50],
        iconAnchor:  [19, 50],
        popupAnchor: [0, -54],
        className:   '',
    });
}

// ─── Auto-fit map to markers on mount / when points change ───────────────────
function FitBounds({ points }) {
    const map = useMap();
    useEffect(() => {
        if (points.length === 1) {
            map.setView(points[0].latlng, 15);
        } else if (points.length > 1) {
            const bounds = L.latLngBounds(points.map(p => p.latlng));
            map.fitBounds(bounds, { padding: [52, 52], maxZoom: 16 });
        }
    }, [points, map]);
    return null;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PlannerMap({ city, dayData, activeDay }) {
    const cityBounds = CITY_BOUNDS[city] || CITY_BOUNDS['Marrakech'];

    const allItems = [
        ...(dayData?.morning   || []),
        ...(dayData?.afternoon || []),
        ...(dayData?.evening   || []),
    ].filter(item => item.x !== undefined && item.y !== undefined);

    const points = allItems.map((item, idx) => ({
        latlng:   toLatLng(city, item.x, item.y),
        label:    item.label.replace(/Dîner Saveur Locale — /, ''),
        cost:     item.cost,
        desc:     item.desc || '',
        category: item.category,
        color:    CAT_COLORS[item.category] || '#c0241a',
        num:      idx + 1,
    }));

    const polylinePath = points.map(p => p.latlng);

    // Visible categories in this day for legend
    const legendCats = [...new Set(points.map(p => p.category))];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* ── REAL INTERACTIVE MAP ── */}
            <MapContainer
                center={cityBounds.center}
                zoom={13}
                style={{ height: '430px', width: '100%', borderRadius: '14px', zIndex: 0 }}
                key={`${city}-${activeDay}`}
                scrollWheelZoom={true}
                zoomControl={true}
            >
                {/* ESRI World Imagery — free satellite tiles (Google Maps style) */}
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, USDA FSA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                />
                {/* Street labels overlay on top of satellite */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                    opacity={0.85}
                />

                {/* Soft glow halo behind route */}
                {polylinePath.length > 1 && (
                    <Polyline
                        positions={polylinePath}
                        color="#c0241a"
                        weight={10}
                        opacity={0.08}
                    />
                )}

                {/* Dashed route line */}
                {polylinePath.length > 1 && (
                    <Polyline
                        positions={polylinePath}
                        color="#c0241a"
                        weight={2.5}
                        opacity={0.75}
                        dashArray="10, 8"
                        lineJoin="round"
                    />
                )}

                {/* Markers */}
                {points.map((pt, idx) => (
                    <Marker key={`${activeDay}-${idx}`} position={pt.latlng} icon={makeIcon(pt.color, pt.num)}>
                        <Popup maxWidth={220}>
                            <div style={{ fontFamily: 'Outfit, Inter, sans-serif', padding: '2px 0' }}>
                                {/* Category badge */}
                                <span style={{
                                    display: 'inline-block',
                                    background: pt.color + '1a',
                                    color: pt.color,
                                    padding: '2px 9px',
                                    borderRadius: '20px',
                                    fontSize: '0.67rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    marginBottom: '7px',
                                }}>
                                    {CAT_LABELS[pt.category] || pt.category}
                                </span>

                                {/* Stop number + name */}
                                <div style={{
                                    fontSize: '0.93rem',
                                    fontWeight: 800,
                                    color: '#1a0505',
                                    marginBottom: '5px',
                                    lineHeight: 1.35,
                                }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '20px', height: '20px',
                                        borderRadius: '50%',
                                        background: pt.color,
                                        color: '#fff',
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        marginRight: '6px',
                                        flexShrink: 0,
                                        verticalAlign: 'middle',
                                    }}>{pt.num}</span>
                                    {pt.label}
                                </div>

                                {/* Description */}
                                {pt.desc && (
                                    <div style={{
                                        fontSize: '0.76rem',
                                        color: '#6b7280',
                                        marginBottom: '7px',
                                        lineHeight: 1.4,
                                    }}>
                                        {pt.desc.length > 90 ? pt.desc.substring(0, 90) + '…' : pt.desc}
                                    </div>
                                )}

                                {/* Cost */}
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: pt.cost > 0 ? '#c0241a' : '#16a34a',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    {pt.cost > 0 ? `💰 ${pt.cost.toLocaleString('fr-MA')} DH` : '✅ Gratuit / Inclus'}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Auto-fit bounds */}
                {points.length > 0 && <FitBounds points={points} />}
            </MapContainer>

            {/* ── LEGEND BAR ── */}
            {legendCats.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '12px 16px',
                    background: '#fafafa',
                    borderTop: '1px solid #f0e0e0',
                    borderRadius: '0 0 14px 14px',
                    justifyContent: 'center',
                }}>
                    {legendCats.map(cat => (
                        <div key={cat} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#374151',
                        }}>
                            <span style={{
                                width: '10px', height: '10px',
                                borderRadius: '50%',
                                background: CAT_COLORS[cat] || '#c0241a',
                                flexShrink: 0,
                            }} />
                            {CAT_LABELS[cat]}
                        </div>
                    ))}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af',
                        marginLeft: 'auto',
                    }}>
                        <svg width="22" height="6" viewBox="0 0 22 6">
                            <line x1="0" y1="3" x2="22" y2="3" stroke="#c0241a" strokeWidth="2"
                                strokeDasharray="5,4" strokeLinecap="round"/>
                        </svg>
                        Circuit du jour
                    </div>
                </div>
            )}

            {/* ── EMPTY STATE ── */}
            {points.length === 0 && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '14px',
                    backdropFilter: 'blur(4px)',
                    gap: '10px',
                    zIndex: 500,
                }}>
                    <div style={{ fontSize: '2.5rem' }}>🗺️</div>
                    <div style={{ fontWeight: 800, color: '#374151' }}>Aucun point avec coordonnées pour ce jour</div>
                </div>
            )}
        </div>
    );
}
