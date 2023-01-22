function handleOnChange() {
    var inputElement = document.getElementById("input");
    var audio = document.createElement("audio");
    var file = inputElement.files[0];
    var url = URL.createObjectURL(file);

    if(file.size > 5000000) {
       window.alert("Your file size is too large!  Please ensure that your recording is less than 5MB before uploading again.");
       return;
    }

    if(file.type !== "audio/wav") {
        window.alert("Your file is not a .wav file!  Our analysis tool only accepts 16khz mono .wav files.");
        return;
    }

    console.log(url);
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

    if (!file) {
      console.error("No file selected");
      return;
    }

    var xhr = new XMLHttpRequest();

    xhr.onload = () => {
      console.log(xhr.responseText)
    }

    xhr.open("POST", "http://localhost:8080/recording-api/file");

    var formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);

    xhr.onload = function() {
      var data = xhr.responseText;
      var jsonResponse = JSON.parse(data);
      var numHesitationsJSON = jsonResponse["numHesitations"];
      var numWordsJSON = jsonResponse["numWords"];
      var hesiTimesJSON = jsonResponse["hesiTimes"];
      var accuracyJSON = ((numWordsJSON - numHesitationsJSON) / numWordsJSON) * 100;

      li.setAttribute("id", `${jsonResponse["id"]}`);
      deleteButton.setAttribute("onclick", `handleDeleteOnClick(${jsonResponse["id"]})`);

      var numHesitations = document.createElement("div");
      numHesitations.setAttribute("class", "body");
      numHesitations.innerHTML = `# of Hesitations: ${JSON.stringify(numHesitationsJSON)}`;

      var accuracy = document.createElement("div");
      accuracy.setAttribute("class", "body");
      accuracy.innerHTML = `Accuracy: ${JSON.stringify(accuracyJSON)}%`;

      var hesiTimes = document.createElement("div");
      hesiTimes.setAttribute("class", "body");
      hesiTimes.innerHTML = `Hesitation Timestamps (seconds): ${JSON.stringify(hesiTimesJSON)}`;

      analysis.innerHTML = "";
      analysis.appendChild(numHesitations);
      analysis.appendChild(accuracy);
      analysis.appendChild(hesiTimes);
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