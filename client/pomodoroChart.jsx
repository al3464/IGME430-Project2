const helper = require('./helper.js');
const React = require('react');
//to build a bar chart, use npm install recharts component and import these propertiesw
const { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } = require('recharts');
const { useState, useEffect } = React;


const myStats = (refresh) => {//use refresh to automatic refresh the chart 
    const [record, setRecord] = useState([]);//use data from backen

    useEffect(() => {
        const fetchData = async () => {
            try {//update stats to front end and update it to bar chart
                const res = await fetch('/getPomodoroStats');
                const json = await res.json();
                console.log('stats length:', json.oneweekRecords.length);
                setRecord(json.oneweekRecords);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [refresh]);

    if(record.length === 0 || !record){//if record length is 0, there's no records in pomodoro 
        return <div className="myChart">No records yet.</div>;
    }

    console.log('Fetched stats data:', record);

    return (
        <div className="stats-chart">
            <h3>Last 7 Days Pomodoros</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={record}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="thisTime" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#55acee" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

}

module.exports = myStats;