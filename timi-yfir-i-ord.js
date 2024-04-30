/*
	Usage: 
	------
	HTML head: <script language="javascript" type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
			   <script language="javascript" type="text/javascript" src="timeToWords.js"></script>
	           <script>
					$('#clock-to-words').text('Klukkan er tólf mínútur í ellefu');
			   </script>
	HTML body: <input class="customButton icon talk" type="button" value="" onclick="playitAll()" />
			   <p id="clock-to-words"></p>
*/
const map = new Map();
map.set('eina', 'eina');
map.set('eitt', 'eitt');
map.set('ellefu', 'ellefu');
map.set('fimm', 'fimm');
map.set('fimmtán', 'fimmtan');
map.set('fimmtíu', 'fimmtiu');
map.set('fjórar', 'fjorar');
map.set('fjórtán', 'fjortan');
map.set('fjögur', 'fjogur');
map.set('fjörtíu', 'fjortiu');
map.set('hálf', 'half');
map.set('klukkan er', 'klukkan_er');
map.set('korter', 'korter');
map.set('mínútu', 'minutu');
map.set('mínútur', 'minutur');
map.set('nítján', 'nitjan');
map.set('níu', 'niu');
map.set('og', 'og');
map.set('sautján', 'sautjan');
map.set('sex', 'sex');
map.set('sextán', 'sextan');
map.set('sjö', 'sjo');
map.set('tuttugu', 'tuttugu');
map.set('tvær', 'tvaer');
map.set('tvö', 'tvo');
map.set('tíu', 'tiu');
map.set('tólf', 'tolf');
map.set('yfir', 'yfir');
map.set('átján', 'atjan');
map.set('átta', 'atta');
map.set('í', 'i');
map.set('þrettán', 'threttan');
map.set('þrjár', 'thrjar');
map.set('þrjátíu', 'thrjatiu');
map.set('þrjú', 'thrju');


function timeToWords(hours, minutes, nativeLang = true) {
	if (hours === undefined || minutes === undefined) {
		throw new Error('Hours or minutes not numerical.');
	}
    
	if (nativeLang === true) {
        return timeToWordsIS(hours, minutes);
    }
    else {
        return timeToWordsEN(hours, minutes);
    }
}

function timeToVoice(hours, minutes, nativeLang = true) {
	playSentenceVocally(timeToWords(hours, minutes, nativeLang));
}

function timeToWordsEN(hours, minutes) {
    const numbersToWords = [
        'zero', 'one', 'two', 'three', 'four',
        'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
        'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
        'twenty', 'twenty one', 'twenty two', 'twenty three', 'twenty four',
        'twenty five', 'twenty six', 'twenty seven', 'twenty eight', 'twenty nine',
        'thirty', 'thirty one', 'thirty two', 'thirty three', 'thirty four',
        'thirty five', 'thirty six', 'thirty seven', 'thirty eight', 'thirty nine',
        'forty', 'forty one', 'forty two', 'forty three', 'forty four',
        'forty five', 'forty six', 'forty seven', 'forty eight', 'forty nine',
        'fifty', 'fifty one', 'fifty two', 'fifty three', 'fifty four',
        'fifty five', 'fifty six', 'fifty seven', 'fifty eight', 'fifty nine'
    ];

    let words = 'It\'s ';
    let hoursAdjusted = hours % 12;
    let hoursPlusOneAdjusted = (hours + 1) % 12;

    if (hoursAdjusted === 0) {
        hoursAdjusted = 12;
    }
    if (hoursPlusOneAdjusted === 0) {
        hoursPlusOneAdjusted = 12;
    }

    if (minutes === 0) {
        words += numbersToWords[hoursAdjusted] + ' o\'clock';
    }
    else {
        if (minutes <= 30) {
            words += numbersToWords[minutes] + ' past ' + numbersToWords[hoursAdjusted];
        } else {
            words += numbersToWords[60 - minutes] + ' to ' + numbersToWords[hoursPlusOneAdjusted];
        }
    }

    if (words.includes('fifteen')) {
        words = words.replace('fifteen', 'quarter');
    }
    else if (words.includes('thirty past')) {
        words = words.replace('thirty', 'half');
    }

    words += '.';

    return words;
}

function timeToWordsIS(hours, minutes) {
    const numbersToWords = [
        'núll', 'eitt', 'tvö', 'þrjú', 'fjögur',
        'fimm', 'sex', 'sjö', 'átta', 'níu',
        'tíu', 'ellefu', 'tólf', 'þrettán', 'fjórtán',
        'fimmtán', 'sextán', 'sautján', 'átján', 'nítján',
        'tuttugu', 'tuttugu og eina', 'tuttugu og tvær', 'tuttugu og þrjár', 'tuttugu og fjórar',
        'tuttugu og fimm', 'tuttugu og sex', 'tuttugu og sjö', 'tuttugu og átta', 'tuttugu og níu',
        'þrjátíu', 'þrjátíu og eina', 'þrjátíu og tvær', 'þrjátíu og þrjár', 'þrjátíu og fjórar',
        'þrjátíu og fimm', 'þrjátíu og sex', 'þrjátíu og sjö', 'þrjátíu og átta', 'þrjátíu og níu',
        'fjörtíu', 'fjörtíu og eina', 'fjörtíu og tvær', 'fjörtíu og þrjár', 'fjörtíu og fjórar',
        'fjörtíu og fimm', 'fjörtíu og sex', 'fjörtíu og sjö', 'fjörtíu og átta', 'fjörtíu og níu',
        'fimmtíu', 'fimmtíu og eina', 'fimmtíu og tvær', 'fimmtíu og þrjár', 'fimmtíu og fjórar',
        'fimmtíu og fimm', 'fimmtíu og sex', 'fimmtíu og sjö', 'fimmtíu og átta', 'fimmtíu og níu'
    ];

    const minutesToWords = ['núll', 'eina', 'tvær', 'þrjár', 'fjórar'];

    let words = '';
    let hoursAdjusted = hours % 12;
    let hoursPlusOneAdjusted = (hours + 1) % 12;
	
    if (hoursAdjusted === 0) {
        hoursAdjusted = 12;
    }
    if (hoursPlusOneAdjusted === 0) {
        hoursPlusOneAdjusted = 12;
    }

    if (minutes === 0) {
        words += 'Klukkan er ' + numbersToWords[hoursAdjusted];
    }
    else {
        if (minutes < 30) {
            var minutesCount = numbersToWords[minutes];
            if (minutes >= 1 && minutes <= 4) {
                minutesCount = minutesToWords[minutes];
            }
            words += 'Klukkan er ' + minutesCount + ' mínútur yfir ' + numbersToWords[hoursAdjusted];
        } 
		else {
            var from60 = 60 - minutes;

            var minutesCount = numbersToWords[from60];
            if (from60 >= 1 && from60 <= 4) {
                minutesCount = minutesToWords[from60];
            }

            words += 'Klukkan er ' + minutesCount + ' mínútur í ' + numbersToWords[hoursPlusOneAdjusted];
        }
    }

    if (words.includes('eina mínútur ')) {
        words = words.replace('eina mínútur ', 'eina mínútu ');
    }

    if (words.includes('fimmtán mínútur')) {
        words = words.replace('fimmtán mínútur', 'korter');
    }
    else if (words.includes('þrjátíu mínútur í')) {
        words = words.replace('þrjátíu mínútur í', 'hálf');
    }

	words += '.';

    return words;
}

function playSentenceVocally(sentence) {
	if (sentence && sentence.length > 0) {
		sentence = sentence.replace(/\./g, '')
		
		var words = sentence.split(' ');
		var hljodArray = [];
		var baseFolder = './resources/sound-files/';
		
		// Map necessary MP3 files to each word in the sentence.
		hljodArray.push(`${baseFolder}${map.get('klukkan er')}.mp3`);
		for (i=0; i<words.length; i++) {
			var word = words[i];
			if (word === 'Klukkan' || word === 'er') {
				continue;
			}
			var value = map.get(word);
			if (value) {
				hljodArray.push(`${baseFolder}${value}.mp3`);
			}
		}
		playMP3FilesInSequence(hljodArray);
	}
}

function playMP3FilesInSequence(audionamesarray) {
	if (audionamesarray && audionamesarray.length >= 0) {
		var audio = new Audio(audionamesarray[0]);
		audio.src = audionamesarray[0];
		audio.play();
		
		index = 1;
		audio.onended = function(){
			if (index < audionamesarray.length) {
				audio.src = audionamesarray[index];
				audio.play();
				index++;
			}
		};
	}
}