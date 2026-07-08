import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPlanPlanner from './Dashboard/MyPlanPlanner';

export default function MyPlanPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            navigate('/Login');
        }
    }, [navigate]);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, paddingTop: '120px', paddingBottom: '60px' }}>
                {user ? (
                    <MyPlanPlanner user={user} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement...</div>
                )}
            </div>
        </div>
    );
}
