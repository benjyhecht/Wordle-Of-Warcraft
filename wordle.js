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
wordList[26]="cast";
wordList[27]="clam";
wordList[28]="claw";
wordList[29]="coal";
wordList[30]="cold";
wordList[31]="cook";
wordList[32]="crow";
wordList[33]="dark";
wordList[34]="dash";
wordList[35]="dawn";
wordList[36]="daze";
wordList[37]="dead";
wordList[38]="ding";
wordList[39]="dire";
wordList[40]="doom";
wordList[41]="duel";
wordList[42]="dust";
wordList[43]="ebon";
wordList[44]="echo";
wordList[45]="epic";
wordList[46]="fade";
wordList[47]="fall";
wordList[48]="farm";
wordList[49]="fate";
wordList[50]="fear";
wordList[51]="feet";
wordList[52]="fine";
wordList[53]="fire";
wordList[54]="fish";
wordList[55]="fist";
wordList[56]="flay";
wordList[57]="flee";
wordList[58]="flow";
wordList[59]="form";
wordList[60]="frog";
wordList[61]="garr";
wordList[62]="gaze";
wordList[63]="gear";
wordList[64]="genn";
wordList[65]="gift";
wordList[66]="goat";
wordList[67]="gold";
wordList[68]="gore";
wordList[69]="grip";
wordList[70]="halo";
wordList[71]="hand";
wordList[72]="hard";
wordList[73]="hawk";
wordList[74]="head";
wordList[75]="heal";
wordList[76]="helm";
wordList[77]="herb";
wordList[78]="hero";
wordList[79]="hide";
wordList[80]="holy";
wordList[81]="hook";
wordList[82]="hope";
wordList[83]="howl";
wordList[84]="huln";
wordList[85]="hymn";
wordList[86]="idol";
wordList[87]="iron";
wordList[88]="item";
wordList[89]="jade";
wordList[90]="kick";
wordList[91]="kill";
wordList[92]="king";
wordList[93]="kite";
wordList[94]="kodo";
wordList[95]="lair";
wordList[96]="lash";
wordList[97]="lava";
wordList[98]="leaf";
wordList[99]="leap";
wordList[100]="legs";
wordList[101]="lich";
wordList[102]="life";
wordList[103]="lily";
wordList[104]="link";
wordList[105]="lion";
wordList[106]="lock";
wordList[107]="loot";
wordList[108]="lord";
wordList[109]="lore";
wordList[110]="lynx";
wordList[111]="mace";
wordList[112]="mage";
wordList[113]="magi";
wordList[114]="mail";
wordList[115]="maim";
wordList[116]="mana";
wordList[117]="mark";
wordList[118]="maul";
wordList[119]="maut";
wordList[120]="mead";
wordList[121]="meat";
wordList[122]="mend";
wordList[123]="milk";
wordList[124]="mind";
wordList[125]="mine";
wordList[126]="mist";
wordList[127]="moam";
wordList[128]="mogu";
wordList[129]="mojo";
wordList[130]="monk";
wordList[131]="moon";
wordList[132]="moth";
wordList[133]="naga";
wordList[134]="need";
wordList[135]="noth";
wordList[136]="nova";
wordList[137]="odyn";
wordList[138]="ogre";
wordList[139]="ooze";
wordList[140]="orca";
wordList[141]="pack";
wordList[142]="pact";
wordList[143]="pain";
wordList[144]="peon";
wordList[145]="pepe";
wordList[146]="play";
wordList[147]="pure";
wordList[148]="rage";
wordList[149]="raid";
wordList[150]="rain";
wordList[151]="rake";
wordList[152]="rare";
wordList[153]="rend";
wordList[154]="rest";
wordList[155]="rime";
wordList[156]="ring";
wordList[157]="roar";
wordList[158]="robe";
wordList[159]="role";
wordList[160]="roll";
wordList[161]="root";
wordList[162]="rose";
wordList[163]="ruby";
wordList[164]="rune";
wordList[165]="rush";
wordList[166]="sand";
wordList[167]="salt";
wordList[168]="scar";
wordList[169]="seal";
wordList[170]="seam";
wordList[171]="sear";
wordList[172]="seed";
wordList[173]="shaw";
wordList[174]="shiv";
wordList[175]="shot";
wordList[176]="skin";
wordList[177]="slag";
wordList[178]="slam";
wordList[179]="slow";
wordList[180]="slug";
wordList[181]="snow";
wordList[182]="soul";
wordList[183]="soup";
wordList[184]="spec";
wordList[185]="stab";
wordList[186]="star";
wordList[187]="stew";
wordList[188]="stun";
wordList[189]="talk";
wordList[190]="tame";
wordList[191]="tank";
wordList[192]="tear";
wordList[193]="tide";
wordList[194]="tier";
wordList[195]="time";
wordList[196]="toad";
wordList[197]="toss";
wordList[198]="trap";
wordList[199]="vale";
wordList[200]="veil";
wordList[201]="vile";
wordList[202]="void";
wordList[203]="walk";
wordList[204]="wand";
wordList[205]="warm";
wordList[206]="wasp";
wordList[207]="wave";
wordList[208]="weak";
wordList[209]="wear";
wordList[210]="wild";
wordList[211]="will";
wordList[212]="wind";
wordList[213]="wisp";
wordList[214]="wolf";
wordList[215]="wood";
wordList[216]="worm";
wordList[217]="wrap";
wordList[218]="wyrm";
wordList[219]="xuen";
wordList[220]="yauj";
wordList[221]="yrel";
wordList[222]="zeal";
wordList[223]="zone";
wordList[224]="acorn";
wordList[225]="adder";
wordList[226]="addon";
wordList[227]="agent";
wordList[228]="aggro";
wordList[229]="agony";
wordList[230]="akama";
wordList[231]="aldor";
wordList[232]="alpha";
wordList[233]="amani";
wordList[234]="amber";
wordList[235]="angel";
wordList[236]="anima";
wordList[237]="apple";
wordList[238]="arena";
wordList[239]="argus";
wordList[240]="armor";
wordList[241]="ashen";
wordList[242]="baine";
wordList[243]="baron";
wordList[244]="blade";
wordList[245]="blast";
wordList[246]="blaze";
wordList[247]="bless";
wordList[248]="block";
wordList[249]="blind";
wordList[250]="blink";
wordList[251]="blood";
wordList[252]="brann";
wordList[253]="brave";
wordList[254]="brawl";
wordList[255]="bread";
wordList[256]="brill";
wordList[257]="brute";
wordList[258]="burst";
wordList[259]="cabal";
wordList[260]="calia";
wordList[261]="camel";
wordList[262]="candy";
wordList[263]="carve";
wordList[264]="chain";
wordList[265]="chaos";
wordList[266]="cheat";
wordList[267]="chess";
wordList[268]="chest";
wordList[269]="chill";
wordList[270]="clash";
wordList[271]="class";
wordList[272]="cloak";
wordList[273]="cloth";
wordList[274]="cloud";
wordList[275]="cobra";
wordList[276]="combo";
wordList[277]="comet";
wordList[278]="coral";
wordList[279]="corgi";
wordList[280]="cower";
wordList[281]="crane";
wordList[282]="crash";
wordList[283]="crawg";
wordList[284]="cream";
wordList[285]="crude";
wordList[286]="crypt";
wordList[287]="curse";
wordList[288]="dance";
wordList[289]="death";
wordList[290]="decay";
wordList[291]="demon";
wordList[292]="dense";
wordList[293]="detox";
wordList[294]="djinn";
wordList[295]="dodge";
wordList[296]="drain";
wordList[297]="draka";
wordList[298]="drake";
wordList[299]="dress";
wordList[300]="drink";
wordList[301]="druid";
wordList[302]="drust";
wordList[303]="dryad";
wordList[304]="dwarf";
wordList[305]="eagle";
wordList[306]="earth";
wordList[307]="elder";
wordList[308]="elekk";
wordList[309]="elune";
wordList[310]="emote";
wordList[311]="eonar";
wordList[312]="ettin";
wordList[313]="event";
wordList[314]="faith";
wordList[315]="feast";
wordList[316]="feint";
wordList[317]="feral";
wordList[318]="fetch";
wordList[319]="fiend";
wordList[320]="fiery";
wordList[321]="flame";
wordList[322]="flank";
wordList[323]="flare";
wordList[324]="flash";
wordList[325]="flask";
wordList[326]="flesh";
wordList[327]="focus";
wordList[328]="forge";
wordList[329]="fresh";
wordList[330]="freya";
wordList[331]="frost";
wordList[332]="fruit";
wordList[333]="fungi";
wordList[334]="geist";
wordList[335]="geode";
wordList[336]="ghost";
wordList[337]="ghoul";
wordList[338]="giant";
wordList[339]="glide";
wordList[340]="gluth";
wordList[341]="glyph";
wordList[342]="gnome";
wordList[343]="golem";
wordList[344]="goren";
wordList[345]="gouge";
wordList[346]="grace";
wordList[347]="grass";
wordList[348]="grave";
wordList[349]="greed";
wordList[350]="grell";
wordList[351]="grong";
wordList[352]="gronn";
wordList[353]="group";
wordList[354]="growl";
wordList[355]="grunt";
wordList[356]="gruul";
wordList[357]="guard";
wordList[358]="guarm";
wordList[359]="guild";
wordList[360]="hands";
wordList[361]="harpy";
wordList[362]="haste";
wordList[363]="haunt";
wordList[364]="havoc";
wordList[365]="heart";
wordList[366]="heavy";
wordList[367]="hemet";
wordList[368]="helya";
wordList[369]="hodir";
wordList[370]="honey";
wordList[371]="honor";
wordList[372]="horde";
wordList[373]="horse";
wordList[374]="hound";
wordList[375]="hozen";
wordList[376]="human";
wordList[377]="hyjal";
wordList[378]="hydra";
wordList[379]="jaina";
wordList[380]="jerky";
wordList[381]="jinyu";
wordList[382]="joust";
wordList[383]="kabob";
wordList[384]="kalec";
wordList[385]="karma";
wordList[386]="kezan";
wordList[387]="knife";
wordList[388]="lance";
wordList[389]="leech";
wordList[390]="level";
wordList[391]="light";
wordList[392]="llama";
wordList[393]="llane";
wordList[394]="loken";
wordList[395]="lotus";
wordList[396]="lunge";
wordList[397]="magic";
wordList[398]="magma";
wordList[399]="magni";
wordList[400]="maiev";
wordList[401]="melee";
wordList[402]="might";
wordList[403]="moira";
wordList[404]="money";
wordList[405]="moose";
wordList[406]="mount";
wordList[407]="naaru";
wordList[408]="nalak";
wordList[409]="nexus";
wordList[410]="night";
wordList[411]="noble";
wordList[412]="ogron";
wordList[413]="order";
wordList[414]="otter";
wordList[415]="pagle";
wordList[416]="panda";
wordList[417]="parry";
wordList[418]="party";
wordList[419]="patch";
wordList[420]="peach";
wordList[421]="pearl";
wordList[422]="phase";
wordList[423]="plane";
wordList[424]="plate";
wordList[425]="power";
wordList[426]="prowl";
wordList[427]="purge";
wordList[428]="pygmy";
wordList[429]="power";
wordList[430]="quail";
wordList[431]="queen";
wordList[432]="quest";
wordList[433]="quick";
wordList[434]="quill";
wordList[435]="raven";
wordList[436]="relic";
wordList[437]="renew";
wordList[438]="rhino";
wordList[439]="rodeo";
wordList[440]="rogue";
wordList[441]="rough";
wordList[442]="rylak";
wordList[443]="satyr";
wordList[444]="scale";
wordList[445]="scent";
wordList[446]="scout";
wordList[447]="sewer";
wordList[448]="shade";
wordList[449]="shale";
wordList[450]="shard";
wordList[451]="shark";
wordList[452]="sheep";
wordList[453]="shell";
wordList[454]="shift";
wordList[455]="shirt";
wordList[456]="shock";
wordList[457]="shoot";
wordList[458]="shout";
wordList[459]="sigil";
wordList[460]="silly";
wordList[461]="singe";
wordList[462]="siren";
wordList[463]="skill";
wordList[464]="skull";
wordList[465]="skunk";
wordList[466]="slice";
wordList[467]="slime";
wordList[468]="smack";
wordList[469]="smash";
wordList[470]="smite";
wordList[471]="smoke";
wordList[472]="snake";
wordList[473]="snare";
wordList[474]="sneak";
wordList[475]="solar";
wordList[476]="sonic";
wordList[477]="spark";
wordList[478]="spawm";
wordList[479]="spear";
wordList[480]="speed";
wordList[481]="spell";
wordList[482]="spice";
wordList[483]="spike";
wordList[484]="spore";
wordList[485]="squid";
wordList[486]="staff";
wordList[487]="steak";
wordList[488]="steal";
wordList[489]="steed";
wordList[490]="sting";
wordList[491]="stomp";
wordList[492]="stone";
wordList[493]="storm";
wordList[494]="stuck";
wordList[495]="surge";
wordList[496]="swift";
wordList[497]="swipe";
wordList[498]="sword";
wordList[499]="taloc";
wordList[500]="taunt";
wordList[501]="throw";
wordList[502]="tiger";
wordList[503]="titan";
wordList[504]="thief";
wordList[505]="token";
wordList[506]="topaz";
wordList[507]="totem";
wordList[508]="touch";
wordList[509]="toxic";
wordList[510]="toxin";
wordList[511]="track";
wordList[512]="trail";
wordList[513]="train";
wordList[514]="trash";
wordList[515]="trick";
wordList[516]="trogg";
wordList[517]="troll";
wordList[518]="trout";
wordList[519]="tuber";
wordList[520]="twist";
wordList[521]="uldir";
wordList[522]="uldum";
wordList[523]="ursoc";
wordList[524]="uther";
wordList[525]="valor";
wordList[526]="vashj";
wordList[527]="vault";
wordList[528]="velen";
wordList[529]="venom";
wordList[530]="vigil";
wordList[531]="vigor";
wordList[532]="viper";
wordList[533]="voice";
wordList[534]="waist";
wordList[535]="water";
wordList[536]="witch";
wordList[537]="wound";
wordList[538]="wrath";
wordList[539]="wrist";
wordList[540]="wrynn";
wordList[541]="xaxas";
wordList[542]="ysera";
wordList[543]="acuity";
wordList[544]="alpaca";
wordList[545]="ambush";
wordList[546]="animal";
wordList[547]="anduin";
wordList[548]="apexis";
wordList[549]="arathi";
wordList[550]="arator";
wordList[551]="arcane";
wordList[552]="arcway";
wordList[553]="argent";
wordList[554]="arlokk";
wordList[555]="arthas";
wordList[556]="ashran";
wordList[557]="aspect";
wordList[558]="astral";
wordList[559]="attack";
wordList[560]="avatar";
wordList[561]="azsuna";
wordList[562]="banish";
wordList[563]="banner";
wordList[564]="barrel";
wordList[565]="battle";
wordList[566]="beacon";
wordList[567]="beaver";
wordList[568]="bisque";
wordList[569]="bolvar";
wordList[570]="botani";
wordList[571]="bracer";
wordList[572]="breath";
wordList[573]="breeze";
wordList[574]="bright";
wordList[575]="broken";
wordList[576]="bronze";
wordList[577]="cairne";
wordList[578]="carrot";
wordList[579]="caster";
wordList[580]="casual";
wordList[581]="charge";
wordList[582]="cheese";
wordList[583]="cherry";
wordList[584]="church";
wordList[585]="cinder";
wordList[586]="cleave";
wordList[587]="clench";
wordList[588]="cleric";
wordList[589]="coarse";
wordList[590]="cobalt";
wordList[591]="common";
wordList[592]="condor";
wordList[593]="cookie";
wordList[594]="copper";
wordList[595]="coyote";
wordList[596]="cudgel";
wordList[597]="cypher";
wordList[598]="daelin";
wordList[599]="dagger";
wordList[600]="damage";
wordList[601]="dampen";
wordList[602]="debuff";
wordList[603]="defile";
wordList[604]="disarm";
wordList[605]="dispel";
wordList[606]="divine";
wordList[607]="dragon";
wordList[608]="dynamo";
wordList[609]="effuse";
wordList[610]="elegon";
wordList[611]="elixir";
wordList[612]="empire";
wordList[613]="energy";
wordList[614]="enrage";
wordList[615]="eredar";
wordList[616]="escape";
wordList[617]="exarch";
wordList[618]="exodar";
wordList[619]="exotic";
wordList[620]="expert";
wordList[621]="faerie";
wordList[622]="falcon";
wordList[623]="farmer";
wordList[624]="felbat";
wordList[625]="ferret";
wordList[626]="fervor";
wordList[627]="feugen";
wordList[628]="flight";
wordList[629]="flurry";
wordList[630]="forest";
wordList[631]="freeze";
wordList[632]="frenzy";
wordList[633]="frozen";
wordList[634]="garona";
wordList[635]="geddon";
wordList[636]="gelbin";
wordList[637]="glaive";
wordList[638]="goblin";
wordList[639]="gorian";
wordList[640]="gorloc";
wordList[641]="goroth";
wordList[642]="gothik";
wordList[643]="ground";
wordList[644]="hakkar";
wordList[645]="hammer";
wordList[646]="health";
wordList[647]="hearth";
wordList[648]="heigen";
wordList[649]="heroic";
wordList[650]="hotfix";
wordList[651]="hunter";
wordList[652]="huojin";
wordList[653]="hybrid";
wordList[654]="icecap";
wordList[655]="ignite";
wordList[656]="insane";
wordList[657]="jailer";
wordList[658]="jasper";
wordList[659]="kairoz";
wordList[660]="kaliri";
wordList[661]="klaxxi";
wordList[662]="knight";
wordList[663]="kraken";
wordList[664]="krasus";
wordList[665]="kromog";
wordList[666]="krosus";
wordList[667]="kyrian";
wordList[668]="lasher";
wordList[669]="legion";
wordList[670]="libram";
wordList[671]="lichen";
wordList[672]="lothar";
wordList[673]="lurker";
wordList[674]="magmaw";
wordList[675]="mantid";
wordList[676]="maiden";
wordList[677]="manual";
wordList[678]="maraad";
wordList[679]="mardum";
wordList[680]="master";
wordList[681]="matron";
wordList[682]="medivh";
wordList[683]="menace";
wordList[684]="meteor";
wordList[685]="mighty";
wordList[686]="mining";
wordList[687]="minion";
wordList[688]="misery";
wordList[689]="monkey";
wordList[690]="moroes";
wordList[691]="mortal";
wordList[692]="murloc";
wordList[693]="mother";
wordList[694]="muffin";
wordList[695]="muzzle";
wordList[696]="mystic";
wordList[697]="mythic";
wordList[698]="nature";
wordList[699]="nazmir";
wordList[700]="nether";
wordList[701]="niuzao";
wordList[702]="normal";
wordList[703]="oculus";
wordList[704]="odious";
wordList[705]="onyxia";
wordList[706]="orchid";
wordList[707]="outlaw";
wordList[708]="owlcat";
wordList[709]="oxxein";
wordList[710]="parley";
wordList[711]="parrot";
wordList[712]="patron";
wordList[713]="pebble";
wordList[714]="plague";
wordList[715]="poison";
wordList[716]="portal";
wordList[717]="potion";
wordList[718]="powder";
wordList[719]="prayer";
wordList[720]="priest";
wordList[721]="primal";
wordList[722]="prince";
wordList[723]="pummel";
wordList[724]="purify";
wordList[725]="pyrite";
wordList[726]="pyrium";
wordList[727]="qiraji";
wordList[728]="quilen";
wordList[729]="rabbit";
wordList[730]="radish";
wordList[731]="rajaxx";
wordList[732]="ranged";
wordList[733]="ranger";
wordList[734]="raptor";
wordList[735]="ravage";
wordList[736]="reaver";
wordList[737]="rebuke";
wordList[738]="renown";
wordList[739]="rested";
wordList[740]="revive";
wordList[741]="rexxar";
wordList[742]="ritual";
wordList[743]="rocket";
wordList[744]="sacred";
wordList[745]="salmon";
wordList[746]="saurid";
wordList[747]="saurok";
wordList[748]="savage";
wordList[749]="scarab";
wordList[750]="school";
wordList[751]="scorch";
wordList[752]="scream";
wordList[753]="scroll";
wordList[754]="scythe";
wordList[755]="seeker";
wordList[756]="server";
wordList[757]="shadow";
wordList[758]="shadra";
wordList[759]="shaman";
wordList[760]="shaper";
wordList[761]="shield";
wordList[762]="shrine";
wordList[763]="shroud";
wordList[764]="silver";
wordList[765]="sinvyr";
wordList[766]="slayer";
wordList[767]="smooth";
wordList[768]="sniper";
wordList[769]="socket";
wordList[770]="soothe";
wordList[771]="sorrow";
wordList[772]="spider";
wordList[773]="spirit";
wordList[774]="sprint";
wordList[775]="sprite";
wordList[776]="skeram";
wordList[777]="stable";
wordList[778]="stance";
wordList[779]="static";
wordList[780]="strike";
wordList[781]="sudden";
wordList[782]="summon";
wordList[783]="sunder";
wordList[784]="switch";
wordList[785]="symbol";
wordList[786]="taelia";
wordList[787]="talbuk";
wordList[788]="talent";
wordList[789]="tanaan";
wordList[790]="taunka";
wordList[791]="tauren";
wordList[792]="tectus";
wordList[793]="temple";
wordList[794]="tendon";
wordList[795]="thekal";
wordList[796]="thorim";
wordList[797]="thorns";
wordList[798]="thrall";
wordList[799]="thrash";
wordList[800]="threat";
wordList[801]="throne";
wordList[802]="tinder";
wordList[803]="tirion";
wordList[804]="tortos";
wordList[805]="treant";
wordList[806]="turkey";
wordList[807]="turnip";
wordList[808]="turtle";
wordList[809]="tushui";
wordList[810]="tyrant";
wordList[811]="ulduar";
wordList[812]="undead";
wordList[813]="unholy";
wordList[814]="vampyr";
wordList[815]="vanish";
wordList[816]="varian";
wordList[817]="vectis";
wordList[818]="vellum";
wordList[819]="virmen";
wordList[820]="vision";
wordList[821]="violet";
wordList[822]="vivify";
wordList[823]="volley";
wordList[824]="voodoo";
wordList[825]="vorrik";
wordList[826]="vrykul";
wordList[827]="vulpin";
wordList[828]="warden";
wordList[829]="warder";
wordList[830]="weapon";
wordList[831]="wicker";
wordList[832]="wisdom";
wordList[833]="wolvar";
wordList[834]="worgen";
wordList[835]="wraith";
wordList[836]="wyvern";
wordList[837]="xavius";
wordList[838]="zeliek";
wordList[839]="ability";
wordList[840]="abyssal";
wordList[841]="account";
wordList[842]="acherus";
wordList[843]="aethril";
wordList[844]="agility";
wordList[845]="alchemy";
wordList[846]="algalon";
wordList[847]="alleria";
wordList[848]="alterac";
wordList[849]="aluneth";
wordList[850]="amplify";
wordList[851]="ancient";
wordList[852]="anglers";
wordList[853]="anguish";
wordList[854]="antorus";
wordList[855]="arakkoa";
wordList[856]="artisan";
wordList[857]="ashvane";
wordList[858]="attumen";
wordList[859]="auction";
wordList[860]="auriaya";
wordList[861]="avenger";
wordList[862]="azeroth";
wordList[863]="azgalor";
wordList[864]="azshara";
wordList[865]="balance";
wordList[866]="baleroc";
wordList[867]="banshee";
wordList[868]="barrage";
wordList[869]="barrier";
wordList[870]="barrens";
wordList[871]="berserk";
wordList[872]="bethekk";
wordList[873]="bolster";
wordList[874]="boralus";
wordList[875]="brawler";
wordList[876]="breaker";
wordList[877]="bulwark";
wordList[878]="butcher";
wordList[879]="buzzard";
wordList[880]="cabbage";
wordList[881]="captain";
wordList[882]="carrion";
wordList[883]="censure";
wordList[884]="charged";
wordList[885]="charger";
wordList[886]="cheatah";
wordList[887]="chicken";
wordList[888]="chromie";
wordList[889]="citadel";
wordList[890]="classic";
wordList[891]="cleanse";
wordList[892]="command";
wordList[893]="conduit";
wordList[894]="control";
wordList[895]="cooking";
wordList[896]="counter";
wordList[897]="crawdad";
wordList[898]="cricket";
wordList[899]="crimson";
wordList[900]="cruelty";
wordList[901]="crusade";
wordList[902]="crystal";
wordList[903]="cupcake";
wordList[904]="curator";
wordList[905]="cyclone";
wordList[906]="dalaran";
wordList[907]="dargrul";
wordList[908]="defense";
wordList[909]="demonic";
wordList[910]="deviate";
wordList[911]="diamond";
wordList[912]="diffuse";
wordList[913]="disable";
wordList[914]="disease";
wordList[915]="disrupt";
wordList[916]="draenei";
wordList[917]="draenor";
wordList[918]="drogbar";
wordList[919]="dungeon";
wordList[920]="durotan";
wordList[921]="durotar";
wordList[922]="ebonroc";
wordList[923]="eclipse";
wordList[924]="eitrigg";
wordList[925]="element";
wordList[926]="emerald";
wordList[927]="emporer";
wordList[928]="essence";
wordList[929]="exalted";
wordList[930]="execute";
wordList[931]="fallout";
wordList[932]="farseer";
wordList[933]="fatigue";
wordList[934]="feather";
wordList[935]="felbolt";
wordList[936]="fellash";
wordList[937]="felmyst";
wordList[938]="feltail";
wordList[939]="felwart";
wordList[940]="felweed";
wordList[941]="felwood";
wordList[942]="feralas";
wordList[943]="firefly";
wordList[944]="firemaw";
wordList[945]="fishing";
wordList[946]="fissure";
wordList[947]="fortune";
wordList[948]="fritter";
wordList[949]="furbolg";
wordList[950]="garalon";
wordList[951]="garrosh";
wordList[952]="garrote";
wordList[953]="gazlowe";
wordList[954]="general";
wordList[955]="gilneas";
wordList[956]="glowing";
wordList[957]="grapple";
wordList[958]="grummle";
wordList[959]="gryphon";
wordList[960]="gundrak";
wordList[961]="harpoon";
wordList[962]="harvest";
wordList[963]="helboar";
wordList[964]="helheim";
wordList[965]="heroism";
wordList[966]="honored";
wordList[967]="huhuran";
wordList[968]="hydross";
wordList[969]="icefury";
wordList[970]="illidan";
wordList[971]="inferno";
wordList[972]="justice";
wordList[973]="karabor";
wordList[974]="kargath";
wordList[975]="khadgar";
wordList[976]="kilrogg";
wordList[977]="kormrok";
wordList[978]="krokuun";
wordList[979]="kvaldir";
wordList[980]="leather";
wordList[981]="liadrin";
wordList[982]="loatheb";
wordList[983]="lobster";
wordList[984]="lullaby";
wordList[985]="machine";
wordList[986]="madness";
wordList[987]="maexxna";
wordList[988]="magatha";
wordList[989]="malygos";
wordList[990]="mammoth";
wordList[991]="marshal";
wordList[992]="mastery";
wordList[993]="mastiff";
wordList[994]="mathias";
wordList[995]="mimiron";
wordList[996]="mithril";
wordList[997]="moonkin";
wordList[998]="morchok";
wordList[999]="mudfish";
wordList[1000]="mulgore";
wordList[1001]="nagrand";
wordList[1002]="nathria";
wordList[1003]="nazgrim";
wordList[1004]="neutral";
wordList[1005]="nourish";
wordList[1006]="octopus";
wordList[1007]="offhand";
wordList[1008]="ossuary";
wordList[1009]="outland";
wordList[1010]="outpost";
wordList[1011]="overrun";
wordList[1012]="paladin";
wordList[1013]="peacock";
wordList[1014]="penance";
wordList[1015]="penguin";
wordList[1016]="phoenix";
wordList[1017]="pilgrim";
wordList[1018]="pocopoc";
wordList[1019]="podling";
wordList[1020]="polearm";
wordList[1021]="prelate";
wordList[1022]="prestor";
wordList[1023]="pretzel";
wordList[1024]="private";
wordList[1025]="prophet";
wordList[1026]="provoke";
wordList[1027]="pudding";
wordList[1028]="pursuit";
wordList[1029]="raccoon";
wordList[1030]="radiant";
wordList[1031]="ragveil";
wordList[1032]="rampage";
wordList[1033]="rapture";
wordList[1034]="ratchet";
wordList[1035]="ravager";
wordList[1036]="reagent";
wordList[1037]="rebound";
wordList[1038]="redoubt";
wordList[1039]="reforge";
wordList[1040]="revenge";
wordList[1041]="revered";
wordList[1042]="reverse";
wordList[1043]="revival";
wordList[1044]="riposte";
wordList[1045]="riptide";
wordList[1046]="rotface";
wordList[1047]="rukhmar";
wordList[1048]="rupture";
wordList[1049]="saberon";
wordList[1050]="sanctum";
wordList[1051]="scorpid";
wordList[1052]="scourge";
wordList[1053]="screech";
wordList[1054]="scryers";
wordList[1055]="serpent";
wordList[1056]="sethekk";
wordList[1057]="shackle";
wordList[1058]="shannox";
wordList[1059]="shatter";
wordList[1060]="shimmer";
wordList[1061]="shuffle";
wordList[1062]="silence";
wordList[1063]="skovald";
wordList[1064]="skyfury";
wordList[1065]="smolder";
wordList[1066]="snobold";
wordList[1067]="soldier";
wordList[1068]="sparkle";
wordList[1069]="special";
wordList[1070]="spectre";
wordList[1071]="spitter";
wordList[1072]="stagger";
wordList[1073]="stalagg";
wordList[1074]="stamina";
wordList[1075]="stealth";
wordList[1076]="stonard";
wordList[1077]="strudel";
wordList[1078]="stylist";
wordList[1079]="sunfire";
wordList[1080]="sunwell";
wordList[1081]="suramar";
wordList[1082]="tactics";
wordList[1083]="talador";
wordList[1084]="talanji";
wordList[1085]="tanaris";
wordList[1086]="tandred";
wordList[1087]="templar";
wordList[1088]="thistle";
wordList[1089]="thorium";
wordList[1090]="thunder";
wordList[1091]="tillers";
wordList[1092]="torment";
wordList[1093]="torpedo";
wordList[1094]="torrent";
wordList[1095]="trample";
wordList[1096]="trinity";
wordList[1097]="trinket";
wordList[1098]="tsulong";
wordList[1099]="tuskarr";
wordList[1100]="typhoon";
wordList[1101]="tyrande";
wordList[1102]="uldaman";
wordList[1103]="unicorn";
wordList[1104]="unleash";
wordList[1105]="utgarde";
wordList[1106]="valeera";
wordList[1107]="valiona";
wordList[1108]="vanilla";
wordList[1109]="venison";
wordList[1110]="vereesa";
wordList[1111]="vexiona";
wordList[1112]="victory";
wordList[1113]="vulpera";
wordList[1114]="vulture";
wordList[1115]="warlock";
wordList[1116]="warlord";
wordList[1117]="warpath";
wordList[1118]="warrior";
wordList[1119]="warsong";
wordList[1120]="wendigo";
wordList[1121]="yaungol";
}
