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
wordList[15]="bone";
wordList[16]="boss";
wordList[17]="brew";
wordList[18]="buff";
wordList[19]="burn";
wordList[20]="buru";
wordList[21]="butt";
wordList[22]="cake";
wordList[23]="cape";
wordList[24]="carp";
wordList[25]="clam";
wordList[26]="claw";
wordList[27]="coal";
wordList[28]="cold";
wordList[29]="cook";
wordList[30]="crow";
wordList[31]="dark";
wordList[32]="dash";
wordList[33]="dawn";
wordList[34]="daze";
wordList[35]="dead";
wordList[36]="ding";
wordList[37]="dire";
wordList[38]="duel";
wordList[39]="dust";
wordList[40]="ebon";
wordList[41]="echo";
wordList[42]="epic";
wordList[43]="fade";
wordList[44]="fall";
wordList[45]="farm";
wordList[46]="fate";
wordList[47]="fear";
wordList[48]="feet";
wordList[49]="fine";
wordList[50]="fire";
wordList[51]="fish";
wordList[52]="fist";
wordList[53]="flay";
wordList[54]="flow";
wordList[55]="form";
wordList[56]="frog";
wordList[57]="garr";
wordList[58]="gaze";
wordList[59]="genn";
wordList[60]="goat";
wordList[61]="gold";
wordList[62]="gore";
wordList[63]="grip";
wordList[64]="halo";
wordList[65]="hand";
wordList[66]="hard";
wordList[67]="hawk";
wordList[68]="head";
wordList[69]="heal";
wordList[70]="helm";
wordList[71]="herb";
wordList[72]="hero";
wordList[73]="hide";
wordList[74]="holy";
wordList[75]="hook";
wordList[76]="hope";
wordList[77]="howl";
wordList[78]="huln";
wordList[79]="hymn";
wordList[80]="idol";
wordList[81]="iron";
wordList[82]="item";
wordList[83]="jade";
wordList[84]="kick";
wordList[85]="kill";
wordList[86]="king";
wordList[87]="kite";
wordList[88]="kodo";
wordList[89]="lair";
wordList[90]="lava";
wordList[91]="leaf";
wordList[92]="leap";
wordList[93]="legs";
wordList[94]="lich";
wordList[95]="life";
wordList[96]="lily";
wordList[97]="link";
wordList[98]="lion";
wordList[99]="loot";
wordList[100]="lore";
wordList[101]="lynx";
wordList[102]="mace";
wordList[103]="mage";
wordList[104]="magi";
wordList[105]="mail";
wordList[106]="maim";
wordList[107]="mana";
wordList[108]="mark";
wordList[109]="maul";
wordList[110]="maut";
wordList[111]="mead";
wordList[112]="meat";
wordList[113]="mend";
wordList[114]="milk";
wordList[115]="mind";
wordList[116]="mine";
wordList[117]="mist";
wordList[118]="moam";
wordList[119]="mogu";
wordList[120]="mojo";
wordList[121]="monk";
wordList[122]="moon";
wordList[123]="moth";
wordList[124]="naga";
wordList[125]="noth";
wordList[126]="nova";
wordList[127]="odyn";
wordList[128]="ogre";
wordList[129]="ooze";
wordList[130]="orca";
wordList[131]="pack";
wordList[132]="peon";
wordList[133]="pepe";
wordList[134]="play";
wordList[135]="pure";
wordList[136]="rage";
wordList[137]="raid";
wordList[138]="rake";
wordList[139]="rare";
wordList[140]="rend";
wordList[141]="rest";
wordList[142]="rime";
wordList[143]="ring";
wordList[144]="roar";
wordList[145]="role";
wordList[146]="roll";
wordList[147]="root";
wordList[148]="rose";
wordList[149]="ruby";
wordList[150]="rune";
wordList[151]="rush";
wordList[152]="sand";
wordList[153]="scar";
wordList[154]="seal";
wordList[155]="seam";
wordList[156]="sear";
wordList[157]="seed";
wordList[158]="shaw";
wordList[159]="shot";
wordList[160]="skin";
wordList[161]="slag";
wordList[162]="slow";
wordList[163]="slug";
wordList[164]="snow";
wordList[165]="soul";
wordList[166]="soup";
wordList[167]="spec";
wordList[168]="stab";
wordList[169]="star";
wordList[170]="stew";
wordList[171]="stun";
wordList[172]="tame";
wordList[173]="tank";
wordList[174]="tear";
wordList[175]="tide";
wordList[176]="tier";
wordList[177]="time";
wordList[178]="toad";
wordList[179]="trap";
wordList[180]="vale";
wordList[181]="void";
wordList[182]="wand";
wordList[183]="warm";
wordList[184]="wasp";
wordList[185]="wave";
wordList[186]="weak";
wordList[187]="wear";
wordList[188]="wild";
wordList[189]="will";
wordList[190]="wind";
wordList[191]="wisp";
wordList[192]="wolf";
wordList[193]="wood";
wordList[194]="worm";
wordList[195]="wrap";
wordList[196]="wyrm";
wordList[197]="xuen";
wordList[198]="yauj";
wordList[199]="yrel";
wordList[200]="zeal";
wordList[201]="zone";
wordList[202]="acorn";
wordList[203]="adder";
wordList[204]="addon";
wordList[205]="aggro";
wordList[206]="akama";
wordList[207]="aldor";
wordList[208]="alpha";
wordList[209]="amani";
wordList[210]="amber";
wordList[211]="angel";
wordList[212]="anima";
wordList[213]="apple";
wordList[214]="arena";
wordList[215]="argus";
wordList[216]="ashen";
wordList[217]="baine";
wordList[218]="baron";
wordList[219]="blade";
wordList[220]="blast";
wordList[221]="blaze";
wordList[222]="bless";
wordList[223]="block";
wordList[224]="blind";
wordList[225]="blink";
wordList[226]="blood";
wordList[227]="brann";
wordList[228]="bread";
wordList[229]="brute";
wordList[230]="burst";
wordList[231]="cabal";
wordList[232]="calia";
wordList[233]="camel";
wordList[234]="candy";
wordList[235]="carve";
wordList[236]="chain";
wordList[237]="chaos";
wordList[238]="chess";
wordList[239]="chest";
wordList[240]="chill";
wordList[241]="clash";
wordList[242]="class";
wordList[243]="cloak";
wordList[244]="cloth";
wordList[245]="cloud";
wordList[246]="cobra";
wordList[247]="combo";
wordList[248]="comet";
wordList[249]="coral";
wordList[250]="corgi";
wordList[251]="cower";
wordList[252]="crane";
wordList[253]="crash";
wordList[254]="crawg";
wordList[255]="cream";
wordList[256]="crude";
wordList[257]="crypt";
wordList[258]="curse";
wordList[259]="dance";
wordList[260]="death";
wordList[261]="demon";
wordList[262]="dense";
wordList[263]="detox";
wordList[264]="djinn";
wordList[265]="dodge";
wordList[266]="drake";
wordList[267]="drink";
wordList[268]="druid";
wordList[269]="drust";
wordList[270]="dryad";
wordList[271]="dwarf";
wordList[272]="eagle";
wordList[273]="earth";
wordList[274]="elekk";
wordList[275]="elune";
wordList[276]="emote";
wordList[277]="eonar";
wordList[278]="ettin";
wordList[279]="event";
wordList[280]="faith";
wordList[281]="feast";
wordList[282]="feral";
wordList[283]="fetch";
wordList[284]="fiend";
wordList[285]="fiery";
wordList[286]="flame";
wordList[287]="flank";
wordList[288]="flare";
wordList[289]="flash";
wordList[290]="flask";
wordList[291]="flesh";
wordList[292]="focus";
wordList[293]="forge";
wordList[294]="freya";
wordList[295]="frost";
wordList[296]="fruit";
wordList[297]="fungi";
wordList[298]="geist";
wordList[299]="geode";
wordList[300]="ghost";
wordList[301]="ghoul";
wordList[302]="giant";
wordList[303]="glide";
wordList[304]="gluth";
wordList[305]="glyph";
wordList[306]="gnome";
wordList[307]="golem";
wordList[308]="goren";
wordList[309]="grace";
wordList[310]="grave";
wordList[311]="grell";
wordList[312]="grong";
wordList[313]="gronn";
wordList[314]="group";
wordList[315]="growl";
wordList[316]="grunt";
wordList[317]="gruul";
wordList[318]="guard";
wordList[319]="guarm";
wordList[320]="guild";
wordList[321]="hands";
wordList[322]="harpy";
wordList[323]="haste";
wordList[324]="havoc";
wordList[325]="heart";
wordList[326]="heavy";
wordList[327]="hemet";
wordList[328]="helya";
wordList[329]="hodir";
wordList[330]="honey";
wordList[331]="honor";
wordList[332]="horde";
wordList[333]="horse";
wordList[334]="hound";
wordList[335]="hozen";
wordList[336]="human";
wordList[337]="hyjal";
wordList[338]="hydra";
wordList[339]="jaina";
wordList[340]="jerky";
wordList[341]="jinyu";
wordList[342]="joust";
wordList[343]="kabob";
wordList[344]="kalec";
wordList[345]="karma";
wordList[346]="kezan";
wordList[347]="lance";
wordList[348]="level";
wordList[349]="light";
wordList[350]="llama";
wordList[351]="llane";
wordList[352]="loken";
wordList[353]="lotus";
wordList[354]="magic";
wordList[355]="magma";
wordList[356]="magni";
wordList[357]="maiev";
wordList[358]="melee";
wordList[359]="might";
wordList[360]="moira";
wordList[361]="money";
wordList[362]="moose";
wordList[363]="mount";
wordList[364]="naaru";
wordList[365]="nalak";
wordList[366]="nexus";
wordList[367]="ogron";
wordList[368]="order";
wordList[369]="otter";
wordList[370]="pagle";
wordList[371]="panda";
wordList[372]="parry";
wordList[373]="party";
wordList[374]="patch";
wordList[375]="peach";
wordList[376]="pearl";
wordList[377]="phase";
wordList[378]="plate";
wordList[379]="power";
wordList[380]="prowl";
wordList[381]="pygmy";
wordList[382]="power";
wordList[383]="quail";
wordList[384]="queen";
wordList[385]="quest";
wordList[386]="quill";
wordList[387]="raven";
wordList[388]="relic";
wordList[389]="renew";
wordList[390]="rhino";
wordList[391]="rodeo";
wordList[392]="rogue";
wordList[393]="rough";
wordList[394]="rylak";
wordList[395]="satyr";
wordList[396]="scale";
wordList[397]="scent";
wordList[398]="sewer";
wordList[399]="shade";
wordList[400]="shale";
wordList[401]="shard";
wordList[402]="shark";
wordList[403]="sheep";
wordList[404]="shell";
wordList[405]="shift";
wordList[406]="shirt";
wordList[407]="shock";
wordList[408]="shoot";
wordList[409]="shout";
wordList[410]="sigil";
wordList[411]="silly";
wordList[412]="siren";
wordList[413]="skill";
wordList[414]="skull";
wordList[415]="skunk";
wordList[416]="slime";
wordList[417]="smack";
wordList[418]="smash";
wordList[419]="smite";
wordList[420]="snake";
wordList[421]="snare";
wordList[422]="solar";
wordList[423]="sonic";
wordList[424]="spark";
wordList[425]="spawm";
wordList[426]="spear";
wordList[427]="speed";
wordList[428]="spell";
wordList[429]="spice";
wordList[430]="spike";
wordList[431]="spore";
wordList[432]="squid";
wordList[433]="staff";
wordList[434]="steak";
wordList[435]="steal";
wordList[436]="steed";
wordList[437]="sting";
wordList[438]="stomp";
wordList[439]="stone";
wordList[440]="storm";
wordList[441]="stuck";
wordList[442]="surge";
wordList[443]="swift";
wordList[444]="swipe";
wordList[445]="sword";
wordList[446]="taloc";
wordList[447]="taunt";
wordList[448]="throw";
wordList[449]="tiger";
wordList[450]="titan";
wordList[451]="token";
wordList[452]="topaz";
wordList[453]="totem";
wordList[454]="touch";
wordList[455]="toxic";
wordList[456]="toxin";
wordList[457]="track";
wordList[458]="trail";
wordList[459]="trick";
wordList[460]="trogg";
wordList[461]="troll";
wordList[462]="trout";
wordList[463]="tuber";
wordList[464]="twist";
wordList[465]="uldir";
wordList[466]="uldum";
wordList[467]="ursoc";
wordList[468]="uther";
wordList[469]="valor";
wordList[470]="vashj";
wordList[471]="vault";
wordList[472]="velen";
wordList[473]="venom";
wordList[474]="vigil";
wordList[475]="viper";
wordList[476]="voice";
wordList[477]="waist";
wordList[478]="water";
wordList[479]="witch";
wordList[480]="wrath";
wordList[481]="wrist";
wordList[482]="wrynn";
wordList[483]="xaxas";
wordList[484]="ysera";
wordList[485]="acuity";
wordList[486]="alpaca";
wordList[487]="animal";
wordList[488]="anduin";
wordList[489]="apexis";
wordList[490]="arathi";
wordList[491]="arator";
wordList[492]="arcane";
wordList[493]="arcway";
wordList[494]="arlokk";
wordList[495]="arthas";
wordList[496]="ashran";
wordList[497]="aspect";
wordList[498]="astral";
wordList[499]="attack";
wordList[500]="avatar";
wordList[501]="azsuna";
wordList[502]="barrel";
wordList[503]="battle";
wordList[504]="beacon";
wordList[505]="beaver";
wordList[506]="bisque";
wordList[507]="bolvar";
wordList[508]="botani";
wordList[509]="bracer";
wordList[510]="breath";
wordList[511]="breeze";
wordList[512]="bright";
wordList[513]="broken";
wordList[514]="bronze";
wordList[515]="cairne";
wordList[516]="carrot";
wordList[517]="caster";
wordList[518]="cheese";
wordList[519]="cherry";
wordList[520]="church";
wordList[521]="cinder";
wordList[522]="cleave";
wordList[523]="clench";
wordList[524]="cleric";
wordList[525]="coarse";
wordList[526]="cobalt";
wordList[527]="common";
wordList[528]="condor";
wordList[529]="cookie";
wordList[530]="copper";
wordList[531]="coyote";
wordList[532]="cudgel";
wordList[533]="cypher";
wordList[534]="daelin";
wordList[535]="dagger";
wordList[536]="damage";
wordList[537]="dampen";
wordList[538]="debuff";
wordList[539]="defile";
wordList[540]="disarm";
wordList[541]="dispel";
wordList[542]="divine";
wordList[543]="dragon";
wordList[544]="dynamo";
wordList[545]="effuse";
wordList[546]="elegon";
wordList[547]="elixir";
wordList[548]="empire";
wordList[549]="energy";
wordList[550]="enrage";
wordList[551]="eredar";
wordList[552]="escape";
wordList[553]="exarch";
wordList[554]="exodar";
wordList[555]="exotic";
wordList[556]="expert";
wordList[557]="faerie";
wordList[558]="falcon";
wordList[559]="felbat";
wordList[560]="ferret";
wordList[561]="feugen";
wordList[562]="flight";
wordList[563]="flurry";
wordList[564]="forest";
wordList[565]="freeze";
wordList[566]="frenzy";
wordList[567]="frozen";
wordList[568]="geddon";
wordList[569]="gelbin";
wordList[570]="glaive";
wordList[571]="goblin";
wordList[572]="gorian";
wordList[573]="gorloc";
wordList[574]="goroth";
wordList[575]="gothik";
wordList[576]="hakkar";
wordList[577]="hammer";
wordList[578]="health";
wordList[579]="hearth";
wordList[580]="heigen";
wordList[581]="heroic";
wordList[582]="hotfix";
wordList[583]="hunter";
wordList[584]="huojin";
wordList[585]="hybrid";
wordList[586]="icecap";
wordList[587]="ignite";
wordList[588]="jailer";
wordList[589]="jasper";
wordList[590]="kairoz";
wordList[591]="kaliri";
wordList[592]="klaxxi";
wordList[593]="knight";
wordList[594]="kraken";
wordList[595]="krasus";
wordList[596]="kromog";
wordList[597]="krosus";
wordList[598]="kyrian";
wordList[599]="lasher";
wordList[600]="legion";
wordList[601]="libram";
wordList[602]="lichen";
wordList[603]="lothar";
wordList[604]="lurker";
wordList[605]="magmaw";
wordList[606]="mantid";
wordList[607]="maiden";
wordList[608]="manual";
wordList[609]="maraad";
wordList[610]="mardum";
wordList[611]="master";
wordList[612]="medivh";
wordList[613]="meteor";
wordList[614]="mighty";
wordList[615]="mining";
wordList[616]="misery";
wordList[617]="monkey";
wordList[618]="moroes";
wordList[619]="mortal";
wordList[620]="murloc";
wordList[621]="mother";
wordList[622]="muffin";
wordList[623]="muzzle";
wordList[624]="mystic";
wordList[625]="mythic";
wordList[626]="nature";
wordList[627]="nazmir";
wordList[628]="nether";
wordList[629]="niuzao";
wordList[630]="normal";
wordList[631]="oculus";
wordList[632]="odious";
wordList[633]="onyxia";
wordList[634]="orchid";
wordList[635]="owlcat";
wordList[636]="oxxein";
wordList[637]="parrot";
wordList[638]="plague";
wordList[639]="poison";
wordList[640]="portal";
wordList[641]="potion";
wordList[642]="prayer";
wordList[643]="priest";
wordList[644]="primal";
wordList[645]="pummel";
wordList[646]="purify";
wordList[647]="pyrite";
wordList[648]="pyrium";
wordList[649]="qiraji";
wordList[650]="quilen";
wordList[651]="rabbit";
wordList[652]="radish";
wordList[653]="rajaxx";
wordList[654]="ranged";
wordList[655]="ranger";
wordList[656]="raptor";
wordList[657]="ravage";
wordList[658]="reaver";
wordList[659]="rebuke";
wordList[660]="renown";
wordList[661]="rested";
wordList[662]="revive";
wordList[663]="rexxar";
wordList[664]="rocket";
wordList[665]="sacred";
wordList[666]="salmon";
wordList[667]="saurid";
wordList[668]="saurok";
wordList[669]="savage";
wordList[670]="scarab";
wordList[671]="scorch";
wordList[672]="scream";
wordList[673]="scroll";
wordList[674]="scythe";
wordList[675]="seeker";
wordList[676]="server";
wordList[677]="shadow";
wordList[678]="shadra";
wordList[679]="shaman";
wordList[680]="shaper";
wordList[681]="shield";
wordList[682]="shrine";
wordList[683]="silver";
wordList[684]="sinvyr";
wordList[685]="smooth";
wordList[686]="sniper";
wordList[687]="socket";
wordList[688]="soothe";
wordList[689]="sorrow";
wordList[690]="spider";
wordList[691]="spirit";
wordList[692]="sprite";
wordList[693]="skeram";
wordList[694]="stable";
wordList[695]="stance";
wordList[696]="strike";
wordList[697]="summon";
wordList[698]="sunder";
wordList[699]="switch";
wordList[700]="taelia";
wordList[701]="talbuk";
wordList[702]="talent";
wordList[703]="tanaan";
wordList[704]="taunka";
wordList[705]="tauren";
wordList[706]="tectus";
wordList[707]="temple";
wordList[708]="tendon";
wordList[709]="thekal";
wordList[710]="thorim";
wordList[711]="thorns";
wordList[712]="thrall";
wordList[713]="thrash";
wordList[714]="threat";
wordList[715]="tinder";
wordList[716]="tirion";
wordList[717]="tortos";
wordList[718]="treant";
wordList[719]="turkey";
wordList[720]="turnip";
wordList[721]="turtle";
wordList[722]="tushui";
wordList[723]="ulduar";
wordList[724]="undead";
wordList[725]="unholy";
wordList[726]="vampyr";
wordList[727]="varian";
wordList[728]="vectis";
wordList[729]="vellum";
wordList[730]="virmen";
wordList[731]="vision";
wordList[732]="violet";
wordList[733]="vivify";
wordList[734]="volley";
wordList[735]="voodoo";
wordList[736]="vorrik";
wordList[737]="vrykul";
wordList[738]="vulpin";
wordList[739]="warden";
wordList[740]="warder";
wordList[741]="weapon";
wordList[742]="wicker";
wordList[743]="wisdom";
wordList[744]="wolvar";
wordList[745]="worgen";
wordList[746]="wraith";
wordList[747]="wyvern";
wordList[748]="xavius";
wordList[749]="zeliek";
wordList[750]="abyssal";
wordList[751]="account";
wordList[752]="acherus";
wordList[753]="aethril";
wordList[754]="agility";
wordList[755]="alchemy";
wordList[756]="algalon";
wordList[757]="alleria";
wordList[758]="alterac";
wordList[759]="aluneth";
wordList[760]="ancient";
wordList[761]="anglers";
wordList[762]="anguish";
wordList[763]="antorus";
wordList[764]="arakkoa";
wordList[765]="artisan";
wordList[766]="ashvane";
wordList[767]="attumen";
wordList[768]="auction";
wordList[769]="auriaya";
wordList[770]="avenger";
wordList[771]="azeroth";
wordList[772]="azgalor";
wordList[773]="azshara";
wordList[774]="balance";
wordList[775]="baleroc";
wordList[776]="banshee";
wordList[777]="barrage";
wordList[778]="barrier";
wordList[779]="barrens";
wordList[780]="berserk";
wordList[781]="bethekk";
wordList[782]="boralus";
wordList[783]="brawler";
wordList[784]="breaker";
wordList[785]="bulwark";
wordList[786]="buzzard";
wordList[787]="cabbage";
wordList[788]="captain";
wordList[789]="carrion";
wordList[790]="censure";
wordList[791]="charged";
wordList[792]="charger";
wordList[793]="cheatah";
wordList[794]="chicken";
wordList[795]="chromie";
wordList[796]="citadel";
wordList[797]="classic";
wordList[798]="cleanse";
wordList[799]="command";
wordList[800]="conduit";
wordList[801]="control";
wordList[802]="cooking";
wordList[803]="counter";
wordList[804]="crawdad";
wordList[805]="cricket";
wordList[806]="crusade";
wordList[807]="crystal";
wordList[808]="cupcake";
wordList[809]="curator";
wordList[810]="cyclone";
wordList[811]="dalaran";
wordList[812]="dargrul";
wordList[813]="defense";
wordList[814]="demonic";
wordList[815]="deviate";
wordList[816]="diamond";
wordList[817]="diffuse";
wordList[818]="disable";
wordList[819]="disease";
wordList[820]="disrupt";
wordList[821]="draenei";
wordList[822]="draenor";
wordList[823]="drogbar";
wordList[824]="dungeon";
wordList[825]="durotan";
wordList[826]="durotar";
wordList[827]="ebonroc";
wordList[828]="eclipse";
wordList[829]="eitrigg";
wordList[830]="emerald";
wordList[831]="emporer";
wordList[832]="essence";
wordList[833]="exalted";
wordList[834]="fallout";
wordList[835]="fatigue";
wordList[836]="feather";
wordList[837]="felmyst";
wordList[838]="feltail";
wordList[839]="felwart";
wordList[840]="felweed";
wordList[841]="felwood";
wordList[842]="feralas";
wordList[843]="firefly";
wordList[844]="firemaw";
wordList[845]="fishing";
wordList[846]="fortune";
wordList[847]="fritter";
wordList[848]="furbolg";
wordList[849]="garalon";
wordList[850]="garrosh";
wordList[851]="gazlowe";
wordList[852]="general";
wordList[853]="gilneas";
wordList[854]="glowing";
wordList[855]="grapple";
wordList[856]="grummle";
wordList[857]="gryphon";
wordList[858]="gundrak";
wordList[859]="harpoon";
wordList[860]="harvest";
wordList[861]="helboar";
wordList[862]="helheim";
wordList[863]="honored";
wordList[864]="huhuran";
wordList[865]="hydross";
wordList[866]="illidan";
wordList[867]="inferno";
wordList[868]="justice";
wordList[869]="karabor";
wordList[870]="kargath";
wordList[871]="khadgar";
wordList[872]="kilrogg";
wordList[873]="kormrok";
wordList[874]="krokuun";
wordList[875]="kvaldir";
wordList[876]="leather";
wordList[877]="liadrin";
wordList[878]="loatheb";
wordList[879]="lobster";
wordList[880]="lullaby";
wordList[881]="madness";
wordList[882]="maexxna";
wordList[883]="malygos";
wordList[884]="mammoth";
wordList[885]="marshal";
wordList[886]="mastery";
wordList[887]="mastiff";
wordList[888]="mathias";
wordList[889]="mimiron";
wordList[890]="mithril";
wordList[891]="moonkin";
wordList[892]="morchok";
wordList[893]="mudfish";
wordList[894]="mulgore";
wordList[895]="nagrand";
wordList[896]="nathria";
wordList[897]="nazgrim";
wordList[898]="neutral";
wordList[899]="nourish";
wordList[900]="octopus";
wordList[901]="offhand";
wordList[902]="ossuary";
wordList[903]="outland";
wordList[904]="outpost";
wordList[905]="overrun";
wordList[906]="paladin";
wordList[907]="peacock";
wordList[908]="penance";
wordList[909]="penguin";
wordList[910]="phoenix";
wordList[911]="pocopoc";
wordList[912]="podling";
wordList[913]="polearm";
wordList[914]="prestor";
wordList[915]="pretzel";
wordList[916]="private";
wordList[917]="prophet";
wordList[918]="provoke";
wordList[919]="pudding";
wordList[920]="raccoon";
wordList[921]="radiant";
wordList[922]="ragveil";
wordList[923]="rapture";
wordList[924]="ratchet";
wordList[925]="ravager";
wordList[926]="reagent";
wordList[927]="redoubt";
wordList[928]="reforge";
wordList[929]="revered";
wordList[930]="reverse";
wordList[931]="revival";
wordList[932]="riposte";
wordList[933]="rotface";
wordList[934]="rukhmar";
wordList[935]="saberon";
wordList[936]="sanctum";
wordList[937]="scorpid";
wordList[938]="scourge";
wordList[939]="screech";
wordList[940]="scryers";
wordList[941]="serpent";
wordList[942]="sethekk";
wordList[943]="shackle";
wordList[944]="shannox";
wordList[945]="shatter";
wordList[946]="shimmer";
wordList[947]="shuffle";
wordList[948]="silence";
wordList[949]="skovald";
wordList[950]="smolder";
wordList[951]="snobold";
wordList[952]="soldier";
wordList[953]="sparkle";
wordList[954]="special";
wordList[955]="spectre";
wordList[956]="spitter";
wordList[957]="stagger";
wordList[958]="stalagg";
wordList[959]="stamina";
wordList[960]="stonard";
wordList[961]="strudel";
wordList[962]="sunfire";
wordList[963]="sunwell";
wordList[964]="suramar";
wordList[965]="tactics";
wordList[966]="talador";
wordList[967]="talanji";
wordList[968]="tanaris";
wordList[969]="tandred";
wordList[970]="templar";
wordList[971]="thistle";
wordList[972]="thorium";
wordList[973]="thunder";
wordList[974]="tillers";
wordList[975]="torment";
wordList[976]="torpedo";
wordList[977]="torrent";
wordList[978]="trample";
wordList[979]="trinity";
wordList[980]="trinket";
wordList[981]="tsulong";
wordList[982]="tuskarr";
wordList[983]="typhoon";
wordList[984]="tyrande";
wordList[985]="uldaman";
wordList[986]="unicorn";
wordList[987]="utgarde";
wordList[988]="valiona";
wordList[989]="vanilla";
wordList[990]="venison";
wordList[991]="vereesa";
wordList[992]="vexiona";
wordList[993]="vulpera";
wordList[994]="vulture";
wordList[995]="warlock";
wordList[996]="warlord";
wordList[997]="warrior";
wordList[998]="warsong";
wordList[999]="wendigo";
wordList[1000]="yaungol";

}
