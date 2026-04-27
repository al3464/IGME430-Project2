const models = require('../models');
const Pomodoro = models.Pomodoro;

const getStats = async (req, res) => {
    const owner = req.session.account._id;
    const now = new Date();
    const nowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));//save today's date
    const nowEnd = new Date(nowStart);
    nowEnd.setUTCHours(23, 59, 59, 999);
    const oneWeekPass = new Date();
    oneWeekPass.setDate(nowStart.getDate() - 6);//use setDate to grab accurate date, include today
    oneWeekPass.setHours(0, 0, 0, 0);

    try {
        const oneweekRecords = await Pomodoro.find({ owner }).select('finishedAt').lean();

        const dataInOneweek = oneweekRecords.filter(data => {
            if (data.finishedAt >= oneWeekPass && data.finishedAt <= nowEnd) {
                return true;
            } else {
                return false;
            }
        });

        const allStats = {};//colllect all the pomodoro stats
        dataInOneweek.forEach(record => {
            // convert finishedAt data to formal date, slice(0, 10) collect date part(first 10 words)
            const dateString = record.finishedAt.toISOString().slice(0, 10);
            if (!allStats[dateString]) {
                allStats[dateString] = 0;
            }
            allStats[dateString] += 1;//if allstats[dataString] is undefine,then count the data as 0, otherwise +1
        });

        const records = [];
        for(let i = 0; i < 7; i++){//add complete times to each day
            const thisTime = new Date();//save the time that user who searched the records
            thisTime.setDate(now.getDate() - i);
            const dateString = thisTime.toISOString().slice(0, 10);
            let count;
            if (allStats[dateString] !== undefined && allStats[dateString]!== null) {
                count = allStats[dateString];
            } else {
                count = 0;
            }
            records.push({ thisTime: dateString, count });//push all the results to 7 days records
            console.log(records);

        }
        return res.json({ oneweekRecords: records.reverse() }); // reverse each day's data, old times to new times

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: 'could not get 7 days records' });
    }


}

module.exports.getStats = getStats;