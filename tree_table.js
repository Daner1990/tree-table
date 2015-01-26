function TreeToTable(TreeJson)
{
    var TreeTable = document.getElementById("TreeTable");
    TreeTable.innerHTML = "";

    var MaxDepth = 1;

    for(var index in TreeJson)
    {
        if(TreeJson[index]["depth"]>MaxDepth)
        {
            MaxDepth = TreeJson[index]["depth"];
        }
    }

    $(TreeJson).each(function(index){

        var val=TreeJson[index];
        var childcontent = "";
        var tr = "<tr>";

        if(index == TreeJson.length-1)
        {
            var childtable = CreateTree(val,childcontent,false,MaxDepth,1);
        }
        else
        {
            var childtable = CreateTree(val,childcontent,true,MaxDepth,1);
            childtable = childtable.substring(0,childtable.length-4);
        }

        tr = tr + childtable;
        //alert(tr);
        
        TreeTable.innerHTML = TreeTable.innerHTML + tr;
    });
}

function CreateTree(JsonItem,This_tr,ParentSbling,MaxDepth,RecentDepth)
{
    if(JsonItem.children == undefined)
    {
        return CreateChildTable(JsonItem);
    }

    This_tr = This_tr + CreateChildTable(JsonItem);

    for (var item=0; item<JsonItem.children.length; item++)
    {
        if(JsonItem.children.length-1 == item)
        {
            This_tr = CreateTree(JsonItem.children[item],This_tr,ParentSbling,MaxDepth,RecentDepth+1);
        }
        else{
            This_tr = CreateTree(JsonItem.children[item],This_tr,true,MaxDepth,RecentDepth+1);
        }
    }

    if(JsonItem['depth'] == 1 )
    {
        while(RecentDepth < MaxDepth)
        {
            This_tr = This_tr + "<td>&nbsp;</td>";
            RecentDepth += 1;
        }
        This_tr = This_tr + "</tr>";
    }

    if(ParentSbling == true && JsonItem['depth'] == 1)
    {
        This_tr = This_tr + "<tr>";
    }

    return This_tr;
}

function CreateChildTable(jsonObj)
{
    var JsonStr = JSON.stringify(jsonObj);
    var Title = TreeInfoShow(JsonStr);
    var ChangeUrl = "http://www.baidu.com";

    var ChildTree = "<td id='"+jsonObj["id"]+"' rowspan='"+jsonObj["width"]+"'>";
    //ChildTree += "<span class='td_content' title='"+Title+"' class='easyui-tootip'>";
    ChildTree += "<span class='td_content'>";
    ChildTree += "<img src='"+jsonObj["status_image"]+"' width='10' height='10' alt='status_image' class='status_image' onerror='this.src="+'"'+"error.jpg"+'"'+";'>";
    ChildTree += "<a target='_blank' href='"+ChangeUrl+"'>"+jsonObj["ip_address"];
    ChildTree += "</a></span></td>" 

    return ChildTree;
}

function TreeInfoShow(JsonStr)
{
    var JsonObj = JSON.parse(JsonStr);
    var title = '<div class="tips_content">';

    for(var str in JsonObj)
    {
        if(str != "services" && str != "children")
        {
            title += str + ":" + JsonObj[str] + "<br />";
        }
    }

    title += "</div>";

    return title;
}

function SetRequest()
{
    //var TreeURL = "http://support.msync.vobie.mobi:6543/";
    var TreeURL = "json.json";

    $.ajax({
        type:"GET",
        data:"{}",
        contentType:"application/json; charset=utf-8",
        url:TreeURL,
        dataType:'json',
        success:function(data,status){
            TreeToTable(data);
        }
    }).fail(function(){
        alert("server fail");
    });
}

