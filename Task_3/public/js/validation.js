document.getElementById("userForm").addEventListener('userForm', function(event) {
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const confpass = document.getElementById('confpass').value;

    if (!fname || !lname || !email || !pass){
        alert("Name, Email and Password are required!");
        event.preventDefault();
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        alert("Invalid Email format!");
        event.preventDefault();
        return false;
    }
    
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%&*!?])(?=.*[A-Za-z\d@$%&*!?]){8,}$/;
    if (!passRegex.test(pass)) {
        alert("Password must contain atmost 8 characters with atleast one Uppercase, one Lowercase letters, one number and one special charachter!");
        event.preventDefault();
        return false;
    }

    if (pass !== confpass){
        alert("Passwords do not match!");
        event.preventDefault();
        return false;
    }

});