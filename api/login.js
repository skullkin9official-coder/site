const PlayFab = require('playfab-sdk/Scripts/PlayFab/PlayFabClient.js');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

  const { email, password } = req.body;
  PlayFab.settings.titleId = "YOUR_TITLE_ID";

  PlayFab.PlayFabClient.LoginWithEmailAddress({
    Email: email,
    Password: password
  }, (result, error) => {
    if (error) return res.status(500).json(error);
    res.json({ sessionTicket: result.data.SessionTicket });
  });
}
