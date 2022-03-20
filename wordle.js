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
wordList[63]="goat";
wordList[64]="gold";
wordList[65]="gore";
wordList[66]="grip";
wordList[67]="halo";
wordList[68]="hand";
wordList[69]="hard";
wordList[70]="hawk";
wordList[71]="head";
wordList[72]="heal";
wordList[73]="helm";
wordList[74]="herb";
wordList[75]="hero";
wordList[76]="hide";
wordList[77]="holy";
wordList[78]="hook";
wordList[79]="hope";
wordList[80]="howl";
wordList[81]="huln";
wordList[82]="hymn";
wordList[83]="idol";
wordList[84]="iron";
wordList[85]="item";
wordList[86]="jade";
wordList[87]="kick";
wordList[88]="kill";
wordList[89]="king";
wordList[90]="kite";
wordList[91]="kodo";
wordList[92]="lair";
wordList[93]="lash";
wordList[94]="lava";
wordList[95]="leaf";
wordList[96]="leap";
wordList[97]="legs";
wordList[98]="lich";
wordList[99]="life";
wordList[100]="lily";
wordList[101]="link";
wordList[102]="lion";
wordList[103]="lock";
wordList[104]="loot";
wordList[105]="lord";
wordList[106]="lore";
wordList[107]="lynx";
wordList[108]="mace";
wordList[109]="mage";
wordList[110]="magi";
wordList[111]="mail";
wordList[112]="maim";
wordList[113]="mana";
wordList[114]="mark";
wordList[115]="maul";
wordList[116]="maut";
wordList[117]="mead";
wordList[118]="meat";
wordList[119]="mend";
wordList[120]="milk";
wordList[121]="mind";
wordList[122]="mine";
wordList[123]="mist";
wordList[124]="moam";
wordList[125]="mogu";
wordList[126]="mojo";
wordList[127]="monk";
wordList[128]="moon";
wordList[129]="moth";
wordList[130]="naga";
wordList[131]="need";
wordList[132]="noth";
wordList[133]="nova";
wordList[134]="odyn";
wordList[135]="ogre";
wordList[136]="ooze";
wordList[137]="orca";
wordList[138]="pack";
wordList[139]="pact";
wordList[140]="pain";
wordList[141]="peon";
wordList[142]="pepe";
wordList[143]="play";
wordList[144]="pure";
wordList[145]="rage";
wordList[146]="raid";
wordList[147]="rain";
wordList[148]="rake";
wordList[149]="rare";
wordList[150]="rend";
wordList[151]="rest";
wordList[152]="rime";
wordList[153]="ring";
wordList[154]="roar";
wordList[155]="robe";
wordList[156]="role";
wordList[157]="roll";
wordList[158]="root";
wordList[159]="rose";
wordList[160]="ruby";
wordList[161]="rune";
wordList[162]="rush";
wordList[163]="sand";
wordList[164]="scar";
wordList[165]="seal";
wordList[166]="seam";
wordList[167]="sear";
wordList[168]="seed";
wordList[169]="shaw";
wordList[170]="shiv";
wordList[171]="shot";
wordList[172]="skin";
wordList[173]="slag";
wordList[174]="slam";
wordList[175]="slow";
wordList[176]="slug";
wordList[177]="snow";
wordList[178]="soul";
wordList[179]="soup";
wordList[180]="spec";
wordList[181]="stab";
wordList[182]="star";
wordList[183]="stew";
wordList[184]="stun";
wordList[185]="tame";
wordList[186]="tank";
wordList[187]="tear";
wordList[188]="tide";
wordList[189]="tier";
wordList[190]="time";
wordList[191]="toad";
wordList[192]="toss";
wordList[193]="trap";
wordList[194]="vale";
wordList[195]="veil";
wordList[196]="vile";
wordList[197]="void";
wordList[198]="walk";
wordList[199]="wand";
wordList[200]="warm";
wordList[201]="wasp";
wordList[202]="wave";
wordList[203]="weak";
wordList[204]="wear";
wordList[205]="wild";
wordList[206]="will";
wordList[207]="wind";
wordList[208]="wisp";
wordList[209]="wolf";
wordList[210]="wood";
wordList[211]="worm";
wordList[212]="wrap";
wordList[213]="wyrm";
wordList[214]="xuen";
wordList[215]="yauj";
wordList[216]="yrel";
wordList[217]="zeal";
wordList[218]="zone";
wordList[219]="acorn";
wordList[220]="adder";
wordList[221]="addon";
wordList[222]="agent";
wordList[223]="aggro";
wordList[224]="agony";
wordList[225]="akama";
wordList[226]="aldor";
wordList[227]="alpha";
wordList[228]="amani";
wordList[229]="amber";
wordList[230]="angel";
wordList[231]="anima";
wordList[232]="apple";
wordList[233]="arena";
wordList[234]="argus";
wordList[235]="armor";
wordList[236]="ashen";
wordList[237]="baine";
wordList[238]="baron";
wordList[239]="blade";
wordList[240]="blast";
wordList[241]="blaze";
wordList[242]="bless";
wordList[243]="block";
wordList[244]="blind";
wordList[245]="blink";
wordList[246]="blood";
wordList[247]="brann";
wordList[248]="brawl";
wordList[249]="bread";
wordList[250]="brute";
wordList[251]="burst";
wordList[252]="cabal";
wordList[253]="calia";
wordList[254]="camel";
wordList[255]="candy";
wordList[256]="carve";
wordList[257]="chain";
wordList[258]="chaos";
wordList[259]="cheat";
wordList[260]="chess";
wordList[261]="chest";
wordList[262]="chill";
wordList[263]="clash";
wordList[264]="class";
wordList[265]="cloak";
wordList[266]="cloth";
wordList[267]="cloud";
wordList[268]="cobra";
wordList[269]="combo";
wordList[270]="comet";
wordList[271]="coral";
wordList[272]="corgi";
wordList[273]="cower";
wordList[274]="crane";
wordList[275]="crash";
wordList[276]="crawg";
wordList[277]="cream";
wordList[278]="crude";
wordList[279]="crypt";
wordList[280]="curse";
wordList[281]="dance";
wordList[282]="death";
wordList[283]="decay";
wordList[284]="demon";
wordList[285]="dense";
wordList[286]="detox";
wordList[287]="djinn";
wordList[288]="dodge";
wordList[289]="drain";
wordList[290]="draka";
wordList[291]="drake";
wordList[292]="dress";
wordList[293]="drink";
wordList[294]="druid";
wordList[295]="drust";
wordList[296]="dryad";
wordList[297]="dwarf";
wordList[298]="eagle";
wordList[299]="earth";
wordList[300]="elder";
wordList[301]="elekk";
wordList[302]="elune";
wordList[303]="emote";
wordList[304]="eonar";
wordList[305]="ettin";
wordList[306]="event";
wordList[307]="faith";
wordList[308]="feast";
wordList[309]="feint";
wordList[310]="feral";
wordList[311]="fetch";
wordList[312]="fiend";
wordList[313]="fiery";
wordList[314]="flame";
wordList[315]="flank";
wordList[316]="flare";
wordList[317]="flash";
wordList[318]="flask";
wordList[319]="flesh";
wordList[320]="focus";
wordList[321]="forge";
wordList[322]="fresh";
wordList[323]="freya";
wordList[324]="frost";
wordList[325]="fruit";
wordList[326]="fungi";
wordList[327]="geist";
wordList[328]="geode";
wordList[329]="ghost";
wordList[330]="ghoul";
wordList[331]="giant";
wordList[332]="glide";
wordList[333]="gluth";
wordList[334]="glyph";
wordList[335]="gnome";
wordList[336]="golem";
wordList[337]="goren";
wordList[338]="gouge";
wordList[339]="grace";
wordList[340]="grave";
wordList[341]="greed";
wordList[342]="grell";
wordList[343]="grong";
wordList[344]="gronn";
wordList[345]="group";
wordList[346]="growl";
wordList[347]="grunt";
wordList[348]="gruul";
wordList[349]="guard";
wordList[350]="guarm";
wordList[351]="guild";
wordList[352]="hands";
wordList[353]="harpy";
wordList[354]="haste";
wordList[355]="haunt";
wordList[356]="havoc";
wordList[357]="heart";
wordList[358]="heavy";
wordList[359]="hemet";
wordList[360]="helya";
wordList[361]="hodir";
wordList[362]="honey";
wordList[363]="honor";
wordList[364]="horde";
wordList[365]="horse";
wordList[366]="hound";
wordList[367]="hozen";
wordList[368]="human";
wordList[369]="hyjal";
wordList[370]="hydra";
wordList[371]="jaina";
wordList[372]="jerky";
wordList[373]="jinyu";
wordList[374]="joust";
wordList[375]="kabob";
wordList[376]="kalec";
wordList[377]="karma";
wordList[378]="kezan";
wordList[379]="knife";
wordList[380]="lance";
wordList[381]="leech";
wordList[382]="level";
wordList[383]="light";
wordList[384]="llama";
wordList[385]="llane";
wordList[386]="loken";
wordList[387]="lotus";
wordList[388]="lunge";
wordList[389]="magic";
wordList[390]="magma";
wordList[391]="magni";
wordList[392]="maiev";
wordList[393]="melee";
wordList[394]="might";
wordList[395]="moira";
wordList[396]="money";
wordList[397]="moose";
wordList[398]="mount";
wordList[399]="naaru";
wordList[400]="nalak";
wordList[401]="nexus";
wordList[402]="night";
wordList[403]="noble";
wordList[404]="ogron";
wordList[405]="order";
wordList[406]="otter";
wordList[407]="pagle";
wordList[408]="panda";
wordList[409]="parry";
wordList[410]="party";
wordList[411]="patch";
wordList[412]="peach";
wordList[413]="pearl";
wordList[414]="phase";
wordList[415]="plate";
wordList[416]="power";
wordList[417]="prowl";
wordList[418]="purge";
wordList[419]="pygmy";
wordList[420]="power";
wordList[421]="quail";
wordList[422]="queen";
wordList[423]="quest";
wordList[424]="quick";
wordList[425]="quill";
wordList[426]="raven";
wordList[427]="relic";
wordList[428]="renew";
wordList[429]="rhino";
wordList[430]="rodeo";
wordList[431]="rogue";
wordList[432]="rough";
wordList[433]="rylak";
wordList[434]="satyr";
wordList[435]="scale";
wordList[436]="scent";
wordList[437]="scout";
wordList[438]="sewer";
wordList[439]="shade";
wordList[440]="shale";
wordList[441]="shard";
wordList[442]="shark";
wordList[443]="sheep";
wordList[444]="shell";
wordList[445]="shift";
wordList[446]="shirt";
wordList[447]="shock";
wordList[448]="shoot";
wordList[449]="shout";
wordList[450]="sigil";
wordList[451]="silly";
wordList[452]="singe";
wordList[453]="siren";
wordList[454]="skill";
wordList[455]="skull";
wordList[456]="skunk";
wordList[457]="slice";
wordList[458]="slime";
wordList[459]="smack";
wordList[460]="smash";
wordList[461]="smite";
wordList[462]="smoke";
wordList[463]="snake";
wordList[464]="snare";
wordList[465]="solar";
wordList[466]="sonic";
wordList[467]="spark";
wordList[468]="spawm";
wordList[469]="spear";
wordList[470]="speed";
wordList[471]="spell";
wordList[472]="spice";
wordList[473]="spike";
wordList[474]="spore";
wordList[475]="squid";
wordList[476]="staff";
wordList[477]="steak";
wordList[478]="steal";
wordList[479]="steed";
wordList[480]="sting";
wordList[481]="stomp";
wordList[482]="stone";
wordList[483]="storm";
wordList[484]="stuck";
wordList[485]="surge";
wordList[486]="swift";
wordList[487]="swipe";
wordList[488]="sword";
wordList[489]="taloc";
wordList[490]="taunt";
wordList[491]="throw";
wordList[492]="tiger";
wordList[493]="titan";
wordList[494]="thief";
wordList[495]="token";
wordList[496]="topaz";
wordList[497]="totem";
wordList[498]="touch";
wordList[499]="toxic";
wordList[500]="toxin";
wordList[501]="track";
wordList[502]="trail";
wordList[503]="train";
wordList[504]="trash";
wordList[505]="trick";
wordList[506]="trogg";
wordList[507]="troll";
wordList[508]="trout";
wordList[509]="tuber";
wordList[510]="twist";
wordList[511]="uldir";
wordList[512]="uldum";
wordList[513]="ursoc";
wordList[514]="uther";
wordList[515]="valor";
wordList[516]="vashj";
wordList[517]="vault";
wordList[518]="velen";
wordList[519]="venom";
wordList[520]="vigil";
wordList[521]="vigor";
wordList[522]="viper";
wordList[523]="voice";
wordList[524]="waist";
wordList[525]="water";
wordList[526]="witch";
wordList[527]="wound";
wordList[528]="wrath";
wordList[529]="wrist";
wordList[530]="wrynn";
wordList[531]="xaxas";
wordList[532]="ysera";
wordList[533]="acuity";
wordList[534]="alpaca";
wordList[535]="ambush";
wordList[536]="animal";
wordList[537]="anduin";
wordList[538]="apexis";
wordList[539]="arathi";
wordList[540]="arator";
wordList[541]="arcane";
wordList[542]="arcway";
wordList[543]="argent";
wordList[544]="arlokk";
wordList[545]="arthas";
wordList[546]="ashran";
wordList[547]="aspect";
wordList[548]="astral";
wordList[549]="attack";
wordList[550]="avatar";
wordList[551]="azsuna";
wordList[552]="banish";
wordList[553]="banner";
wordList[554]="barrel";
wordList[555]="battle";
wordList[556]="beacon";
wordList[557]="beaver";
wordList[558]="bisque";
wordList[559]="bolvar";
wordList[560]="botani";
wordList[561]="bracer";
wordList[562]="breath";
wordList[563]="breeze";
wordList[564]="bright";
wordList[565]="broken";
wordList[566]="bronze";
wordList[567]="cairne";
wordList[568]="carrot";
wordList[569]="caster";
wordList[570]="charge";
wordList[571]="cheese";
wordList[572]="cherry";
wordList[573]="church";
wordList[574]="cinder";
wordList[575]="cleave";
wordList[576]="clench";
wordList[577]="cleric";
wordList[578]="coarse";
wordList[579]="cobalt";
wordList[580]="common";
wordList[581]="condor";
wordList[582]="cookie";
wordList[583]="copper";
wordList[584]="coyote";
wordList[585]="cudgel";
wordList[586]="cypher";
wordList[587]="daelin";
wordList[588]="dagger";
wordList[589]="damage";
wordList[590]="dampen";
wordList[591]="debuff";
wordList[592]="defile";
wordList[593]="disarm";
wordList[594]="dispel";
wordList[595]="divine";
wordList[596]="dragon";
wordList[597]="dynamo";
wordList[598]="effuse";
wordList[599]="elegon";
wordList[600]="elixir";
wordList[601]="empire";
wordList[602]="energy";
wordList[603]="enrage";
wordList[604]="eredar";
wordList[605]="escape";
wordList[606]="exarch";
wordList[607]="exodar";
wordList[608]="exotic";
wordList[609]="expert";
wordList[610]="faerie";
wordList[611]="falcon";
wordList[612]="farmer";
wordList[613]="felbat";
wordList[614]="ferret";
wordList[615]="fervor";
wordList[616]="feugen";
wordList[617]="flight";
wordList[618]="flurry";
wordList[619]="forest";
wordList[620]="freeze";
wordList[621]="frenzy";
wordList[622]="frozen";
wordList[623]="garona";
wordList[624]="geddon";
wordList[625]="gelbin";
wordList[626]="glaive";
wordList[627]="goblin";
wordList[628]="gorian";
wordList[629]="gorloc";
wordList[630]="goroth";
wordList[631]="gothik";
wordList[632]="ground";
wordList[633]="hakkar";
wordList[634]="hammer";
wordList[635]="health";
wordList[636]="hearth";
wordList[637]="heigen";
wordList[638]="heroic";
wordList[639]="hotfix";
wordList[640]="hunter";
wordList[641]="huojin";
wordList[642]="hybrid";
wordList[643]="icecap";
wordList[644]="ignite";
wordList[645]="insane";
wordList[646]="jailer";
wordList[647]="jasper";
wordList[648]="kairoz";
wordList[649]="kaliri";
wordList[650]="klaxxi";
wordList[651]="knight";
wordList[652]="kraken";
wordList[653]="krasus";
wordList[654]="kromog";
wordList[655]="krosus";
wordList[656]="kyrian";
wordList[657]="lasher";
wordList[658]="legion";
wordList[659]="libram";
wordList[660]="lichen";
wordList[661]="lothar";
wordList[662]="lurker";
wordList[663]="magmaw";
wordList[664]="mantid";
wordList[665]="maiden";
wordList[666]="manual";
wordList[667]="maraad";
wordList[668]="mardum";
wordList[669]="master";
wordList[670]="matron";
wordList[671]="medivh";
wordList[672]="menace";
wordList[673]="meteor";
wordList[674]="mighty";
wordList[675]="mining";
wordList[676]="minion";
wordList[677]="misery";
wordList[678]="monkey";
wordList[679]="moroes";
wordList[680]="mortal";
wordList[681]="murloc";
wordList[682]="mother";
wordList[683]="muffin";
wordList[684]="muzzle";
wordList[685]="mystic";
wordList[686]="mythic";
wordList[687]="nature";
wordList[688]="nazmir";
wordList[689]="nether";
wordList[690]="niuzao";
wordList[691]="normal";
wordList[692]="oculus";
wordList[693]="odious";
wordList[694]="onyxia";
wordList[695]="orchid";
wordList[696]="outlaw";
wordList[697]="owlcat";
wordList[698]="oxxein";
wordList[699]="parrot";
wordList[700]="patron";
wordList[701]="plague";
wordList[702]="poison";
wordList[703]="portal";
wordList[704]="potion";
wordList[705]="powder";
wordList[706]="prayer";
wordList[707]="priest";
wordList[708]="primal";
wordList[709]="pummel";
wordList[710]="purify";
wordList[711]="pyrite";
wordList[712]="pyrium";
wordList[713]="qiraji";
wordList[714]="quilen";
wordList[715]="rabbit";
wordList[716]="radish";
wordList[717]="rajaxx";
wordList[718]="ranged";
wordList[719]="ranger";
wordList[720]="raptor";
wordList[721]="ravage";
wordList[722]="reaver";
wordList[723]="rebuke";
wordList[724]="renown";
wordList[725]="rested";
wordList[726]="revive";
wordList[727]="rexxar";
wordList[728]="ritual";
wordList[729]="rocket";
wordList[730]="sacred";
wordList[731]="salmon";
wordList[732]="saurid";
wordList[733]="saurok";
wordList[734]="savage";
wordList[735]="scarab";
wordList[736]="scorch";
wordList[737]="scream";
wordList[738]="scroll";
wordList[739]="scythe";
wordList[740]="seeker";
wordList[741]="server";
wordList[742]="shadow";
wordList[743]="shadra";
wordList[744]="shaman";
wordList[745]="shaper";
wordList[746]="shield";
wordList[747]="shrine";
wordList[748]="shroud";
wordList[749]="silver";
wordList[750]="sinvyr";
wordList[751]="slayer";
wordList[752]="smooth";
wordList[753]="sniper";
wordList[754]="socket";
wordList[755]="soothe";
wordList[756]="sorrow";
wordList[757]="spider";
wordList[758]="spirit";
wordList[759]="sprint";
wordList[760]="sprite";
wordList[761]="skeram";
wordList[762]="stable";
wordList[763]="stance";
wordList[764]="static";
wordList[765]="strike";
wordList[766]="sudden";
wordList[767]="summon";
wordList[768]="sunder";
wordList[769]="switch";
wordList[770]="symbol";
wordList[771]="taelia";
wordList[772]="talbuk";
wordList[773]="talent";
wordList[774]="tanaan";
wordList[775]="taunka";
wordList[776]="tauren";
wordList[777]="tectus";
wordList[778]="temple";
wordList[779]="tendon";
wordList[780]="thekal";
wordList[781]="thorim";
wordList[782]="thorns";
wordList[783]="thrall";
wordList[784]="thrash";
wordList[785]="threat";
wordList[786]="tinder";
wordList[787]="tirion";
wordList[788]="tortos";
wordList[789]="treant";
wordList[790]="turkey";
wordList[791]="turnip";
wordList[792]="turtle";
wordList[793]="tushui";
wordList[794]="tyrant";
wordList[795]="ulduar";
wordList[796]="undead";
wordList[797]="unholy";
wordList[798]="vampyr";
wordList[799]="vanish";
wordList[800]="varian";
wordList[801]="vectis";
wordList[802]="vellum";
wordList[803]="virmen";
wordList[804]="vision";
wordList[805]="violet";
wordList[806]="vivify";
wordList[807]="volley";
wordList[808]="voodoo";
wordList[809]="vorrik";
wordList[810]="vrykul";
wordList[811]="vulpin";
wordList[812]="warden";
wordList[813]="warder";
wordList[814]="weapon";
wordList[815]="wicker";
wordList[816]="wisdom";
wordList[817]="wolvar";
wordList[818]="worgen";
wordList[819]="wraith";
wordList[820]="wyvern";
wordList[821]="xavius";
wordList[822]="zeliek";
wordList[823]="abyssal";
wordList[824]="account";
wordList[825]="acherus";
wordList[826]="aethril";
wordList[827]="agility";
wordList[828]="alchemy";
wordList[829]="algalon";
wordList[830]="alleria";
wordList[831]="alterac";
wordList[832]="aluneth";
wordList[833]="amplify";
wordList[834]="ancient";
wordList[835]="anglers";
wordList[836]="anguish";
wordList[837]="antorus";
wordList[838]="arakkoa";
wordList[839]="artisan";
wordList[840]="ashvane";
wordList[841]="attumen";
wordList[842]="auction";
wordList[843]="auriaya";
wordList[844]="avenger";
wordList[845]="azeroth";
wordList[846]="azgalor";
wordList[847]="azshara";
wordList[848]="balance";
wordList[849]="baleroc";
wordList[850]="banshee";
wordList[851]="barrage";
wordList[852]="barrier";
wordList[853]="barrens";
wordList[854]="berserk";
wordList[855]="bethekk";
wordList[856]="bolster";
wordList[857]="boralus";
wordList[858]="brawler";
wordList[859]="breaker";
wordList[860]="bulwark";
wordList[861]="butcher";
wordList[862]="buzzard";
wordList[863]="cabbage";
wordList[864]="captain";
wordList[865]="carrion";
wordList[866]="censure";
wordList[867]="charged";
wordList[868]="charger";
wordList[869]="cheatah";
wordList[870]="chicken";
wordList[871]="chromie";
wordList[872]="citadel";
wordList[873]="classic";
wordList[874]="cleanse";
wordList[875]="command";
wordList[876]="conduit";
wordList[877]="control";
wordList[878]="cooking";
wordList[879]="counter";
wordList[880]="crawdad";
wordList[881]="cricket";
wordList[882]="crimson";
wordList[883]="cruelty";
wordList[884]="crusade";
wordList[885]="crystal";
wordList[886]="cupcake";
wordList[887]="curator";
wordList[888]="cyclone";
wordList[889]="dalaran";
wordList[890]="dargrul";
wordList[891]="defense";
wordList[892]="demonic";
wordList[893]="deviate";
wordList[894]="diamond";
wordList[895]="diffuse";
wordList[896]="disable";
wordList[897]="disease";
wordList[898]="disrupt";
wordList[899]="draenei";
wordList[900]="draenor";
wordList[901]="drogbar";
wordList[902]="dungeon";
wordList[903]="durotan";
wordList[904]="durotar";
wordList[905]="ebonroc";
wordList[906]="eclipse";
wordList[907]="eitrigg";
wordList[908]="element";
wordList[909]="emerald";
wordList[910]="emporer";
wordList[911]="essence";
wordList[912]="exalted";
wordList[913]="execute";
wordList[914]="fallout";
wordList[915]="farseer";
wordList[916]="fatigue";
wordList[917]="feather";
wordList[918]="felbolt";
wordList[919]="fellash";
wordList[920]="felmyst";
wordList[921]="feltail";
wordList[922]="felwart";
wordList[923]="felweed";
wordList[924]="felwood";
wordList[925]="feralas";
wordList[926]="firefly";
wordList[927]="firemaw";
wordList[928]="fishing";
wordList[929]="fissure";
wordList[930]="fortune";
wordList[931]="fritter";
wordList[932]="furbolg";
wordList[933]="garalon";
wordList[934]="garrosh";
wordList[935]="garrote";
wordList[936]="gazlowe";
wordList[937]="general";
wordList[938]="gilneas";
wordList[939]="glowing";
wordList[940]="grapple";
wordList[941]="grummle";
wordList[942]="gryphon";
wordList[943]="gundrak";
wordList[944]="harpoon";
wordList[945]="harvest";
wordList[946]="helboar";
wordList[947]="helheim";
wordList[948]="heroism";
wordList[949]="honored";
wordList[950]="huhuran";
wordList[951]="hydross";
wordList[952]="icefury";
wordList[953]="illidan";
wordList[954]="inferno";
wordList[955]="justice";
wordList[956]="karabor";
wordList[957]="kargath";
wordList[958]="khadgar";
wordList[959]="kilrogg";
wordList[960]="kormrok";
wordList[961]="krokuun";
wordList[962]="kvaldir";
wordList[963]="leather";
wordList[964]="liadrin";
wordList[965]="loatheb";
wordList[966]="lobster";
wordList[967]="lullaby";
wordList[968]="machine";
wordList[969]="madness";
wordList[970]="maexxna";
wordList[971]="magatha";
wordList[972]="malygos";
wordList[973]="mammoth";
wordList[974]="marshal";
wordList[975]="mastery";
wordList[976]="mastiff";
wordList[977]="mathias";
wordList[978]="mimiron";
wordList[979]="mithril";
wordList[980]="moonkin";
wordList[981]="morchok";
wordList[982]="mudfish";
wordList[983]="mulgore";
wordList[984]="nagrand";
wordList[985]="nathria";
wordList[986]="nazgrim";
wordList[987]="neutral";
wordList[988]="nourish";
wordList[989]="octopus";
wordList[990]="offhand";
wordList[991]="ossuary";
wordList[992]="outland";
wordList[993]="outpost";
wordList[994]="overrun";
wordList[995]="paladin";
wordList[996]="peacock";
wordList[997]="penance";
wordList[998]="penguin";
wordList[999]="phoenix";
wordList[1000]="pilgrim";
wordList[1001]="pocopoc";
wordList[1002]="podling";
wordList[1003]="polearm";
wordList[1004]="prelate";
wordList[1005]="prestor";
wordList[1006]="pretzel";
wordList[1007]="private";
wordList[1008]="prophet";
wordList[1009]="provoke";
wordList[1010]="pudding";
wordList[1011]="pursuit";
wordList[1012]="raccoon";
wordList[1013]="radiant";
wordList[1014]="ragveil";
wordList[1015]="rampage";
wordList[1016]="rapture";
wordList[1017]="ratchet";
wordList[1018]="ravager";
wordList[1019]="reagent";
wordList[1020]="rebound";
wordList[1021]="redoubt";
wordList[1022]="reforge";
wordList[1023]="revenge";
wordList[1024]="revered";
wordList[1025]="reverse";
wordList[1026]="revival";
wordList[1027]="riposte";
wordList[1028]="riptide";
wordList[1029]="rotface";
wordList[1030]="rukhmar";
wordList[1031]="rupture";
wordList[1032]="saberon";
wordList[1033]="sanctum";
wordList[1034]="scorpid";
wordList[1035]="scourge";
wordList[1036]="screech";
wordList[1037]="scryers";
wordList[1038]="serpent";
wordList[1039]="sethekk";
wordList[1040]="shackle";
wordList[1041]="shannox";
wordList[1042]="shatter";
wordList[1043]="shimmer";
wordList[1044]="shuffle";
wordList[1045]="silence";
wordList[1046]="skovald";
wordList[1047]="skyfury";
wordList[1048]="smolder";
wordList[1049]="snobold";
wordList[1050]="soldier";
wordList[1051]="sparkle";
wordList[1052]="special";
wordList[1053]="spectre";
wordList[1054]="spitter";
wordList[1055]="stagger";
wordList[1056]="stalagg";
wordList[1057]="stamina";
wordList[1058]="stealth";
wordList[1059]="stonard";
wordList[1060]="strudel";
wordList[1061]="stylist";
wordList[1062]="sunfire";
wordList[1063]="sunwell";
wordList[1064]="suramar";
wordList[1065]="tactics";
wordList[1066]="talador";
wordList[1067]="talanji";
wordList[1068]="tanaris";
wordList[1069]="tandred";
wordList[1070]="templar";
wordList[1071]="thistle";
wordList[1072]="thorium";
wordList[1073]="thunder";
wordList[1074]="tillers";
wordList[1075]="torment";
wordList[1076]="torpedo";
wordList[1077]="torrent";
wordList[1078]="trample";
wordList[1079]="trinity";
wordList[1080]="trinket";
wordList[1081]="tsulong";
wordList[1082]="tuskarr";
wordList[1083]="typhoon";
wordList[1084]="tyrande";
wordList[1085]="uldaman";
wordList[1086]="unicorn";
wordList[1087]="unleash";
wordList[1088]="utgarde";
wordList[1089]="valeera";
wordList[1090]="valiona";
wordList[1091]="vanilla";
wordList[1092]="venison";
wordList[1093]="vereesa";
wordList[1094]="vexiona";
wordList[1095]="victory";
wordList[1096]="vulpera";
wordList[1097]="vulture";
wordList[1098]="warlock";
wordList[1099]="warlord";
wordList[1100]="warpath";
wordList[1101]="warrior";
wordList[1102]="warsong";
wordList[1103]="wendigo";
wordList[1104]="yaungol";
}
