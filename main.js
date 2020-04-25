//Following the meeting of the Board of Governors of the European Schools
//It was decided that option 1 would be chosen as an alternative way to calculate the BAC's final grade
//This file is a "cleaned-up" version of the main 'script.js', whith unnecessary stuff being removed.

var pdfjsLib = window['pdfjs-dist/build/pdf'];

var test = true;

var genericA = "Error, please contact Victor Garvalov with the following message: ";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./imports/pdfjs-2.3.200-dist/build/pdf.worker.js";

var mainP = document.getElementById("main");

var initialText = "<p id=\"initialP\">Please select your first semester's report (the one you received after the pre-Bac) </p> <input type=\"file\" id=\"file-input\"  accept=\".pdf,application/pdf\"/> <label for=\"file-input\">Choose a file.</label><div id=\"orChoice\">Or <a href=\"\"id=\"inputC\">input your grades manually</a></div><p id=\"footer\">Note: the file is not sent to the servers and is only treated locally.</p>";


const semesterNames = ["Semestre","Semester","Termin","lukukausi","semestras","semestre","Lukuk.","sem.", "Halbjahr","félév","Term. 2","срок","ΕΞΑΜΗΝΟi", "sem"]; 
//Fix #2 : added "semestre" for the italians
//Fix #3 : added "Lukuk." for finnish; can remove "lukukausi" translation?
//Fix #4 : added "sem." for Portuguese; full support now?
//Fix #7 : added "Halbjahr" for Germans; well apparently #4 wasn't full support :c
//Fix #8 : added "félév" for Hungarian; we're going interscholar 
//Fix #11 : added "Term. 2" for Swedes
//Fix #?: sem for dutch

var subjects = [];
var grades = [];
var option1A =0;
var averageA1 =0;
var averageB1 =0;
var gradeValues = [];
var lastiD = 0;
var aInpOrderedList = [];
var bInpOrderedList = [];

resetView();

function resetView()
{
    if(test)console.log("reset");
  mainP.innerHTML = initialText;
  document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
  document.getElementById("inputC").addEventListener("click",function(e){e.preventDefault(); manInput(); });

  subjects = [];
  grades = [];
  option1A =0;
  averageA1 =0;
  averageB1 =0;
}

function manInput()
{
  let inH ="<div id=\"inputPage\"><p id=\"introT\">Please input your: </p>";
  inH += "<div id=\"aGrades\"><span class=\"inpGT\" id=\"aT\">A grades</span><div id=\"aInputs\">"+inputD(lastiD,false) +"</div></div>" + "<div id=\"bGrades\"><span class=\"inpGT\" id=\"bT\">B grades</span><div id=\"bInputs\">" + inputD(lastiD+1,false) +"</div></div>";
  aInpOrderedList.push(lastiD);
  lastiD ++;
  bInpOrderedList.push(lastiD);
  inH += "</br><p id=\"mI_note\">Do <b>NOT</b> include Ethics/Religion. If you have not been graded on a subject (i.e.:grade 'D'), don't write it.</p><div id=\"buttonsI\"><input class=\"but\" id=\"su\" type=\"submit\" value=\"Submit\"><input type=\"button\" id=\"return\" class=\"but blue\" value=\"Go back\"></div></div>";
  mainP.innerHTML = inH;


  document.getElementById("su").addEventListener("click",sub);
  document.getElementById("return").addEventListener("click",resetView);
  document.getElementsByClassName("imagePlus")[0].addEventListener("click",addNew);
  document.getElementsByClassName("imagePlus")[1].addEventListener("click",addNew);
}
function inputD(id,del= true)
{
  return "<div class=\"inpDiv\"><input type=\"number\" id=\"inputGrade" + (id<=9?("0"+id):id) +"\"  min=\"0.0\" max=\"10.0\" step=\"0.1\" value=\"\" class=\"inputG\">" + "<div class=\"imagePlus\" id=\"imPlus"+(id<=9?("0"+id):id)+"\"></div>" +(del ?  "<div class=\"imageDel\" id=\""+(id<=9? ("0"+id):id)+"\"></div>":"" ) + "</div>";
}

function sub()
{
  if(test) console.log("Submit: ");console.log(aInpOrderedList);console.log(bInpOrderedList);
  if(document.getElementsByClassName("inputG").length <=14)
  {
    alert("You have not inputted enough subjects");
    return;
  }
  for(let i=0;i<document.getElementsByClassName("inputG").length;i++)
  {
    let el = document.getElementsByClassName("inputG")[i];
    let val = el.value;
    if(val==10) val="10.0";
    if(val==0) val="0.0";
    let elId = el.getAttribute('id');
    let idNums = parseInt(elId[elId.length-2]) *10 + parseInt(elId[elId.length-1]);
    let typeOG ="";
    let gradePlace =-1;
    if(test)console.log(elId+ "     "+i);
    for(let j = 0;j<aInpOrderedList.length;j++)
    {
      if(idNums == aInpOrderedList[j])
      {
        typeOG = "A";
        gradePlace = j+1;
        break;
      }
      if(idNums == bInpOrderedList[j])
      {
        typeOG = "B";
        gradePlace = j+1;
        break;
      }
      
      console.log("No match:    /"+elId+"/       NUMS:"+idNums+":        A:"+aInpOrderedList[j]+":         B:"+bInpOrderedList[j]+":");
    }
    val.replace(',','.');
    if(val.length>=5 || (val.length<3 && val!="") || parseFloat(val)>10 || parseFloat(val)<0){
      
      alert("Wrong input on subject " + gradePlace +"\'s "+ typeOG +" grade. Make sure you write the exact numbers as those writtten on your report");
      return;
    }
    if(val =="")
    {
      if(test)console.log("error 1  :" +i);
      alert("Empty input on subject " + gradePlace +"'s "+ typeOG+" grade. Please complete it.");
      return;
    }
    
    grades.push(parseFloat(val)); 
    if(i==document.getElementsByClassName("inputG").length-1)
    {break;}
    if(i < document.getElementsByClassName("inputG").length/2)i+=(document.getElementsByClassName("inputG").length/2)-1;
    else i-=(document.getElementsByClassName("inputG").length/2);
  }
  if(test)console.log(grades);
  makeMath(grades.length/2, true);
}

function addNew()
{
  if(document.getElementsByClassName("imagePlus").length ==28)
  {
    alert("You've reached the maximum amount of subjects.");
    return;
  }
  let inpA = document.getElementById("aInputs");
  let inpB = document.getElementById("bInputs");
  lastiD++;
  inpA.insertAdjacentHTML("beforeend", inputD(lastiD,true));
  aInpOrderedList.push(lastiD);
  document.getElementById("imPlus"+(lastiD<=9?("0"+lastiD):lastiD)).addEventListener("click",addNew);
  document.getElementById((lastiD<=9?("0"+lastiD):lastiD)).addEventListener("click",function(e){del(e.target.getAttribute('id'));});
  lastiD++
  inpB.insertAdjacentHTML("beforeend", inputD(lastiD,true));
  document.getElementById("imPlus"+(lastiD<=9?("0"+lastiD):lastiD)).addEventListener("click",addNew);
  document.getElementById((lastiD<=9?("0"+lastiD):lastiD)).addEventListener("click",function(e){del(e.target.getAttribute('id'));});
  bInpOrderedList.push(lastiD);
  if(test) console.log(document.getElementsByClassName("imagePlus").length);
  if(test) console.log(aInpOrderedList);console.log(bInpOrderedList);
} 
function del(id){
  let idc = id;
  document.getElementById("inputGrade"+idc).parentElement.remove();
  if(test) console.log("" +idc);
  if(idc%2==0)
  {
    idc++;
    if(test) console.log("" +idc);
    document.getElementById("inputGrade"+(idc<=9? ("0"+idc):idc)).parentElement.remove();
  }
  else{
    idc--;
    if(test) console.log("" +idc);
    document.getElementById("inputGrade"+(idc<=9? ("0"+idc):idc)).parentElement.remove();
  }
  if(test)console.log(document.getElementsByClassName("imagePlus").length);
  if(test) console.log(aInpOrderedList);console.log(bInpOrderedList);
  for(let i=0;i<aInpOrderedList.length;i++)
  {
    if(id == aInpOrderedList[i])
    {
      aInpOrderedList.splice(i,1);
      bInpOrderedList.splice(i,1);
      break;
    } 
    else if(id == bInpOrderedList[i])
    {
      bInpOrderedList.splice(i,1);
      aInpOrderedList.splice(i,1);
      break;
    }
  }
}

function correctRound(floatN){ //Losing in prescision, gaining in aestethics
  
  if(Number.EPSILON == undefined) //We've got to include Internet Explorer support, right??
  {
    return Math.round((floatN + Math.pow(2,-52)) * 10000) / 10000;
  }
  return Math.round((floatN + Number.EPSILON) * 10000) / 10000;
}

function isLetter(str) {
    return str.length === 1 && (str.match(/[a-z]/i) || str.match(/[а-я]/i) || str.match(/[α-ω]/i) || str[0] == "ή"); //Added cyrilic + greek support
}

function getPDFText(pdfFile)
  {
    var pdf = pdfjsLib.getDocument(pdfFile);
    if(test) console.log(pdf);
    return pdf.promise.then(function(pdf) { // get all pages text
      var maxPages = pdf.numPages;
      if(test) console.log("maxPages var = " + maxPages);
      var countPromises = []; // collecting all page promises
      for (var j = 1; j <= maxPages; j++) {
        var page = pdf.getPage(j);
  
        var txt = "";
        countPromises.push(page.then(function(page) { // add page promise
          var textContent = page.getTextContent();
          return textContent.then(function(text){ // return content promise
            return text.items.map(function (s) { return s.str; }).join(''); // value page text 
          });
        }));
      }
      // Wait for all pages and join text
      return Promise.all(countPromises).then(function (texts) {
        return texts.join('');
      });
    });
}

function readSingleFile(e) {
  let extension ="";
  let fullName = this.value.split('.');
  extension += fullName[fullName.length -1];

  if(extension!= "pdf")
  {
    alert("Unsupported file type. Please make sure you upload a PDF file.");
    return;
  }
  
  var file = e.target.files[0];
  if (!file) {
    alert("Can't read file!");
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = new Uint8Array(e.target.result);
    analyseFile(contents);
  };
  reader.readAsArrayBuffer(file);
}

function analyseFile(fileC)
{
  /*
  var manualInput = true;
  if(manualInput)
  {
    var out = prompt("Data");
    analyseData(out);
  }*/
  
  mainP.innerHTML = "Processing data...";
  // waiting on gettext to finish completion, or error
  getPDFText(fileC).then(function (output) {
    analyseData(output);
  }, 
  function (reason) {
    console.error(reason);
  });
}

function analyseData(text)
{
  var textCopy = "";
  textCopy += text;
  if(test)console.log(textCopy);
  var lastI = 0;
  var languageLen = 0;
  for(let i = 0; i < semesterNames.length;i++)
  {
    lastI = textCopy.lastIndexOf(semesterNames[i]);
    if(lastI == -1)
    {
      if(i == semesterNames.length-1)
      {
        alert(genericA + "semester name not found");
      } 
      lastI = 0;
      continue;
    }
    else{
      languageLen = semesterNames[i].length;
      break;
    }
  }
  var toEnd = textCopy.lastIndexOf("*");
  var subS = textCopy.substring(lastI+languageLen,toEnd).replace(") *",'*');
  subS = subS.replace("(4 pamokos)","4 pamokos"); //Fix #1 : lithuanian report had 4 period in paranthesis
  subS = subS.replace("(protestanttinen)","protestanttinen"); //Fix #5: finnish report had that word in paranthesis
  subS = subS.replace("physique  ","physique"); //Fix #stopped counting: French EEB1? had 2 spaces after sports 'subject'
  if(test) console.log(subS);
  var previousI = 0;
  let dontTakeEthicsE = 0;
  let dontTakeEthicsS = 0;
  for(let i = 0;i<subS.length;i++)
  {
    let numOfTimes= 0;
    let mustBreak = false;
    if(i<=(subS.length -4) ) //Fix #10 : Apparently you can get a grade labeled as 'D' if you are unable to do a subject (e.g.: sports beacause your leg broke)
    {
      if(isLetter(subS[i]) && subS[i+1] == 'D' && subS[i+2] == 'D' && isLetter(subS[i+3])) //Last arg is for security
      {//The subject that was currently 'read' is not to be taken in average, as the student could not perform it during the semester
        //Reallllyyyyyy hope there isn't a language that has 'DD' in a subject's name
        //TODO: find a more thorough way to do that.
        i = i+2;
        previousI = i+1;
        continue;
      }
    }
    if(subS[i] == ')' || subS[i] == '*' || (isLetter(subS[i]) && (subS[i+1]  >= '0' && subS[i+1] <= '9' )))
    {
      if(subS[i] == '*') //In the case of ethics
      {
        dontTakeEthicsS = i;
        let imOutOfNames = 0;
        for(let a = i+1;a<subS.length;a++)
        {
          if((subS[a] >= '0' && subS[a] <= '9')|| subS[a] =='.') 
          {
            if(a!= subS.length-1) continue;
          }
          imOutOfNames = a;
          break;
        }
        i=imOutOfNames -1;
        dontTakeEthicsE = imOutOfNames;
        previousI = imOutOfNames; 
        continue;
      }
      if(test) console.log(dontTakeEthicsS + " " + dontTakeEthicsE);
      subjects.push(subS.substring(previousI,i+1));
      let gradeStart = i+1;
      let gStart = gradeStart;
      let gEnd = 0;
      for(let j = gradeStart;j<subS.length;j++)
      {
        if(j>=dontTakeEthicsS && j<=dontTakeEthicsE) break;
        if(j== subS.length-1)
        {
          mustBreak = true;
          grades.push(subS.substring(gStart,j+1));
          break;
        }
        if(subS[j]=='.')
        {
         grades.push(subS.substring(gStart,j+2));
         numOfTimes++;
         gStart = j+2;
         j++;
        }
        if(numOfTimes==2) 
        { 
          gEnd= j;
          break;
        }
      }
      previousI = gEnd+1;
    }
    if(mustBreak) break;
  }
  if(test) 
  {console.log(grades); console.log(subjects);}
  //Ended analysing; data fetched

  makeMath(subjects.length)
}

function makeMath(subjectL = 1, manualInput= false)
{
  for(let i=0;i<grades.length;i++)
  {
    if(i%2 == 0)
    {
      averageA1 += parseFloat(grades[i]);
      continue;
    }
    else
    {
      averageB1 += parseFloat(grades[i]);
    }
  }
  averageA1 = averageA1/(subjectL); 
  averageB1 = averageB1/ (subjectL);

  if(test)console.log("a: "+averageA1+"        "+"b: "+ averageB1);

  //Option 1
  option1A = (2/10) * averageA1 *2 + (6/10) * averageB1;
  if(test)console.log(option1A);


  //Check if correct subs.

  if(!manualInput)checkSubs();
  else changeView();
}

function checkSubs()
{
  let iH = "<div id=\"checkS\"><div id=\"subCT\"><span>Please check that all your subjects appear correctly (i.e. two subjects aren't on the same row, grades aren't incuded...). If anything looks out of place, please contact Victor Garvalov.</br></span></div><div id=\"note\"><i>Note:</i> Ethics/Religion is not included. Each subject is underlined for clarity.</div></br></br>";
  var wForm ="<form id=wSub>";
  for(let i = 0;i<subjects.length;i++)
  {
    let idW = "\"w" + i +"\""; 
    if(i%2==0) wForm +=  "<span id=" + idW +" class=\"bSub\">";
    else wForm +=  "<span id=" + idW +" class=\"gSub\">";
    wForm += subjects[i] + "</span></br>";
  }
  wForm+="</form>";
  iH += wForm + "</br><input class=\"but\" id=\"but\" type=\"submit\" value=\"Everything is correct\">";
  iH +="</div>";
  mainP.innerHTML = iH;
  
  document.getElementById("but").addEventListener("click",changeView);
}

function changeView()
{
  let iHtmlT = "<div id=\"finalR\"><p id=\"assuming\"><b><i>Assuming A1 = A2</i></b> (as you will most probalby get a <i>similar</i> A2 grade average as in the first semester)</p> </br>\
  <div id=\"bAv\"><b size=10>BAC average: </b> <span class=\"gradeC\">"+ correctRound(option1A) + "</span></div></br></br>\
  <form id=\"uni\" onSubmit=\"return false;\">\
    <label id=\"avInp\">Average needed to get into Uni: \
    <input type=\"number\" id=\"grade\"  min=\"0.0\" max=\"10.0\" step=\"0.01\" value=\"8\"></label>\
  </form></br>\
  <div><b>Required A2 average</b> to get requested uni grade: <div class=\"gradeC\" id=\"o1\">"+0 +"</div>\
  </div>\
  </br>";
  iHtmlT += "<input type=\"button\" id=\"resBut\" class=\"but blue\" value=\"Use new PDF report\"><div>"    //TODO: uncomment, prepare new functionality: MUST RESET ALL 'global' variables in resetView(); otherwise bugs when reset;
  mainP.innerHTML = iHtmlT;
  changeA();

  document.getElementById("resBut").addEventListener("click",resetView);
  
  document.getElementById("grade").addEventListener("change",function(event){
    event.preventDefault();
    changeA();});
}

function changeA()
{
  let gr = document.getElementById("grade").value;
  document.getElementById("o1").innerHTML = caluclateUA(gr);
}

function caluclateUA(newAverage)
{
    let result = (newAverage-(averageB1 * (6/10))-(averageA1 *(2/10))) * (10/2);
    if(result<0 || result>10) return "There is no way you are getting this grade.";
    else return correctRound(result);
}