function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;

    showButtons(true, id_token);
}

function showButtons(bool, idToken) {
    let poolBtn = document.getElementById("doPollBtn");
    let signOutBtn = document.getElementById("signOutBtn");

    poolBtn.style.display = bool ? "block" : "none";
    signOutBtn.style.display = bool ? "block" : "none";

    signOutBtn.onclick = signOut;
    poolBtn.onclick = () => window.location.href = `http://130.25.193.20:9095/login?idToken=${idToken}`;
}

function signOut() { 
    let auth2 = gapi.auth2.getAuthInstance(); 
    auth2.signOut().then(() => console.log('Te ne vai già ???? :('));
    showButtons(false);
}