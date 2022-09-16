const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require('request');
const cheerio = require('cheerio');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

var finalDuration
app.get('/', (req, res) => {
    res.render("index",{
        finalDuration:finalDuration
    });
});

app.post('/',(req,res)=>{


    var link = req.body.link;

    

    request(`${link}`, function (error, response, html) {
    
        if (error) {
            // Print the error if one occurred
            console.error('error:', error);
        }else {
            
            handlehtml(html);
    
        }
    
    });
    
      function handlehtml(html){
          // write html constent to file
            const fs = require('fs');
    
            // load html content
            const $ = cheerio.load(html);
    
            var script ="";
            
            $('script').each(function(i, elem) {
                var script = $(this).html();
                if(script.match(/var ytInitialData/)){
                    script = script.replace('var ytInitialData =','');
                    // console.log(script.replace('var ytInitialData =',''))
                    script = script.slice(0, -1);
                    // console.log(script.slice(0, -1));
                    script = JSON.parse(script);
                    script = script['contents']['twoColumnBrowseResultsRenderer']
                    ['tabs'][0]['tabRenderer']['content']['sectionListRenderer']['contents'][0]['itemSectionRenderer']
                    ['contents'][0]['playlistVideoListRenderer']['contents'];
    
                    console.log(script[0]['playlistVideoRenderer']['title']['runs'][0]['text']);
    
                    let videoData = {}
                    var sum = 0 ;
                    var minSum = 0;
                    var hourSum = 0;
                    for(var i = 0; i < script.length; i++){
                        // let videoTitle = script[i]['playlistVideoRenderer']['title']['runs'][0]['text'];
                        let videoTime = script[i]['playlistVideoRenderer']['lengthText']['simpleText'];
                        // let videoUrl = script[i]['playlistVideoRenderer']['navigationEndpoint']['watchEndpoint']['videoId'];
                        // videoData[i] = {
                        //     'videoTime': videoTime,
                        //     // 'videoUrl': videoUrl,
                        //     // 'videoTitle': videoTitle
                        // }
    
                        
                            
                            var secondSlice = videoTime.slice(-2);
                            secondSlice = Number(secondSlice);   
                            sum = sum+secondSlice;
                           
    
                            var minSlice = videoTime.slice(-5,-3);
                            minSlice = Number(minSlice);
                            minSum = minSum+minSlice;
                            
                            var hourSlice = videoTime.slice(-9,-6)
                             hourSlice = Number(hourSlice);
                             hourSum = hourSum+hourSlice;
                        
                    }
                    
                    // var min = (sum/60).toFixed(2)
                    // console.log(min);
                    var fSecond = sum % 60;
    
    
                    console.log(fSecond);
    
                    // var cmin = String(min).slice(-5,-3);
                    // console.log(cmin);
                    minSum =minSum+Math.floor(sum/60);
                    console.log(minSum);
                    // var Hour =(minSum/60).toFixed(2)
                    // console.log(Hour);
                    var fmin = minSum%60;
    
                    console.log(fmin);
    
                    // var cHour = String(Hour).slice(-5,-3);
                    // console.log(cHour);
                    hourSum = hourSum;
                    var fHour = hourSum + Math.floor(minSum/60);
    
    
                    console.log(fHour);
    
                    finalDuration = fHour+" Hours:  "+fmin+" Min: "+fSecond+"  Sec";
                    console.log(finalDuration);
                       

                    res.redirect('/');



    
                }        
            });
        
    }

    
    


    
})


app.listen(4000, function () {
    console.log("Server started on port 4000");
});