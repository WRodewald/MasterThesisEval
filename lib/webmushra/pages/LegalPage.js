/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LegalPage(_pageManager, _pageTemplateRenderer, _pageConfig, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.pageConfig = _pageConfig;
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.fpc = null;  
  this.played = false;

  
  this.pageTemplateRenderer  = _pageTemplateRenderer; 
  this.agreement = false;

}

LegalPage.prototype.init = function (_callbackError) {
};


LegalPage.prototype.getName = function () {
  return this.pageConfig.name;
};

LegalPage.prototype.load = function() {

  var pageTemplateRenderer = this.pageTemplateRenderer;
  
  var checkbox = $("#legal_agreement");
  checkbox.unbind('change');
  checkbox.change(function() {
    if(checkbox.prop('checked')) {
      pageTemplateRenderer.unlockNextButton();
    } else {
      pageTemplateRenderer.lockNextButton();
    }
  });

  if(this.agreement) {    
    pageTemplateRenderer.unlockNextButton();
    checkbox.click();
  } else {
    pageTemplateRenderer.lockNextButton();    
  }
};

LegalPage.prototype.save = function() {

  this.agreement = $("#legal_agreement").prop('checked');
};


LegalPage.prototype.render = function (_parent) {
  
  _parent.append(this.pageConfig.content);

  
  var table = $("<table style='margin-top:2em' align='center'></table>");

  var tr = $("<tr></tr>");
  var td = $("<td></td>")

  tr.append(td)
  table.append(tr)

  td.append($("<input type='checkbox' id='legal_agreement' name='legal_agreement'><label id='legal_label' for='legal_agreement'>" + this.pageConfig.label + "</label>"))

  _parent.append(table)
};
