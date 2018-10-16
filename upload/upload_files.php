<?php
	$result = "";
	if($_FILES["file"]["error"][0] == 0){

		$num_of_files = count($_FILES["file"]["name"]);

		for ($i=0; $i < $num_of_files ; $i++) { 
			move_uploaded_file($_FILES["file"]["tmp_name"][$i], "files/".$_FILES["file"]["name"][$i]);
			echo "<p> " 
				. $_FILES["file"]["name"][$i]  
				. " uploaded succesfully"
				."</p>";
		}


	}
	else{
		$result = "Error uploading file" . 
		          "<br> Error code: " . $_FILES["file"]["error"];
	}
	echo $result;
?>
