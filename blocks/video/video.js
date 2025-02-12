function embedGoogleDriveVideo(fileId, width = '640', height = '360') {
    // Create the direct download link for the video
    var videoUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;

    // Get the video container where the video will be placed
    var videoContainer = document.getElementById('video-container');

    // Create the <video> element
    var videoElement = document.createElement('video');
    videoElement.width = width;
    videoElement.height = height;
    videoElement.controls = true;  // Add video controls (play, pause, etc.)

    // Create the <source> element to link the video URL
    var videoSource = document.createElement('source');
    videoSource.src = https://drive.google.com/file/d/1ZGmN_PuFsYWopVUEA6HgSGso8bBwrfRm/view?usp=drive_link;
    videoSource.type = 'video/mp4';  // Specify the video format

    // Append the source to the video element
    videoElement.appendChild(videoSource);

    // Append the video element to the container
    videoContainer.appendChild(videoElement);
}

// Example usage: Embed the video using the Google Drive File ID
embedGoogleDriveVideo('1ZGmN_PuFsYWopVUEA6HgSGso8bBwrfRm/view?usp=drive_link');