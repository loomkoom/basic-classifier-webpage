/*
	Webcam Image Classification template, using a ml5.js pre-trained classification model

ml5.js is a javascript library (based on the p5.js library), and it is like an abstraction layer on top of (to make it easy to work with) tensorflow.js. 
ml stands for 'machine learning'. tensorflow.js is the javascript version of the deep learning library tensorflow, from Google.
So, we'll be using ml5.js to talk to our TeachableMachine model.

p5.js is actually 2 things: first, a general purpose javascript library to make it easy to do calculations in your browser, to connect to your webcam, etc.
And on the other hand, p5 is also like an IDE, a (webbased) application in which you can write, run, debug... javascript code.
We will only be using the javascript library, not the IDE.

We use the preload() function of p5.js to make sure we load in external files, before we start the setup() function. 
The preload is asynchronous, meaning that it completely executes one line of code (like loading a big model into memory), before executing the next line (it waits for completion).
That's the difference with the setup() function. The setup function executes line by line, but it doesn't wait for a previous command to be completely finished.

The setup() part is called after the preload is done (and we're sure that our model is completely loaded). 
In the setup() part we'll create a canvas, like the canvas of a painter on which we'll draw something, like our webcam input, our label output, etc.
Creating the canvas, also calls the draw() function, to draw content on to the canvas.
The draw() function keeps on looping by default, to redraw the content on our canvas. For more information: https://p5js.org/learn/program-flow.html

After creating the canvas, the setup function continues (it doesn't wait until previous commands are finished), and we create a video-stream from our webcam, but we hide it. 
The reason: we want images as input for our model, not a moviestream. We use the draw-function to continuously create images from our webcam feed (capture frames), and draw them on the canvas.
This gives the same result as a live webcam feed on the canvas, but now we have images we can send to our model to do classification.

After the creation of our videostream / capturing images (frames) from our webcam, the setup function calls the classifyImage() function
*/



/*
	Variable declaration
	To define javascript variables, we use the 'var' keyword (although the 'let' keyword would probably also be possible (for more info: https://www.w3schools.com/js/js_let.asp)
*/

var classifier; // variable that will contain our trained model
var imageModelURL = 'https://teachablemachine.withgoogle.com/models/Sgd6lprMn/'; // variable of our trained model's URL
var video; // variable that will contain our videostream
var flippedImage; // variable that will contain our flipped image of our videostream (because a webcam stream needs to be flipped - it's like a mirror)
var label = ""; // placeholder for the label, the thing we want to classify, the output of our model
var confidence = 0;



/*
	preload() function
	
	Preload the model via our TeachableMachine_URL, before we can draw our canvas and start modeling. 
	We use the imageClassifier function of ml5.js to load the model 
	Model can be pretty big, so it can take a while to load. That's why we need the asynchronous mode of preload instead of setup
	Documentation: https://p5js.org/reference/#/p5/preload
*/
function preload() {

    classifier = ml5.imageClassifier(imageModelURL + 'model.json');

}


/* 
	setup() function 
	Creating the canvas, and creating a videostream but hiding it (the draw function will continuously draw a captured frame).
	Call the classifyImage function, to get a prediction
	
	Note: the classifyImage function will use a callback function 'gotResult', which will call classifyImage again, so creating a continous loop for classifying whatever image is on the canvas at that moment
*/
function setup() {
    // Create the canvas
    let cnv = createCanvas(320, 260);
    cnv.parent("cnv");

    for (div of document.getElementById("parent").children) {
        div.style.display = 'none';
    }


    // Create the video / webcam stream
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    // Start classifying
    classifyImage();
}

function draw() {
    background(0);

    // Draw the video (flippedImage is already declaired as a variable, and given content in the classifyImage() function
    image(flippedImage, 0, 0);

    // Draw the label (label is already declaired as a variable, and given content in the gotResult() function
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyImage() {
    // capturing the video frame (making flipped image from webcam feed - flipped because of mirror effect of a webcam)	
    flippedImage = ml5.flipImage(video)
    // classifying the image, and getting result back from our model. Getting result, will do a callback to this function. So we keep on looping in the classification as well
    classifier.classify(flippedImage, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error: (to check the error, open the console window of your browser - in dev tools)
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence. If you want to view the entire returned value (including the confidence intervals, un-comment the line below
    //console.log(results);

    // we only want the label of the first element (the highest confidence prediction)
    label = results[0].label;
    confidence = ceil(results[0].confidence * 100);
    // Classifiy again! So we keep on looping
    classifyImage();
    if (confidence > 75) {
        displayContent();
    }
}

function hideContent() {
    // We reset the display values
    document.getElementById("border collie").style.display = 'none';
    document.getElementById("dalmatier").style.display = 'none';
    document.getElementById("pitbull").style.display = 'none';
    document.getElementById("shiba inu").style.display = 'none';
    document.getElementById("yorkshire terrier").style.display = 'none';
}

// using the var label content we choose which div to display
function displayContent() {
    hideContent();

    var myDiv;
    if (label != "nothing") {
        myDiv = document.getElementById(label);
        myDiv.style.display = 'block';
    }
}
