/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function ExamplePage(_pageManager, _audioContext, _audioFileLoader, _pageConfig, _bufferSize, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.audioContext = _audioContext;
  this.audioFileLoader = _audioFileLoader;
  this.pageConfig = _pageConfig;
  this.bufferSize = _bufferSize;
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.fpc = null;  
  this.played = false;

  this.stimuli = [];
  this.description = [];

  var i;
  for(i = 0; i < _pageConfig.stimuli.length; ++i) {
    this.stimuli[i] = new Stimulus("stimulus", _pageConfig.stimuli[i].sample);
    this.description[i] = _pageConfig.stimuli[i].description;
    this.audioFileLoader.addFile(_pageConfig.stimuli[i].sample, (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimuli[i]);
  }

  this.filePlayer = null;
}

ExamplePage.prototype.init = function (_callbackError) {
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, this.stimuli, this.errorHandler, this.language, this.pageManager.getLocalizer(), this.description); 
};


ExamplePage.prototype.getName = function () {
  return this.pageConfig.name;
};

ExamplePage.prototype.load = function() {
  this.filePlayer.init(); 
};

ExamplePage.prototype.save = function() {
  this.filePlayer.free();
};


ExamplePage.prototype.render = function (_parent) {
  var content = $(" <p> " + this.pageConfig.content + " </p>");
  _parent.append(content);
  this.filePlayer.render(_parent);
};
