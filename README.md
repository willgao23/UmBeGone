# UmBeGone
## What is this project?
UmBeGone is a public speaking training tool that helps users eliminate hesitations in their speech.  This repository
contains the front end of the web application, built using HTML, CSS, and Javascript to allow users to
easily upload recordings to be analyzed.  

The files are then sent to a Spring Boot API that analyzes the recording
using CMUSphinx4 - an open source speech recognition library (more details located in its respective repository: https://github.com/willgao23/UmBeGone-API)

## How do I use this project?
To use UmBeGone:
1) Visit our website at: (hosting is currently in the works - sit tight!)
2) Using Audacity or another recording software of your choice, record your mono channeled, 16khz sampling rate .wav file(s)
that you want analyzed
3) Upload your .wav file(s) on our website
4) Receive your hesitation report!

## What was the motivation behind this project?
As someone who loves performing and public speaking, I'm always looking for ways to improve my skills.  Specifically, I 
found that while performing improv comedy, I hesitated a lot within scenes.  Punchlines just don't land the same when 
every other word is *um*, so I decided to make UmBeGone for me and all other serial hesitators out there.

## What challenges were faced?
The biggest challenge I faced while developing UmBeGone was facilitating the user recordings to match the
stringent specifications required by the CMUSphinx4 library.  

Originally, my plan was to have the user record themselves within the web app for ease of use.  Modern web browsers record audio at a much higher sampling rate 
(44.1 khz and 48khz for Chrome and Firefox respectively), and so to convert it, one would have to downsample the recording. 
Sampling rate is essentially the number of tiny samples taken per second to create the audio file and downsampling 
typically involves removing some of the samples (i.e. keeping every nth sample).

However, what I soon found was that while downsampling is often imperceptible to the human ear, it had a massive
impact on the accuracy of the CMUSphinx4 speech recognition library.  I assume CMUSphinx4 is so sensitive because it was developed for research
purposes on cleaned audio samples and not necessarily for noisy user-made samples.

This led me to pivot from my original idea to one where users upload files recorded natively at 16khz and taught me the
valuable lesson of always thoroughly evaluating external resources upfront to ensure they fit project needs.

