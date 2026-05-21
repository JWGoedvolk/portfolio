function imageExists(path) {
    return new Promise(function(resolve) {
        if (!path) {
            resolve(false);
            return;
        }

        var image = new Image();

        image.onload = function() {
            resolve(true);
        };

        image.onerror = function() {
            resolve(false);
        };

        image.src = path;
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
                var exists = await imageExists(image.path);
                return exists ? image : null;
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
