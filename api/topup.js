const PlayFab = require('playfab-sdk/Scripts/PlayFab/PlayFabClient.js');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

  const { sessionTicket, months } = req.body;

  PlayFab.settings.titleId = "1FC26D";

  PlayFab.PlayFabClient.ExecuteCloudScript({
    FunctionName: "TopUpSubscription",
    FunctionParameter: { months },
    AuthenticationContext: { SessionTicket: sessionTicket }
  }, (result, error) => {
    if (error) return res.status(500).json(error);
    res.json(result.FunctionResult);
  });
}
