function QualityPage(_pageManager, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language) {
	this.isMushra = true; 
  this.pageManager = _pageManager;
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
  for (var key in this.pageConfig.qualityItems) {
    this.qualityItems[this.qualityItems.length] = new QualityItem(key, this.pageConfig.qualityItems[key]);
  }

  this.reference = new Stimulus("reference", this.pageConfig.reference);
  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  
  // data
  this.ratings = [];
  this.loop = {start: null, end: null};
  this.slider = {start: null, end: null};
  
  this.time = 0;
  this.startTimeOnPage = null;
}



QualityPage.prototype.getName = function () {
  return this.pageConfig.name;
};

QualityPage.prototype.init = function () {
   var toDisable;
  var td;
  var active; 
  

  conditions = []
  this.mushraAudioControl = new MushraAudioControl(this.audioContext, this.bufferSize, this.reference, conditions, this.errorHandler, this.pageConfig.createAnchor35, this.pageConfig.createAnchor70, this.pageConfig.randomize);
  this.mushraAudioControl.addEventListener((function (_event) {
  if (_event.name == 'stopTriggered') {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));

    if($('#buttonReference').attr("active") == "true") {
      $.mobile.activePage.find('#buttonReference')  //remove color from Reference
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonReference').attr("active", "false");
    }


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

  } else if (_event.name == 'playReferenceTriggered') {

    if($('#buttonStop').attr("active") == "true") {
      $.mobile.activePage.find('#buttonStop')  //remove color from Stop
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonStop').attr("active", "false");
    }

    $.mobile.activePage.find('#buttonReference')		//add color to reference
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find('#buttonReference').focus();
  	$('#buttonReference').attr("active", "true");
  }


}).bind(this));
  
  
  
};

QualityPage.prototype.render = function (_parent) {
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
  var tableDown = $("<table id='mainDown' align = 'center'></table>"); 
  div.append(tableUp);
  div.append(tableDown);

  var trLoop = $("<tr id='trWs'></tr>");
  tableUp.append(trLoop);





  //trLoop.append(buttonPlayReference);

  var tdPlayPauseStop = $("<td style='width: 10%;'></td>");
  trLoop.append(tdPlayPauseStop);

  var tdPlayPauseStopTable = $("<table></table>");
  tdPlayPauseStop.append(tdPlayPauseStopTable);

  var trPlayPauseRow = $("<tr></tr>");
  tdPlayPauseStopTable.append(trPlayPauseRow);
  
  var buttonPlayReference = $("\
  <td class='stopButton'> \
    <button data-theme='a' id='buttonReference' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReference()' style='width : 5.5em !important; margin : 0 auto !important'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button> \
  </td>");
  trPlayPauseRow.append(buttonPlayReference);
  

  var trStopRow = $("<tr></tr>");
  tdPlayPauseStopTable.append(trStopRow);
  

  var tdLoop1 = $(" \
  <td class='stopButton'> \
    <button data-role='button' data-inline='true' id='buttonStop' onclick='"+ this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') + "</button> \
  </td> \
  ");
  trStopRow.append(tdLoop1);

  var tdRight = $("<td></td>");
  trLoop.append(tdRight);
  

  var trMushra = $("<tr></tr>");
  tableDown.append(trMushra);
  var tdMushra = $("<td id='td_Mushra' colspan='2'></td>");
  trMushra.append(tdMushra);

  var tableMushra = $("<table id='mushra_items'></table>");
  tdMushra.append(tableMushra);

  var trConditionNames = $("<tr></tr>");
  tableMushra.append(trConditionNames);

  var tdConditionNamesReference = $("<td></td>");
  trConditionNames.append(tdConditionNamesReference);

  var tdConditionNamesScale = $("<td id='conditionNameScale'></td>");
  trConditionNames.append(tdConditionNamesScale);

  var i;
  for (i = 0; i < this.qualityItems.length; ++i) {
    td = $("<td style='padding : 2em;'><b>"  + this.qualityItems[i].getLabel() + "</b></td>");
    trConditionNames.append(td);
  }

  
  // ratings
  var trConditionRatings = $("<tr id='tr_ConditionRatings'></tr>");
  tableMushra.append(trConditionRatings);

  var tdConditionRatingsReference = $("<td id='refCanvas'></td>");
  trConditionRatings.append(tdConditionRatingsReference);

  var tdConditionRatingsScale = $("<td id='spaceForScale'></td>");
  trConditionRatings.append(tdConditionRatingsScale);

  for (i = 0; i < this.qualityItems.length; ++i) {
    td = $("<td class='spaceForSlider'> \
      <span><input type='range' name='"+this.qualityItems[i].getId()+"' class='scales' value='100' min='0' max='100' data-vertical='true' data-highlight='true' style='display : inline-block; float : none;'/></span> \
    </td>");
    $(".ui-slider-handle").unbind('keydown');
    trConditionRatings.append(td);
  }


  this.macic = new MushraAudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.macic.bind(); 

this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", tdRight, this.reference, this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();
};

QualityPage.prototype.pause = function() {
    this.mushraAudioControl.pause();
};

QualityPage.prototype.setLoopStart = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

QualityPage.prototype.setLoopEnd = function() {
  var slider = document.getElementById('slider'); 
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

QualityPage.prototype.btnCallbackReference = function() {
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

QualityPage.prototype.renderCanvas = function(_parentId) {
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


QualityPage.prototype.load = function () {

  this.startTimeOnPage = new Date();
	
	
  this.renderCanvas('mushra_items');
 
 
  this.mushraAudioControl.initAudio();
 
  if (this.ratings.length !== 0) {
    var scales = $(".scales");
    var i;
    for (i = 0; i  < scales.length; ++i) {
      $(".scales").eq(i).val(this.ratings[i].value).slider("refresh");
    }
  }
  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }
 
};

QualityPage.prototype.save = function () {
  this.macic.unbind(); 
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.freeAudio();
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);  
  var scales = $(".scales");
  this.ratings = [];
  var i;
  for (i = 0; i  < scales.length; ++i) {
    this.ratings[i] = {name: scales[i].name, value: scales[i].value};
  }
 
  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};

QualityPage.prototype.store = function () {
	
  var trial = new Trial();
  trial.type = this.pageConfig.type;
  trial.id = this.pageConfig.id;
  var i;
  for (i = 0; i  < this.ratings.length; ++i) {
    var rating = this.ratings[i];
    var ratingObj = new MUSHRARating();
    ratingObj.stimulus = rating.name;
    ratingObj.score = rating.value;
    ratingObj.time = this.time;
    trial.responses[trial.responses.length] = ratingObj;
  }
  this.session.trials[this.session.trials.length] = trial;
};
