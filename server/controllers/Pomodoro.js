const models = require('../models');
const Pomodoro = models.Pomodoro;

const getStats = async (req, res) => {
    const owner = req.session.account._id;
    const today = new Date();//save today's date
    const oneWeekPass = new Date();
    oneWeekPass.setDate(today.getDate() - 6);//use setDate to grab accurate date, include today
    oneWeekPass.setHours(0, 0, 0, 0);

    try {
        const oneweekRecords = await Pomodoro.find({ owner }).select('finishedAt').lean();

        const dataInOneweek = oneweekRecords.filter(data => {
            if (data.finishedAt >= oneWeekPass && data.finishedAt <= today) {
                return true;
            } else {
                return false;
            }
        });

        const allStats = {};//colllect all the pomodoro stats
        dataInOneweek.forEach(data => {
            // convert finishedAt data to formal date, slice(0, 10) collect date part(first 10 words)
            const dateString = data.finishedAt.toISOString().slice(0, 10);
            if (!allStats[dateString]) {
                allStats[dateString] = 0;
            }
            allStats[dateString] += 1;//if allstats[dataString] is undefine,then count the data as 0, otherwise +1
        });

        const records = [];
        const oneWeek = 7;
        for(let i = 0; i < oneWeek; i++){//add complete times to each day
            const thisTime = new Date();//save the time that user who searched the records
            thisTime.setDate(today.getDate() - i);
            thisTime.setHours(0, 0, 0, 0);
            const dateString = thisTime.toISOString().slice(0, 10);
            let count;
            if (allStats[dateString] !== undefined && allStats[dateString]!== null) {
                count = allStats[dateString];
            } else {
                count = 0;
            }
            records.push({ thisTime: dateString, count });//push all the results to 7 days records
            return res.json({ oneweekRecords: records.reverse() }); // reverse each day's data, old times to new times
        }

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: 'could not get 7 days records' });
    }


}

module.exports.getStats = getStats;