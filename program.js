/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.00000000000000"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var feed = require('feed-read');
/**
 * WhatsTheLatestPost is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var WhatsTheLatestPost = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
WhatsTheLatestPost.prototype = Object.create(AlexaSkill.prototype);
WhatsTheLatestPost.prototype.constructor = WhatsTheLatestPost;

WhatsTheLatestPost.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("WhatsTheLatestPost onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

WhatsTheLatestPost.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("WhatsTheLatestPost onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Latest News for Silverline Alexa Skill. You can learn the latest news about Silverline. Ask for the latest blog post by saying, What's the latest post?";
    var repromptText = "Ask for the latest blog post by saying What's the latest post or What's the latest news?";
    response.ask(speechOutput, repromptText);
};

WhatsTheLatestPost.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("WhatsTheLatestPost onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

WhatsTheLatestPost.prototype.intentHandlers = {
    // register custom intent handlers
    "WhatsTheLatestPost": function (intent, session, response) {
        
        var url = "http://silverlinecrm.com/blog/?feed=rss";

        feed(url,
              function(err, articles) {
                
                var blogTitle = '';
                var blogLink = '';
                var addedSpeech = '';
                if (err){
                    blogTitle = 'Error Fetching Blog Post';         
                }
                else{
                    blogTitle = articles[0].title;//  + ' - ' + articles[0].link;
                    blogLink = articles[0].link;

                    addedSpeech = '. I have sent a link to this article to your Amazon Alexa App.'
                }   

                response.tellWithCard(blogTitle + addedSpeech, "Latest News for Silverline", blogTitle + ' - ' + blogLink);        
                
              }
            );    
            
        
        
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask for the latest blog post by saying What's the latest post or What's the latest news?", "Ask for the latest blog post by saying What's the latest post or What's the latest news?");
    }

};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var whatsTheLatestPost = new WhatsTheLatestPost();
    whatsTheLatestPost.execute(event, context);
};
