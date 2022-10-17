var axios = require('axios');
var qs = require('qs');

async function getBearerToken()
{
    try{
        var data = qs.stringify({
            'grant_type': 'client_credentials',
            'client_id': 'a5231317-4c9c-4820-af8f-6bc51d343137',
            'client_secret': 'wPA8Q~RNSKJHPWQXoaYWUzAiQdhiKWAWQCLHMb9Y',
            'resource\t': 'https://purview.azure.net' 
            });
            var config = {
            method: 'post',
            url: 'https://login.microsoftonline.com/bc1fe3f1-755f-402f-a2b1-9f20f20b860c/oauth2/token',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Cookie': 'fpc=AnJJs97yToBPlDFeBRokozEQDLcQAQAAAJ3M1doOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
            },
            data : data
            };
            let result = await axios(config);
            return result.data.access_token;
    }
    catch (err)
    {
        console.log(err)
    }
}

async function assignTerm(TermGuid, AssetGuid, bToken){
    var data = JSON.stringify([
    {
        "guid": AssetGuid
    }
    ]);

    var config = {
    method: 'post',
    url: 'https://pvlab-pv.purview.azure.com/catalog/api/atlas/v2/glossary/terms/'+TermGuid+'/assignedEntities',
    headers: { 
        'Authorization': 'Bearer '+bToken, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });
   
}

module.exports = async function (context, req) {
    
    var bToken = await getBearerToken();
    for(var assingRel in req.body)
    {
        await assignTerm(req.body[assingRel].gTerm, req.body[assingRel].dAsset, bToken);
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "done."
    };
}