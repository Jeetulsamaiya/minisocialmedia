var like = document.querySelector('#like');
var likee = document.querySelector('#likee');
like.addEventListener("click", function () {
    // console.log(likee.innerText);
    axios.get(`/like/${likee.innerText}`).then(function (response) {
        // likee.innerText = response.innerText;
        // console.log(response.data.likes.length);
        like.textContent = response.data.likes.length + ' ' + "Like "

    })
})