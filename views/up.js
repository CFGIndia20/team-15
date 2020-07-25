function myFunction() {
    var str1 = document.getElementById("passOne").value;
    var str2 = document.getElementById("passTwo").value;
    var n = str1.localeCompare(str2);
  
      if(str1=="" || str2==""){
          document.getElementById("footerText").innerHTML = "Fill out all the fields!";
      }
    else if(n==0){
      document.getElementById("footerText").innerHTML = "Password updated!";
    }
    else{
      document.getElementById("footerText").innerHTML = "Type correct password";
    }
    
  }