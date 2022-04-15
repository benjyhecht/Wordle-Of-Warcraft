var wordToFind = "hoover";
const rowHolderArray = new Array;
const letterHolderArray = new Array;
const wordList = new Array;
const hitBoxes = new Array;
const hitKeys = new Array;
const partialBoxes = new Array;
const partialKeys = new Array;

const colors = {colorHit:"#5A9A54", colorPartial:"#B9A448", cbHit:"#65A0E9", cbPartial:"#E5691A", miss:"#939393", keyMiss:"#505050"};
const colorStrings = new Array; 
var colorIndex = 0;
var currentColorHit;
var currentColorPartial;

var rowIndex = 0;
var letterIndex = 0;
var ended = false;

var wordLength = 5;
var maxRows = 6;

var colorBlindMode = false;

const currentWordArray = new Array;

var finalText = "";
var finalCBText = "";

window.onload = (event) => {
    colorStrings.push("#5A9A54", "#B9A448", "#65A0E9", "#E5691A", "#939393", "#505050");
    packWords();
    wordToFind = chooseWord();
    wordLength = wordToFind.length;
    maxRows = wordLength + 2;

    var lastWord = getYesterdayWord();
    document.getElementById("yesterday").innerHTML = "Yesterday's word was: " + lastWord.toUpperCase();
    //document.addEventListener('keyup', checkKey(event));
    addRow();
    updateGuesses();
};

document.onkeyup = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode + 32);
    //alert(charCode);
    if (charCode >=65 && charCode <= 90) {
        addLetter(charStr);
    } else if (charCode == 13) {
        checkWord();
    } else if (charCode == 8) {
        deleteLetter();
    }
};

function swapColorBlind(){
    if (ended) {
        return;
    }
    colorBlindMode = (!colorBlindMode);
    if (colorBlindMode) {
        colorIndex = 2;
    } else {
        colorIndex = 0;
    }
    hitBoxes.forEach(element => {
        element.style.backgroundColor = colorStrings[colorIndex];
    });
    partialBoxes.forEach(element => {
        element.style.backgroundColor = colorStrings[colorIndex + 1];        
    });
    partialKeys.forEach(element => {
        element.style.backgroundColor = colorStrings[colorIndex + 1];
    });
    hitKeys.forEach(element => {
        element.style.backgroundColor = colorStrings[colorIndex];
    });

    if (colorBlindMode) {
        document.getElementById("colorBlindButton").innerHTML = "Contrast: High"
    } else {
        document.getElementById("colorBlindButton").innerHTML = "Contrast: Normal"
    }    
}

function checkLength(elementLength) {
    return elementLength == wordLength;
}

function showMessage(messageToShow, time) {
    document.getElementById("messageBox").innerHTML = messageToShow;
    if (time > 0) {
        setTimeout(updateGuesses, time * 1000);
    }
}

function addLetter(character) {
    if (ended) {
        return;
    }
    if (letterIndex < wordLength) {
        letterHolderArray[letterIndex].innerText = character.toString().toUpperCase();
        letterHolderArray[letterIndex].style.borderColor = "grey";
        currentWordArray[letterIndex] = character;
        letterIndex++;
    }
}

function deleteLetter(){
    if (ended) {
        return;
    }
    if (letterIndex > 0) {
        letterIndex--;
        letterHolderArray[letterIndex].style.borderColor = "black";
        letterHolderArray[letterIndex].innerHTML = '';
    }
}

function makeRandomGuess(){
    if (ended) {
        return;
    }
    if (rowIndex == 0) {
        showMessage("Try making at least one guess, first.", 4);
        return;
    }
    useableWords = wordList.filter(word => word.length == wordLength);
    while (letterIndex > 0) {
        deleteLetter();
    }

    var guessIndex = Math.floor(Math.random() * useableWords.length);
    var guessedWord = useableWords[guessIndex];
    const guessedWordArray = Array.from(guessedWord);
    for (var i = 0; i < guessedWordArray.length; i++) {
        addLetter(guessedWordArray[i]);
    }

    checkWord();
    return;
}

function checkWord(){

    if (ended) {
        return;
    }
    
    if (letterIndex != wordLength) {
        return;
    }
    
    var currentWord = "";
    for (var i = 0; i < wordLength; i++) {
        currentWord += currentWordArray[i];
    }
    

    const emojiArray = new Array;
    const emojiCBArray = new Array;
    if (currentWord == wordToFind) {
        solved = true;
        for (var i = 0; i < wordLength; i++) {
            letterHolderArray[i].style.backgroundColor = colorStrings[colorIndex];
            emojiArray[i] = ("🟩");
            emojiCBArray[i] = ("🟦");
        }
        emojiArray.push("\n");
        emojiCBArray.push("\n");
        rowIndex++;
        updateGuesses();
        
        finalText += emojiArray.join('');
        finalCBText += emojiCBArray.join('');

        endGame(true);
        return;
    }

    if (!wordList.includes(currentWord)){
        document.getElementById("messageBox").style.color = "#FF8888";
        showMessage("That's not a warcraft word.", 2);
        return;
    }

    rowIndex++;
    updateGuesses();

    const wordToFindArray = Array.from(wordToFind);
    for (var i = 0; i < wordLength; i++) {
        if (currentWordArray[i] == wordToFindArray[i]){
            letterHolderArray[i].style.backgroundColor = colorStrings[colorIndex];
            changeKeyboardLetter(currentWordArray[i], colorStrings[colorIndex]);
            emojiArray[i] = ("🟩");
            emojiCBArray[i] = ("🟦");
            hitBoxes.push(letterHolderArray[i]);
            hitKeys.push(document.getElementById(currentWordArray[i]));
            wordToFindArray[i] = '-';
            currentWordArray[i] = '+';
        } else {
            letterHolderArray[i].style.backgroundColor = colors.miss;
            emojiArray[i] = ("⬛");
            emojiCBArray[i] = ("⬛");
            if (!hitKeys.includes(document.getElementById(currentWordArray[i]))) {
                if (!partialKeys.includes(document.getElementById(currentWordArray[i]))) {
                    changeKeyboardLetter(currentWordArray[i], colors.keyMiss);
                }
            }
        }
    }

    for (var i = 0; i < wordLength; i++) {
        for (var j = 0; j < wordLength; j++) {
            if (currentWordArray[i] == wordToFindArray[j]) {
                letterHolderArray[i].style.backgroundColor = colorStrings[colorIndex + 1];
                partialBoxes.push(letterHolderArray[i]);
                emojiArray[i] = ("🟨");
                emojiCBArray[i] = ("🟧");
                if (!hitKeys.includes(document.getElementById(currentWordArray[i]))) {
                    changeKeyboardLetter(currentWordArray[i], colorStrings[colorIndex + 1]);
                    partialKeys.push(document.getElementById(currentWordArray[i]));
                }
                wordToFindArray[j] = '-';
                currentWordArray[i] = '+';
            }
        } 
    }

    emojiArray.push("\n");
    emojiCBArray.push("\n");

    finalText += emojiArray.join('');
    finalCBText += emojiCBArray.join('');

    letterIndex = 0;
    if (rowIndex >= maxRows) {
        endGame(false);
        return;
    }
    
    addRow();
}

function getKeyboardColor(letter) {
    var id = letter;
    key = document.getElementById(id)
    return key.style.backgroundColor;
}

function changeKeyboardLetter(letter, color) {
    var id = letter;
    key = document.getElementById(id)
    key.style.backgroundColor = color;
}

function addRow(){
    var holder = document.getElementById("rowHolders");
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    for (var i = 0; i < wordLength; i++) {
        var box = document.createElement("button");
        box.setAttribute("class", "box");
        letterHolderArray[i] = box;
        row.append(box);
    }
    holder.append(row);
}

function updateGuesses()
{
    document.getElementById("messageBox").style.color = "white";
    document.getElementById("messageBox").innerText = "Guesses: " + rowIndex + "/" + maxRows;
}

function copyToClipboard()
{
    var copyText = finalText;
    if (colorBlindMode)
    {
        copyText = finalCBText;
    }
    copyText += "Wordle of Warcraft " + rowIndex + "/" + maxRows;

    //copyText.select();
    //copyText.setSelectionRange(0, 100); //Mobile

    navigator.clipboard.writeText(copyText);
}

function endGame(solved) {
    ended = true;
    document.getElementById("colorBlindButton").style.visibility = "hidden";
    document.getElementById("guessButton").style.visibility = "hidden";
    document.getElementById("shareButton").style.visibility = "visible";
    document.getElementById("shareButton").style.background = colorStrings[colorIndex];
    document.getElementById("shareButton").style.width = "100px";
    if (solved) {        
        document.getElementById("messageBox").style.color = colorStrings[colorIndex];
        document.getElementById("messageBox").style.fontWeight ="Bold";
        showMessage("You won!", 0);
    } else {
        showMessage("You lost! Check back tomorrow for the solution", 0);
    }
}

/*
taken from 
https://github.com/aappleby/smhasher/blob/master/src/MurmurHash3.cpp
by Austin Appleby
Adaption by JBentley on stackoverflow at
https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
*/
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

/*
taken from 
https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
full credit to Tommy Ettinger
Adaption by JBentley on stackoverflow at
https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
*/
function mulberry(a){
    return function() {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      }
}

/*
taken from 
http://pracrand.sourceforge.net/
full credit to Chris Doty-Humphrey
Adaption by JBentley on stackoverflow at
https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
*/
function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

function chooseWord() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;

    var seed = xmur3(today);
    var rand = sfc32(seed(), seed(), seed(), seed());
    var index = Math.floor(rand() * wordList.length);
    return wordList[index];
}

function getYesterdayWord() {
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    var dd = String(yesterday.getDate()).padStart(2, '0');
    var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = yesterday.getFullYear();
    yesterday = yyyy + '/' + mm + '/' + dd;

    var seed = xmur3(yesterday);
    var rand = sfc32(seed(), seed(), seed(), seed());

    var index = Math.floor(rand() * wordList.length);
    return wordList[index];
}

function packWords()
{
    wordList[0]="aqir";
wordList[1]="arms";
wordList[2]="army";
wordList[3]="aura";
wordList[4]="auro";
wordList[5]="back";
wordList[6]="bank";
wordList[7]="bear";
wordList[8]="belt";
wordList[9]="beta";
wordList[10]="bind";
wordList[11]="bite";
wordList[12]="boar";
wordList[13]="bolt";
wordList[14]="bomb";
wordList[15]="bond";
wordList[16]="bone";
wordList[17]="boss";
wordList[18]="brew";
wordList[19]="buff";
wordList[20]="burn";
wordList[21]="buru";
wordList[22]="butt";
wordList[23]="cake";
wordList[24]="cape";
wordList[25]="carp";
wordList[26]="clam";
wordList[27]="claw";
wordList[28]="coal";
wordList[29]="cold";
wordList[30]="cook";
wordList[31]="crow";
wordList[32]="dark";
wordList[33]="dash";
wordList[34]="dawn";
wordList[35]="daze";
wordList[36]="dead";
wordList[37]="ding";
wordList[38]="dire";
wordList[39]="doom";
wordList[40]="duel";
wordList[41]="dust";
wordList[42]="ebon";
wordList[43]="echo";
wordList[44]="epic";
wordList[45]="fade";
wordList[46]="fall";
wordList[47]="farm";
wordList[48]="fate";
wordList[49]="fear";
wordList[50]="feet";
wordList[51]="fine";
wordList[52]="fire";
wordList[53]="fish";
wordList[54]="fist";
wordList[55]="flay";
wordList[56]="flee";
wordList[57]="flow";
wordList[58]="form";
wordList[59]="frog";
wordList[60]="garr";
wordList[61]="gaze";
wordList[62]="genn";
wordList[63]="gift";
wordList[64]="goat";
wordList[65]="gold";
wordList[66]="gore";
wordList[67]="grip";
wordList[68]="halo";
wordList[69]="hand";
wordList[70]="hard";
wordList[71]="hawk";
wordList[72]="head";
wordList[73]="heal";
wordList[74]="helm";
wordList[75]="herb";
wordList[76]="hero";
wordList[77]="hide";
wordList[78]="holy";
wordList[79]="hook";
wordList[80]="hope";
wordList[81]="howl";
wordList[82]="huln";
wordList[83]="hymn";
wordList[84]="idol";
wordList[85]="iron";
wordList[86]="item";
wordList[87]="jade";
wordList[88]="kick";
wordList[89]="kill";
wordList[90]="king";
wordList[91]="kite";
wordList[92]="kodo";
wordList[93]="lair";
wordList[94]="lash";
wordList[95]="lava";
wordList[96]="leaf";
wordList[97]="leap";
wordList[98]="legs";
wordList[99]="lich";
wordList[100]="life";
wordList[101]="lily";
wordList[102]="link";
wordList[103]="lion";
wordList[104]="lock";
wordList[105]="loot";
wordList[106]="lord";
wordList[107]="lore";
wordList[108]="lynx";
wordList[109]="mace";
wordList[110]="mage";
wordList[111]="magi";
wordList[112]="mail";
wordList[113]="maim";
wordList[114]="mana";
wordList[115]="mark";
wordList[116]="maul";
wordList[117]="maut";
wordList[118]="mead";
wordList[119]="meat";
wordList[120]="mend";
wordList[121]="milk";
wordList[122]="mind";
wordList[123]="mine";
wordList[124]="mist";
wordList[125]="moam";
wordList[126]="mogu";
wordList[127]="mojo";
wordList[128]="monk";
wordList[129]="moon";
wordList[130]="moth";
wordList[131]="naga";
wordList[132]="need";
wordList[133]="noth";
wordList[134]="nova";
wordList[135]="odyn";
wordList[136]="ogre";
wordList[137]="ooze";
wordList[138]="orca";
wordList[139]="pack";
wordList[140]="pact";
wordList[141]="pain";
wordList[142]="peon";
wordList[143]="pepe";
wordList[144]="play";
wordList[145]="pure";
wordList[146]="rage";
wordList[147]="raid";
wordList[148]="rain";
wordList[149]="rake";
wordList[150]="rare";
wordList[151]="rend";
wordList[152]="rest";
wordList[153]="rime";
wordList[154]="ring";
wordList[155]="roar";
wordList[156]="robe";
wordList[157]="role";
wordList[158]="roll";
wordList[159]="root";
wordList[160]="rose";
wordList[161]="ruby";
wordList[162]="rune";
wordList[163]="rush";
wordList[164]="sand";
wordList[165]="scar";
wordList[166]="seal";
wordList[167]="seam";
wordList[168]="sear";
wordList[169]="seed";
wordList[170]="shaw";
wordList[171]="shiv";
wordList[172]="shot";
wordList[173]="skin";
wordList[174]="slag";
wordList[175]="slam";
wordList[176]="slow";
wordList[177]="slug";
wordList[178]="snow";
wordList[179]="soul";
wordList[180]="soup";
wordList[181]="spec";
wordList[182]="stab";
wordList[183]="star";
wordList[184]="stew";
wordList[185]="stun";
wordList[186]="tame";
wordList[187]="tank";
wordList[188]="tear";
wordList[189]="tide";
wordList[190]="tier";
wordList[191]="time";
wordList[192]="toad";
wordList[193]="toss";
wordList[194]="trap";
wordList[195]="vale";
wordList[196]="veil";
wordList[197]="vile";
wordList[198]="void";
wordList[199]="walk";
wordList[200]="wand";
wordList[201]="warm";
wordList[202]="wasp";
wordList[203]="wave";
wordList[204]="weak";
wordList[205]="wear";
wordList[206]="wild";
wordList[207]="will";
wordList[208]="wind";
wordList[209]="wisp";
wordList[210]="wolf";
wordList[211]="wood";
wordList[212]="worm";
wordList[213]="wrap";
wordList[214]="wyrm";
wordList[215]="xuen";
wordList[216]="yauj";
wordList[217]="yrel";
wordList[218]="zeal";
wordList[219]="zone";
wordList[220]="acorn";
wordList[221]="adder";
wordList[222]="addon";
wordList[223]="agent";
wordList[224]="aggro";
wordList[225]="agony";
wordList[226]="akama";
wordList[227]="aldor";
wordList[228]="alpha";
wordList[229]="amani";
wordList[230]="amber";
wordList[231]="angel";
wordList[232]="anima";
wordList[233]="apple";
wordList[234]="arena";
wordList[235]="argus";
wordList[236]="armor";
wordList[237]="ashen";
wordList[238]="baine";
wordList[239]="baron";
wordList[240]="blade";
wordList[241]="blast";
wordList[242]="blaze";
wordList[243]="bless";
wordList[244]="block";
wordList[245]="blind";
wordList[246]="blink";
wordList[247]="blood";
wordList[248]="brann";
wordList[249]="brave";
wordList[250]="brawl";
wordList[251]="bread";
wordList[252]="brill";
wordList[253]="brute";
wordList[254]="burst";
wordList[255]="cabal";
wordList[256]="calia";
wordList[257]="camel";
wordList[258]="candy";
wordList[259]="carve";
wordList[260]="chain";
wordList[261]="chaos";
wordList[262]="cheat";
wordList[263]="chess";
wordList[264]="chest";
wordList[265]="chill";
wordList[266]="clash";
wordList[267]="class";
wordList[268]="cloak";
wordList[269]="cloth";
wordList[270]="cloud";
wordList[271]="cobra";
wordList[272]="combo";
wordList[273]="comet";
wordList[274]="coral";
wordList[275]="corgi";
wordList[276]="cower";
wordList[277]="crane";
wordList[278]="crash";
wordList[279]="crawg";
wordList[280]="cream";
wordList[281]="crude";
wordList[282]="crypt";
wordList[283]="curse";
wordList[284]="dance";
wordList[285]="death";
wordList[286]="decay";
wordList[287]="demon";
wordList[288]="dense";
wordList[289]="detox";
wordList[290]="djinn";
wordList[291]="dodge";
wordList[292]="drain";
wordList[293]="draka";
wordList[294]="drake";
wordList[295]="dress";
wordList[296]="drink";
wordList[297]="druid";
wordList[298]="drust";
wordList[299]="dryad";
wordList[300]="dwarf";
wordList[301]="eagle";
wordList[302]="earth";
wordList[303]="elder";
wordList[304]="elekk";
wordList[305]="elune";
wordList[306]="emote";
wordList[307]="eonar";
wordList[308]="ettin";
wordList[309]="event";
wordList[310]="faith";
wordList[311]="feast";
wordList[312]="feint";
wordList[313]="feral";
wordList[314]="fetch";
wordList[315]="fiend";
wordList[316]="fiery";
wordList[317]="flame";
wordList[318]="flank";
wordList[319]="flare";
wordList[320]="flash";
wordList[321]="flask";
wordList[322]="flesh";
wordList[323]="focus";
wordList[324]="forge";
wordList[325]="fresh";
wordList[326]="freya";
wordList[327]="frost";
wordList[328]="fruit";
wordList[329]="fungi";
wordList[330]="geist";
wordList[331]="geode";
wordList[332]="ghost";
wordList[333]="ghoul";
wordList[334]="giant";
wordList[335]="glide";
wordList[336]="gluth";
wordList[337]="glyph";
wordList[338]="gnome";
wordList[339]="golem";
wordList[340]="goren";
wordList[341]="gouge";
wordList[342]="grace";
wordList[343]="grave";
wordList[344]="greed";
wordList[345]="grell";
wordList[346]="grong";
wordList[347]="gronn";
wordList[348]="group";
wordList[349]="growl";
wordList[350]="grunt";
wordList[351]="gruul";
wordList[352]="guard";
wordList[353]="guarm";
wordList[354]="guild";
wordList[355]="hands";
wordList[356]="harpy";
wordList[357]="haste";
wordList[358]="haunt";
wordList[359]="havoc";
wordList[360]="heart";
wordList[361]="heavy";
wordList[362]="hemet";
wordList[363]="helya";
wordList[364]="hodir";
wordList[365]="honey";
wordList[366]="honor";
wordList[367]="horde";
wordList[368]="horse";
wordList[369]="hound";
wordList[370]="hozen";
wordList[371]="human";
wordList[372]="hyjal";
wordList[373]="hydra";
wordList[374]="jaina";
wordList[375]="jerky";
wordList[376]="jinyu";
wordList[377]="joust";
wordList[378]="kabob";
wordList[379]="kalec";
wordList[380]="karma";
wordList[381]="kezan";
wordList[382]="knife";
wordList[383]="lance";
wordList[384]="leech";
wordList[385]="level";
wordList[386]="light";
wordList[387]="llama";
wordList[388]="llane";
wordList[389]="loken";
wordList[390]="lotus";
wordList[391]="lunge";
wordList[392]="magic";
wordList[393]="magma";
wordList[394]="magni";
wordList[395]="maiev";
wordList[396]="melee";
wordList[397]="might";
wordList[398]="moira";
wordList[399]="money";
wordList[400]="moose";
wordList[401]="mount";
wordList[402]="naaru";
wordList[403]="nalak";
wordList[404]="nexus";
wordList[405]="night";
wordList[406]="noble";
wordList[407]="ogron";
wordList[408]="order";
wordList[409]="otter";
wordList[410]="pagle";
wordList[411]="panda";
wordList[412]="parry";
wordList[413]="party";
wordList[414]="patch";
wordList[415]="peach";
wordList[416]="pearl";
wordList[417]="phase";
wordList[418]="plane";
wordList[419]="plate";
wordList[420]="power";
wordList[421]="prowl";
wordList[422]="purge";
wordList[423]="pygmy";
wordList[424]="power";
wordList[425]="quail";
wordList[426]="queen";
wordList[427]="quest";
wordList[428]="quick";
wordList[429]="quill";
wordList[430]="raven";
wordList[431]="relic";
wordList[432]="renew";
wordList[433]="rhino";
wordList[434]="rodeo";
wordList[435]="rogue";
wordList[436]="rough";
wordList[437]="rylak";
wordList[438]="satyr";
wordList[439]="scale";
wordList[440]="scent";
wordList[441]="scout";
wordList[442]="sewer";
wordList[443]="shade";
wordList[444]="shale";
wordList[445]="shard";
wordList[446]="shark";
wordList[447]="sheep";
wordList[448]="shell";
wordList[449]="shift";
wordList[450]="shirt";
wordList[451]="shock";
wordList[452]="shoot";
wordList[453]="shout";
wordList[454]="sigil";
wordList[455]="silly";
wordList[456]="singe";
wordList[457]="siren";
wordList[458]="skill";
wordList[459]="skull";
wordList[460]="skunk";
wordList[461]="slice";
wordList[462]="slime";
wordList[463]="smack";
wordList[464]="smash";
wordList[465]="smite";
wordList[466]="smoke";
wordList[467]="snake";
wordList[468]="snare";
wordList[469]="sneak";
wordList[470]="solar";
wordList[471]="sonic";
wordList[472]="spark";
wordList[473]="spawm";
wordList[474]="spear";
wordList[475]="speed";
wordList[476]="spell";
wordList[477]="spice";
wordList[478]="spike";
wordList[479]="spore";
wordList[480]="squid";
wordList[481]="staff";
wordList[482]="steak";
wordList[483]="steal";
wordList[484]="steed";
wordList[485]="sting";
wordList[486]="stomp";
wordList[487]="stone";
wordList[488]="storm";
wordList[489]="stuck";
wordList[490]="surge";
wordList[491]="swift";
wordList[492]="swipe";
wordList[493]="sword";
wordList[494]="taloc";
wordList[495]="taunt";
wordList[496]="throw";
wordList[497]="tiger";
wordList[498]="titan";
wordList[499]="thief";
wordList[500]="token";
wordList[501]="topaz";
wordList[502]="totem";
wordList[503]="touch";
wordList[504]="toxic";
wordList[505]="toxin";
wordList[506]="track";
wordList[507]="trail";
wordList[508]="train";
wordList[509]="trash";
wordList[510]="trick";
wordList[511]="trogg";
wordList[512]="troll";
wordList[513]="trout";
wordList[514]="tuber";
wordList[515]="twist";
wordList[516]="uldir";
wordList[517]="uldum";
wordList[518]="ursoc";
wordList[519]="uther";
wordList[520]="valor";
wordList[521]="vashj";
wordList[522]="vault";
wordList[523]="velen";
wordList[524]="venom";
wordList[525]="vigil";
wordList[526]="vigor";
wordList[527]="viper";
wordList[528]="voice";
wordList[529]="waist";
wordList[530]="water";
wordList[531]="witch";
wordList[532]="wound";
wordList[533]="wrath";
wordList[534]="wrist";
wordList[535]="wrynn";
wordList[536]="xaxas";
wordList[537]="ysera";
wordList[538]="acuity";
wordList[539]="alpaca";
wordList[540]="ambush";
wordList[541]="animal";
wordList[542]="anduin";
wordList[543]="apexis";
wordList[544]="arathi";
wordList[545]="arator";
wordList[546]="arcane";
wordList[547]="arcway";
wordList[548]="argent";
wordList[549]="arlokk";
wordList[550]="arthas";
wordList[551]="ashran";
wordList[552]="aspect";
wordList[553]="astral";
wordList[554]="attack";
wordList[555]="avatar";
wordList[556]="azsuna";
wordList[557]="banish";
wordList[558]="banner";
wordList[559]="barrel";
wordList[560]="battle";
wordList[561]="beacon";
wordList[562]="beaver";
wordList[563]="bisque";
wordList[564]="bolvar";
wordList[565]="botani";
wordList[566]="bracer";
wordList[567]="breath";
wordList[568]="breeze";
wordList[569]="bright";
wordList[570]="broken";
wordList[571]="bronze";
wordList[572]="cairne";
wordList[573]="carrot";
wordList[574]="caster";
wordList[575]="casual";
wordList[576]="charge";
wordList[577]="cheese";
wordList[578]="cherry";
wordList[579]="church";
wordList[580]="cinder";
wordList[581]="cleave";
wordList[582]="clench";
wordList[583]="cleric";
wordList[584]="coarse";
wordList[585]="cobalt";
wordList[586]="common";
wordList[587]="condor";
wordList[588]="cookie";
wordList[589]="copper";
wordList[590]="coyote";
wordList[591]="cudgel";
wordList[592]="cypher";
wordList[593]="daelin";
wordList[594]="dagger";
wordList[595]="damage";
wordList[596]="dampen";
wordList[597]="debuff";
wordList[598]="defile";
wordList[599]="disarm";
wordList[600]="dispel";
wordList[601]="divine";
wordList[602]="dragon";
wordList[603]="dynamo";
wordList[604]="effuse";
wordList[605]="elegon";
wordList[606]="elixir";
wordList[607]="empire";
wordList[608]="energy";
wordList[609]="enrage";
wordList[610]="eredar";
wordList[611]="escape";
wordList[612]="exarch";
wordList[613]="exodar";
wordList[614]="exotic";
wordList[615]="expert";
wordList[616]="faerie";
wordList[617]="falcon";
wordList[618]="farmer";
wordList[619]="felbat";
wordList[620]="ferret";
wordList[621]="fervor";
wordList[622]="feugen";
wordList[623]="flight";
wordList[624]="flurry";
wordList[625]="forest";
wordList[626]="freeze";
wordList[627]="frenzy";
wordList[628]="frozen";
wordList[629]="garona";
wordList[630]="geddon";
wordList[631]="gelbin";
wordList[632]="glaive";
wordList[633]="goblin";
wordList[634]="gorian";
wordList[635]="gorloc";
wordList[636]="goroth";
wordList[637]="gothik";
wordList[638]="ground";
wordList[639]="hakkar";
wordList[640]="hammer";
wordList[641]="health";
wordList[642]="hearth";
wordList[643]="heigen";
wordList[644]="heroic";
wordList[645]="hotfix";
wordList[646]="hunter";
wordList[647]="huojin";
wordList[648]="hybrid";
wordList[649]="icecap";
wordList[650]="ignite";
wordList[651]="insane";
wordList[652]="jailer";
wordList[653]="jasper";
wordList[654]="kairoz";
wordList[655]="kaliri";
wordList[656]="klaxxi";
wordList[657]="knight";
wordList[658]="kraken";
wordList[659]="krasus";
wordList[660]="kromog";
wordList[661]="krosus";
wordList[662]="kyrian";
wordList[663]="lasher";
wordList[664]="legion";
wordList[665]="libram";
wordList[666]="lichen";
wordList[667]="lothar";
wordList[668]="lurker";
wordList[669]="magmaw";
wordList[670]="mantid";
wordList[671]="maiden";
wordList[672]="manual";
wordList[673]="maraad";
wordList[674]="mardum";
wordList[675]="master";
wordList[676]="matron";
wordList[677]="medivh";
wordList[678]="menace";
wordList[679]="meteor";
wordList[680]="mighty";
wordList[681]="mining";
wordList[682]="minion";
wordList[683]="misery";
wordList[684]="monkey";
wordList[685]="moroes";
wordList[686]="mortal";
wordList[687]="murloc";
wordList[688]="mother";
wordList[689]="muffin";
wordList[690]="muzzle";
wordList[691]="mystic";
wordList[692]="mythic";
wordList[693]="nature";
wordList[694]="nazmir";
wordList[695]="nether";
wordList[696]="niuzao";
wordList[697]="normal";
wordList[698]="oculus";
wordList[699]="odious";
wordList[700]="onyxia";
wordList[701]="orchid";
wordList[702]="outlaw";
wordList[703]="owlcat";
wordList[704]="oxxein";
wordList[705]="parley";
wordList[706]="parrot";
wordList[707]="patron";
wordList[708]="pebble";
wordList[709]="plague";
wordList[710]="poison";
wordList[711]="portal";
wordList[712]="potion";
wordList[713]="powder";
wordList[714]="prayer";
wordList[715]="priest";
wordList[716]="primal";
wordList[717]="prince";
wordList[718]="pummel";
wordList[719]="purify";
wordList[720]="pyrite";
wordList[721]="pyrium";
wordList[722]="qiraji";
wordList[723]="quilen";
wordList[724]="rabbit";
wordList[725]="radish";
wordList[726]="rajaxx";
wordList[727]="ranged";
wordList[728]="ranger";
wordList[729]="raptor";
wordList[730]="ravage";
wordList[731]="reaver";
wordList[732]="rebuke";
wordList[733]="renown";
wordList[734]="rested";
wordList[735]="revive";
wordList[736]="rexxar";
wordList[737]="ritual";
wordList[738]="rocket";
wordList[739]="sacred";
wordList[740]="salmon";
wordList[741]="saurid";
wordList[742]="saurok";
wordList[743]="savage";
wordList[744]="scarab";
wordList[745]="school";
wordList[746]="scorch";
wordList[747]="scream";
wordList[748]="scroll";
wordList[749]="scythe";
wordList[750]="seeker";
wordList[751]="server";
wordList[752]="shadow";
wordList[753]="shadra";
wordList[754]="shaman";
wordList[755]="shaper";
wordList[756]="shield";
wordList[757]="shrine";
wordList[758]="shroud";
wordList[759]="silver";
wordList[760]="sinvyr";
wordList[761]="slayer";
wordList[762]="smooth";
wordList[763]="sniper";
wordList[764]="socket";
wordList[765]="soothe";
wordList[766]="sorrow";
wordList[767]="spider";
wordList[768]="spirit";
wordList[769]="sprint";
wordList[770]="sprite";
wordList[771]="skeram";
wordList[772]="stable";
wordList[773]="stance";
wordList[774]="static";
wordList[775]="strike";
wordList[776]="sudden";
wordList[777]="summon";
wordList[778]="sunder";
wordList[779]="switch";
wordList[780]="symbol";
wordList[781]="taelia";
wordList[782]="talbuk";
wordList[783]="talent";
wordList[784]="tanaan";
wordList[785]="taunka";
wordList[786]="tauren";
wordList[787]="tectus";
wordList[788]="temple";
wordList[789]="tendon";
wordList[790]="thekal";
wordList[791]="thorim";
wordList[792]="thorns";
wordList[793]="thrall";
wordList[794]="thrash";
wordList[795]="threat";
wordList[796]="tinder";
wordList[797]="tirion";
wordList[798]="tortos";
wordList[799]="treant";
wordList[800]="turkey";
wordList[801]="turnip";
wordList[802]="turtle";
wordList[803]="tushui";
wordList[804]="tyrant";
wordList[805]="ulduar";
wordList[806]="undead";
wordList[807]="unholy";
wordList[808]="vampyr";
wordList[809]="vanish";
wordList[810]="varian";
wordList[811]="vectis";
wordList[812]="vellum";
wordList[813]="virmen";
wordList[814]="vision";
wordList[815]="violet";
wordList[816]="vivify";
wordList[817]="volley";
wordList[818]="voodoo";
wordList[819]="vorrik";
wordList[820]="vrykul";
wordList[821]="vulpin";
wordList[822]="warden";
wordList[823]="warder";
wordList[824]="weapon";
wordList[825]="wicker";
wordList[826]="wisdom";
wordList[827]="wolvar";
wordList[828]="worgen";
wordList[829]="wraith";
wordList[830]="wyvern";
wordList[831]="xavius";
wordList[832]="zeliek";
wordList[833]="ability";
wordList[834]="abyssal";
wordList[835]="account";
wordList[836]="acherus";
wordList[837]="aethril";
wordList[838]="agility";
wordList[839]="alchemy";
wordList[840]="algalon";
wordList[841]="alleria";
wordList[842]="alterac";
wordList[843]="aluneth";
wordList[844]="amplify";
wordList[845]="ancient";
wordList[846]="anglers";
wordList[847]="anguish";
wordList[848]="antorus";
wordList[849]="arakkoa";
wordList[850]="artisan";
wordList[851]="ashvane";
wordList[852]="attumen";
wordList[853]="auction";
wordList[854]="auriaya";
wordList[855]="avenger";
wordList[856]="azeroth";
wordList[857]="azgalor";
wordList[858]="azshara";
wordList[859]="balance";
wordList[860]="baleroc";
wordList[861]="banshee";
wordList[862]="barrage";
wordList[863]="barrier";
wordList[864]="barrens";
wordList[865]="berserk";
wordList[866]="bethekk";
wordList[867]="bolster";
wordList[868]="boralus";
wordList[869]="brawler";
wordList[870]="breaker";
wordList[871]="bulwark";
wordList[872]="butcher";
wordList[873]="buzzard";
wordList[874]="cabbage";
wordList[875]="captain";
wordList[876]="carrion";
wordList[877]="censure";
wordList[878]="charged";
wordList[879]="charger";
wordList[880]="cheatah";
wordList[881]="chicken";
wordList[882]="chromie";
wordList[883]="citadel";
wordList[884]="classic";
wordList[885]="cleanse";
wordList[886]="command";
wordList[887]="conduit";
wordList[888]="control";
wordList[889]="cooking";
wordList[890]="counter";
wordList[891]="crawdad";
wordList[892]="cricket";
wordList[893]="crimson";
wordList[894]="cruelty";
wordList[895]="crusade";
wordList[896]="crystal";
wordList[897]="cupcake";
wordList[898]="curator";
wordList[899]="cyclone";
wordList[900]="dalaran";
wordList[901]="dargrul";
wordList[902]="defense";
wordList[903]="demonic";
wordList[904]="deviate";
wordList[905]="diamond";
wordList[906]="diffuse";
wordList[907]="disable";
wordList[908]="disease";
wordList[909]="disrupt";
wordList[910]="draenei";
wordList[911]="draenor";
wordList[912]="drogbar";
wordList[913]="dungeon";
wordList[914]="durotan";
wordList[915]="durotar";
wordList[916]="ebonroc";
wordList[917]="eclipse";
wordList[918]="eitrigg";
wordList[919]="element";
wordList[920]="emerald";
wordList[921]="emporer";
wordList[922]="essence";
wordList[923]="exalted";
wordList[924]="execute";
wordList[925]="fallout";
wordList[926]="farseer";
wordList[927]="fatigue";
wordList[928]="feather";
wordList[929]="felbolt";
wordList[930]="fellash";
wordList[931]="felmyst";
wordList[932]="feltail";
wordList[933]="felwart";
wordList[934]="felweed";
wordList[935]="felwood";
wordList[936]="feralas";
wordList[937]="firefly";
wordList[938]="firemaw";
wordList[939]="fishing";
wordList[940]="fissure";
wordList[941]="fortune";
wordList[942]="fritter";
wordList[943]="furbolg";
wordList[944]="garalon";
wordList[945]="garrosh";
wordList[946]="garrote";
wordList[947]="gazlowe";
wordList[948]="general";
wordList[949]="gilneas";
wordList[950]="glowing";
wordList[951]="grapple";
wordList[952]="grummle";
wordList[953]="gryphon";
wordList[954]="gundrak";
wordList[955]="harpoon";
wordList[956]="harvest";
wordList[957]="helboar";
wordList[958]="helheim";
wordList[959]="heroism";
wordList[960]="honored";
wordList[961]="huhuran";
wordList[962]="hydross";
wordList[963]="icefury";
wordList[964]="illidan";
wordList[965]="inferno";
wordList[966]="justice";
wordList[967]="karabor";
wordList[968]="kargath";
wordList[969]="khadgar";
wordList[970]="kilrogg";
wordList[971]="kormrok";
wordList[972]="krokuun";
wordList[973]="kvaldir";
wordList[974]="leather";
wordList[975]="liadrin";
wordList[976]="loatheb";
wordList[977]="lobster";
wordList[978]="lullaby";
wordList[979]="machine";
wordList[980]="madness";
wordList[981]="maexxna";
wordList[982]="magatha";
wordList[983]="malygos";
wordList[984]="mammoth";
wordList[985]="marshal";
wordList[986]="mastery";
wordList[987]="mastiff";
wordList[988]="mathias";
wordList[989]="mimiron";
wordList[990]="mithril";
wordList[991]="moonkin";
wordList[992]="morchok";
wordList[993]="mudfish";
wordList[994]="mulgore";
wordList[995]="nagrand";
wordList[996]="nathria";
wordList[997]="nazgrim";
wordList[998]="neutral";
wordList[999]="nourish";
wordList[1000]="octopus";
wordList[1001]="offhand";
wordList[1002]="ossuary";
wordList[1003]="outland";
wordList[1004]="outpost";
wordList[1005]="overrun";
wordList[1006]="paladin";
wordList[1007]="peacock";
wordList[1008]="penance";
wordList[1009]="penguin";
wordList[1010]="phoenix";
wordList[1011]="pilgrim";
wordList[1012]="pocopoc";
wordList[1013]="podling";
wordList[1014]="polearm";
wordList[1015]="prelate";
wordList[1016]="prestor";
wordList[1017]="pretzel";
wordList[1018]="private";
wordList[1019]="prophet";
wordList[1020]="provoke";
wordList[1021]="pudding";
wordList[1022]="pursuit";
wordList[1023]="raccoon";
wordList[1024]="radiant";
wordList[1025]="ragveil";
wordList[1026]="rampage";
wordList[1027]="rapture";
wordList[1028]="ratchet";
wordList[1029]="ravager";
wordList[1030]="reagent";
wordList[1031]="rebound";
wordList[1032]="redoubt";
wordList[1033]="reforge";
wordList[1034]="revenge";
wordList[1035]="revered";
wordList[1036]="reverse";
wordList[1037]="revival";
wordList[1038]="riposte";
wordList[1039]="riptide";
wordList[1040]="rotface";
wordList[1041]="rukhmar";
wordList[1042]="rupture";
wordList[1043]="saberon";
wordList[1044]="sanctum";
wordList[1045]="scorpid";
wordList[1046]="scourge";
wordList[1047]="screech";
wordList[1048]="scryers";
wordList[1049]="serpent";
wordList[1050]="sethekk";
wordList[1051]="shackle";
wordList[1052]="shannox";
wordList[1053]="shatter";
wordList[1054]="shimmer";
wordList[1055]="shuffle";
wordList[1056]="silence";
wordList[1057]="skovald";
wordList[1058]="skyfury";
wordList[1059]="smolder";
wordList[1060]="snobold";
wordList[1061]="soldier";
wordList[1062]="sparkle";
wordList[1063]="special";
wordList[1064]="spectre";
wordList[1065]="spitter";
wordList[1066]="stagger";
wordList[1067]="stalagg";
wordList[1068]="stamina";
wordList[1069]="stealth";
wordList[1070]="stonard";
wordList[1071]="strudel";
wordList[1072]="stylist";
wordList[1073]="sunfire";
wordList[1074]="sunwell";
wordList[1075]="suramar";
wordList[1076]="tactics";
wordList[1077]="talador";
wordList[1078]="talanji";
wordList[1079]="tanaris";
wordList[1080]="tandred";
wordList[1081]="templar";
wordList[1082]="thistle";
wordList[1083]="thorium";
wordList[1084]="thunder";
wordList[1085]="tillers";
wordList[1086]="torment";
wordList[1087]="torpedo";
wordList[1088]="torrent";
wordList[1089]="trample";
wordList[1090]="trinity";
wordList[1091]="trinket";
wordList[1092]="tsulong";
wordList[1093]="tuskarr";
wordList[1094]="typhoon";
wordList[1095]="tyrande";
wordList[1096]="uldaman";
wordList[1097]="unicorn";
wordList[1098]="unleash";
wordList[1099]="utgarde";
wordList[1100]="valeera";
wordList[1101]="valiona";
wordList[1102]="vanilla";
wordList[1103]="venison";
wordList[1104]="vereesa";
wordList[1105]="vexiona";
wordList[1106]="victory";
wordList[1107]="vulpera";
wordList[1108]="vulture";
wordList[1109]="warlock";
wordList[1110]="warlord";
wordList[1111]="warpath";
wordList[1112]="warrior";
wordList[1113]="warsong";
wordList[1114]="wendigo";
wordList[1115]="yaungol";

}
