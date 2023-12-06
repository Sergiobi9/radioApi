import { RadioBrowserApi } from 'radio-browser-api'
import express from 'express'
import fetch from 'node-fetch'

const app = express();
const port = 3001;
const api = new RadioBrowserApi('Radio Browser Api')
global.fetch = fetch

app.get('/radio/stations', async (req, res) => {
    var countryCodeParam = req.query.countryCode;
    var tagsListParams = req.query.tags;

    var stations = await api.searchStations({
        countryCode: countryCodeParam ?? "ES",
        limit: 100,
        tagList: [tagsListParams] ?? [],
        removeDuplicates: true,
        offset: 0
    }).catch()

    var cleanedStations = [];
    for (let i = 0; i < stations.length; i++) {
        if (stations[i].favicon != '' && stations[i].urlResolved != '' && !stations[i].urlResolved.endsWith('.ico')) {
            stations[i].name = stations[i].name.trim();
            cleanedStations.push(stations[i])
        }
    }


    res.send({
        "error": false,
        "message": "Radio stations fetched successfully",
        "stations": cleanedStations
    });
});

app.listen(port, () => {
    console.log(`Radio Browser Api at http://localhost:${port}`);
});