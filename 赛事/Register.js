function changeSubmitAvailability(disable) {
  const btn = document.getElementById("buttonSubmit");
  btn.disabled = disable;
}

function getSubmitMode() {
  const select = document.getElementById("selectSubmitMode");
  return select.selectedOptions[0].value;
}
function checkSubmitAvailability() {
  const fileNameInput = document.getElementById("fileToBeUploaded");
  const groupNameInput = document.getElementById("groupName");
  const mode = getSubmitMode();
  const fileExists = !!fileNameInput.files[0];
  const groupSpecified = !!groupNameInput.value;
  const avail =
    (fileExists || ["delete", "download"].indexOf(mode) != -1) &&
    groupSpecified;
  changeSubmitAvailability(!avail);
}
function headers() {
  return new Headers({ "Content-Type": "application/json;charset=UTF-8" });
}
function token() {
  return "ba0e2aa15624320984c515ffbe0a2feb";
}
function baseURL() {
  return "https://gitee.com/api/v5/repos/AssistLGAG/yavatdata-repo/contents/championship/";
}
function getFileNameOnRemote() {
  const group = document.getElementById("groupName").value;
  return group + getFileType();
}
function getFileType(){
  var filename = document.getElementById("fileToBeUploaded").value;
  var fileType = filename.substring(filename.lastIndexOf('.'));
  if(fileType != ".doc" && fileType != ".docx" && fileType != ".xls" && fileType != ".xlsx"){
    alert("只接受word或者excel文件");
    return ".";
  }
  return fileType;
}
async function requestFile(fileNameOnRemote) {
  if (!fileNameOnRemote) throw fileNameOnRemote;
  const requestToGetSha = new Request(
    baseURL() + fileNameOnRemote + "?access_token=" + token(),
    { method: "get" }
  );
  return await fetch(requestToGetSha);
}
async function requestFileSha(fileNameOnRemote) {
  try {
    const responseToGetSha = await requestFile(fileNameOnRemote);
    const responseJSONToGetSha = await responseToGetSha.json();
    const sha = responseJSONToGetSha["sha"];
    if (!sha) throw responseJSONToGetSha;
    return sha;
  } catch (error) {
    alert("找不到注册文件！可能之前注册时队名有误或者被某个憨憨删掉了！");
    throw error;
  }
}
async function requestFileContent(fileNameOnRemote) {
  try {
    const responseToGetFile = await requestFile(fileNameOnRemote);
    const responseJSONToGetFile = await responseToGetFile.json();
    const content = responseJSONToGetFile["content"];
    if (!content) throw responseJSONToGetFile;
    return content;
  } catch (error) {
    alert("找不到注册文件！可能之前注册时队名有误或者被某个憨憨删掉了！");
    throw error;
  }
}

async function getFileContent() {
  const file = document.getElementById("fileToBeUploaded").files[0];
  const buffer = await file.arrayBuffer();
  const string = String.fromCharCode(...new Uint8Array(buffer));
  const base64 = window.btoa(string);
  return base64;
}

async function upload() {
  const fileContent = await getFileContent();
  const fileNameOnRemote = getFileNameOnRemote();

  const request = new Request(baseURL() + fileNameOnRemote, {
    method: "post",
    headers: headers(),
    body: JSON.stringify({
      access_token: token(),
      content: fileContent,
      message: "Create " + fileNameOnRemote,
    }),
  });
  const response = await fetch(request);
  if (!response.ok) alert("上传失败！原因为：" + (await response.text()));
}

async function update() {
  const fileNameOnRemote = getFileNameOnRemote();
  const sha = await requestFileSha(fileNameOnRemote);

  const fileContentToBeUploaded = await getFileContent();

  const request = new Request(baseURL() + fileNameOnRemote, {
    method: "put",
    headers: headers(),
    body: JSON.stringify({
      access_token: token(),
      sha: sha,
      content: fileContentToBeUploaded,
      message: "Update " + fileNameOnRemote,
    }),
  });
  const response = await fetch(request);
  if (!response.ok) alert("更新失败！原因为：" + (await response.text()));
}

async function download() {
  const fileNameOnRemote = getFileNameOnRemote();
  const content = await requestFileContent(fileNameOnRemote);
  const a = document.createElement("a");
  a.href =
    "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
    content;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function remove() {
  const fileNameOnRemote = getFileNameOnRemote();
  const sha = await requestFileSha(fileNameOnRemote);

  const request = new Request(baseURL() + fileNameOnRemote, {
    method: "delete",
    headers: headers(),
    body: JSON.stringify({
      access_token: token(),
      sha: sha,
      message: "Delete " + fileNameOnRemote,
    }),
  });
  const response = await fetch(request);
  if (!response.ok) alert("删除失败！原因为：" + (await response.text()));
}

async function submit() {
  const mode = getSubmitMode();

  changeSubmitAvailability(true);
  try {
    if (mode == "create") await upload();
    else if (mode == "update") await update();
    else if (mode == "delete") await remove();
    //else if (mode == "download") await download();
    else console.error("Unrecognized mode.");
  } catch (error) {
    alert(error);
  }
  changeSubmitAvailability(false);
}

// Add watcher
document
  .getElementById("groupName")
  .addEventListener("change", checkSubmitAvailability);
document
  .getElementById("fileToBeUploaded")
  .addEventListener("change", checkSubmitAvailability);
document
  .getElementById("selectSubmitMode")
  .addEventListener("change", checkSubmitAvailability);
