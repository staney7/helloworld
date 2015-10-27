/**
 * Created by jay on 2015/8/11.
 */
/*
    fileIndex的服务；
 */
angular.module('localdiskModule')
    .factory('localdiskService',function($rootScope){
    /*
     文件类型判断和文件类型的集合
     */
    var   image_types = ['gif', 'png', 'jpg', 'jpeg', 'bmp'];
    var  doc_types = ['bib', 'csv', 'dbf', 'dif', 'doc', 'docx', 'emf', 'eps', 'fodg', 'fodp', 'fods', 'fodt', 'htm', 'html', 'ltx', 'met', 'odd', 'odg', 'odp', 'ods', 'odt', 'otg', 'otp', 'ots', 'ott', 'pbm', 'pct', 'pct', 'pdb', 'pdf', 'pgm', 'pot', 'potm', 'ppm', 'pps', 'ppt', 'pptx', 'psw', 'pwp', 'pxl', 'ras', 'rtf', 'sda', 'sdc', 'sdd', 'sdw', 'slk', 'stc', 'std', 'sti', 'stw', 'svg', 'svm', 'sxc', 'sxd', 'sxi', 'sxw', 'tiff', 'txt', 'uop', 'uos', 'uot', 'vor', 'wmf', 'wps', 'xhtml', 'xls', 'xlsx', 'xlt', 'xml', 'xpm'];
    var  media_types = ['3g2', '3gp', '4xm', 'a64', 'aac', 'ac3', 'act', 'adf', 'adp', 'adts', 'adx', 'aea', 'afc', 'aiff', 'alaw', 'alsa', 'amr', 'anm', 'apc', 'ape', 'aqtitle', 'asf', 'ass', 'ast', 'au', 'avi', 'avm2', 'avr', 'avs', 'bfi', 'bin', 'bink', 'bit', 'bmv', 'boa', 'brstm', 'c93', 'caf', 'cavsvideo', 'cdg', 'cdxl', 'cine', 'concat', 'crc', 'data', 'daud', 'dfa', 'dirac', 'dnxhd', 'dsicin', 'dts', 'dtshd', 'dv', 'dv1394', 'dvd', 'dxa', 'ea', 'ea_cdata', 'eac3', 'epaf', 'f32be', 'f32le', 'f4v', 'f64be', 'f64le', 'fbdev', 'ffm', 'ffmetadata', 'film_cpk', 'filmstrip', 'flac', 'flic', 'flv', 'framecrc', 'framemd5', 'frm', 'g722', 'g723_1', 'g729', 'gsm', 'gxf', 'h261', 'h263', 'h264', 'hds', 'hevc', 'hls', 'hnm', 'ico', 'idcin', 'idf', 'iff', 'ilbc', 'image2', 'image2pipe', 'ingenient', 'ipmovie', 'ipod', 'ircam', 'ismv', 'iss', 'iv8', 'ivf', 'jacosub', 'jv', 'latm', 'lavfi', 'lmlm4', 'loas', 'lvf', 'lxf', 'm4a', 'm4v', 'matroska', 'md5', 'mgsts', 'microdvd', 'mj2', 'mjpeg', 'mkv', 'mlp', 'mm', 'mmf', 'mov', 'mp2', 'mp3', 'mp4', 'mpc', 'mpc8', 'mpeg', 'mpg', 'mpeg1video', 'mpeg2video', 'mpegts', 'mpegtsraw', 'mpegvideo', 'mpjpeg', 'mpl2', 'mpsub', 'msnwctcp', 'mtv', 'mulaw', 'mv', 'mvi', 'mxf', 'mxf_d10', 'mxg', 'nc', 'nistsphere', 'nsv', 'nut', 'nuv', 'ogg', 'oma', 'opus', 'oss', 'paf', 'pjs', 'pmp', 'psp', 'psxstr', 'pva', 'pvf', 'qcp', 'r3d', 'rawvideo', 'realtext', 'redspark', 'rl2', 'rm', 'rmvb', 'roq', 'rpl', 'rsd', 'rso', 'rtp', 'rtsp', 's16be', 's16le', 's24be', 's24le', 's32be', 's32le', 's8', 'sami', 'sap', 'sbg', 'sdl', 'sdp', 'sdr2', 'segment', 'shn', 'siff', 'smjpeg', 'smk', 'smoothstreaming', 'smush', 'sol', 'sox', 'spdif', 'speex', 'srt', 'subviewer', 'subviewer1', 'svcd', 'swf', 'tak', 'tedcaptions', 'tee', 'thp', 'tiertexseq', 'tmv', 'truehd', 'tta', 'tty', 'txd', 'u16be', 'u16le', 'u24be', 'u24le', 'u32be', 'u32le', 'u8', 'uncodedframecrc', 'v4l2', 'vc1', 'vc1test', 'vcd', 'v4l2', 'vivo', 'vmd', 'vob', 'vobsub', 'voc', 'vplayer', 'vqf', 'w64', 'wav', 'wmv', 'wc3movie', 'webm', 'webvtt', 'wsaud', 'wsvqa', 'wtv', 'wv', 'xa', 'xbin', 'xmv', 'xwma', 'yop', 'yuv4mpegpipe'];
    function fileJudge(fileName) {
        var temp=fileName.split(".");
        // alert(angular.toJson(temp));
        if (temp.length==1) return "OTHERS"

        var lastName=temp[temp.length-1];
        // alert(lastName);
        if (image_types.indexOf(lastName)!=-1){
            return "IMAGE";
        }
        if (doc_types.indexOf(lastName)!=-1){
            return "DOC";
        }
        if (media_types.indexOf(lastName)!=-1){
            return "MEDIA";
        }
    }




    function cmp(a,b){
        if (a.type!= b.type) return (a.type- b.type);
        if (a.name> b.name) return 1;
        return -1;
    }


    /*
     readEntries 的成功回调和失败回调；
     */
    function readEntriessuccess(entries) {
       // alert(angular.toJson(entries));
        $rootScope.fileIndex=[];
        $rootScope.$apply(function(){
            var i;
            for(i=0;i< entries.length;i++) {
                if (entries[i].name[0]=='.') continue;
                if (entries[i].isFile) {
                   // alert(entries[i].name)
                    var temp=fileJudge(entries[i].name);
                    if (temp=="IMAGE"){
                        $rootScope.fileIndex.push({
                            type:1,
                            name: entries[i].name,
                            imgPath: "icon fa fa-file-image-o fa-3x",
                            selectedBox: ""
                        });
                    } else if (temp=="DOC") {
                        $rootScope.fileIndex.push({
                            type:1,
                            name: entries[i].name,
                            imgPath: "icon fa fa-file-text fa-3x",
                            selectedBox: ""
                        });
                    } else if (temp=="MEDIA"){
                        $rootScope.fileIndex.push({
                            type:1,
                            name: entries[i].name,
                            imgPath: "icon fa fa-file-video-o fa-3x",
                            selectedBox: ""
                        });
                    } else if (temp=="OTHERS"){
                        $rootScope.fileIndex.push({
                            type:1,
                            name: entries[i].name,
                            imgPath: "icon fa fa-file fa-3x",
                            selectedBox: ""
                        });
                    }
                } else {
                    $rootScope.fileIndex.push({type:0,name: entries[i].name, imgPath: "icon ion-ios-folder fa-2x",Selected:false});
                }
            }
            $rootScope.fileIndex.sort(cmp);
            //alert(angular.toJson($rootScope.fileIndex));
         });
    };
    function readEntriesfail(error) {
        alert("Failed to list directory contents:" + error.code);
    }



    /*
        服务返回的主体；
     */
    var fileServer={
        /*
        entrydisplay:改变fileindex让界面改变；
         */
        EntryDisplay:function (entry){
            //alert(angular.toJson(entry));
            var reader=entry.createReader();
            reader.readEntries(readEntriessuccess,readEntriesfail);
        },

       /*
        检查文件类型
         */
        fileType: function(fileName){
            var i;
            var index=$rootScope.fileIndex;
            //alert(angular.toJson(index));
            for (i=0;i<index.length;i++){
                if (index[i].name==fileName){
                    if (index[i].type==0) return "ENTRY";
                    else {
                        return fileJudge(fileName);
                    }
                }
            }
        }

    }
    return fileServer;
})