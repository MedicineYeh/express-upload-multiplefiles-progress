$(function() {
	var showInfo = function(message) {
		$('div.progress').hide();
		$('strong.message').text(message);
		$('div.alert').show();
	};

	$('input[type="submit"]').on('click', function(evt) {
		evt.preventDefault();
		$('div.progress').show();
		var formData = new FormData();
		var files = document.getElementById('myFile').files;
		for (var i = 0; i < files.length; i++) {
			formData.append("upload_files", files[i]);
		}
		var xhr = new XMLHttpRequest();

		//Do the upload on another thread
		xhr.open('post', '/', true);

		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				var percentage = (e.loaded / e.total) * 100;
				$('div.progress div.bar').css('width', percentage + '%');
			}
		};

		xhr.onerror = function(e) {
			showInfo('An error occurred while submitting the form. Maybe your file is too big');
		};

		xhr.onload = function() {
			showInfo(this.statusText);
		};

		xhr.send(formData);

	});
});
