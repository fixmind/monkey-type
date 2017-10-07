/* 
 * MonkeyType 1.7.0
 * Copyright 2017 Michal Barcikowski
 * Available via the MIT or new BSD @license. 
 * Project: https://github.com/bartonus/monkey-type
 */

(function(jq){

	var monkeyType = function(option){

		// monkey element verification
		this.elementId = $(this).attr('id');
		if (!this.elementId == true) {
			alert("No 'ID' attribute for monkeyType element. Define it, and try again.");
			return false;
		}

		// monkey definition
		this.monkeyTypeDefinition = [100,200,200,400,50,100,20,20,100,50,50,400];
		this.monkeyOnSpaceThinking = [300,600,1000,2000];
		
		// others
		this.delay = 0;
		this.charIndex = 0;

		// add class to object
		$(this).addClass('monkey-type');
		
		/* FUNCTIONS */
		
		this.beMoreMonkey = function(from, to){
			return Math.floor((Math.random() * to) + from);
		}

		this.typeItNow = function ()
		{
			for(var i = 0; i < this.typeThis.length; i++)
			{
				if (this.typeThis[i] != ' ')
				{
					var delayIt = this.monkeyTypeDefinition[this.beMoreMonkey(0, this.monkeyTypeDefinition.length)];
				}
				else
				{
					var delayIt = this.monkeyOnSpaceThinking[this.beMoreMonkey(0, this.monkeyOnSpaceThinking.length)];
				}

				delayIt = delayIt * this.speed;

				this.delay += delayIt;

				this.writeChar(this.typeThis[i], this.delay, ((i == (this.typeThis.length - 1)) ? true : false));
			}
		}

		this.writeChar = function(char, delay, lastChar) {
			
			// variables
			var putChar = char;
			var element = $('#' + this.elementId);
			var doItAfterFinish = this.doItAfterFinish;
		
			// add char to string
			setTimeout(function(){ element.append(putChar); }, delay);
						
			// do it on last char
			if (lastChar == true) {

				// do it after finish
				setTimeout(function(){doItAfterFinish();}, delay);

				// stop blinking
				if (this.cursorStopAfter == true)
				{
					setTimeout(function(){ element.removeClass('monkey-type-replace'); }, delay);
					setTimeout(function(){ element.removeClass('monkey-type-insert'); }, delay);
				}
			}
		}

		this.setTypeText = function(text) {
			this.typeThis = text.replace(/[^a-zA-Z0-9ęóąśłżźćń,.\(\)\[\]!@#;:'"\? -]/gi, ' ');
			$(this).html('');
		}
		
		this.isScrollEnaught = function() {

			var windowHeight = $(window).height();
			var fromTop = $(window).scrollTop();
			var elementPosition = $('#' + this.elementId).offset().top;
			
			if ((windowHeight + fromTop) >= elementPosition) return true;
			else return false;

		}
		
		this.setOption = function(option) {

			// check option object
			if (option instanceof Object) {

				// set text
				if (option.monkeyText == '' || option.monkeyText == undefined || option.monkeyText == null) this.setTypeText($(this).html());
				else this.setTypeText(option.monkeyText);
			
				// set speed
				if (option.speed == 'fast') this.speed = 0.3;
				else if (option.speed == 'medium') this.speed = 0.6;
				else if (option.speed == 'vfast') this.speed = 0.1;
				else if (option.speed == 'slow') this.speed = 1.5;
				else this.speed = 1;

				// set cursor
				if (option.cursorType == 'replace') this.cursorType = 'replace';
				else this.cursorType = 'insert';
				
				// set cursor stop blinking after
				if (option.cursorStopAfter == false) this.cursorStopAfter = false;
				else this.cursorStopAfter = true;

				// start type after scroll to it
				if (option.startAfterScroll == true) this.startAfterScroll = true;
				else this.startAfterScroll = false;

				// set action after finish
				if (option.doItAfterFinish instanceof Function) {
					this.doItAfterFinish = option.doItAfterFinish;
				} else {
					this.doItAfterFinish = function(){};
				}
			}

			// set defaults
			else {
				this.setTypeText($(this).html());
				this.speed = 1;	
				this.cursorType = 'insert';
				this.cursorStopAfter = true;
			}
			
			// set cursor
			$(this).addClass('monkey-type-' + this.cursorType);
			
		}
		
		this.setOption(option);
		
		// check doItAfterFinish
		if (this.startAfterScroll == true && this.isScrollEnaught() == false) {

			var that = this;
			var started = false;
			$(window).scroll(function(){
				
				
				if (started == false) {

					var windowHeight = $(window).height();
					var fromTop = $(window).scrollTop();
					var elementPosition = $('#'+that.elementId).offset().top;

					if (that.isScrollEnaught())
					{
						started = true;
						that.typeItNow();
					}

				}
				
			});

		}
		else {
			this.typeItNow();
		}

	}

	$.fn.monkeyType = monkeyType;

})(jQuery);