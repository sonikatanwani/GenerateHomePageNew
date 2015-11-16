var cheerio = require('cheerio');
var sizeOf = require('image-size');
var xlsx = require('node-xlsx');

module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            src: '',
            files: '*.html',
            tasks: ['copy-part-of-file'],
            options: {
                nospawn: true
            }
        },

        prettify: {
            options: {
                "indent": 2,
                "indent_char": " ",
                "indent_scripts": "normal",
                "wrap_line_length": 0,
                "brace_style": "collapse",
                "preserve_newlines": true,
                "max_preserve_newlines": 1,
                "unformatted": [
                    "a",
                    "code",
                    "pre"
                ]
            },
            one: {
                src: '<%=watch.src%>/homepage.html',
                dest: '<%=watch.src%>/homepage.html'
            }
        }
    });

   // grunt.loadNpmTasks('grunt-debug-inspector');
    grunt.loadNpmTasks('grunt-prettify');

    grunt.registerTask('createHTML', function() {


        var excelData;

        if (grunt.file.exists(grunt.config.get("watch.src") + '/linking_doc.xlsx')) {
            excelData = xlsx.parse(grunt.config.get("watch.src") + '/linking_doc.xlsx');
        }

        var genericExplicitStyles = 'body.NavAppHomePage #bd {width: 960px !important; border:none !important;line-height: 0px !important;} #globalContentContainer .row div { padding-right: 0;}';


         function addImageStyle(imageId, width, height) {
         genericExplicitStyles += "#" + imageId + "{display : inline-block ; float:left; width:" + width + "px !important; height:" + height + "px !important;}";
         }



        function addFloaterImageStyle(imageId, width, height) {
            genericExplicitStyles += "#" + imageId + "{ width:" + width + "px !important; height: " + height + "px !important;}";
        }

        function addBlockGridStyle(divClassName ){
            var divClassName = divClassName;
            genericExplicitStyles += "." + divClassName+ " ul{margin: 0px!important; padding:0px !important}" ;
            genericExplicitStyles += "." + divClassName+ " ul li{margin: 0px!important; padding:0px !important}" ;

        }

        function ApplyFoundation(currentImageCounter, colCount) {
            var currentImageCounter = parseInt(currentImageCounter);
            var colCount = parseInt(colCount);
            var divRow = $('<div/>');

            if(colCount !=1){
            divRow.attr("class", "row collapse");

            for (var k = 0; k < colCount; k++){
                var divCol = $('<div/>');
                divCol.attr("class", "small-" + imageSize[currentImageCounter].width / 60 + " columns");

                var img = $('<img/>');
                img.attr("src", 'images/' + images[currentImageCounter]);
                img.attr("width", imageSize[currentImageCounter].width);
                img.attr("height", imageSize[currentImageCounter].height);
                img.attr("usemap", '#HP_map' + currentImageCounter);
                img.attr("alt", ' ');

                divCol.append(img);
                divRow.append(divCol);
                currentImageCounter += 1;

            }
            }else{
                divRow.attr("class", "row");
                var divCol = $('<div/>');
                divCol.attr("class", "small-16 columns");

                var img = $('<img/>');
                img.attr("src", 'images/' + images[currentImageCounter]);
                img.attr("width", imageSize[currentImageCounter].width);
                img.attr("height", imageSize[currentImageCounter].height);
                img.attr("usemap", '#HP_map' + currentImageCounter);
                img.attr("alt", ' ');

                divCol.append(img);
                divRow.append(divCol);
                currentImageCounter += 1;
            }
            return divRow;

        }


        function ApplyGenericStyle(currentImageCounter, colCount) {
            var divRow = $('<div/>');
            divRow.attr("style", "display:block;");
            var currentImageCounter = parseInt(currentImageCounter);
            var colCount = parseInt(colCount);

            for (var k = 0; k < colCount; k++) {
                var img = $('<img/>');
                var imageId = currentImageCounter;
                img.attr("id", "img_" + imageId);
                img.attr("src", 'images/' + images[currentImageCounter]);
                img.attr("width", imageSize[currentImageCounter].width);
                img.attr("height", imageSize[currentImageCounter].height);
                img.attr("usemap", '#HP_map' + currentImageCounter);
                img.attr("alt", ' ');
                addImageStyle("img_" + imageId, imageSize[currentImageCounter].width, imageSize[currentImageCounter].height);

                divRow.append(img);
                currentImageCounter += 1;
            }

            return divRow;

        }


        function ApplyBlockGrid(currentImageCounter, colCount, applyBlock) {
            var currentImageCounter = parseInt(currentImageCounter);
            var colCount = parseInt(colCount);
            var applyBlock = applyBlock;

            var divRow = $('<div/>');
            divRow.attr("class", "row collapse");
            divRow.addClass("block_grid");
            var ul = $('<ul/>');
            ul.attr("class", "small-block-grid-" + colCount);
            divRow.append(ul);

            for (var k = 0; k < colCount; k++) {
                var li = $('<li/>');
                var img = $('<img/>');
                img.attr("src", 'images/' + images[currentImageCounter]);
                img.attr("width", imageSize[currentImageCounter].width);
                img.attr("height", imageSize[currentImageCounter].height);
                img.attr("usemap", '#HP_map' + currentImageCounter);
                img.attr("alt", ' ');
                li.append(img);
                ul.append(li);
                currentImageCounter += 1;

            }

            if(applyBlock){
                addBlockGridStyle("block_grid");
            }
            return divRow;


        }

        $ = cheerio.load('');

        var images = [];
        var imageSize = [];
        var floaterImageSize;
        var foundation = true;
        var blockGrid = true;
        var imageCounter = 0;
        var blockInstance = true;


        grunt.file.recurse(grunt.config.get("watch.src") + '/images', function (abspath, rootdir, subdir, filename) {

            var pngType = filename.match('png' + "$") == 'png';
            var jpgType = filename.match('jpg' + "$") == 'jpg';
            var jpegtype = filename.match('jpeg' + "$") == 'jpeg';

            if (pngType || jpgType || jpegtype) {

                if (filename == 'floater.png') {
                    floaterImageSize = sizeOf(abspath);
                }
                else {
                    images.push(filename);
                    imageSize.push(sizeOf(abspath));
                }
            }
        });

        var columnDetails = grunt.option('columnDetails');

        var rowDetails = columnDetails.split(',');

        var mainHTML = $('<html/>');
        var head = $('<head/>');
        var style = $('<link rel="stylesheet" href="../macy-base.css" type="text/css"/>');
        var style1 = $('<link rel="stylesheet" href="../responsive-home.css" type="text/css"/>');
        var style2 = $('<link rel="stylesheet" href="../home.responsive_css-min-2.css" type="text/css"/>');
        var style3 = $('<link rel="stylesheet" href="../quickbag.css" type="text/css"/>');
        var style4 = $('<link rel="stylesheet" href="../avenirblack.css" type="text/css"/>');

        var jqueryScript = $('<script type="text/javascript" src="../jquery-2.1.4.min.js" />');

        head.append(style);
        head.append(style1);
        head.append(style2);
        head.append(style3);
        head.append(style4);


        head.append(jqueryScript);

        var body = $('<body style="width: 960px"/>');

        mainHTML.append(head);
        mainHTML.append(body);

        $.root().append(mainHTML);

        /*scrolling side roll ad code starts  */

        if (grunt.option('floater')) {
            var floaterHtml = grunt.file.read('floater_html.txt');
            var floaterScript = grunt.file.read('floater_script.txt');
            var floaterStyle = grunt.file.read('floater_style.txt');

            head.append(floaterStyle);
            head.append(floaterScript);
            body.append(floaterHtml);

            if (floaterImageSize == undefined) {
                //throw error that image not found for floater
                grunt.util.error('floating parameter set but no image for floater');
            }
            else {
                $("#floatingImage").attr('src', 'images/floater.png');
                $("#floatingImage").attr('width', floaterImageSize.width);
                $("#floatingImage").attr('height', floaterImageSize.height);
                addFloaterImageStyle('floatingImage', floaterImageSize.width, floaterImageSize.height);

            }

        }

        var imageCounter = 0;


        fOuter:   for (var i = 0; i < rowDetails.length; i++) {

            if (parseInt(rowDetails[i]) != 1) {
                fInner:   for (var j = 0; j < rowDetails[i]; j++) {
                    if (imageSize[imageCounter + j].width % 60 != 0) {
                        foundation = false;
                        break fInner;
                    }
                }
            } else {
                foundation = true;
                if(imageSize[imageCounter].width % 60 != 0) {
                    grunt.warn("image not cut properly 960px. Please cut and again run the task");
                }

            }

        if (foundation) {
            var row = ApplyFoundation(imageCounter, rowDetails[i]);
            body.append(row);
            imageCounter = imageCounter + parseInt(rowDetails[i]);

        } else {

            block:   for (var j = 0; j < rowDetails[i]; j++) {
                if (imageSize[imageCounter].width != imageSize[imageCounter + j].width) {
                    blockGrid = false;
                    grunt.warn("image not properly cut. can't apply any foundation class");
                    break block;

                }
            }

            if (blockGrid) {
                var row = ApplyBlockGrid(imageCounter, rowDetails[i],blockInstance);
                body.append(row);
                imageCounter = imageCounter + parseInt(rowDetails[i]);
                blockInstance = false;
            } else {

                var row = ApplyGenericStyle(imageCounter, rowDetails[i]);
                body.append(row);
                imageCounter = imageCounter + parseInt(rowDetails[i]);

            }
        }

        foundation = true;
        blockGrid = true;

    }

        if (genericExplicitStyles != '') {
            head.append('<style>' + genericExplicitStyles + '</style>');
        }





        for (var i = 0; i < imageCounter; i++) {
                var map = $('<map/>');
                map.attr("name", 'HP_map' + i);

                var fileName = images[i];


                if (excelData != undefined && excelData.length > 0 && excelData[0].data != undefined){
                    excelData[0].data.forEach(function(value){
                        if (value[0] == fileName){
                            var area = $('<area/>');

                            area.attr('coords','10,2,3,12');
                            area.attr('href', value[1]);
                            area.attr('alt',value[2]);
                            map.append(area);
                        }
                    })
                };

                body.append(map);
            }


            grunt.file.write(grunt.config.get("watch.src") + "/homepage.html", $.html());

        });


    grunt.registerTask('createTemplate', function(val) {
        grunt.config.set('watch.src', val);
        grunt.task.run('createHTML');
        grunt.task.run('prettify');

    });

}