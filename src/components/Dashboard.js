import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import styled from 'styled-components';
import axios from 'axios';
import { parseISO, format } from 'date-fns';

const DashboardContainer = styled.div`
    background-color: #121212;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const GraphContainer = styled.div`
    width: 80%;
    margin-bottom: 50px;
    background: #1e1e1e;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Dashboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('./data.json')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.error('Data is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    if (!data.length) {
        return <DashboardContainer>Loading...</DashboardContainer>;
    }

    const parsedData = data.map(item => ({
        ...item,
        timestamp: parseISO(item.timestamp),
    }));

    // Number of alerts over time (Line Chart)
    const alertsOverTime = parsedData.reduce((acc, alert) => {
        const date = format(alert.timestamp, 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const lineData = {
        labels: Object.keys(alertsOverTime),
        datasets: [
            {
                label: 'Number of Alerts',
                data: Object.values(alertsOverTime),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
            }
        ]
    };

    // Distribution of alert severities (Pie Chart)
    const severityCounts = parsedData.reduce((acc, alert) => {
        if (alert.alert && alert.alert.severity != null) {
            acc[alert.alert.severity] = (acc[alert.alert.severity] || 0) + 1;
        }
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(severityCounts),
        datasets: [
            {
                label: 'Severity Distribution',
                data: Object.values(severityCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1,
            }
        ]
    };

    // Alerts by source IP (Bar Chart)
    const alertsBySourceIp = parsedData.reduce((acc, alert) => {
        if (alert.src_ip) {
            acc[alert.src_ip] = (acc[alert.src_ip] || 0) + 1;
        }
        return acc;
    }, {});

    const barData = {
        labels: Object.keys(alertsBySourceIp),
        datasets: [
            {
                label: 'Number of Alerts',
                data: Object.values(alertsBySourceIp),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#666',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            y: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        }
    };

    return (
        <DashboardContainer>
            <GraphContainer>
                <Graph type="line" data={lineData} options={options} />
            </GraphContainer>
            <GraphContainer>
                <Graph type="pie" data={pieData} options={options} />
            </GraphContainer>
            <GraphContainer>
                <Graph type="scatter" data={barData} options={options} />
            </GraphContainer>
        </DashboardContainer>
    );
};

export default Dashboard;
