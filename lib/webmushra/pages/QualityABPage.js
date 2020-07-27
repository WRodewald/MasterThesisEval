function QualityABPage(_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language) {
	this.isMushra = false; 
  this.pageManager = _pageManager;
  this.pageConfig = _pageConfig;
  this.pageTemplateRenderer = _pageTemplateRenderer;  
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.session = _session;
  this.pageConfig = _pageConfig;
  this.errorHandler = _errorHandler;
  this.language = _language
  this.mushraAudioControl = null;
  this.div = null;
  this.waveformVisualizer = null;
  this.macic = null; 
  
  this.currentItem = null;
  
  this.tdLoop2 = null; 

  var i;
  this.qualityItems = [];
  this.ratings = [];
  for (i = 0; i < this.pageConfig.qualityItems.length; ++i) {
    this.qualityItems[this.qualityItems.length] = new QualityItem(this.pageConfig.qualityItems[i].Item, this.pageConfig.qualityItems[i].Label, this.pageConfig.qualityItems[i].Description);
    this.ratings[i] = undefined;
  }

  this.conditions = [];
  this.conditions[this.conditions.length] = new Stimulus("stimulus", this.pageConfig.stimulus);

  this.reference = new Stimulus("reference", this.pageConfig.reference);
  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  for (i = 0; i < this.conditions.length; ++i) {
    this.audioFileLoader.addFile(this.conditions[i].getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.conditions[i]);
  }

  this.trinary = false;
  if(this.pageConfig.trinary) { 
    this.trinary = true;
  }

  // data
  this.ratingMap = new Array();
  this.loop = {start: null, end: null};
  this.slider = {start: null, end: null};
  
  this.time = 0;
  this.startTimeOnPage = null;
}



QualityABPage.prototype.getName = function () {
  return this.pageConfig.name;
};

QualityABPage.prototype.init = function () {
  var toDisable;
  var active; 
  
  this.cbk = (function(_prefix) {
  }).bind(this);
  
  var i;
  this.scale = []
  if(this.pageConfig.scale == undefined) {
    this.scale = [{value:"A", label:"A"}, {value:"B", label:"B"}];
  } else {
    for (i = 0; i < this.pageConfig.scale.length; ++i) {
      this.scale[i] = {value: this.pageConfig.scale[i].Value, label: this.pageConfig.scale[i].Label};
    }
  }

  this.reversed_order = false;
  if(this.pageConfig.reversed_order == true) {
    this.reversed_order = true;
  }

  this.mushraAudioControl = new MushraAudioControl(this.audioContext, this.bufferSize, this.reference, this.conditions, this.errorHandler, this.pageConfig.createAnchor35, this.pageConfig.createAnchor70, false, this.reversed_order);
  this.mushraAudioControl.addEventListener((function (_event) {
    if (_event.name == 'stopTriggered') {
      $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButtonA'));
      $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButtonB'));
  
      for(i = 0; i < _event.conditionLength; i++) {
        active = '#buttonConditions' + i;
        toDisable = $(".scales").get(i);
        if($(active).attr("active") == "true") {
          $.mobile.activePage.find(active)      // remove color from conditions
            .removeClass('ui-btn-b')
            .addClass('ui-btn-a').attr('data-theme', 'a');
          //$(toDisable).slider('disable');
          $(toDisable).attr("active", "false");
          $(active).attr("active", "false");
          break;
        }
      }
  
      $.mobile.activePage.find('#buttonStop')    //add color to stop
        .removeClass('ui-btn-a')
        .addClass('ui-btn-b').attr('data-theme', 'b');
      $.mobile.activePage.find('#buttonStop').focus();
      $('#buttonStop').attr("active", "true");
  
    } else if(_event.name == 'playConditionTriggered') {
  
      var index = _event.index;
      var activeSlider = $(".scales").get(index);
      var selector = '#buttonConditions' + index;
  
      if($('#buttonStop').attr("active") == "true") {
        $.mobile.activePage.find('#buttonStop')  //remove color from Stop
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a'); 
        $('#buttonStop').attr("active", "false");
      }
    var k;
      for(k = 0; k < _event.length; k++) {
        active = '#buttonConditions' + k;
        toDisable = $(".scales").get(k); 
        if($(active).attr("active") == "true") {
          $.mobile.activePage.find(active)    // remove color from conditions
            .removeClass('ui-btn-b')
            .addClass('ui-btn-a').attr('data-theme', 'a');
          //$(toDisable).slider('disable');
          $(active).attr("active", "false");
          $(toDisable).attr("active", "false");
          break;
       }
      }
  
      $(activeSlider).slider('enable');
      $(activeSlider).attr("active", "true");
      $.mobile.activePage.find(selector)    //add color to conditions
        .removeClass('ui-btn-a')
        .addClass('ui-btn-b').attr('data-theme', 'b');
      $.mobile.activePage.find(selector).focus();
      $(selector).attr("active", "true");
    }
  }).bind(this));
};

QualityABPage.prototype.render = function (_parent) {
  var div = $("<div></div>");
  _parent.append(div);
  var content; 
  if(this.pageConfig.content === null){
	  content ="";
  } else {
	  content = this.pageConfig.content;
  }
	
  var p = $("<p>" + content + "</p>");
  div.append(p);

  var tableUp = $("<table id='mainUp'></table>");
  var tableDown = $("<table id='mainDown' align = 'center' style='border-spacing: 0em 0em;'></table>"); 
  div.append(tableUp);
  var form = $("<form></form");
  form.append(tableDown);
  div.append(form);

  var trLoop = $("<tr id='trWs'></tr>");
  tableUp.append(trLoop);

  var tdPlayPauseStop = $("<td style='width: 10%;'></td>");
  trLoop.append(tdPlayPauseStop);

  var tdPlayPauseStopTable = $("<table></table>");
  tdPlayPauseStop.append(tdPlayPauseStopTable);

  var conditions = this.mushraAudioControl.getConditions();
  for (i = 0; i < conditions.length; ++i) {
    var btn = "playButtonA"
    if (i == 1) {
      btn = "playButtonB"
    }

    tr = $("<tr></tr>")
    td = $("<td class='stopButton'></td>"); 
    var buttonPlay = $("<button data-role='button' class='audioControlElement wide' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackCondition(" + i + ");'>" + this.pageManager.getLocalizer().getFragment(this.language, btn) + "</button>");
    buttonPlay.attr("id", "buttonConditions" + i);
    td.append(buttonPlay);
    tr.append(td);
    tdPlayPauseStopTable.append(tr);
  }
  
  var trStopRow = $("<tr></tr>");
  tdPlayPauseStopTable.append(trStopRow);

  var tdLoop1 = $(" \
    <td class='stopButton'> \
      <button data-role='button' data-inline='true' id='buttonStop' class='wide' onclick='"+ this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') + "</button> \
    </td> \
  ");
  trStopRow.append(tdLoop1);

  var tdRight = $("<td></td>");
  trLoop.append(tdRight);
  
  var tr = $("<tr></tr>");
  tr.append($("<td class='table-pad'></td>"));
  tr.append($("<td class='table-pad'></td>"));
  tr.append($("<td class='table-pad'></td>"));

  var k;
  for (k = 0; k < this.scale.length; ++k) {
    tr.append( $("<td class='table-pad'></td>").append("<b>" + this.scale[k].label + "</b>"));
  }

  tr.append( $("<td class='table-pad'></td>"));
  tableDown.append(tr);

  tr.append($("<td></td>"));

  for (i = 0; i < this.qualityItems.length; ++i) {
    var tr = $("<tr class='radio-tr'></tr>");
    
    var tdName = $("<td class='table-pad' style='text-align:left;'><b>" + this.qualityItems[i].getLabel() + ":</b>  </td>");

    var tdDescription = $("<td class='table-pad' style='text-align:left;'> " + this.qualityItems[i].getDescription() + " </td>");

    tr.append(tdName);
    tr.append(tdDescription);
    tr.append("<td class='table-pad'><b>A</b></td>");

    var k;
    for (k = 0; k < this.scale.length; ++k) {
      var id = this.qualityItems[i].getId() + "_" + this.scale[k].value;
      var td = $("<td class='radio-td'></td>");
      var radio = $("<input type='radio' id='" + id + "' name='" + this.qualityItems[i].getId() + "' \
                            style='position:relative; width: 1.5em; height:1.5em; margin:auto; top: 0px; left: 0px;'></input>");

      radio.attr('value', this.scale[k].value);

      var page  = this;
      radio.change(function(_value, _item) {
        var item  = $(this).attr('name');
        var value = $(this).attr('value');

        var i;
        for(i = 0; i < page.qualityItems.length; ++i) {
          if(page.qualityItems[i].getId() == item) {
             break;
          }
        }

        page.ratings[i] = value;
        page.ratingMap[item] = true;

        if (Object.keys(page.ratingMap).length == page.qualityItems.length) {
          page.pageTemplateRenderer.unlockNextButton();
        }
      });

      tr.append(td);
      td.append(radio);
    }
    
    tr.append("<td><b>B</b></td>");
    tableDown.append(tr); 

    $('.ui-radio').css({"display":"flex","align-items":"center", "justify-content":"center"});

  }

  this.macic = new MushraAudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.macic.bind(); 

  this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", tdRight, this.reference, this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();
};

QualityABPage.prototype.pause = function() {
    this.mushraAudioControl.pause();
};

QualityABPage.prototype.setLoopStart = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

QualityABPage.prototype.setLoopEnd = function() {
  var slider = document.getElementById('slider'); 
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

QualityABPage.prototype.btnCallbackReference = function() {
  this.currentItem = "ref";
  var label = $("#buttonReference").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playReference();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));
  }
}; 

QualityABPage.prototype.btnCallbackCondition = function(_index) {
	this.currentItem = _index;	
	
  var label = $("#buttonConditions" + _index).text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButtonA')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'playButtonA'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButtonB')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'playButtonB'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButtonA')) {
    $("#buttonConditions" + (1-_index)).text(this.pageManager.getLocalizer().getFragment(this.language, 'playButtonB'));
    this.mushraAudioControl.playCondition(_index);
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButtonA'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButtonB')) {
    $("#buttonConditions" + (1-_index)).text(this.pageManager.getLocalizer().getFragment(this.language, 'playButtonA'));
    this.mushraAudioControl.playCondition(_index);
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButtonB'));
  }
};

QualityABPage.prototype.load = function () {

  this.startTimeOnPage = new Date();
	  
  this.mushraAudioControl.initAudio();
  
  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }
 
  // reload ratings
  var i;
  for(i = 0; i < this.ratings.length; ++i){
    if(this.ratings[i] != undefined) {
      var id = this.qualityItems[i].getId() + "_" + this.ratings[i];
      var selector = "input[id=" + id + "]";
      $(selector).attr('checked', true);
    }
  }

  // lock next button
  if (Object.keys(this.ratingMap).length != this.qualityItems.length) {
    this.pageTemplateRenderer.lockNextButton();
  } else {
    this.pageTemplateRenderer.unlockNextButton();
  }
};

QualityABPage.prototype.save = function () {
  this.macic.unbind(); 
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.freeAudio();
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);  
 
  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};

QualityABPage.prototype.store = function () {
	
  var trial = new Trial();
  trial.type = this.pageConfig.type;
  trial.id = this.pageConfig.id;

  var i;
  for (i = 0; i  < this.ratings.length; ++i) {
    var rating = this.ratings[i];
    var ratingObj = new BinaryABRating();
    ratingObj.name  = rating.name;
    ratingObj.value = rating.value;
    if(this.reversed_order) {
      ratingObj.reversed = 1;
    } else {
      ratingObj.reversed = 0;
    }
    ratingObj.time = this.time;
    trial.responses[trial.responses.length] = ratingObj;
  }
  this.session.trials[this.session.trials.length] = trial;
};
