
// we don't want javascript error if legacy browser don't support console.log()
if ( ! window.console ) {
    (function() {
      var names = ["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"],i, l = names.length;
      window.console = {};
      for ( i = 0; i < l; i++ ) { window.console[ names[i] ] = function() {}; }
    }());
}

! function($) {
	
	'use strict';

	/* VALIDATOR PUBLIC CLASS DEFINITION
	 * =============================== */

	var Validator = function (form, options) {
		this.init('validator', form, options);
	};

	Validator.prototype = {
		
		constructor : Validator

		/**
		 *
		 * @param type
		 * @param form
         * @param options
         */
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
				alpha:/^[a-z]+$/i,
				alphanumeric:/^[a-z0-9]+$/i,
				creditcard:/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})$/,
				email:/^[a-z0-9+._%-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
				integer:/^\d+$/,
				number:/^\d+(\.\d+)?$/,
				postalcode_us:/^[0-9]{5}(?:-[0-9]{4})?$/,
				postalcode_ca:/^[ABCEGHJKLMNPRSTVXY][0-9][A-Z][\s\-]?[0-9][A-Z][0-9]$/i,
				postalcode_uk:/(((^[BEGLMNS][1-9]\d?)|(^W[2-9])|(^(A[BL]|B[ABDHLNRST]|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]|F[KY]|G[LUY]|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]|M[EKL]|N[EGNPRW]|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKL-PRSTWY]|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)\d\d?)|(^W1[A-HJKSTUW0-9])|(((^WC[1-2])|(^EC[1-4])|(^SW1))[ABEHMNPRVWXY]))(\s*)?([0-9][ABD-HJLNP-UW-Z]{2}))$|(^GIR\s?0AA$)/,
				postalcode_br:/^\d{5}\-\d{3}$/,
				tel:/^[0-9\-\s\.]+$/,
				tel_us:/^(([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+$/,
				url: /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
			};
			this.lang = {
				test:'TEST'
			};
			
			this.loadLanguage(this.options.lang);
		}

		/**
		 * Add a regex to the default list of regex
		 * @param regexName
		 * @param regexPattern
         */
		, addRegex : function (regexName, regexPattern) {
			this.regex[regexName] = regexPattern;
		}

		/**
		 *
		 * @param lang
         */
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

		/**
		 *
		 * @param index
		 * @param opt
		 * @returns {string|XML|void}
         */
		, getString : function (index, opt) {
			if(typeof this.lang[index] != 'undefined')
				return this.lang[index].replace('%s', opt);
			else
				console.log(index);
		}

		/**
		 * get the current directory where the javascript is executed from
		 * @param arrFilename
         * @returns {*}
         */
		, getCurrentDirectory : function(arrFilename) {
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

		/**
		 *
		 * @param options
         */
		, getOptions : function (options) {
			return $.extend({}, $.fn[this.type].defaults, options, this.$form.data());
		}

		/**
		 *
		 * @param $inputElement
		 * @param ruleName
		 * @param ruleParam
         * @returns {*}
         */
		, validate : function ($inputElement, ruleName, ruleParam) {

			var value = $inputElement.val();

            if(ruleName == 'required') {
				if($inputElement.is('input[type="checkbox"]'))
					return $inputElement[0].checked;
				else
               		return (value.length > 0);
			}
           
            if(ruleName == 'minlength')
                return (value.length >= ruleParam);
            
            if(ruleName == 'maxlength')
                return (value.length <= ruleParam);

			if(ruleName == 'matches')
				return (value == this.$form.find('#'+ruleParam).val());

			if(ruleName == 'maxsize') {
				//check whether browser fully supports all File API
				if (window.File && window.FileReader && window.FileList && window.Blob && $inputElement[0].files[0]) {
					return ($inputElement[0].files[0].size < this.getSizeInBytes(ruleParam));
				}
			}

            if(value.length > 0 && this.regex[ruleName])
                return this.regex[ruleName].test(value);
            
            return true;
		}

		/**
		 * get the size in bytes from a string (ex: 2M => 2097152)
		 * @param value
		 * @returns {number}
         */
		, getSizeInBytes: function(value) {
			var factor = 0;
			var unit = value.substr(-1, 1);
			if(unit == 'M')
				factor = 2;
			else if(unit == 'K')
				factor = 1;

			return Math.floor(parseFloat(value) * Math.pow(1024, factor));
		}

		/**
		 *
		 * @param errorArray
		 * @returns {string}
         */
		, formatErrors : function (errorArray) {
			var error = '';
			for(var i in errorArray)
  				error+="<div class='"+this.options.errorMessageClass+"'>"+errorArray[i]+"</div>";

  			return error;
		}

		/**
		 *
		 * @param $inputElement
		 * @returns {boolean}
         */
		, validateInput : function($inputElement) {

		    // if : element is disabled, don't do validation
            if($inputElement.is(':disabled'))
                return true;

			//console.log($inputElement.data('bs.fv.status'))
            
			var rules = $inputElement.data('validate').split(',');
			var error = '';
			var errorArray = [];
			for(var i in rules) {
			    if(rules[i].length) {
    			    var ruleParams = rules[i].split(/[=:]/);
    			    var ruleName = ruleParams[0];
    			    var ruleParam = (ruleParams[1]) ? ruleParams[1] : null;

    			    if(!this.validate($inputElement, ruleName, ruleParam)) {
						if(ruleName == 'matches')
							ruleParam = (ruleParams[1]) ? $inputElement.parents('form').find('#'+ruleParam).parents('.form-group, .checkbox, .radio').find('label').html() : null;

						errorArray.push(this.getString(ruleName, ruleParam));
					}
                }
			}

			if(errorArray.length > 0) {
				$inputElement.data('bs.fv.status', 'error');

				var tooltipObject = $inputElement.data('bs.tooltip') || false;
				if(!tooltipObject) {
					$inputElement.tooltip({
						html:true,
						placement: $inputElement.data('placement') ? $inputElement.data('placement') : this.options.placement,
						container:$inputElement.data('container') ? $inputElement.data('container') : this.options.container,
						title:this.formatErrors(errorArray),
						trigger:'manual'
					});
					$inputElement.tooltip('show');
				}
				else {
					var tooltipTitle = tooltipObject.getTitle();
					var errorTitle = this.formatErrors(errorArray);
					if(tooltipTitle != errorTitle) {
						tooltipObject.$tip.find('.tooltip-inner').html(errorTitle)
					}
				}
				$inputElement.parents('.form-group, .checkbox, .radio').addClass('has-error');
				return false;
			}
			else {
				$inputElement.data('bs.fv.status', 'ok');
				this.cleanInput($inputElement);
				return true;
			}
		}

		/**
		 *
		 */
		, validateForm : function () {
			var self = this;
			self.validationStatus = true;
			self.$form.find('[data-validate]').each(function(){
				if(!self.validateInput($(this)))
					self.validationStatus = false;
			});
		}

		/**
		 *
		 */
		, destroy : function () {
			var self = this;
			self.$form.find('[data-validate]').each(function(){
				self.cleanInput($(this));
			});
			self.$form.off('.' + this.type).removeData(this.type);
		}

		/**
		 *
		 * @param $inputElement
         */
		, cleanInput : function ($inputElement) {
			$inputElement.parents('.form-group, .checkbox, .radio').removeClass('has-error');
			$inputElement.tooltip('destroy');
		}
		
		, print : function () {
			console.log('--print test--');
		}
		
		, timer : 0

		/**
		 *
		 * @param callback
         * @param ms
         */
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
		, container: 'body'
		, errorMessageClass: ''
		, lang: (document.documentElement.lang) ? document.documentElement.lang : navigator.language
  		, placement: $(window).width()<768 ? 'top' : 'right'
  	};

	$(function() {
		
		var $forms = $('form[data-validate]');
		if(!$forms){
			console.log('there is no form to validate');
			return false
		}
		
		$forms.each(function (i) {
			var $form = $(this)
			, options = $form.data();

			if(!options['validate'])
                return false;
			
			if($form.prop('id'))
				console.log('form to validate : '+$form.prop('id'));
			
			$form.validator(options);
			
			// if the form doesn't have a submit button
			$form.find('input').on('keypress', function(e){
	            // if : enter pressed
	            if(e.which == 10 || e.which == 13) {
    	            $form.submit();
        	    }
			});

			$form.find('[type="submit"]').on('click', function(e){
				$form.submit();
			});
			
			// if the live option is enabled, activate validation on key up
			if($form.data('validate')=='live') {
				$form.find('input[data-validate]').each(function () {
					var $input = $(this);
					if($input.is('input[type=file]')) {
						$input.on('change.validator.data-api', function(event) {
							$form.validator('validateInput', $input);
						});
					}
					else if($input.is('input[type=checkbox]')) {
						$input.on('change.validator.data-api', function(event) {
							$form.validator('validateInput', $input);
						});
					}
					else {
						$input.on('keyup.validator.data-api', function (event) {
							// if : event not the tab key
							if (event.keyCode != 9) {
								//var that = this; // keep context
								var callback = function () {
									return $form.validator('validateInput', $input);
								};
								$form.validator('delay', callback, 300);
							}
						});
						$input.on('blur.validator.data-api', function () {
							$form.validator('validateInput', $input)
						});
					}
				});
			}
			
			$form.on('submit.validator.data-api', function(e) {
                $form.validator('validateForm');
                 //console.log('--submit--')
                if($form.data('validator').validationStatus==false)
                    e.preventDefault();
            });
		});
		
	});
}(window.jQuery);
