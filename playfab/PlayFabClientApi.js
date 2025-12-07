var PlayFabClientAPI = {
    LoginWithEmailAddress: function (request, success, error) {
        request.TitleId = request.TitleId || PlayFab.settings.titleId;
        fetch("https://"+request.TitleId+".playfabapi.com/Client/LoginWithEmailAddress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-PlayFabSDK": "JavaScriptSDK"
            },
            body: JSON.stringify(request)
        })
        .then(r=>r.json())
        .then(resp => resp.data ? success(resp) : error(resp))
        .catch(err => error(err));
    },

    RegisterPlayFabUser: function(request, success, error){
        request.TitleId = request.TitleId || PlayFab.settings.titleId;
        fetch("https://"+request.TitleId+".playfabapi.com/Client/RegisterPlayFabUser", {
            method: "POST",
            headers: {"Content-Type": "application/json","X-PlayFabSDK":"JavaScriptSDK"},
            body: JSON.stringify(request)
        })
        .then(r=>r.json())
        .then(resp => resp.data ? success(resp) : error(resp))
        .catch(err => error(err));
    },

    GetUserInventory: function(request, success, error){
        fetch("https://"+PlayFab.settings.titleId+".playfabapi.com/Client/GetUserInventory", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "X-Authorization": PlayFab._internalSettings.sessionTicket,
                "X-PlayFabSDK": "JavaScriptSDK"
            },
            body: JSON.stringify(request || {})
        })
        .then(r=>r.json())
        .then(resp => resp.data ? success(resp) : error(resp))
        .catch(err=>error(err));
    }
};
