const models = require('../models');
const Pomodoro = models.Pomodoro;

const getStats = async (req, res) => {
    const owner = req.session.account._id;
    const today = new Date();
    const oneWeekPass = new Date();
    oneWeekPass.setDate(today.getDate() - 6);//use setDate and getDate to grab accurate date
    oneWeekPass.setHours(0, 0, 0, 0);

    try {
        const oneweekRecords = await PomodoroSession.find({ owner });
        const dataInOneweek = oneweekRecords.filter(data => {
            if (data.finishedAt >= oneweekPass && data.finishedAt <= today) {
                return true;
            } else {
                return false;
            }
        }).select('finishedAt').lean();
        ;

        const allStats = {};//colllect all the pomodoro stats
        dataInOneweek.forEach(data => {
            // convert finishedAt data to formal date, slice(0, 10) collect date part(first 10 words)
            const dateString = data.finishedAt.toISOString().slice(0, 10);
            if (!allStats[dateString]) {
                allStats[dateString] = 0;
            }
            allStats[dateString] += 1;//if allstats[dataString] is undefine,then count the data as 0, otherwise +1
        });





    } catch {

    }




}