const express = require('express');
const bodyParser = require('body-parser');
const PlayFab = require('playfab-sdk/Scripts/PlayFab/PlayFabClient.js');

const app = express();
app.use(bodyParser.json());

PlayFab.settings.titleId = "1FC26D"; // vul je PlayFab Title ID in

app.post('/topup', (req, res) => {
    const { CustomId, months } = req.body;

    // 1. Login met CustomID
    PlayFab.PlayFabClient.LoginWithCustomID({
        CustomId: CustomId,
        CreateAccount: true
    }, function(result, error) {
        if(error) return res.status(500).json(error);

        const sessionTicket = result.data.SessionTicket;

        // 2. Execute Cloud Script
        PlayFab.PlayFabClient.ExecuteCloudScript({
            FunctionName: "TopUpSubscription",
            FunctionParameter: { months: months || 1 },
            GeneratePlayStreamEvent: true,
            AuthenticationContext: { SessionTicket: sessionTicket }
        }, function(result, error){
            if(error) return res.status(500).json(error);
            res.json(result.FunctionResult);
        });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
