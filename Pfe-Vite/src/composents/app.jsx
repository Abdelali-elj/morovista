import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

import Navbar from "./NavBar";
import Footer from "./footer";
import Home, { ScrollTopButton } from "./Home";
import ServicesSection from "./Services/services";
import Hotels from "./Services/Hotels";
import Restaurant from "./Services/Restaurant";
import Stadium from "./Services/Stadium";
import Places from "./Services/places";
import Exchange from "./Services/exchange";
import Weather from "./Services/Weather";
import PhoneList from "./Services/phoneN";
import Login from "./Login";
import Transport from "./Services/Transport";
import Dashboard from "./Dashboard/Dashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";
import MyPlanPage from "./MyPlanPage";
import LocalServices from "./Services/LocalServices";
import PlansG from "./Services/PlansG";
import PlanDetails from "./Services/PlanDetails";
import SiteComments from "./Services/SiteComments";
import AboutUs from "./Services/AboutUs";
import Contact from "./Contact";
import Chatbot from "./Chatbot";
import Activities from "./Services/Activities";
import Visa from "./Services/Visa";
import Esim from "./Services/Esim";

function Outils() {
    const [selectedTool, setSelectedTool] = useState('exchange');

    const renderTool = () => {
        switch (selectedTool) {
            case 'exchange':
                return <Exchange />;
            case 'phone':
                return <PhoneList />;
            case 'weather':
                return <Weather />;
            default:
                return <Exchange />;
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Outils</h2>
                <select
                    className="tool-select"
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                >
                    <option value="exchange">Exchange</option>
                    <option value="phone">Phone (Urgences)</option>
                    <option value="weather">Weather</option>
                </select>
            </div>
            <div className="tool-content">
                {renderTool()}
            </div>
        </div>
    );
}

import Lenis from '@studio-freight/lenis';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
    const location = useLocation();
    const servicesRef = useRef(null);
    const isDashboardPath = ["/AdminDashboard", "/Dashboard"].includes(location.pathname);
    const lenisRef = useRef(null);

    useEffect(() => {
        const isTouchDevice =
            window.matchMedia("(pointer: coarse)").matches ||
            window.matchMedia("(hover: none)").matches ||
            window.innerWidth <= 1024;

        ScrollTrigger.config({ ignoreMobileResize: true });
        gsap.ticker.lagSmoothing(0);

        const handleRefresh = () => ScrollTrigger.refresh();
        window.addEventListener("resize", handleRefresh);
        window.addEventListener("orientationchange", handleRefresh);

        if (isTouchDevice) {
            lenisRef.current = null;
            requestAnimationFrame(() => ScrollTrigger.refresh());

            return () => {
                window.removeEventListener("resize", handleRefresh);
                window.removeEventListener("orientationchange", handleRefresh);
            };
        }

        const lenis = new Lenis({
            duration: 1.05,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1,
            infinite: false,
        });

        const onLenisScroll = () => ScrollTrigger.update();
        const updateLenis = (time) => {
            lenis.raf(time * 1000);
        };

        lenisRef.current = lenis;
        lenis.on("scroll", onLenisScroll);
        gsap.ticker.add(updateLenis);
        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            gsap.ticker.remove(updateLenis);
            lenis.off("scroll", onLenisScroll);
            lenis.destroy();
            lenisRef.current = null;
            window.removeEventListener("resize", handleRefresh);
            window.removeEventListener("orientationchange", handleRefresh);
        };
    }, []);

    // Refresh GSAP on route change or initial load
    useEffect(() => {
        const refreshTimer = setTimeout(() => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo({ top: 0, behavior: "auto" });
            }

            ScrollTrigger.refresh();
        }, 120);

        const postRefreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 320);

        return () => {
            clearTimeout(refreshTimer);
            clearTimeout(postRefreshTimer);
        };
    }, [location.pathname]);

    const goToServices = () => {
        if (lenisRef.current && servicesRef.current) {
            lenisRef.current.scrollTo(servicesRef.current, {
                offset: -80,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            servicesRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="app-wrapper">
            {!isDashboardPath && <Navbar />}
            <main className={isDashboardPath ? "admin-content" : "content"}>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Home onDiscover={goToServices} />
                            <div ref={servicesRef} id="services">
                                <ServicesSection />
                                <PlansG />
                                <SiteComments />
                                <AboutUs />
                            </div>
                        </>
                    } />
                    <Route path="/Hotels" element={<Hotels />} />
                    <Route path="/Restaurant" element={<Restaurant />} />
                    <Route path="/Stadium" element={<Stadium />} />
                    <Route path="/Places" element={<Places />} />
                    <Route path="/Exchange" element={<Exchange />} />
                    <Route path="/Weather" element={<Weather />} />
                    <Route path="/PhoneList" element={<PhoneList />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Transport" element={<Transport />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    <Route path="/LocalServices" element={<LocalServices />} />
                    <Route path="/services" element={<ServicesSection />} />
                    <Route path="/Outils" element={<Outils />} />
                    <Route path="/PlanDetails/:id" element={<PlanDetails />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/MyPlan" element={<MyPlanPage />} />
                    <Route path="/Activities" element={<Activities />} />
                    <Route path="/Visa" element={<Visa />} />
                    <Route path="/Esim" element={<Esim />} />
                    <Route path="/Tours" element={
                        <div className="page-container" style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh" }}>
                            <PlansG />
                        </div>
                    } />
                </Routes>
            </main>
            {!isDashboardPath && <Footer />}
            {!isDashboardPath && <ScrollTopButton />}
            {!isDashboardPath && <Chatbot />}
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
