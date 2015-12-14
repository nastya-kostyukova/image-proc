
$( document ).ready(function() {

    var sliderBrightness = new slider('slBrightness', 400, -100, 100, 1, document.getElementById('infoBrightness')),
        sliderContrast = new slider('slContrast', 400, -100, 100, 1, document.getElementById('infoContrast')),
        sliderHue = new slider('slHue', 400, -100, 100, 1, document.getElementById('infoHue')),
        sliderSaturation = new slider('slSaturation', 400, -100, 100, 1, document.getElementById('infoSat')),
        sliderRadius = new slider('slRadius', 400, 0, 200, 1, document.getElementById('infoRadius')),
        sliderStrength = new slider('slRadius', 400, 0, 200, 1, document.getElementById("infoStrength")),
        sliderBlur = new slider('slBlur', 400, 0, 200, 1, document.getElementById("infoBlur")),
        sliderSize = new slider('slSize', 400, 0, 200, 1, document.getElementById('infoSize')),
        sliderAmount = new slider('slAmount', 400, 0, 200, 1, document.getElementById('infoAmount')),
        sliderSepia = new slider('slSepia', 400, 0, 200, 1, document.getElementById('infoSepia')),
        sliderDenoise = new slider('slDenoise', 400, 0, 200, 1, document.getElementById('infoDenoise')),
        sliderNoise = new slider('slNoise', 400, 0, 200, 1, document.getElementById('infoNoise')),
        sliderInk = new slider('slInk', 400, 0, 200, 1, document.getElementById('infoInk')),
        sliderHexagonalPixelate = new slider('slHexagonalPixelate', 400, 1, 200, 1, document.getElementById('infoHexagonalPixelate')),
        sliderDotScreenAngle = new slider('slDotAngle', 400, 0, 200, 1, document.getElementById('infoDotAngle')),
        sliderDotSize = new slider('slDotSize', 400, 1, 200, 1, document.getElementById('infoDotSize')),
      //  sliderColorHalftone = new slider('slColorHalftone', 400, 0, 200, 1, document.getElementById('infoColorHalftone')),
        isChanged = false,
        imageBase64;
    sliderBrightness.setValue(0);
    sliderContrast.setValue(0);
    sliderHue.setValue(0);
    sliderSaturation.setValue(0);
    sliderRadius.setValue(0);
    sliderStrength.setValue(0);
    sliderBlur.setValue(0);
    sliderSize.setValue(0);
    sliderAmount.setValue(0);
    sliderSepia.setValue(0);
    sliderDenoise.setValue(0);
    sliderNoise.setValue(0);
    sliderInk.setValue(0);
    sliderHexagonalPixelate.setValue(1);
    sliderDotScreenAngle.setValue(0);
    sliderDotSize.setValue(1);

    $('#cropBtn').on('click', function(e){
        crop();
    });

    $('#find-faces').on('click', function(e) {
        findFaces();
    });
    $('#hide-faces').on('click', function(e) {
        $('.border-face').remove();
    });


    $('#saveBtn').on('click', function(e) {
        var img = new Image();
        canvas.update();
        img.src = canvas.toDataURL();
        img.onload = function () {
            texture = canvas.texture(img);
            canvas.draw(texture).update();
            $('#result').attr('src',img.src);

            sliderBrightness.setValue(0);
            sliderContrast.setValue(0);
            sliderHue.setValue(0);
            sliderSaturation.setValue(0);
            sliderRadius.setValue(0);
            sliderStrength.setValue(0);
            sliderSize.setValue(0);
            sliderAmount.setValue(0);
            sliderSepia.setValue(0);
            sliderHexagonalPixelate.setValue(1);
            sliderDotScreenAngle.setValue(0);
            sliderDotSize.setValue(1);
        }
    });

    document.getElementById("openFile").addEventListener("click", function(e) {
        e.preventDefault();
        $("#browse").trigger('click');
    });

    $('#output').css('paddingLeft', '5%');

    var canvas = fx.canvas(),
        texture,
        defaultTexture;

    $('#result').append(canvas);

    var coords,
        jcrop_api,
        data_caman_id = 1;

    function convertToDataURLviaCanvas(callback){
        var dataURL = canvas.toDataURL();
        callback(dataURL);
    }

    function blobToFile(theBlob, fileName){
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }


    function crop() {

        var url ='/Jcrop/demos/crop.php';

        canvas.update();
        var cv = $('canvas')[0];
        var dataFile = canvas.toDataURL('image/png');

        var data = {
            file: dataFile,
            x: coords.x,
            x2: coords.x2,
            y: coords.y,
            y2: coords.y2,
            height: coords.h,
            width: coords.w
        };

        jcrop_api.release();

        $("#result").width(data.width).height(data.height);

        $.ajax({
            url: url,
            method: 'POST',
            data: data
        }).done(function(url) {

            convertToDataURLviaCanvas(function(base64Img){
                //file = base64Img;

                function getBase64Image(img) {
                    // Create an empty canvas element
                    var cv = document.createElement("canvas");
                    cv.width = img.width;
                    cv.height = img.height;

                    // Copy the image contents to the canvas
                    var ctx = cv.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    // Get the data-URL formatted image
                    // Firefox supports PNG and JPEG. You could check img.src to
                    // guess the original format, but be aware the using "image/jpg"
                    // will re-encode the image.
                    var dataURL = cv.toDataURL("image/png");

                    return dataURL;
                }

                    filter = '';
                    var _img = new Image();
                    _img.onload = function() {
                        texture = canvas.texture(_img);
                        canvas.draw(texture).update();
                        canvas.width = data.width;
                        canvas.height = data.height;
                        canvas.update();

                        jcrop_api.setImage(url,function(){
                            jcrop_api = this;
                            //file = _img;
                        });

                        if (canvas.scale)
                            canvas.scale(1,1);

                        canvas.update();

                        dataFile = getBase64Image(_img);
                        var blob = dataURLtoBlob(dataFile);

                        file = new File([blob], "test.jpg");
                        $( ".border-face" ).remove();

                    };
                    _img.src = url;
            });
        });

    }

    function findFaces() {
        canvas.update();

        var src = 'sqface-master/findFaces.php',
            dataFile = canvas.toDataURL('image/png'),
            data = {
                file: dataFile
            };

        $.ajax({
            url: src,
            method: 'POST',
            data: data
        }).done(function(json) {
           // var data = JSON.parse(json);
            console.log(json);
            for(var i = 0; i < json.length;i++) {
                var face = document.createElement("DIV");
                face.className = "border-face";
                var elem = json[i];
                console.log(json);
                face.setAttribute("style", "    position: absolute;border: 2px dashed #535380;top: "+ json[i]['y1'] + "px;" +
                    "margin-left: "+ json[i]['x1'] + "px;" +
                    "height: "+ (json[i]['y2'] - json[i]['y1']) + "px;" +
                    "width: "+ (json[i]['x2'] - json[i]['x1'])  + "px;z-index: "+ (700 +i));
                $('.jcrop-holder').append(face);
            }
        });

    }

    var
        file
        , filter = 'hazyDays' // default filter
        , processing = false,
        result = $('#result');

    function _choose(state){
        choose.style.display = state ? '' : 'none';
        photoBooth.style.visibility = !state ? '' : 'hidden';
        photoBooth.style.height = !state ? '' : '20px';
    }

    // Open dialog
    FileAPI.event.on(browse, 'change', function (evt){
        file = FileAPI.getFiles(evt)[0];
        imageBase64 = file;
        //$( ".border-face" ).remove();
        if( file ){
            _applyFilter(true);
        }
    });

    // Set filter
        FileAPI.event.on(PresetFilters, 'click', function (evt) {
            var el = evt.target;

            if (!processing && el.tagName == 'A') {
                filter = el.dataset.preset;
                processing = {el: el, html: el.innerHTML};

                //document.getElementsByClassName('Active').remove('Active');
                if($('.Active').hasClass('Active'))
                    $('.Active').removeClass('Active');

                //el.innerHTML = 'Rendering&hellip;';
                el.className = 'Active';

                _applyFilter();
            }
        });

    function _applyFilter(loading){
        if( loading ){
            $('.loader').show();
        }

        output.style.display = '';

        /*var data = {
            x: coords && coords.x ? coords.x : 0,
            y: coords && coords.y ? coords.y: 0,
            height: coords && coords.h ? coords.h : 768,
            width: coords && coords.w ? coords.w : 1024
        };*/

        FileAPI.Image(file)
            .resize(1024, 768, 'max')
            .filter(filter)
            .get(function (err, img){
                $('.loader').hide();
                $('#sliders').css('visibility','visible');

                texture = canvas.texture(img);
                canvas.draw(texture).update();
                canvas.width = img.width;
                canvas.height = img.height;
                $('#result').width(img.width).height(img.height);

                if (!defaultTexture) {
                    defaultTexture = canvas.texture(img);
                    canvas.draw(defaultTexture).update();
                }
                data_caman_id++;

                if(jcrop_api && typeof jcrop_api.destroy === 'function') {
                   /* jcrop_api.destroy();

                   /* $('#output').prepend('<div id="result"></div>');
                    $('#result').append(img);

                    $('.jcrop-holder').width(img.width).height(img.height);
                    $('.jcrop-tracker').width(img.width).height(img.height);*/
                    //$('#result').width(img.width).height(img.height);
                }


                $('#result').Jcrop({
                    onChange:   showCoords,
                    onSelect:   showCoords,
                    onRelease:  showCoords
                },function(){
                    jcrop_api = this;
                });

                jcrop_api.setImage(canvas.toDataURL(),function(){
                    jcrop_api = this;
                    //file = _img;
                });

                function showCoords (c) {
                    coords = c;
                }

                if( processing ){
                    processing.el.innerHTML = processing.html;
                    processing = false;
                }
            })
        ;
    }

    isChanged = true;
    function brightnessContrastClick() {
        if (isChanged) {
            canvas.draw(texture).brightnessContrast(sliderBrightness.getValue()/100, sliderContrast.getValue()/100).update();
        }
    }
    function hueSaturationClick() {
        canvas.draw(texture).hueSaturation(sliderHue.getValue()/100, sliderSaturation.getValue()/100).update();
    }
    function unsharpMaskClick() {
        canvas.draw(texture).unsharpMask(sliderRadius.getValue(), sliderStrength.getValue()/40).update();
    }
    function blurClick() {
        canvas.draw(texture).triangleBlur(sliderBlur.getValue()).update();
    }
    function vingetteClick(){
        canvas.draw(texture).vignette(sliderSize.getValue()/200, sliderAmount.getValue()/200).update()
    }
    function sepiaClick(){
        canvas.draw(texture).sepia(sliderSepia.getValue()/200).update();
    }
    function denoiseClick() {
        canvas.draw(texture).denoise(parseInt(sliderDenoise.getValue()/4)).update();
    }
    function noiseClick() {
        canvas.draw(texture).noise(sliderNoise.getValue()/200).update();
    }
    function inkClick() {
        canvas.draw(texture).ink(sliderInk.getValue()/200).update();
    }
    function hexagonalPixelateClick() {
        canvas.draw(texture).hexagonalPixelate(canvas.width/2, canvas.height/2, sliderHexagonalPixelate.getValue()/2).update();
    }
    function  dotScreenClick() {
        canvas.draw(texture).dotScreen(canvas.width/2, canvas.height/2, sliderDotScreenAngle.getValue()/(200/ Math.PI / 2), sliderDotSize.getValue()/10).update();

    }
    $('#slBrightness').click(function(event) {
        brightnessContrastClick();
    });

    $('#slContrast').on('click', function(event) {
        brightnessContrastClick();
    });
    $('#slHue').on('click', function(event) {
        hueSaturationClick();
    });
    $('#slSaturation').on('click', function(event) {
        hueSaturationClick();
    });
    $('#slRadius').on('click', function(event) {
        unsharpMaskClick();
    });
    $('#slStrength').on('click', function(event) {
        unsharpMaskClick();
    });
    $('#slBlur').on('click', function(event) {
        blurClick();
    });
    $('#slSize').on('click', function(event) {
        vingetteClick();
    });
    $('#slAmount').on('click', function(event) {
        vingetteClick();
    });
    $('#slSepia').on('click', function(event) {
        sepiaClick();
    });
    $('#slDenoise').on('click', function(event) {
        denoiseClick();
    });
    $('#slNoise').on('click', function(event) {
        noiseClick();
    });
    $('#slInk').on('click', function(event) {
        inkClick();
    });
    $('#slHexagonalPixelate').on('click', function(event) {
        hexagonalPixelateClick();
    });
    $('#slDotAngle').on('click', function(event) {
        dotScreenClick();
    });
    $('#slDotSize').on('click', function(event) {
        dotScreenClick();
    });
    $('body').on('keyup', function(event) {
       if(event.keyCode === 27) {
           jcrop_api.release();
       }
    });

    $('#downloadFile').click(function(e) {
        var download = document.createElement('a'),
            src = $('#result').attr('src');
        download.href = src;
        download.download = 'result.png';
        download.click();
    });
});
