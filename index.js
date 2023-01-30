function handleOnChange() {
    var inputElement = document.getElementById("input");
    var files = inputElement.files;
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      var url = URL.createObjectURL(files[i]);

      if(files[i].size > 5000000) {
        window.alert("Your file size is too large!  Please ensure that your recording is less than 5MB before uploading again.");
        return;
      }

      if(files[i].type !== "audio/wav") {
          window.alert("Your file is not a .wav file!  Our analysis tool only accepts 16khz mono .wav files.");
          return;
      }

      formData.append('files', files[i]);

      var audio = document.createElement("audio");
      audio.setAttribute("controls", "controls");
      audio.setAttribute("src", url);
      audio.setAttribute("type", "audio/wav");

      var deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "delete");
      deleteButton.innerHTML = "Delete";

      var analysis = document.createElement("div");
      analysis.setAttribute("class", "analysis");
      analysis.innerHTML = "Analyzing your recording...";

      var li = document.createElement('li');
      li.appendChild(audio);
      li.appendChild(analysis);
      li.appendChild(deleteButton);

      var recordingsList = document.getElementById("recordingsList")

      recordingsList.appendChild(li);
    }
    

    if (!files) {
      console.error("No file selected");
      return;
    }

    var xhr = new XMLHttpRequest();

    xhr.onload = () => {
      console.log(xhr.responseText)
    }

    xhr.open("POST", "http://localhost:8080/recording-api/file");

    xhr.send(formData);

    xhr.onload = function() {
      if (xhr.status === 200) {
        var data = xhr.response;
        var jsonResponse = JSON.parse(data);
        var list = document.getElementById("recordingsList");
        var recordings = list.getElementsByTagName("li");

        for(var i = 0; i < jsonResponse.length; i++) {
          console.log(jsonResponse[i]);
          console.log(recordings[i]);
          var numHesitationsJSON = jsonResponse[i]["numHesitations"];
          var numWordsJSON = jsonResponse[i]["numWords"];
          var hesiTimesJSON = jsonResponse[i]["hesiTimes"];
          var accuracyJSON = ((numWordsJSON - numHesitationsJSON) / numWordsJSON) * 100;
  
          recordings[i].setAttribute("id", `${jsonResponse[i]["id"]}`);
          recordings[i].querySelector("button").setAttribute("onclick", `handleDeleteOnClick(${jsonResponse[i]["id"]})`);
  
          var numHesitations = document.createElement("div");
          numHesitations.setAttribute("class", "body");
          numHesitations.innerHTML = `# of Hesitations: ${JSON.stringify(numHesitationsJSON)}`;
  
          var accuracy = document.createElement("div");
          accuracy.setAttribute("class", "body");
          accuracy.innerHTML = `Accuracy: ${JSON.stringify(accuracyJSON)}%`;
  
          var hesiTimes = document.createElement("div");
          hesiTimes.setAttribute("class", "body");
          hesiTimes.innerHTML = `Hesitation Timestamps (seconds): ${JSON.stringify(hesiTimesJSON)}`;
          
          var analysisDiv = recordings[i].querySelector("div");
          analysisDiv.innerHTML = "";
          analysisDiv.appendChild(numHesitations);
          analysisDiv.appendChild(accuracy);
          analysisDiv.appendChild(hesiTimes);
        }
      }
      
    }
  }

  function handleDeleteOnClick(clickedId) {
    var toDelete = document.getElementById(clickedId);
    var xhr = new XMLHttpRequest();

    xhr.onload = () => {
      console.log(xhr.responseText)
    }

    xhr.open("DELETE", `http://localhost:8080/recording-api/${clickedId}`);
    xhr.send();
    
    toDelete.remove();
  }