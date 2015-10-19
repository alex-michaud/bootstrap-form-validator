/*
 *  bootstrap-form-validator - v0.0.2
 *  A javascript bootstrap plugin to validate a form
 *
 *  Made by Alex Michaud
 *  Under MIT License
 */

// we don't want javascript error if legacy browser don't support console.log()
if ( ! window.console ) {
    (function() {
      var names = ["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"],i, l = names.length;
      window.console = {};
      for ( i = 0; i < l; i++ ) { window.console[ names[i] ] = function() {}; }
    }());
}

! function($) {
	
	'use strict';// jshint ;_;

	/* VALIDATOR PUBLIC CLASS DEFINITION
	 * =============================== */

	var Validator = function (form, options) {
		this.init('validator', form, options);
	};

	Validator.prototype = {
		
		constructor : Validator
		
		, init : function (type, form, options) {

			this.type = type;
			this.$form = $(form);
			this.options = this.getOptions(options);
			this.current_directory = this.getCurrentDirectory(['bootstrap-form-validator.js', 'bootstrap-form-validator.min.js']);

			if(!this.current_directory) {
				console.log('Could not find the directory where the bootstrap form validator plugin is located');
				return;
			}

			this.validationStatus = true;
			this.regex = {
				email:/^[a-zA-Z0-9+._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
				url:/^((http|https|ftp):\/\/)?([[a-zA-Z0-9]\-\.])+(\.)([[a-zA-Z0-9]]){2,4}([[a-zA-Z0-9]\/+=%&_\.~?\-]*)$/,
				integer:/^\d+$/,
				number:/^\d+$/,
				alpha:/^[a-z]+$/i,
				alphanumeric:/^[a-z0-9]+$/i,
				tel:/^[0-9\-\s]+$/,
				postalcode_us:/^[0-9]{5}(?:-[0-9]{4})?$/,
				postalcode_ca:/^[ABCEGHJKLMNPRSTVXY][0-9][A-Z][\s\-]?[0-9][A-Z][0-9]$/i,
				postalcode_uk:/(((^[BEGLMNS][1-9]\d?)|(^W[2-9])|(^(A[BL]|B[ABDHLNRST]|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]|F[KY]|G[LUY]|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]|M[EKL]|N[EGNPRW]|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKL-PRSTWY]|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)\d\d?)|(^W1[A-HJKSTUW0-9])|(((^WC[1-2])|(^EC[1-4])|(^SW1))[ABEHMNPRVWXY]))(\s*)?([0-9][ABD-HJLNP-UW-Z]{2}))$|(^GIR\s?0AA$)/,
				postalcode_br:/^\d{5}\-\d{3}$/,
				phone_us:/^(([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+$/,
				creditcard:/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})$/
			};
			this.lang = {
				test:'TEST'
			};
			
			this.loadLanguage(this.options.lang);
		}
		
		, loadLanguage : function (lang) {
			var self = this;
			var languageFile = 'bootstrap-form-validator-'+lang+'.js';
			if(typeof bootstrapFormValidatorLanguage=='undefined'){
				$.ajax({
					url: this.current_directory+languageFile,
					dataType: 'script',
					async: false,
					cache: false,
					success: function(){
						console.log('language script loaded');
						//console.log(typeof bootstrapFormValidatorLanguage)
						if(typeof bootstrapFormValidatorLanguage == 'object')
							$.extend(self.lang, bootstrapFormValidatorLanguage);
						else
							alert('bootstrap form validator language file is loaded, but the content is invalid');
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log('bootstrap validator could not find the language file : '+languageFile);
						if(lang != 'en')
						{
							console.log('trying to load the default language file');
							self.loadLanguage('en');
						}
					}
				});
			}
			else {
				$.extend(self.lang, bootstrapFormValidatorLanguage);
			}
		}
		
		, getString : function (index, opt) {
			if(typeof this.lang[index] != 'undefined')
				return this.lang[index].replace('%s', opt);
			else
				console.log(index);
		}

		// get the current directory where the javascript is executed from
		, getCurrentDirectory : function(arrFilename) {
			//for(var i=0, scripts = document.getElementsByTagName('script'); i<scripts.length; i++)
			var scripts = document.getElementsByTagName('script');
			for(var i in scripts)
			{
				if(scripts[i].src) {
					var url = document.createElement('a');
					url.href = scripts[i].src;
					for(var j in arrFilename) {
						if(url.pathname.indexOf(arrFilename[j]) != -1) {
							return url.pathname.replace(arrFilename[j], '');
						}
					}
				}
			}
			return false;
		}
		
		, getOptions : function (options) {
			return $.extend({}, $.fn[this.type].defaults, options, this.$form.data());
		}
		
		, addRegex : function (regexName, regexPattern) {
            this.regex[regexName] = regexPattern;
		}
		
		, validate : function (value, ruleName, ruleParam) {
		    
            if(ruleName == 'required')
               return (value.length > 0);
           
            if(ruleName == 'minlength')
                return (value.length >= ruleParam);
            
            if(ruleName == 'maxlength')
                return (value.length <= ruleParam);

			if(ruleName == 'matches') {
				//console.log(ruleParam)
				//console.log(value)
				//console.log(this.$form.find('#'+ruleParam).val())
				return (value == this.$form.find('#'+ruleParam).val());
			}
            
            if(value.length > 0 && this.regex[ruleName])
                return this.regex[ruleName].test(value);
            
            return true;
		}
		
		, formatErrors : function (errorArray) {
			var error = '';
			for(var i in errorArray)
  				error+="<div class='"+this.options.errorMessageClass+"'>"+errorArray[i]+"</div>";

  			return error;
		}
		
		, validateInput : function(inputElement) {

			var $inputElement = $(inputElement);

		    // if : element is disabled, don't do validation
            if($inputElement.is(':disabled'))
                return true;

			//console.log($inputElement.data('bs.fv.status'))
            
			var rules = $inputElement.data('validate').split(',');
			var error = '';
			var errorArray = [];
			//for(var i=0; i<rules.length; i++) {
			for(var i in rules) {
			    if(rules[i].length) {
    			    var ruleParams = rules[i].split(/[=:]/);
    			    var ruleName = ruleParams[0];
    			    var ruleParam = (ruleParams[1]) ? ruleParams[1] : null;

    			    if(!this.validate($inputElement.val(), ruleName, ruleParam)) {
						if(ruleName == 'matches')
							ruleParam = (ruleParams[1]) ? $inputElement.parents('form').find('#'+ruleParam).parents('.form-group').find('label').html() : null;

						errorArray.push(this.getString(ruleName, ruleParam));
					}
                }
			}

			if(errorArray.length > 0) {
				$inputElement.data('bs.fv.status', 'error');

				var tooltipObject = $inputElement.data('bs.tooltip') || false;
				//console.log(tooltipObject);
				if(!tooltipObject) {
					$inputElement.tooltip({
						html:true,
						placement: $inputElement.data('placement') ? $inputElement.data('placement') : this.options.placement,
						container:'body',
						title:this.formatErrors(errorArray),
						trigger:'manual'
					});
					$inputElement.tooltip('show');
				}
				else {
					var tooltipTitle = tooltipObject.getTitle();
					var errorTitle = this.formatErrors(errorArray);
					//console.log(tooltipTitle)
					//console.log(errorTitle)
					if(tooltipTitle != errorTitle) {
						tooltipObject.$tip.find('.tooltip-inner').html(errorTitle)
					}
				}
				$inputElement.parents('.form-group').addClass('has-error');
				return false;
			}
			else {
				$inputElement.data('bs.fv.status', 'ok');
				this.cleanInput($inputElement);
				return true;
			}
		}
		
		, validateForm : function () {
			var self = this;
			self.validationStatus = true;
			self.$form.find('[data-validate]').each(function(){
				if(!self.validateInput(this))
					self.validationStatus = false;
			});
		}

		, destroy : function () {
			var self = this;
			self.$form.find('[data-validate]').each(function(){
				self.cleanInput($(this));
			});
			self.$form.off('.' + this.type).removeData(this.type);
		}
		
		, cleanInput : function ($inputElement) {
			$inputElement.parents('.form-group').removeClass('has-error');
			$inputElement.tooltip('destroy');
		}
		
		, print : function () {
			console.log('--print test--');
		}
		
		, timer : 0

		, delay : function (callback, ms) {
            clearTimeout(this.timer);
            this.timer = setTimeout(callback, ms);
		}
	};

	/* VALIDATOR PLUGIN DEFINITION
	 * ========================= */
	$.fn.validator = function (option, first_param, second_param) {
		return this.each(function () {
			var $this = $(this) 
			, data = $this.data('validator')
			, options = typeof option == 'object' && option
			, action = typeof option == 'string' ? option : 'validateForm';
			
			if (!data) $this.data('validator', ( data = new Validator(this, options)));
			else if (action) data[action](first_param, second_param);
		})
	};

	$.fn.validator.Constructor = Validator;
	
	$.fn.validator.defaults = {
		animation: true
  		, placement: $(window).width()<768 ? 'top' : 'right'
  		, lang: (document.documentElement.lang) ? document.documentElement.lang : navigator.language
  		, errorMessageClass: ''
  	};

	$(function() {
		
		var $forms = $('form[data-validate]');
		if(!$forms){
			console.log('there is no form to validate');
			return false
		}
		
		$forms.each(function (i) {
			var $this = $(this)
			, options = $this.data();

			if(!options['validate'])
                return false;
			
			if($this.prop('id'))
				console.log('form to validate : '+$this.prop('id'));
			
			$this.validator(options);
			
			// if the form doesn't have a submit button
			$this.find('input').on('keypress', function(e){
	            // if : enter pressed
	            if(e.which == 10 || e.which == 13) {
    	            $this.submit();
        	    }
			});
			
			// if the live option is enabled, activate validation on key up
			if($this.data('validate')=='live') {
				$this.find('input[data-validate]').each(function () {
					$(this).on('keyup.validator.data-api', function(event) {
					    // if : event not the tab key
					    if(event.keyCode != 9)
					    {
    						var that = this; // keep context
                            var callback = function(){ return $this.validator('validateInput', that); };
                            $this.validator('delay', callback, 300);
					    }
					});
					$(this).on('blur.validator.data-api', function() {
                        $this.validator('validateInput',this)
                    });
				});
			}
			
			$this.on('submit.validator.data-api', function(e) {
                $this.validator('validateForm');
                // console.log('--submit--')
                if($this.data('validator').validationStatus==false)
                    e.preventDefault();
            });
            
            // if form already have error(s) on load, display those errors 
            // if($this.find('.has-error').length)
            // {
                // var callback = function(){ $this.validator('validateForm'); };
                // $this.validator('delay', callback, 300);
            // }
		});
		
	});
}(window.jQuery);
