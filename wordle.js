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
    addRow();
    updateGuesses();
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
wordList[155]="role";
wordList[156]="roll";
wordList[157]="root";
wordList[158]="rose";
wordList[159]="ruby";
wordList[160]="rune";
wordList[161]="rush";
wordList[162]="sand";
wordList[163]="scar";
wordList[164]="seal";
wordList[165]="seam";
wordList[166]="sear";
wordList[167]="seed";
wordList[168]="shaw";
wordList[169]="shiv";
wordList[170]="shot";
wordList[171]="skin";
wordList[172]="slag";
wordList[173]="slam";
wordList[174]="slow";
wordList[175]="slug";
wordList[176]="snow";
wordList[177]="soul";
wordList[178]="soup";
wordList[179]="spec";
wordList[180]="stab";
wordList[181]="star";
wordList[182]="stew";
wordList[183]="stun";
wordList[184]="tame";
wordList[185]="tank";
wordList[186]="tear";
wordList[187]="tide";
wordList[188]="tier";
wordList[189]="time";
wordList[190]="toad";
wordList[191]="toss";
wordList[192]="trap";
wordList[193]="vale";
wordList[194]="veil";
wordList[195]="vile";
wordList[196]="void";
wordList[197]="walk";
wordList[198]="wand";
wordList[199]="warm";
wordList[200]="wasp";
wordList[201]="wave";
wordList[202]="weak";
wordList[203]="wear";
wordList[204]="wild";
wordList[205]="will";
wordList[206]="wind";
wordList[207]="wisp";
wordList[208]="wolf";
wordList[209]="wood";
wordList[210]="worm";
wordList[211]="wrap";
wordList[212]="wyrm";
wordList[213]="xuen";
wordList[214]="yauj";
wordList[215]="yrel";
wordList[216]="zeal";
wordList[217]="zone";
wordList[218]="acorn";
wordList[219]="adder";
wordList[220]="addon";
wordList[221]="agent";
wordList[222]="aggro";
wordList[223]="agony";
wordList[224]="akama";
wordList[225]="aldor";
wordList[226]="alpha";
wordList[227]="amani";
wordList[228]="amber";
wordList[229]="angel";
wordList[230]="anima";
wordList[231]="apple";
wordList[232]="arena";
wordList[233]="argus";
wordList[234]="armor";
wordList[235]="ashen";
wordList[236]="baine";
wordList[237]="baron";
wordList[238]="blade";
wordList[239]="blast";
wordList[240]="blaze";
wordList[241]="bless";
wordList[242]="block";
wordList[243]="blind";
wordList[244]="blink";
wordList[245]="blood";
wordList[246]="brann";
wordList[247]="brawl";
wordList[248]="bread";
wordList[249]="brute";
wordList[250]="burst";
wordList[251]="cabal";
wordList[252]="calia";
wordList[253]="camel";
wordList[254]="candy";
wordList[255]="carve";
wordList[256]="chain";
wordList[257]="chaos";
wordList[258]="cheat";
wordList[259]="chess";
wordList[260]="chest";
wordList[261]="chill";
wordList[262]="clash";
wordList[263]="class";
wordList[264]="cloak";
wordList[265]="cloth";
wordList[266]="cloud";
wordList[267]="cobra";
wordList[268]="combo";
wordList[269]="comet";
wordList[270]="coral";
wordList[271]="corgi";
wordList[272]="cower";
wordList[273]="crane";
wordList[274]="crash";
wordList[275]="crawg";
wordList[276]="cream";
wordList[277]="crude";
wordList[278]="crypt";
wordList[279]="curse";
wordList[280]="dance";
wordList[281]="death";
wordList[282]="decay";
wordList[283]="demon";
wordList[284]="dense";
wordList[285]="detox";
wordList[286]="djinn";
wordList[287]="dodge";
wordList[288]="drain";
wordList[289]="draka";
wordList[290]="drake";
wordList[291]="drink";
wordList[292]="druid";
wordList[293]="drust";
wordList[294]="dryad";
wordList[295]="dwarf";
wordList[296]="eagle";
wordList[297]="earth";
wordList[298]="elder";
wordList[299]="elekk";
wordList[300]="elune";
wordList[301]="emote";
wordList[302]="eonar";
wordList[303]="ettin";
wordList[304]="event";
wordList[305]="faith";
wordList[306]="feast";
wordList[307]="feint";
wordList[308]="feral";
wordList[309]="fetch";
wordList[310]="fiend";
wordList[311]="fiery";
wordList[312]="flame";
wordList[313]="flank";
wordList[314]="flare";
wordList[315]="flash";
wordList[316]="flask";
wordList[317]="flesh";
wordList[318]="focus";
wordList[319]="forge";
wordList[320]="fresh";
wordList[321]="freya";
wordList[322]="frost";
wordList[323]="fruit";
wordList[324]="fungi";
wordList[325]="geist";
wordList[326]="geode";
wordList[327]="ghost";
wordList[328]="ghoul";
wordList[329]="giant";
wordList[330]="glide";
wordList[331]="gluth";
wordList[332]="glyph";
wordList[333]="gnome";
wordList[334]="golem";
wordList[335]="goren";
wordList[336]="gouge";
wordList[337]="grace";
wordList[338]="grave";
wordList[339]="greed";
wordList[340]="grell";
wordList[341]="grong";
wordList[342]="gronn";
wordList[343]="group";
wordList[344]="growl";
wordList[345]="grunt";
wordList[346]="gruul";
wordList[347]="guard";
wordList[348]="guarm";
wordList[349]="guild";
wordList[350]="hands";
wordList[351]="harpy";
wordList[352]="haste";
wordList[353]="haunt";
wordList[354]="havoc";
wordList[355]="heart";
wordList[356]="heavy";
wordList[357]="hemet";
wordList[358]="helya";
wordList[359]="hodir";
wordList[360]="honey";
wordList[361]="honor";
wordList[362]="horde";
wordList[363]="horse";
wordList[364]="hound";
wordList[365]="hozen";
wordList[366]="human";
wordList[367]="hyjal";
wordList[368]="hydra";
wordList[369]="jaina";
wordList[370]="jerky";
wordList[371]="jinyu";
wordList[372]="joust";
wordList[373]="kabob";
wordList[374]="kalec";
wordList[375]="karma";
wordList[376]="kezan";
wordList[377]="knife";
wordList[378]="lance";
wordList[379]="leech";
wordList[380]="level";
wordList[381]="light";
wordList[382]="llama";
wordList[383]="llane";
wordList[384]="loken";
wordList[385]="lotus";
wordList[386]="lunge";
wordList[387]="magic";
wordList[388]="magma";
wordList[389]="magni";
wordList[390]="maiev";
wordList[391]="melee";
wordList[392]="might";
wordList[393]="moira";
wordList[394]="money";
wordList[395]="moose";
wordList[396]="mount";
wordList[397]="naaru";
wordList[398]="nalak";
wordList[399]="nexus";
wordList[400]="night";
wordList[401]="noble";
wordList[402]="ogron";
wordList[403]="order";
wordList[404]="otter";
wordList[405]="pagle";
wordList[406]="panda";
wordList[407]="parry";
wordList[408]="party";
wordList[409]="patch";
wordList[410]="peach";
wordList[411]="pearl";
wordList[412]="phase";
wordList[413]="plate";
wordList[414]="power";
wordList[415]="prowl";
wordList[416]="purge";
wordList[417]="pygmy";
wordList[418]="power";
wordList[419]="quail";
wordList[420]="queen";
wordList[421]="quest";
wordList[422]="quick";
wordList[423]="quill";
wordList[424]="raven";
wordList[425]="relic";
wordList[426]="renew";
wordList[427]="rhino";
wordList[428]="rodeo";
wordList[429]="rogue";
wordList[430]="rough";
wordList[431]="rylak";
wordList[432]="satyr";
wordList[433]="scale";
wordList[434]="scent";
wordList[435]="scout";
wordList[436]="sewer";
wordList[437]="shade";
wordList[438]="shale";
wordList[439]="shard";
wordList[440]="shark";
wordList[441]="sheep";
wordList[442]="shell";
wordList[443]="shift";
wordList[444]="shirt";
wordList[445]="shock";
wordList[446]="shoot";
wordList[447]="shout";
wordList[448]="sigil";
wordList[449]="silly";
wordList[450]="singe";
wordList[451]="siren";
wordList[452]="skill";
wordList[453]="skull";
wordList[454]="skunk";
wordList[455]="slice";
wordList[456]="slime";
wordList[457]="smack";
wordList[458]="smash";
wordList[459]="smite";
wordList[460]="smoke";
wordList[461]="snake";
wordList[462]="snare";
wordList[463]="solar";
wordList[464]="sonic";
wordList[465]="spark";
wordList[466]="spawm";
wordList[467]="spear";
wordList[468]="speed";
wordList[469]="spell";
wordList[470]="spice";
wordList[471]="spike";
wordList[472]="spore";
wordList[473]="squid";
wordList[474]="staff";
wordList[475]="steak";
wordList[476]="steal";
wordList[477]="steed";
wordList[478]="sting";
wordList[479]="stomp";
wordList[480]="stone";
wordList[481]="storm";
wordList[482]="stuck";
wordList[483]="surge";
wordList[484]="swift";
wordList[485]="swipe";
wordList[486]="sword";
wordList[487]="taloc";
wordList[488]="taunt";
wordList[489]="throw";
wordList[490]="tiger";
wordList[491]="titan";
wordList[492]="thief";
wordList[493]="token";
wordList[494]="topaz";
wordList[495]="totem";
wordList[496]="touch";
wordList[497]="toxic";
wordList[498]="toxin";
wordList[499]="track";
wordList[500]="trail";
wordList[501]="train";
wordList[502]="trash";
wordList[503]="trick";
wordList[504]="trogg";
wordList[505]="troll";
wordList[506]="trout";
wordList[507]="tuber";
wordList[508]="twist";
wordList[509]="uldir";
wordList[510]="uldum";
wordList[511]="ursoc";
wordList[512]="uther";
wordList[513]="valor";
wordList[514]="vashj";
wordList[515]="vault";
wordList[516]="velen";
wordList[517]="venom";
wordList[518]="vigil";
wordList[519]="vigor";
wordList[520]="viper";
wordList[521]="voice";
wordList[522]="waist";
wordList[523]="water";
wordList[524]="witch";
wordList[525]="wound";
wordList[526]="wrath";
wordList[527]="wrist";
wordList[528]="wrynn";
wordList[529]="xaxas";
wordList[530]="ysera";
wordList[531]="acuity";
wordList[532]="alpaca";
wordList[533]="ambush";
wordList[534]="animal";
wordList[535]="anduin";
wordList[536]="apexis";
wordList[537]="arathi";
wordList[538]="arator";
wordList[539]="arcane";
wordList[540]="arcway";
wordList[541]="argent";
wordList[542]="arlokk";
wordList[543]="arthas";
wordList[544]="ashran";
wordList[545]="aspect";
wordList[546]="astral";
wordList[547]="attack";
wordList[548]="avatar";
wordList[549]="azsuna";
wordList[550]="banish";
wordList[551]="banner";
wordList[552]="barrel";
wordList[553]="battle";
wordList[554]="beacon";
wordList[555]="beaver";
wordList[556]="bisque";
wordList[557]="bolvar";
wordList[558]="botani";
wordList[559]="bracer";
wordList[560]="breath";
wordList[561]="breeze";
wordList[562]="bright";
wordList[563]="broken";
wordList[564]="bronze";
wordList[565]="cairne";
wordList[566]="carrot";
wordList[567]="caster";
wordList[568]="charge";
wordList[569]="cheese";
wordList[570]="cherry";
wordList[571]="church";
wordList[572]="cinder";
wordList[573]="cleave";
wordList[574]="clench";
wordList[575]="cleric";
wordList[576]="coarse";
wordList[577]="cobalt";
wordList[578]="common";
wordList[579]="condor";
wordList[580]="cookie";
wordList[581]="copper";
wordList[582]="coyote";
wordList[583]="cudgel";
wordList[584]="cypher";
wordList[585]="daelin";
wordList[586]="dagger";
wordList[587]="damage";
wordList[588]="dampen";
wordList[589]="debuff";
wordList[590]="defile";
wordList[591]="disarm";
wordList[592]="dispel";
wordList[593]="divine";
wordList[594]="dragon";
wordList[595]="dynamo";
wordList[596]="effuse";
wordList[597]="elegon";
wordList[598]="elixir";
wordList[599]="empire";
wordList[600]="energy";
wordList[601]="enrage";
wordList[602]="eredar";
wordList[603]="escape";
wordList[604]="exarch";
wordList[605]="exodar";
wordList[606]="exotic";
wordList[607]="expert";
wordList[608]="faerie";
wordList[609]="falcon";
wordList[610]="farmer";
wordList[611]="felbat";
wordList[612]="ferret";
wordList[613]="fervor";
wordList[614]="feugen";
wordList[615]="flight";
wordList[616]="flurry";
wordList[617]="forest";
wordList[618]="freeze";
wordList[619]="frenzy";
wordList[620]="frozen";
wordList[621]="garona";
wordList[622]="geddon";
wordList[623]="gelbin";
wordList[624]="glaive";
wordList[625]="goblin";
wordList[626]="gorian";
wordList[627]="gorloc";
wordList[628]="goroth";
wordList[629]="gothik";
wordList[630]="ground";
wordList[631]="hakkar";
wordList[632]="hammer";
wordList[633]="health";
wordList[634]="hearth";
wordList[635]="heigen";
wordList[636]="heroic";
wordList[637]="hotfix";
wordList[638]="hunter";
wordList[639]="huojin";
wordList[640]="hybrid";
wordList[641]="icecap";
wordList[642]="ignite";
wordList[643]="insane";
wordList[644]="jailer";
wordList[645]="jasper";
wordList[646]="kairoz";
wordList[647]="kaliri";
wordList[648]="klaxxi";
wordList[649]="knight";
wordList[650]="kraken";
wordList[651]="krasus";
wordList[652]="kromog";
wordList[653]="krosus";
wordList[654]="kyrian";
wordList[655]="lasher";
wordList[656]="legion";
wordList[657]="libram";
wordList[658]="lichen";
wordList[659]="lothar";
wordList[660]="lurker";
wordList[661]="magmaw";
wordList[662]="mantid";
wordList[663]="maiden";
wordList[664]="manual";
wordList[665]="maraad";
wordList[666]="mardum";
wordList[667]="master";
wordList[668]="matron";
wordList[669]="medivh";
wordList[670]="menace";
wordList[671]="meteor";
wordList[672]="mighty";
wordList[673]="mining";
wordList[674]="minion";
wordList[675]="misery";
wordList[676]="monkey";
wordList[677]="moroes";
wordList[678]="mortal";
wordList[679]="murloc";
wordList[680]="mother";
wordList[681]="muffin";
wordList[682]="muzzle";
wordList[683]="mystic";
wordList[684]="mythic";
wordList[685]="nature";
wordList[686]="nazmir";
wordList[687]="nether";
wordList[688]="niuzao";
wordList[689]="normal";
wordList[690]="oculus";
wordList[691]="odious";
wordList[692]="onyxia";
wordList[693]="orchid";
wordList[694]="outlaw";
wordList[695]="owlcat";
wordList[696]="oxxein";
wordList[697]="parrot";
wordList[698]="patron";
wordList[699]="plague";
wordList[700]="poison";
wordList[701]="portal";
wordList[702]="potion";
wordList[703]="powder";
wordList[704]="prayer";
wordList[705]="priest";
wordList[706]="primal";
wordList[707]="pummel";
wordList[708]="purify";
wordList[709]="pyrite";
wordList[710]="pyrium";
wordList[711]="qiraji";
wordList[712]="quilen";
wordList[713]="rabbit";
wordList[714]="radish";
wordList[715]="rajaxx";
wordList[716]="ranged";
wordList[717]="ranger";
wordList[718]="raptor";
wordList[719]="ravage";
wordList[720]="reaver";
wordList[721]="rebuke";
wordList[722]="renown";
wordList[723]="rested";
wordList[724]="revive";
wordList[725]="rexxar";
wordList[726]="ritual";
wordList[727]="rocket";
wordList[728]="sacred";
wordList[729]="salmon";
wordList[730]="saurid";
wordList[731]="saurok";
wordList[732]="savage";
wordList[733]="scarab";
wordList[734]="scorch";
wordList[735]="scream";
wordList[736]="scroll";
wordList[737]="scythe";
wordList[738]="seeker";
wordList[739]="server";
wordList[740]="shadow";
wordList[741]="shadra";
wordList[742]="shaman";
wordList[743]="shaper";
wordList[744]="shield";
wordList[745]="shrine";
wordList[746]="shroud";
wordList[747]="silver";
wordList[748]="sinvyr";
wordList[749]="slayer";
wordList[750]="smooth";
wordList[751]="sniper";
wordList[752]="socket";
wordList[753]="soothe";
wordList[754]="sorrow";
wordList[755]="spider";
wordList[756]="spirit";
wordList[757]="sprint";
wordList[758]="sprite";
wordList[759]="skeram";
wordList[760]="stable";
wordList[761]="stance";
wordList[762]="static";
wordList[763]="strike";
wordList[764]="sudden";
wordList[765]="summon";
wordList[766]="sunder";
wordList[767]="switch";
wordList[768]="taelia";
wordList[769]="talbuk";
wordList[770]="talent";
wordList[771]="tanaan";
wordList[772]="taunka";
wordList[773]="tauren";
wordList[774]="tectus";
wordList[775]="temple";
wordList[776]="tendon";
wordList[777]="thekal";
wordList[778]="thorim";
wordList[779]="thorns";
wordList[780]="thrall";
wordList[781]="thrash";
wordList[782]="threat";
wordList[783]="tinder";
wordList[784]="tirion";
wordList[785]="tortos";
wordList[786]="treant";
wordList[787]="turkey";
wordList[788]="turnip";
wordList[789]="turtle";
wordList[790]="tushui";
wordList[791]="tyrant";
wordList[792]="ulduar";
wordList[793]="undead";
wordList[794]="unholy";
wordList[795]="vampyr";
wordList[796]="vanish";
wordList[797]="varian";
wordList[798]="vectis";
wordList[799]="vellum";
wordList[800]="virmen";
wordList[801]="vision";
wordList[802]="violet";
wordList[803]="vivify";
wordList[804]="volley";
wordList[805]="voodoo";
wordList[806]="vorrik";
wordList[807]="vrykul";
wordList[808]="vulpin";
wordList[809]="warden";
wordList[810]="warder";
wordList[811]="weapon";
wordList[812]="wicker";
wordList[813]="wisdom";
wordList[814]="wolvar";
wordList[815]="worgen";
wordList[816]="wraith";
wordList[817]="wyvern";
wordList[818]="xavius";
wordList[819]="zeliek";
wordList[820]="abyssal";
wordList[821]="account";
wordList[822]="acherus";
wordList[823]="aethril";
wordList[824]="agility";
wordList[825]="alchemy";
wordList[826]="algalon";
wordList[827]="alleria";
wordList[828]="alterac";
wordList[829]="aluneth";
wordList[830]="amplify";
wordList[831]="ancient";
wordList[832]="anglers";
wordList[833]="anguish";
wordList[834]="antorus";
wordList[835]="arakkoa";
wordList[836]="artisan";
wordList[837]="ashvane";
wordList[838]="attumen";
wordList[839]="auction";
wordList[840]="auriaya";
wordList[841]="avenger";
wordList[842]="azeroth";
wordList[843]="azgalor";
wordList[844]="azshara";
wordList[845]="balance";
wordList[846]="baleroc";
wordList[847]="banshee";
wordList[848]="barrage";
wordList[849]="barrier";
wordList[850]="barrens";
wordList[851]="berserk";
wordList[852]="bethekk";
wordList[853]="bolster";
wordList[854]="boralus";
wordList[855]="brawler";
wordList[856]="breaker";
wordList[857]="bulwark";
wordList[858]="butcher";
wordList[859]="buzzard";
wordList[860]="cabbage";
wordList[861]="captain";
wordList[862]="carrion";
wordList[863]="censure";
wordList[864]="charged";
wordList[865]="charger";
wordList[866]="cheatah";
wordList[867]="chicken";
wordList[868]="chromie";
wordList[869]="citadel";
wordList[870]="classic";
wordList[871]="cleanse";
wordList[872]="command";
wordList[873]="conduit";
wordList[874]="control";
wordList[875]="cooking";
wordList[876]="counter";
wordList[877]="crawdad";
wordList[878]="cricket";
wordList[879]="crimson";
wordList[880]="cruelty";
wordList[881]="crusade";
wordList[882]="crystal";
wordList[883]="cupcake";
wordList[884]="curator";
wordList[885]="cyclone";
wordList[886]="dalaran";
wordList[887]="dargrul";
wordList[888]="defense";
wordList[889]="demonic";
wordList[890]="deviate";
wordList[891]="diamond";
wordList[892]="diffuse";
wordList[893]="disable";
wordList[894]="disease";
wordList[895]="disrupt";
wordList[896]="draenei";
wordList[897]="draenor";
wordList[898]="drogbar";
wordList[899]="dungeon";
wordList[900]="durotan";
wordList[901]="durotar";
wordList[902]="ebonroc";
wordList[903]="eclipse";
wordList[904]="eitrigg";
wordList[905]="element";
wordList[906]="emerald";
wordList[907]="emporer";
wordList[908]="essence";
wordList[909]="exalted";
wordList[910]="execute";
wordList[911]="fallout";
wordList[912]="farseer";
wordList[913]="fatigue";
wordList[914]="feather";
wordList[915]="felbolt";
wordList[916]="fellash";
wordList[917]="felmyst";
wordList[918]="feltail";
wordList[919]="felwart";
wordList[920]="felweed";
wordList[921]="felwood";
wordList[922]="feralas";
wordList[923]="firefly";
wordList[924]="firemaw";
wordList[925]="fishing";
wordList[926]="fissure";
wordList[927]="fortune";
wordList[928]="fritter";
wordList[929]="furbolg";
wordList[930]="garalon";
wordList[931]="garrosh";
wordList[932]="garrote";
wordList[933]="gazlowe";
wordList[934]="general";
wordList[935]="gilneas";
wordList[936]="glowing";
wordList[937]="grapple";
wordList[938]="grummle";
wordList[939]="gryphon";
wordList[940]="gundrak";
wordList[941]="harpoon";
wordList[942]="harvest";
wordList[943]="helboar";
wordList[944]="helheim";
wordList[945]="heroism";
wordList[946]="honored";
wordList[947]="huhuran";
wordList[948]="hydross";
wordList[949]="icefury";
wordList[950]="illidan";
wordList[951]="inferno";
wordList[952]="justice";
wordList[953]="karabor";
wordList[954]="kargath";
wordList[955]="khadgar";
wordList[956]="kilrogg";
wordList[957]="kormrok";
wordList[958]="krokuun";
wordList[959]="kvaldir";
wordList[960]="leather";
wordList[961]="liadrin";
wordList[962]="loatheb";
wordList[963]="lobster";
wordList[964]="lullaby";
wordList[965]="machine";
wordList[966]="madness";
wordList[967]="maexxna";
wordList[968]="magatha";
wordList[969]="malygos";
wordList[970]="mammoth";
wordList[971]="marshal";
wordList[972]="mastery";
wordList[973]="mastiff";
wordList[974]="mathias";
wordList[975]="mimiron";
wordList[976]="mithril";
wordList[977]="moonkin";
wordList[978]="morchok";
wordList[979]="mudfish";
wordList[980]="mulgore";
wordList[981]="nagrand";
wordList[982]="nathria";
wordList[983]="nazgrim";
wordList[984]="neutral";
wordList[985]="nourish";
wordList[986]="octopus";
wordList[987]="offhand";
wordList[988]="ossuary";
wordList[989]="outland";
wordList[990]="outpost";
wordList[991]="overrun";
wordList[992]="paladin";
wordList[993]="peacock";
wordList[994]="penance";
wordList[995]="penguin";
wordList[996]="phoenix";
wordList[997]="pilgrim";
wordList[998]="pocopoc";
wordList[999]="podling";
wordList[1000]="polearm";
wordList[1001]="prelate";
wordList[1002]="prestor";
wordList[1003]="pretzel";
wordList[1004]="private";
wordList[1005]="prophet";
wordList[1006]="provoke";
wordList[1007]="pudding";
wordList[1008]="pursuit";
wordList[1009]="raccoon";
wordList[1010]="radiant";
wordList[1011]="ragveil";
wordList[1012]="rampage";
wordList[1013]="rapture";
wordList[1014]="ratchet";
wordList[1015]="ravager";
wordList[1016]="reagent";
wordList[1017]="rebound";
wordList[1018]="redoubt";
wordList[1019]="reforge";
wordList[1020]="revenge";
wordList[1021]="revered";
wordList[1022]="reverse";
wordList[1023]="revival";
wordList[1024]="riposte";
wordList[1025]="riptide";
wordList[1026]="rotface";
wordList[1027]="rukhmar";
wordList[1028]="rupture";
wordList[1029]="saberon";
wordList[1030]="sanctum";
wordList[1031]="scorpid";
wordList[1032]="scourge";
wordList[1033]="screech";
wordList[1034]="scryers";
wordList[1035]="serpent";
wordList[1036]="sethekk";
wordList[1037]="shackle";
wordList[1038]="shannox";
wordList[1039]="shatter";
wordList[1040]="shimmer";
wordList[1041]="shuffle";
wordList[1042]="silence";
wordList[1043]="skovald";
wordList[1044]="skyfury";
wordList[1045]="smolder";
wordList[1046]="snobold";
wordList[1047]="soldier";
wordList[1048]="sparkle";
wordList[1049]="special";
wordList[1050]="spectre";
wordList[1051]="spitter";
wordList[1052]="stagger";
wordList[1053]="stalagg";
wordList[1054]="stamina";
wordList[1055]="stealth";
wordList[1056]="stonard";
wordList[1057]="strudel";
wordList[1058]="stylist";
wordList[1059]="sunfire";
wordList[1060]="sunwell";
wordList[1061]="suramar";
wordList[1062]="symbol";
wordList[1063]="tactics";
wordList[1064]="talador";
wordList[1065]="talanji";
wordList[1066]="tanaris";
wordList[1067]="tandred";
wordList[1068]="templar";
wordList[1069]="thistle";
wordList[1070]="thorium";
wordList[1071]="thunder";
wordList[1072]="tillers";
wordList[1073]="torment";
wordList[1074]="torpedo";
wordList[1075]="torrent";
wordList[1076]="trample";
wordList[1077]="trinity";
wordList[1078]="trinket";
wordList[1079]="tsulong";
wordList[1080]="tuskarr";
wordList[1081]="typhoon";
wordList[1082]="tyrande";
wordList[1083]="uldaman";
wordList[1084]="unicorn";
wordList[1085]="unleash";
wordList[1086]="utgarde";
wordList[1087]="valeera";
wordList[1088]="valiona";
wordList[1089]="vanilla";
wordList[1090]="venison";
wordList[1091]="vereesa";
wordList[1092]="vexiona";
wordList[1093]="victory";
wordList[1094]="vulpera";
wordList[1095]="vulture";
wordList[1096]="warlock";
wordList[1097]="warlord";
wordList[1098]="warpath";
wordList[1099]="warrior";
wordList[1100]="warsong";
wordList[1101]="wendigo";
wordList[1102]="yaungol";
}
