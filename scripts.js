var imageExtensions = [".apng", ".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"];
var videoExtensions = [".mp4", ".webm", ".ogg"];
var videoMimeTypes = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogg": "video/ogg"
};
var textMarkers = {
    "new line": "<br>",
    "line": "<br><hr class=\"text_separator\"><br>"
};

function getFileExtension(path) {
    var cleanPath = path
        .split("?")[0]
        .split("#")[0];

    return cleanPath.substring(cleanPath.lastIndexOf(".")).toLowerCase();
}

function getMediaType(path) {
    if (isTextOnlyMediaPath(path)) {
        return "text";
    }

    var extension = getFileExtension(path);

    if (imageExtensions.includes(extension)) {
        return "image";
    }

    if (videoExtensions.includes(extension)) {
        return "video";
    }

    return "";
}

function isTextOnlyMediaPath(path) {
    var normalizedPath = (path || "").trim().toLowerCase();

    return normalizedPath === "" || normalizedPath === "empty";
}

function getVideoMimeType(path) {
    return videoMimeTypes[getFileExtension(path)] || "";
}

function renderTextMarker(markerName) {
    var markerHtml = textMarkers[markerName.trim().toLowerCase()];

    return markerHtml || "|" + markerName + "|";
}

function formatStyledText(text) {
    return Handlebars.Utils.escapeExpression(text || "")
        .replace(/\|([^|]+)\|/g, function(match, markerName) {
            return renderTextMarker(markerName);
        });
}

Handlebars.registerHelper("formatText", function(text) {
    return new Handlebars.SafeString(formatStyledText(text));
});

function mediaExists(media) {
    return new Promise(function(resolve) {
        if (media.type === "text") {
            resolve(true);
            return;
        }

        if (!media.path || !media.type) {
            resolve(false);
            return;
        }

        var element = media.type === "video"
            ? document.createElement("video")
            : new Image();

        if (media.type === "video") {
            element.preload = "metadata";
        }

        element.onloadedmetadata = function() {
            resolve(true);
        };

        element.onload = function() {
            resolve(true);
        };

        element.onerror = function() {
            resolve(false);
        };

        element.src = media.path;
    });
}

$(document).ready(function() {
    var projectTemplate = $("#project-template").html();
    var compiledTemplate = Handlebars.compile(projectTemplate);

    $.getJSON("projects.json")
    .done(async function(data) {
        var projects = data.Projects || [];

        var projectData = await Promise.all(projects.map(async function(project, index) {
            var images = project.images || [];

            var checkedImages = await Promise.all(images.map(async function(image) {
                var mediaType = getMediaType(image.path || "");
                var media = Object.assign({}, image, {
                    isImage: mediaType === "image",
                    isTextOnly: mediaType === "text",
                    isVideo: mediaType === "video",
                    mimeType: getVideoMimeType(image.path || ""),
                    type: mediaType
                });

                var exists = await mediaExists(media);
                return exists ? media : null;
            }));

            return Object.assign({}, project, {
                images: checkedImages.filter(Boolean),
                isLast: index === projects.length - 1
            });
        }));

        var projectHtml = projectData.map(function(project) {
            return compiledTemplate(project);
        }).join("");

        $("#project-list").html(projectHtml);
    })
    .fail(function() {
        $("#project-list").html("<li>Projects could not be loaded.</li>");
    });
});
