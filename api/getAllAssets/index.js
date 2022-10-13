const { get } = require('https');

Assets = [];

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
            if(result.status == 200)
            {
                console.log(result.status+" Request for Bearertoken was successful");
            }
            return result.data.access_token;
    }
    catch (err)
    {
        console.log(err)
    }
}

async function getAll(bToken)
{
    try{
            var data = JSON.stringify({
                "keywords": "QueriesByState"
            });

        var config = {
        method: 'post',
        url: 'https://pvlab-pv.purview.azure.com/catalog/api/search/suggest?api-version=2022-03-01-preview',
        headers: { 
            'Authorization': 'Bearer '+bToken, 
            'Content-Type': 'application/json'
        },
        data : data
        };

        let result = await axios(config);
        for(var i = 0; i < result.data.value.length; i++)
        {
            if(result.data.value[i].objectType == "Glossary terms")
            {
                Assets.push({
                    name : result.data.value[i].name,
                    guid : result.data.value[i].id,
                    type : "GlossaryTerm"
                });
            }
            else{
                Assets.push({
                    name : result.data.value[i].name,
                    guid : result.data.value[i].id,
                    type : "DataAsset"
                });
            }
        }
    }
    catch (err){
        console.log(err);
    }

}

module.exports = async function (context, req) {
    
    bToken = await getBearerToken();
    await getAll(bToken)
    //console.log(Assets);
    context.res = {
        body: Assets,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    Assets = [];
}