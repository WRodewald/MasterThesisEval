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

  this.qualityItems = [];
  for (var i in this.pageConfig.qualityItems) {
    this.qualityItems[this.qualityItems.length] = new QualityItem(this.pageConfig.qualityItems[i].Item, this.pageConfig.qualityItems[i].Label, this.pageConfig.qualityItems[i].Description);
  }

  this.conditions = [];
  this.conditions[this.conditions.length] = new Stimulus("stimulus", this.pageConfig.stimulus);

  this.reference = new Stimulus("reference", this.pageConfig.reference);
  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  for (var i = 0; i < this.conditions.length; ++i) {
    this.audioFileLoader.addFile(this.conditions[i].getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.conditions[i]);
  }

  this.trinary = false;
  if(this.pageConfig.trinary) { 
    this.trinary = true;
  }

  // data
  this.ratingMap = new Array();
  this.ratings = [];
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
  var td;
  var active; 
  this.likerts = [];
  
  var cbk = (function(_prefix) {
    this.ratingMap[_prefix] = true;
    if (Object.keys(this.ratingMap).length == this.qualityItems.length) {
      this.pageTemplateRenderer.unlockNextButton();
    }
  }).bind(this);
  
  for (i = 0; i < this.qualityItems.length; ++i) {
    if(this.trinary) {
      this.likerts[i] = new LikertScale([{value:"A", label:"A"}, {value:"0", label:"Neither"}, {value:"B", label:"B"}], this.qualityItems[i].getId(), false, cbk);
    } else {
      this.likerts[i] = new LikertScale([{value:"A", label:"A"}, {value:"B", label:"B"}], this.qualityItems[i].getId(), false, cbk);
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
  var tableDown = $("<table id='mainDown' align = 'center' style='border-spacing: 2em 0em;'></table>"); 
  div.append(tableUp);
  div.append(tableDown);

  var trLoop = $("<tr id='trWs'></tr>");
  tableUp.append(trLoop);




  //trLoop.append(buttonPlayReference);

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
    // (function(i) {
        // Mousetrap.bind(String(i + 1), function() { this.pageManager.getCurrentPage().btnCallbackCondition(i); });
    // })(i);
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
  
  for (i = 0; i < this.qualityItems.length; ++i) {
    var tr = $("<tr></tr>");
    
    var tdName = $("<td style='text-align:left;'><b>" + this.qualityItems[i].getLabel() + ":</b>  </td>");

    var tdDescription = $("<td style='text-align:left;'> " + this.qualityItems[i].getDescription() + " </td>");
   
    var td = $("<td></td>");
 
    this.likerts[i].render(td);  

    tr.append(tdName);
    tr.append(tdDescription);
    tr.append(td);
    //tr.append(tdButtonB);
    tableDown.append(tr);

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

QualityABPage.prototype.renderCanvas = function(_parentId) {
	$('#mushra_canvas').remove(); 
  parent = $('#' + _parentId);
  var canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.zIndex = 0;
  canvas.setAttribute("id","mushra_canvas");
  parent.get(0).appendChild(canvas);
  $('#mushra_canvas').offset({top: $('#refCanvas').offset().top, left : $('#refCanvas').offset().left});
  canvas.height = parent.get(0).offsetHeight - (parent.get(0).offsetHeight - $('#tr_ConditionRatings').height());
  canvas.width = parent.get(0).offsetWidth;

  $(".scales").siblings().css("zIndex", "1");
  $(".scales").slider("enable");

  var canvasContext = canvas.getContext('2d');

  var YfreeCanvasSpace = $(".scales").prev().offset().top - $(".scales").parent().offset().top;
  var YfirstLine = $(".scales").parent().get(0).offsetTop + parseInt($(".scales").css("borderTopWidth"), 10) + YfreeCanvasSpace;
  var prevScalesHeight = $(".scales").prev().height();
  var xDrawingStart = $('#spaceForScale').offset().left - $('#spaceForScale').parent().offset().left + canvasContext.measureText("100 ").width * 1.5;
  var xAbsTableOffset = -$('#mushra_items').offset().left - ($('#mushra_canvas').offset().left - $('#mushra_items').offset().left);
  var xDrawingBeforeScales = $('.scales').first().prev().children().eq(0).offset().left + xAbsTableOffset;
  var xDrawingEnd = $('.scales').last().offset().left - $('#mushra_items').offset().left + $('.scales').last().width()/2;

  canvasContext.beginPath();
  canvasContext.moveTo(xDrawingStart, YfirstLine);
  canvasContext.lineTo(xDrawingEnd, YfirstLine);
  canvasContext.stroke();

  var scaleSegments = [0.2, 0.4, 0.6, 0.8];
  var i;
  for (i = 0; i < scaleSegments.length; ++i) {
    canvasContext.beginPath();
    canvasContext.moveTo(xDrawingStart, prevScalesHeight * scaleSegments[i] +  YfirstLine);
    canvasContext.lineTo(xDrawingBeforeScales, prevScalesHeight * scaleSegments[i] +  YfirstLine);
    canvasContext.stroke();

    var predecessorXEnd = null;
    $('.scales').each(function( index ) {
      var sliderElement = $(this).prev().first();
      if (index > 0) {
        canvasContext.beginPath();
        canvasContext.moveTo(predecessorXEnd, prevScalesHeight * scaleSegments[i] +  YfirstLine);
        canvasContext.lineTo(sliderElement.offset().left + xAbsTableOffset, prevScalesHeight * scaleSegments[i] +  YfirstLine);
        canvasContext.stroke();
      }
      predecessorXEnd = sliderElement.offset().left + sliderElement.width() + xAbsTableOffset + 1;
    });
  }


  canvasContext.beginPath();
  canvasContext.moveTo(xDrawingStart, prevScalesHeight +  YfirstLine);
  canvasContext.lineTo(xDrawingEnd, prevScalesHeight + YfirstLine);
  canvasContext.stroke();

  canvasContext.font = "1.25em Calibri";
  canvasContext.textBaseline = "middle";
  canvasContext.textAlign = "center";
  var xLetters = $("#refCanvas").width() + ($("#spaceForScale").width() + canvasContext.measureText("1 ").width) / 2.0;

  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'excellent'),xLetters , prevScalesHeight * 0.1 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'good'), xLetters, prevScalesHeight * 0.3 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'fair'), xLetters, prevScalesHeight * 0.5 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'poor'), xLetters, prevScalesHeight * 0.7 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'bad'), xLetters, prevScalesHeight * 0.9 + YfirstLine);

  canvasContext.font = "1em Calibri";
  canvasContext.textAlign = "right";
  var xTextScoreRanges =  xDrawingStart - canvasContext.measureText("100 ").width * 0.25; // $("#refCanvas").width()
  canvasContext.fillText("100", xTextScoreRanges, YfirstLine);
  canvasContext.fillText("80", xTextScoreRanges, prevScalesHeight * 0.2 + YfirstLine);
  canvasContext.fillText("60", xTextScoreRanges, prevScalesHeight * 0.4 + YfirstLine);
  canvasContext.fillText("40", xTextScoreRanges, prevScalesHeight * 0.6 + YfirstLine);
  canvasContext.fillText("20", xTextScoreRanges, prevScalesHeight * 0.8 + YfirstLine);
  canvasContext.fillText("0", xTextScoreRanges, prevScalesHeight + YfirstLine);

};


QualityABPage.prototype.load = function () {

  this.startTimeOnPage = new Date();
	  
  this.mushraAudioControl.initAudio();
  
  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }
 
  // reload ratings if they exist
  if(this.ratings){
    var i;
    for(i = 0; i < this.ratings.length; ++i) {
      if(this.ratings[i] != undefined) {
        $("input[name='"+ this.ratings[i].name +"_response'][value='" + this.ratings[i].value +"']").attr("checked", "checked");
        $("input[name='"+ this.ratings[i].name +"_response'][value='" + this.ratings[i].value +"']").checkboxradio("refresh");
        this.likerts[i].group.change();  
      }
    }
  }

  // lock next button
  if (Object.keys(this.ratingMap).length != this.qualityItems.length) {
    this.pageTemplateRenderer.lockNextButton();
  }
  else
  {
    this.pageTemplateRenderer.unlockNextButton();

  }

};

QualityABPage.prototype.save = function () {
  this.macic.unbind(); 
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.freeAudio();
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);  

  this.ratings = [];
  for (i = 0; i < this.likerts.length; ++i) {
    var element = $("input[name='" + this.qualityItems[i].getId() + "_response']:checked");
    var val = element.val();
    if(val) {
      this.ratings[i] = {name: this.qualityItems[i].getId(), value: val};
    } else {
      this.ratings[i] = undefined;
    }
  }
 
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
