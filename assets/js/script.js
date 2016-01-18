$(function () {

	// Globals variables

	// 	An array containing all our hints
	var hints = [];

	// These are called on page load
	$('.AnimalList').change( function() {
		populateLevelsDropdown( $(this).val() );
		setHintLevel(0);
		renderHints();
	});

	$('.LevelList').change( function() {
		setHintLevel(0);
		renderHints();
	});

	$('.WholeWordCheckbox').click( function() {
		setHintLevel(0);
		renderHints();
	});

	$('.HintLevel').keypress(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault(); // prevent form submit
		}
		renderHints();
	});

	// Get data about our products from products.json.
	$.getJSON( "hints.json", function( data ) {

		// Write the data into our global variable.
		hints = data;

		populateAnimalsDropdown(hints);

		renderHints();

		$('.all-hints').addClass('visible');
	});

	// This function is called only once - on page load to populate the animals dropdown list
	function populateAnimalsDropdown(data){

		var _select = $('<select>');
		var _first = true;
		var _selectedAnimal;

		$.each(data.english, function(val, levels) {
			var optionNode;
			if (_first) {
				optionNode = $('<option selected="selected"></option>')
				_selectedAnimal = val;
				_first = false;
			} else {
				optionNode = $('<option></option>')
			}
			_select.append(
				optionNode.val(val).html(val)
			);
		});
		$('.AnimalList')
			.find('option')
			.remove()
			.end()
			.append(_select.html());

		populateLevelsDropdown(_selectedAnimal);
	}

	// This function is called to populate the levels dropdown list based on
	// currently selected animal
	function populateLevelsDropdown(selected){

		var _select = $('<select>');
		var _first = true;

		$.each( hints.english[selected], function(val, words) {
			var optionNode;
			if (_first) {
				optionNode = $('<option selected="selected"></option>')
				_first = false;
			} else {
				optionNode = $('<option></option>')
			}
			_select.append(
				optionNode.val(val).html(val)
			);
		});

		$('.LevelList')
			.find('option')
			.remove()
			.end()
			.append(_select.html());
	}

	function setHintLevel(level) {
		$('.HintLevel').val(level);
	}

	function renderHints() {
		// get the animal/level/hint level
		var animal = $('.AnimalList').val();
		var level = $('.LevelList').val();
		var wordFirst = $('.WholeWordCheckbox').prop('checked');
		var hintLevel = $('.HintLevel').val();

		var words = hints.english[animal][level];

		// build hints based on hint level. each level
		// reveals one more letter of a word
		var wordHints = [];
		$.each( words, function(index, word) {
			wordHints.push(word.replace(/./g, '_'));
		});

		var wordIdx = 0; // which word
		var charIdx = 0; // which char in a word

		if (wordFirst) {
			// if we're not revealing a word at a time, then advanced to the
			// next word to reveal a letter in each word at a time
			while (hintLevel > 0) {

				var newHint;
				if (charIdx == 0) {
					newHint = words[wordIdx].charAt(0) + wordHints[wordIdx].substr(1);
				} else {
					newHint = words[wordIdx].substr(0, charIdx+1) + wordHints[wordIdx].substr(charIdx+1);
				}
				wordHints[wordIdx] = newHint;

				charIdx++;
				if (charIdx >= words[wordIdx].length) {
					// reached the end of a word
					wordIdx++;
					charIdx = 0;
				}
				--hintLevel;

				if (wordIdx >= words.length) {
					break;
				}
			}
		}
		else {
			while (hintLevel > 0) {
				if ((wordIdx + 1) > words.length) {
					wordIdx = 0;
					charIdx++;
				}

				var newHint;
				if (charIdx == 0) {
					newHint = words[wordIdx].charAt(0) + wordHints[wordIdx].substr(1);
				} else {
					newHint = words[wordIdx].substr(0, charIdx+1) + wordHints[wordIdx].substr(charIdx+1);
				}
				wordHints[wordIdx] = newHint;

				wordIdx++;
				--hintLevel;
			}
		}

		$('.hints-span').html(wordHints.join(' '));
	}

	// Shows the error page.
	function renderErrorPage(){
		var page = $('.error');
		page.addClass('visible');
	}

});
