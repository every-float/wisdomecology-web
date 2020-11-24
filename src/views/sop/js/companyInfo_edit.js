var form, layer, formSelects, upload;
$(function(){
    vm.coId = $.getUrlParam("coId");
    layui.use(['form', 'formSelects', 'layer', 'laydate', 'upload'], function(){
        form = layui.form;
        formSelects = layui.formSelects;
        layer = layui.layer,
        upload = layui.upload;
        var laydate = layui.laydate;

        // 提交日期
        laydate.render({
            elem:"#coWorkdate",
            trigger:"click",
            done:function(value, date, endDate){
                $("input[name=coWorkdate]").val(value);
            }
        });

        // 名录类别
        formSelects.render({
            name : 'conDatatype'
        });

        // 所属乡镇监听
        form.on('select(coTownship)',function(data){
            $("select[name=coTownship]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 注册类型监听
        form.on('select(coRetype)',function(data){
            $("select[name=coRetype]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 单位类别监听
        form.on('select(coCotype)',function(data){
            $("select[name=coCotype]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 企业规模监听
        form.on('select(coScale)',function(data){
            $("select[name=coScale]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 隶属关系监听
        form.on('select(coParent)',function(data){
            $("select[name=coParent]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 行业类别监听
        form.on('select(coIndtype)',function(data){
            $("select[name=coIndtype]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 流域编码监听
        form.on('select(coRiver)',function(data){
            $("select[name=coRiver]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });
        // 关注程度监听
        form.on('select(coAttention)',function(data){
            $("select[name=coAttention]").val(data.value);
            setTimeout(function(){form.render("select");},10)
        });

        // 保存监听
        form.on('submit(btnSave)', function(){
            var conDatatype = formSelects.value('conDatatype', 'val').join(",");
            $("select[name=conDatatype]").val(conDatatype);
            vm.saveInfo();
            return false;
        })

        vm.init();
    });
});

var vm = new Vue({
    el:"#webPage",
    data:{
        coId:"",
        townList:[],    // 乡镇列表
        companyType:[], // 行业类别

        // 上传文件列表
        fileList1:[],
        fileList2:[],
        fileList3:[],
        fileList4:[],
        fileList5:[],
        fileList6:[],
        fileList7:[],
        fileList8:[],
        fileList9:[],
        fileList10:[],
        fileList11:[],
        fileList12:[],
        fileList13:[],
    },
    methods:{
        init:function(){
            layer.load(2,{shade:0.5});
            vm.getTownList();
        },

        // 获取乡镇信息
        getTownList:function(){
            $.ajax({
                type:"get",
                url:URL_gb_areaTree,
                async:true,
                dataType:"json",
                data:{
                    parentId:"120111"
                },
                success:function(ret){
                    if(ret.code == 0){
                        vm.townList = ret.data.tree;
                        setTimeout(function(){
                            form.render("select");
                        }, 10);
                    }else{
                        layer.msg(ret.msg);
                    }
                },
                error:function(){
                    layer.msg("网络访问出错，未能获取到详情！");
                },
                complete:function(){
                    vm.getCompanyType();
                }
            })
        },

        // 获取行业类别
        getCompanyType:function(){
            $.ajax({
                type:"get",
                url:URL_get_company_type,
                dataType:"json",
                async:true,
                success:function(ret){
                    if(ret.code == 0){
                        vm.companyType = ret.data;
                        setTimeout(function(){
                            form.render("select");
                        }, 10);
                    }else{
                        layer.msg(ret.msg);
                    }
                },
                error:function(){
                    layer.msg("网络访问出错，未能获取到详情！");
                },
                complete:function(){
                    layer.closeAll("loading");
                    if(vm.coId){
                        vm.getDetail();
                    }else{
                        vm.getUploadTable(1,[]);
                        vm.getUploadTable(2,[]);
                        vm.getUploadTable(3,[]);
                        vm.getUploadTable(4,[]);
                        vm.getUploadTable(5,[]);
                        vm.getUploadTable(6,[]);
                        vm.getUploadTable(7,[]);
                        vm.getUploadTable(8,[]);
                        vm.getUploadTable(9,[]);
                        vm.getUploadTable(10,[]);
                        vm.getUploadTable(11,[]);
                        vm.getUploadTable(12,[]);
                        vm.getUploadTable(13,[]);
                    }
                }
            })
        },

        // 获取详情
        getDetail:function(){
            $.ajax({
                type:"get",
                url:URL_company_info_detail,
                dataType:"json",
                async:true,
                data:{
                    coId:vm.coId
                },
                success:function(ret){
                    if(ret.code == 0){
                        form.val('form1', {
                            "coName":ret.data.coName,
                            "coCode":ret.data.coCode,
                            "coTownship":ret.data.coTownship,
                            "coRetype":ret.data.coRetype,
                            "coCotype":ret.data.coCotype,
                            "coScale":ret.data.coScale,
                            "coParent":ret.data.coParent,
                            "coIndtype":ret.data.coIndtype,
                            "coRiver":ret.data.coRiver,
                            "conDatatype":ret.data.conDatatype,
                            "coAttention":ret.data.coAttention,
                            "coArea":ret.data.coArea,
                            "coWorkdate":ret.data.coWorkdate,
                            "coLongitude":ret.data.coLongitude,
                            "coLatitude":ret.data.coLatitude,
        
                            "coEpDepart":ret.data.coEpDepart,
                            "coEpPerson":ret.data.coEpPerson,
                            "coEpPhone":ret.data.coEpPhone,
                            "coEpNums":ret.data.coEpNums,
        
                            "coBuSocietycode":ret.data.coBuSocietycode,
                            "coBuPerson":ret.data.coBuPerson,
                            "coBuBank":ret.data.coBuBank,
                            "coBuAccount":ret.data.coBuAccount,
                            "coBuAddress":ret.data.coBuAddress,
        
                            "coTexphone":ret.data.coTexphone,
                            "coMobilephone":ret.data.coMobilephone,
                            "coEmail":ret.data.coEmail,
                            "coConaddress":ret.data.coConaddress,
                            "conSend":ret.data.conSend,
                            "conWebsite":ret.data.conWebsite,
                            "conPostcode":ret.data.conPostcode,

                            "conYjya":ret.data.conYjya,
                            "conGylc":ret.data.conGylc,
                            "conZyyfl":ret.data.conZyyfl,
                            "conWfgl":ret.data.conWfgl,
                            "conZyqk":ret.data.conZyqk
                        });
                        if(ret.data.filesHpsp){
                            vm.fileList1 = ObjectParse(ret.data.filesHpsp);
                        }
                        if(ret.data.filesYswd){
                            vm.fileList2 = ObjectParse(ret.data.filesYswd);
                        }
                        if(ret.data.filesJcbg){
                            vm.fileList3 = ObjectParse(ret.data.filesJcbg);
                        }
                        if(ret.data.filesJcqk){
                            vm.fileList4 = ObjectParse(ret.data.filesJcqk);
                        }
                        if(ret.data.filesCfqk){
                            vm.fileList5 = ObjectParse(ret.data.filesCfqk);
                        }
                        if(ret.data.filesHyxx){
                            vm.fileList6 = ObjectParse(ret.data.filesHyxx);
                        }
                        if(ret.data.filesYjya){
                            vm.fileList7 = ObjectParse(ret.data.filesYjya);
                        }
                        if(ret.data.filesBgjl){
                            vm.fileList8 = ObjectParse(ret.data.filesBgjl);
                        }
                        if(ret.data.filesCwjd){
                            vm.fileList9 = ObjectParse(ret.data.filesCwjd);
                        }
                        if(ret.data.filesSjcl){
                            vm.fileList10 = ObjectParse(ret.data.filesSjcl);
                        }
                        if(ret.data.filesWfgl){
                            vm.fileList11 = ObjectParse(ret.data.filesWfgl);
                        }
                        if(ret.data.filesZyqk){
                            vm.fileList12 = ObjectParse(ret.data.filesZyqk);
                        }
                        if(ret.data.filesPwk){
                            vm.fileList13 = ObjectParse(ret.data.filesPwk);
                        }

                        // 附件上传
                        vm.toUploadFile(1);
                        vm.toUploadFile(2);
                        vm.toUploadFile(3);
                        vm.toUploadFile(4);
                        vm.toUploadFile(5);
                        vm.toUploadFile(6);
                        vm.toUploadFile(7);
                        vm.toUploadFile(8);
                        vm.toUploadFile(9);
                        vm.toUploadFile(10);
                        vm.toUploadFile(11);
                        vm.toUploadFile(12);
                        vm.toUploadFile(13);
                        vm.getUploadTable(1,ret.data.filesHpsp?ObjectParse(ret.data.filesHpsp):[]);
                        vm.getUploadTable(2,ret.data.filesYswd?ObjectParse(ret.data.filesYswd):[]);
                        vm.getUploadTable(3,ret.data.filesJcbg?ObjectParse(ret.data.filesJcbg):[]);
                        vm.getUploadTable(4,ret.data.filesJcqk?ObjectParse(ret.data.filesJcqk):[]);
                        vm.getUploadTable(5,ret.data.filesCfqk?ObjectParse(ret.data.filesCfqk):[]);
                        vm.getUploadTable(6,ret.data.filesHyxx?ObjectParse(ret.data.filesHyxx):[]);
                        vm.getUploadTable(7,ret.data.filesYjya?ObjectParse(ret.data.filesYjya):[]);
                        vm.getUploadTable(8,ret.data.filesBgjl?ObjectParse(ret.data.filesBgjl):[]);
                        vm.getUploadTable(9,ret.data.filesCwjd?ObjectParse(ret.data.filesCwjd):[]);
                        vm.getUploadTable(10,ret.data.filesSjcl?ObjectParse(ret.data.filesSjcl):[]);
                        vm.getUploadTable(11,ret.data.filesWfgl?ObjectParse(ret.data.filesWfgl):[]);
                        vm.getUploadTable(12,ret.data.filesZyqk?ObjectParse(ret.data.filesZyqk):[]);
                        vm.getUploadTable(13,ret.data.filesPwk?ObjectParse(ret.data.filesPwk):[]);

                        formSelects.value('conDatatype', ret.data.conDatatype.split(","));
                        setTimeout(function(){
                            form.render();
                        }, 10);
                    }else{
                        layer.msg(ret.msg);
                    }
                },
                error:function(){
                    layer.msg("网络访问出错，未能获取到详情！");
                },
                complete:function(){
                    layer.closeAll("loading");
                }
            })
        },

        // 附件上传
        toUploadFile:function(listIndex){
            switch(listIndex){
                case 1:
                    if(vm.fileList1.length){
                        var num = vm.fileList1.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 2:
                    if(vm.fileList2.length){
                        var num = vm.fileList2.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 3:
                    if(vm.fileList3.length){
                        var num = vm.fileList3.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 4:
                    if(vm.fileList4.length){
                        var num = vm.fileList4.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 5:
                    if(vm.fileList5.length){
                        var num = vm.fileList5.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 6:
                    if(vm.fileList6.length){
                        var num = vm.fileList6.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 7:
                    if(vm.fileList7.length){
                        var num = vm.fileList7.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 8:
                    if(vm.fileList8.length){
                        var num = vm.fileList8.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 9:
                    if(vm.fileList9.length){
                        var num = vm.fileList9.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 10:
                    if(vm.fileList10.length){
                        var num = vm.fileList10.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 11:
                    if(vm.fileList11.length){
                        var num = vm.fileList11.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 12:
                    if(vm.fileList12.length){
                        var num = vm.fileList12.length;
                    }else{
                        var num = 0;
                    }
                    break;
                case 13:
                    if(vm.fileList13.length){
                        var num = vm.fileList13.length;
                    }else{
                        var num = 0;
                    }
                    break;
            }
            upload.render({
                elem: '#uploadBtn'+listIndex, //绑定元素
                url: baseUrl+'fileupload/uploadFile?useType=SOPCO&dataClass='+listIndex,
                accept: 'file',
                multiple: true,
                exts:"jpg|png|gif|bmp|jpeg|txt|doc|xls|ppt|docx|xlsx|pptx|zip",
                before:function(){
                    layer.load(2,{shade:0.6});
                },
                choose: function(obj){
                    //将每次选择的文件追加到文件队列
                    var files = obj.pushFile();
                    
                    //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                    obj.preview(function(index, file, result){
                        switch(listIndex){
                            case 1:
                                vm.fileList1.push(file);
                                break;
                            case 2:
                                vm.fileList2.push(file);
                                break;
                            case 3:
                                vm.fileList3.push(file);
                                break;
                            case 4:
                                vm.fileList4.push(file);
                                break;
                            case 5:
                                vm.fileList5.push(file);
                                break;
                            case 6:
                                vm.fileList6.push(file);
                                break;
                            case 7:
                                vm.fileList7.push(file);
                                break;
                            case 8:
                                vm.fileList8.push(file);
                                break;
                            case 9:
                                vm.fileList9.push(file);
                                break;
                            case 10:
                                vm.fileList10.push(file);
                                break;
                            case 11:
                                vm.fileList11.push(file);
                                break;
                            case 12:
                                vm.fileList12.push(file);
                                break;
                            case 13:
                                vm.fileList13.push(file);
                                break;
                        }
                        
                        //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                        
                        //这里还可以做一些 append 文件列表 DOM 的操作
                        
                        //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                        // delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                    });
                },
                done:function(res, index, upload){
                    switch(listIndex){
                        case 1:
                            vm.fileList1[num].msg = res.msg;
                            vm.fileList1[num].fileId = res.data.fileId;
                            vm.fileList1[num].path = res.data.filePath;
                            if(!vm.fileList1[num].type){
                                vm.fileList1[num].type = res.data.originalFileType;
                            }
                            break;
                        case 2:
                            vm.fileList2[num].msg = res.msg;
                            vm.fileList2[num].fileId = res.data.fileId;
                            vm.fileList2[num].path = res.data.filePath;
                            if(!vm.fileList2[num].type){
                                vm.fileList2[num].type = res.data.originalFileType;
                            }
                            break;
                        case 3:
                            if(!vm.fileList3[num].type){
                                vm.fileList3[num].type = res.data.originalFileType;
                                console.log(res.data.originalFileType);
                                console.log(vm.fileList3[num].type);
                            }
                            vm.fileList3[num].msg = res.msg;
                            vm.fileList3[num].fileId = res.data.fileId;
                            vm.fileList3[num].path = res.data.filePath;
                            console.log(vm.fileList3[num].type);
                            break;
                        case 4:
                            vm.fileList4[num].msg = res.msg;
                            vm.fileList4[num].fileId = res.data.fileId;
                            vm.fileList4[num].path = res.data.filePath;
                            if(!vm.fileList4[num].type){
                                vm.fileList4[num].type = res.data.originalFileType;
                            }
                            break;
                        case 5:
                            vm.fileList5[num].msg = res.msg;
                            vm.fileList5[num].fileId = res.data.fileId;
                            vm.fileList5[num].path = res.data.filePath;
                            if(!vm.fileList5[num].type){
                                vm.fileList5[num].type = res.data.originalFileType;
                            }
                            break;
                        case 6:
                            vm.fileList6[num].msg = res.msg;
                            vm.fileList6[num].fileId = res.data.fileId;
                            vm.fileList6[num].path = res.data.filePath;
                            if(!vm.fileList6[num].type){
                                vm.fileList6[num].type = res.data.originalFileType;
                            }
                            break;
                        case 7:
                            vm.fileList7[num].msg = res.msg;
                            vm.fileList7[num].fileId = res.data.fileId;
                            vm.fileList7[num].path = res.data.filePath;
                            if(!vm.fileList7[num].type){
                                vm.fileList7[num].type = res.data.originalFileType;
                            }
                            break;
                        case 8:
                            vm.fileList8[num].msg = res.msg;
                            vm.fileList8[num].fileId = res.data.fileId;
                            vm.fileList8[num].path = res.data.filePath;
                            if(!vm.fileList8[num].type){
                                vm.fileList8[num].type = res.data.originalFileType;
                            }
                            break;
                        case 9:
                            vm.fileList9[num].msg = res.msg;
                            vm.fileList9[num].fileId = res.data.fileId;
                            vm.fileList9[num].path = res.data.filePath;
                            if(!vm.fileList9[num].type){
                                vm.fileList9[num].type = res.data.originalFileType;
                            }
                            break;
                        case 10:
                            vm.fileList10[num].msg = res.msg;
                            vm.fileList10[num].fileId = res.data.fileId;
                            vm.fileList10[num].path = res.data.filePath;
                            if(!vm.fileList10[num].type){
                                vm.fileList10[num].type = res.data.originalFileType;
                            }
                            break;
                        case 11:
                            vm.fileList11[num].msg = res.msg;
                            vm.fileList11[num].fileId = res.data.fileId;
                            vm.fileList11[num].path = res.data.filePath;
                            if(!vm.fileList11[num].type){
                                vm.fileList11[num].type = res.data.originalFileType;
                            }
                            break;
                        case 12:
                            vm.fileList12[num].msg = res.msg;
                            vm.fileList12[num].fileId = res.data.fileId;
                            vm.fileList12[num].path = res.data.filePath;
                            if(!vm.fileList12[num].type){
                                vm.fileList12[num].type = res.data.originalFileType;
                            }
                            break;
                        case 13:
                            vm.fileList13[num].msg = res.msg;
                            vm.fileList13[num].fileId = res.data.fileId;
                            vm.fileList13[num].path = res.data.filePath;
                            if(!vm.fileList13[num].type){
                                vm.fileList13[num].type = res.data.originalFileType;
                            }
                            break;
                    }
                    num++;
                },
                allDone: function(res){
                    //上传完毕回调
                    var arr = [];
                    switch(listIndex){
                        case 1:
                            vm.renderUploadTable(listIndex, vm.fileList1);
                            if(vm.fileList1.length){
                                for(var i in vm.fileList1){
                                    arr.push({
                                        fileId:vm.fileList1[i].fileId,
                                        name:vm.fileList1[i].name,
                                        path:vm.fileList1[i].path,
                                        thumb:"",
                                        size:vm.fileList1[i].size,
                                        type:vm.fileList1[i].type,
                                        msg:vm.fileList1[i].msg
                                    });
                                }
                                $("input[name=filesHpsp]").val(JSON.stringify(arr));
                            }
                            break;
                        case 2:
                            vm.renderUploadTable(listIndex, vm.fileList2);
                            if(vm.fileList2.length){
                                for(var i in vm.fileList2){
                                    arr.push({
                                        fileId:vm.fileList2[i].fileId,
                                        name:vm.fileList2[i].name,
                                        path:vm.fileList2[i].path,
                                        thumb:"",
                                        size:vm.fileList2[i].size,
                                        type:vm.fileList2[i].type,
                                        msg:vm.fileList2[i].msg
                                    });
                                }
                                $("input[name=filesYswd]").val(JSON.stringify(arr));
                            }
                            break;
                        case 3:
                            vm.renderUploadTable(listIndex, vm.fileList3);
                            if(vm.fileList3.length){
                                for(var i in vm.fileList3){
                                    arr.push({
                                        fileId:vm.fileList3[i].fileId,
                                        name:vm.fileList3[i].name,
                                        path:vm.fileList3[i].path,
                                        thumb:"",
                                        size:vm.fileList3[i].size,
                                        type:vm.fileList3[i].type,
                                        msg:vm.fileList3[i].msg
                                    });
                                }
                                $("input[name=filesJcbg]").val(JSON.stringify(arr));
                            }
                            break;
                        case 4:
                            vm.renderUploadTable(listIndex, vm.fileList4);
                            if(vm.fileList4.length){
                                for(var i in vm.fileList4){
                                    arr.push({
                                        fileId:vm.fileList4[i].fileId,
                                        name:vm.fileList4[i].name,
                                        path:vm.fileList4[i].path,
                                        thumb:"",
                                        size:vm.fileList4[i].size,
                                        type:vm.fileList4[i].type,
                                        msg:vm.fileList4[i].msg
                                    });
                                }
                                $("input[name=filesJcqk]").val(JSON.stringify(arr));
                            }
                            break;
                        case 5:
                            vm.renderUploadTable(listIndex, vm.fileList5);
                            if(vm.fileList5.length){
                                for(var i in vm.fileList5){
                                    arr.push({
                                        fileId:vm.fileList5[i].fileId,
                                        name:vm.fileList5[i].name,
                                        path:vm.fileList5[i].path,
                                        thumb:"",
                                        size:vm.fileList5[i].size,
                                        type:vm.fileList5[i].type,
                                        msg:vm.fileList5[i].msg
                                    });
                                }
                                $("input[name=filesCfqk]").val(JSON.stringify(arr));
                            }
                            break;
                        case 6:
                            vm.renderUploadTable(listIndex, vm.fileList6);
                            if(vm.fileList6.length){
                                for(var i in vm.fileList6){
                                    arr.push({
                                        fileId:vm.fileList6[i].fileId,
                                        name:vm.fileList6[i].name,
                                        path:vm.fileList6[i].path,
                                        thumb:"",
                                        size:vm.fileList6[i].size,
                                        type:vm.fileList6[i].type,
                                        msg:vm.fileList6[i].msg
                                    });
                                }
                                $("input[name=filesHyxx]").val(JSON.stringify(arr));
                            }
                            break;
                        case 7:
                            vm.renderUploadTable(listIndex, vm.fileList7);
                            if(vm.fileList7.length){
                                for(var i in vm.fileList7){
                                    arr.push({
                                        fileId:vm.fileList7[i].fileId,
                                        name:vm.fileList7[i].name,
                                        path:vm.fileList7[i].path,
                                        thumb:"",
                                        size:vm.fileList7[i].size,
                                        type:vm.fileList7[i].type,
                                        msg:vm.fileList7[i].msg
                                    });
                                }
                                $("input[name=filesYjya]").val(JSON.stringify(arr));
                            }
                            break;
                        case 8:
                            vm.renderUploadTable(listIndex, vm.fileList8);
                            if(vm.fileList8.length){
                                for(var i in vm.fileList8){
                                    arr.push({
                                        fileId:vm.fileList8[i].fileId,
                                        name:vm.fileList8[i].name,
                                        path:vm.fileList8[i].path,
                                        thumb:"",
                                        size:vm.fileList8[i].size,
                                        type:vm.fileList8[i].type,
                                        msg:vm.fileList8[i].msg
                                    });
                                }
                                $("input[name=filesBgjl]").val(JSON.stringify(arr));
                            }
                            break;
                        case 9:
                            vm.renderUploadTable(listIndex, vm.fileList9);
                            if(vm.fileList9.length){
                                for(var i in vm.fileList9){
                                    arr.push({
                                        fileId:vm.fileList9[i].fileId,
                                        name:vm.fileList9[i].name,
                                        path:vm.fileList9[i].path,
                                        thumb:"",
                                        size:vm.fileList9[i].size,
                                        type:vm.fileList9[i].type,
                                        msg:vm.fileList9[i].msg
                                    });
                                }
                                $("input[name=filesCwjd]").val(JSON.stringify(arr));
                            }
                            break;
                        case 10:
                            vm.renderUploadTable(listIndex, vm.fileList10);
                            if(vm.fileList10.length){
                                for(var i in vm.fileList10){
                                    arr.push({
                                        fileId:vm.fileList10[i].fileId,
                                        name:vm.fileList10[i].name,
                                        path:vm.fileList10[i].path,
                                        thumb:"",
                                        size:vm.fileList10[i].size,
                                        type:vm.fileList10[i].type,
                                        msg:vm.fileList10[i].msg
                                    });
                                }
                                $("input[name=filesSjcl]").val(JSON.stringify(arr));
                            }
                            break;
                        case 11:
                            vm.renderUploadTable(listIndex, vm.fileList11);
                            if(vm.fileList11.length){
                                for(var i in vm.fileList11){
                                    arr.push({
                                        fileId:vm.fileList11[i].fileId,
                                        name:vm.fileList11[i].name,
                                        path:vm.fileList11[i].path,
                                        thumb:"",
                                        size:vm.fileList11[i].size,
                                        type:vm.fileList11[i].type,
                                        msg:vm.fileList11[i].msg
                                    });
                                }
                                $("input[name=filesWfgl]").val(JSON.stringify(arr));
                            }
                            break;
                        case 12:
                            vm.renderUploadTable(listIndex, vm.fileList12);
                            if(vm.fileList12.length){
                                for(var i in vm.fileList12){
                                    arr.push({
                                        fileId:vm.fileList12[i].fileId,
                                        name:vm.fileList12[i].name,
                                        path:vm.fileList12[i].path,
                                        thumb:"",
                                        size:vm.fileList12[i].size,
                                        type:vm.fileList12[i].type,
                                        msg:vm.fileList12[i].msg
                                    });
                                }
                                $("input[name=filesZyqk]").val(JSON.stringify(arr));
                            }
                            break;
                        case 13:
                            vm.renderUploadTable(listIndex, vm.fileList13);
                            if(vm.fileList13.length){
                                for(var i in vm.fileList13){
                                    arr.push({
                                        fileId:vm.fileList13[i].fileId,
                                        name:vm.fileList13[i].name,
                                        path:vm.fileList13[i].path,
                                        thumb:"",
                                        size:vm.fileList13[i].size,
                                        type:vm.fileList13[i].type,
                                        msg:vm.fileList13[i].msg
                                    });
                                }
                                $("input[name=filesPwk]").val(JSON.stringify(arr));
                            }
                            break;
                    }
                    layer.closeAll("loading");
                },
                error: function(){
                    //请求异常回调
                    switch(listIndex){
                        case 1:
                            vm.fileList1 = [];
                            break;
                        case 2:
                            vm.fileList2 = [];
                            break;
                        case 3:
                            vm.fileList3 = [];
                            break;
                        case 4:
                            vm.fileList4 = [];
                            break;
                        case 5:
                            vm.fileList5 = [];
                            break;
                        case 6:
                            vm.fileList6 = [];
                            break;
                        case 7:
                            vm.fileList7 = [];
                            break;
                        case 8:
                            vm.fileList8 = [];
                            break;
                        case 9:
                            vm.fileList9 = [];
                            break;
                        case 10:
                            vm.fileList10 = [];
                            break;
                        case 11:
                            vm.fileList11 = [];
                            break;
                        case 12:
                            vm.fileList12 = [];
                            break;
                        case 13:
                            vm.fileList13 = [];
                            break;
                    }
                    layer.closeAll("loading");
                }
            });
        },

        // 上传文件预览列表
        getUploadTable:function(index, data){
            layui.use('table', function(){
                var table = layui.table;
                table.render({
                    elem:'#fileList'+index,
                    data:data,
                    page:true,
                    height:177,
                    cols:[[
                        {field: 'name', title: '文件名称', minWidth:200, align: 'center'},
                        {field: 'type', title: '文件类型', width:120, align: 'center'},
                        {title: '文件大小', width:120, align: 'center', templet:function(d){
                            return (d.size/1024).toFixed(2)+"kb";
                        }},
                        {field: 'msg', title: '上传描述', width:180, align: 'center'},
                        {title: '操作', width:130, align: 'center', templet:function(d){
                            return "<div><a class='layui-btn layui-btn-xs' onclick='deleteFile("+index+",\""+d.fileId+"\")'>删除</a><a class='layui-btn layui-btn-xs layui-btn-primary' onclick='toPreview(\""+d.path+"\")'>预览</a></div>"
                        }},
                    ]]
                });
            })
        },
        renderUploadTable:function(index, data){
            layui.use('table', function(){
                var table = layui.table;
                table.reload("fileList"+index,{
                    data:data,
                });
            })
        },

        // 获取地理位置
        getLocation:function(){
            parent.getLocation();
        },

        // 保存信息
        saveInfo:function(){
            if(vm.coId){
                var url = URL_company_info_update;
            }else{
                var url = URL_company_info_save;
            }
            $.ajax({
                type:"post",
                url:url,
                dataType:"json",
                data : $('#form1').serialize(),
                beforeSend:function(){
                    this.layerIndex = parent.layer.load(2,{shade:0.5});
                },
                success:function(ret){
                    if(ret.code == 0){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        parent.layer.msg("信息保存成功！");
                        setTimeout(function(){
                            parent.search();
                        }, 20);
                    }else{
                        layer.msg(ret.msg);
                    }
                },
                error:function(){
                    layer.msg("网络访问出错，信息保存失败！");
                },
                complete:function(){
                    parent.layer.close(this.layerIndex);
                }
            })
        },

        // 父页面调用保存
        toSave:function(){
            $("#btnSave").trigger("click");
        },
    }
})

// 删除
function deleteFile(index, fileId){
    switch(index){
        case 1:
            for(var i in vm.fileList1){
                if(vm.fileList1[i].fileId == fileId){
                    vm.fileList1.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList1);
            break;
        case 2:
            for(var i in vm.fileList2){
                if(vm.fileList2[i].fileId == fileId){
                    vm.fileList2.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList2);
            break;
        case 3:
            for(var i in vm.fileList3){
                if(vm.fileList3[i].fileId == fileId){
                    vm.fileList3.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList3);
            break;
        case 4:
            for(var i in vm.fileList4){
                if(vm.fileList4[i].fileId == fileId){
                    vm.fileList4.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList4);
            break;
        case 5:
            for(var i in vm.fileList5){
                if(vm.fileList5[i].fileId == fileId){
                    vm.fileList5.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList5);
            break;
        case 6:
            for(var i in vm.fileList6){
                if(vm.fileList6[i].fileId == fileId){
                    vm.fileList6.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList6);
            break;
        case 7:
            for(var i in vm.fileList7){
                if(vm.fileList7[i].fileId == fileId){
                    vm.fileList7.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList7);
            break;
        case 8:
                for(var i in vm.fileList8){
                    if(vm.fileList8[i].fileId == fileId){
                        vm.fileList8.splice(i,1);
                        break;
                    }
                }
                vm.renderUploadTable(index,vm.fileList8);
            break;
        case 9:
                for(var i in vm.fileList9){
                    if(vm.fileList9[i].fileId == fileId){
                        vm.fileList9.splice(i,1);
                        break;
                    }
                }
                vm.renderUploadTable(index,vm.fileList9);
            break;
        case 10:
                for(var i in vm.fileList10){
                    if(vm.fileList10[i].fileId == fileId){
                        vm.fileList10.splice(i,1);
                        break;
                    }
                }
                vm.renderUploadTable(index,vm.fileList10);
            break;
        case 11:
                for(var i in vm.fileList11){
                    if(vm.fileList11[i].fileId == fileId){
                        vm.fileList11.splice(i,1);
                        break;
                    }
                }
                vm.renderUploadTable(index,vm.fileList11);
            break;
        case 12:
            for(var i in vm.fileList12){
                if(vm.fileList12[i].fileId == fileId){
                    vm.fileList12.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList12);
            break;
        case 13:
            for(var i in vm.fileList13){
                if(vm.fileList13[i].fileId == fileId){
                    vm.fileList13.splice(i,1);
                    break;
                }
            }
            vm.renderUploadTable(index,vm.fileList13);
            break;
    }
}

// 预览
function toPreview(path){
    if(path.split(".")[1]=="jpg" || path.split(".")[1]=="png" || path.split(".")[1]=="gif"){
        layer.photos({
            photos: {
                "title": "", //相册标题
                "id": 123, //相册id
                "start": 0, //初始显示的图片序号，默认0
                "data": [   //相册包含的图片，数组格式
                  {
                    "alt": "",
                    "pid": 0, //图片id
                    "src": path, //原图地址
                    "thumb": "" //缩略图地址
                  }
                ]
            },
            anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
        });
    }else{
        window.open(path);
    }
}