angular.module('homeModule',[])
.controller('homeCtrl',['$scope', '$location', '$rootScope','$http' ,'$filter', function($scope, $location, $rootScope,$http,$filter){
    
	// Initialing Fabric Canvas
	$rootScope.canvas = new fabric.Canvas('c'); 
	
	//Array to store Canvas modifications
	$scope.historyArr = []; 
	
	//Counter
	var count = 0; 
	
	//To Differentiate Multiple images
	var leftPadding = 0; 
	
	//To avoid multiple pushes in array during Undo/Redo
	var isUndoDone = false; 

 /* ===================================================== */
 /* Upload Image
 /* ===================================================== */			
loadImg = function(event) 
	{
		var output = document.getElementById('c');
		var context = output.getContext('2d');
		var input = event.target;
		for(i=0;i<input.files.length;i++)
		{
		addImage(i); //allow Multiple images upload
		}   
	}	
//Multilpe images Upload 
addImage = function(i)
	{
		var output = document.getElementById('c');
		var context = output.getContext('2d');
		var input = event.target;
		var reader = new FileReader();
		reader.onload = function(f) 
		{
			var data = f.target.result;
			fabric.Image.fromURL(data, function (img) 
			{
    	      var oImg = img.set({left: 100 + leftPadding, top: 80, angle: 00,width:80, height:80}).scale(1.5);
    	      $rootScope.canvas.add(oImg).renderAll();
    	      var a = $rootScope.canvas.setActiveObject(oImg);
    	      var dataURL = $rootScope.canvas.toDataURL({format: 'png', quality: 0.8});
    	    }); 
		};
		reader.readAsDataURL(input.files[i]);
		leftPadding+=10;
		pushCanvasChanges(true);
	}
	
/* ===================================================== */
 /* Add Text
 /* ===================================================== */
 
$scope.addText = function()
	{
		var addTextThis = new fabric.IText('Double tap to Edit', 
		{
            left: 50,
            top: 50,
			fontSize: 25,
        });
        $rootScope.canvas.add(addTextThis);
        $rootScope. canvas.setActiveObject(addTextThis);
        addTextThis.bringToFront();
	}


 /* ===================================================== */
 /* Save Designs in DB
 /* ===================================================== */
$scope.save = function () 
	{
		document.getElementById("selectOption").style.display = "none"; //Hide select box to open newly saved changes
		var timeStamp = new Date(); //Capturing Time at which changes are saved by user
		
		 var toSaveCanvas = 
		 [{
            time: timeStamp.getTime(),
            canvas: ""
         }];

        var json = $rootScope.canvas.toJSON();
		if(json["objects"].length == 0)
		{
			alert("Please avoid saving empty designs ");
			return;
		}
        json = JSON.stringify(json);
        toSaveCanvas[0]['canvas'] = json;
		 $http.post('http://localhost:3000/saveHistory', toSaveCanvas).then(function(response) {
            if (response.data) 
			alert(response.data);
        }, function(response) {
            alert("There's some issue in retrieving the data, Please try again later ");
        });
	}

 /* ===================================================== */
 /* Fetch Designs from DB
 /* ===================================================== */
 
$scope.fetch = function() {
        $http({
            method: "GET",
            url: "http://localhost:3000/fetchFromDb"
        }).then(function mySuccess(response) {
			if(response.data){
				if(response.data.length == 0){
					alert("No Data Found");
					return;
			}
				$scope.updated_data = response.data;
				$scope.appendResponseToHtml();
			}else{
				alert("Error!! Please try again later");
			
			}
			}, function myError(response) {
            $scope.updated_data = response.statusText;
        });

    }
	
//To Display Saved Designs		
$scope.appendResponseToHtml = function(){
	
	document.getElementById("selectOption").style.display = "block";
		selectOption.options.length = 0;
		
		var elm = document.getElementById('selectOption'),

        df = document.createDocumentFragment();
		for (var i = 0; i <= $scope.updated_data.length-1; i++) 
		{
			var option = document.createElement('option');
			option.value = $scope.updated_data[i].Canvas;;
		/*Beautifying Display Date Starts*/
			var dateStr = parseInt($scope.updated_data[i].Time);
			var date = new Date(dateStr);
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var months = date.getMonth()+1;
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var date = date.getDate()+'/'+ months+'/'+date.getFullYear() + ' ';
			var strTime = date + hours + ':' + minutes + ' ' + ampm + ' and ' +seconds +' seconds';
		/*Beautifying Display Date ends*/	
        option.appendChild(document.createTextNode(strTime));
        df.appendChild(option);
		}
		elm.appendChild(df);
}	

//Loading selected Designs 		
$scope.changeFunc = function()
	{
		var selectBox = document.getElementById("selectOption");	
		var selectedValue = selectBox.options[selectBox.selectedIndex].value;
		$rootScope.canvas.clear().renderAll();
        $rootScope.canvas.loadFromJSON(selectedValue);
        $rootScope.canvas.renderAll();
	}	

 /* ===================================================== */
 /* Remove All and Delete selected
 /* ===================================================== */	
//Remove all changes - Clear Canvas
$scope.removeAll = function() 
	{
		if(confirm('Note : All the changes will be removed. Do you still want to Remove ?')){
			$rootScope.canvas.clear().renderAll();
			$scope.historyArr = [];
			leftPadding = 0;
		}	
	}

//Delete Object 
$scope.delete = function() 
	{
		if($rootScope.canvas.getActiveObject() == null ) 
		{
			alert("Please select an element to delete");
			return;
		}
        $rootScope.canvas.getActiveObject().remove();
    }
	
 /* ===================================================== */
 /* Edit History
 /* ===================================================== */	
//Capturing Canvas modifications	
$rootScope.canvas.on(
		'object:modified', function () {
		pushCanvasChanges(true);
		});

//Capturing Canvas additions
$rootScope.canvas.on(
		'object:added', function () {
		pushCanvasChanges(true);
		});
		
//Capturing Canvas Removals	
		$rootScope.canvas.on(
		'object:removed', function () {
		pushCanvasChanges(true);
		});
	
//Storing canvas modifications
pushCanvasChanges = function(isSaveFlag) 
	{
		if(isUndoDone == true){
			return;//To Avoid Multiple
		}
		if(isSaveFlag == true)
		{
		currentJson = JSON.stringify($rootScope.canvas);
		$scope.historyArr.push(currentJson);
		}
		$scope.historyArr = $scope.historyArr.filter( returnUnique );//To eliminate redundancy
	}

//Return Unique Array	
function returnUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
	
//Undo Functionality
$scope.undo = function() 
	{
		if (count < $scope.historyArr.length) 
		{
			$rootScope.canvas.clear().renderAll();
			$rootScope.canvas.loadFromJSON($scope.historyArr[$scope.historyArr.length-1 - count - 1]);	
		}
        $rootScope.canvas.renderAll();        
        count += 1;
		document.getElementById("redoBtn").disabled = false;
		isUndoDone = true;
	}
	
//Redo Functionality
$scope.redo = function() 
	{
		if (count > 0) 
		{
		$rootScope.canvas.clear().renderAll();
		$rootScope.canvas.loadFromJSON($scope.historyArr[$scope.historyArr.length-1 - count + 1]);
		$rootScope.canvas.renderAll();
		document.getElementById("redoBtn").disabled = true;
		count -= 1;
		}
			isUndoDone = false;
	}


}]);