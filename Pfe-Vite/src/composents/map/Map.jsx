import React, { useState, useEffect } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "./Map.css";

const geoUrl = "https://raw.githubusercontent.com/yousfiSaad/morocco-map/master/data/regions.json";
const geoUrl_country = "https://raw.githubusercontent.com/YassineBouchama1/Morocco-geojson/main/morocco.geojson";

const cities = [
    { name: "Rabat", coordinates: [-6.8416, 34.0209] },
    { name: "Casablanca", coordinates: [-7.6192, 33.5731] },
    { name: "Marrakech", coordinates: [-7.9811, 31.6295] },
    { name: "Tanger", coordinates: [-5.8097, 35.7595] },
    { name: "Agadir", coordinates: [-9.5982, 30.4278] },
    { name: "Fès", coordinates: [-5.0003, 34.0331] }
];

const MoroccoMap = ({ onCityHover }) => {
    return (
        <div className="map-container">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 1600,
                    center: [-6, 28]
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="rgba(255, 255, 255, 0.9)"
                                stroke="rgba(0, 0, 0, 0.2)"
                                strokeWidth={0.7}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "rgba(255, 255, 255, 0.9)", outline: "none" },
                                    pressed: { outline: "none" }
                                }}
                            />
                        ))
                    }
                </Geographies>

                {/* Geographical Snake Layer - High fidelity border */}
                <Geographies geography={geoUrl_country}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey + "-snake"}
                                geography={geo}
                                fill="none"
                                stroke="#ff4757"
                                strokeWidth={2.5}
                                pathLength={1000}
                                className="geographical-snake"
                                style={{
                                    default: { outline: "none" },
                                    hover: { outline: "none" },
                                    pressed: { outline: "none" }
                                }}
                            />
                        ))
                    }
                </Geographies>

                {cities.map(({ name, coordinates }) => (
                    <Marker
                        key={name}
                        coordinates={coordinates}
                        onMouseEnter={() => onCityHover && onCityHover(name)}
                        onMouseLeave={() => onCityHover && onCityHover(null)}
                    >
                        <g
                            className="marker"
                            data-tooltip-id="map-tooltip"
                            data-tooltip-content={name}
                        >
                            <circle r={5} fill="#2E611E" stroke="#fff" strokeWidth={2} />
                        </g>
                    </Marker>
                ))}
            </ComposableMap>
            <Tooltip id="map-tooltip" className="custom-tooltip" />
        </div>
    );
};

export default MoroccoMap;
