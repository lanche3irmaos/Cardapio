const FOLDER_ID = '1CE6QK7FZw2aMHGQZJiswEbWOTz1kU9AK';

function doGet(e) {
  const action = e.parameter.action;
  const callback = e.parameter.callback;

  if(action === 'upload') {
    try {
      const params = JSON.parse(decodeURIComponent(e.parameter.data));
      const folder = DriveApp.getFolderById(FOLDER_ID);

      const imageBytes = Utilities.base64Decode(params.imageData);
      const blob = Utilities.newBlob(imageBytes, params.mimeType, params.fileName);

      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const fileId = file.getId();
      const url = 'https://drive.google.com/uc?export=view&id=' + fileId;

      const result = JSON.stringify({ url: url, fileId: fileId });
      return ContentService
        .createTextOutput(callback + '(' + result + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);

    } catch(err) {
      const result = JSON.stringify({ erro: err.toString() });
      return ContentService
        .createTextOutput(callback + '(' + result + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }

  // Rota padrão — health check
  const result = JSON.stringify({ status: 'online', projeto: 'Lanche 3 Irmãos' });
  if(callback) {
    return ContentService
      .createTextOutput(callback + '(' + result + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const folder = DriveApp.getFolderById(FOLDER_ID);

    const imageBytes = Utilities.base64Decode(params.imageData);
    const blob = Utilities.newBlob(imageBytes, params.mimeType, params.fileName);

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const url = 'https://drive.google.com/uc?export=view&id=' + fileId;

    return ContentService
      .createTextOutput(JSON.stringify({ url: url, fileId: fileId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ erro: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}