// Function to embed the video dynamically
function embedVideo(videoUrl, width = '640', height = '360') {
    var videoContainer = document.getElementById('video-container');

    // Create the <video> element
    var videoElement = document.createElement('video');
    videoElement.width = width;
    videoElement.height = height;
    videoElement.controls = true;  // Adds play, pause, volume controls

    // Create the <source> element
    var videoSource = document.createElement('source');
    videoSource.src = videoUrl;
    videoSource.type = 'video/mp4'; // Adjust the type based on the video format

    // Append the source element to the video element
    videoElement.appendChild(videoSource);

    // Append the video element to the video container
    videoContainer.appendChild(videoElement);
}

// Example usage: Calling the function with a video URL
embedVideo('https://drive.google.com/file/d/1ZGmN_PuFsYWopVUEA6HgSGso8bBwrfRm/view?usp=drive_link');