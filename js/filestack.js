function openFilestack() {
  var client = filestack.init('AdAAjYLUqTSq0nSWvjcuBz');
  client.picker({
    accept: ['image/*'],
    maxFiles: 20,
    uploadInBackground: false,
    fromSources: ['local_file_system', 'imagesearch', 'url'],
    onUploadDone: function (result) {
      if (result.filesUploaded && result.filesUploaded.length > 0) {
        var success = document.getElementById('upload-success');
        var btn = document.getElementById('upload-btn');
        if (success) success.style.display = 'block';
        if (btn) btn.textContent = 'Upload More Photos';
      }
    }
  }).open();
}
