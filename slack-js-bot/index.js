const v8 = require('vm')

// it is slack request querystring of "command line"
/*
{"data":
    {
    "token": "Slack App Credentials Token in Basic Information",
    "team_id": "team primary id",
    "team_domain": "team domain",
    "channel_id": "channel id",
    "channel_name": "channel name",
    "user_id": "user_id",
    "user_name": "user_name",
    "command": "/Slash command",
    "text": "Slack request text",
    "response_url": "hooks url",
    "trigger_id": "trigger id"
    }
}
*/

const userContext = {}

function getContext(key) {
    if (!userContext.hasOwnProperty(key)) {
        let reset = () => {
            userContext[key] = {reset}
            return userContext[key]
        }
        return v8.createContext(reset())
    }
    return userContext[key]
}

function normalizeCode(code) {
    // restore chars that slack api has been replaced
    code = code.replace(/“|”/g, '"')
        .replace(/‘|’/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/```/g, '')
        .trim()
    
    // encapsule objectliteral only expression (caused by vm module's bug)
    if (code[0] === '{' && code[code.length - 1] === '}') {
        code = `(${code})`
    }
    return code
}

function formatResult(result) {
    if (typeof result === 'undefined' || result === undefined) {
        return ""
    }
    if (typeof result !== 'string') {
        result = JSON.stringify(result)
    }

    return "```" + result + "```"
}

// this function is verify that requests are actually comming from Slack.
function verificationCheck(data) {

    if(data.token == "89IiMTHtU8N9WrJn4aE9MZCp" && data.team_id == "T2XBT4Q6Q"){
        return true;
    }

    return false;
}

exports.handler = function(event, context, callback) {
    let payload = {}; // response object to Slack
    
    console.log(event);
    let sandbox = getContext(event.data.user_id || 'U000000000');
    let verification_check = verificationCheck(event.data);

    // callback(Error error, Object result);
    if (verification_check == false) {
        callback(formatResult("Your request is an invalid token or invalid user."));
    }

    let code = normalizeCode(event.data.text);
    console.log(code);
    // TODO: transpile sourcecode when specified trigger_word is given    
    try {
        let result = v8.runInNewContext(code, sandbox, {timeout: 7})
        
        payload.text = formatResult(result);
        payload.response_type = "in_channel";
        
        callback(null, payload);
        
    } catch(e) {
        payload.text = e.toString();
        callback(payload);
    }
}
