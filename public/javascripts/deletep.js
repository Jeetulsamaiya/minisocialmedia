var delet = document.querySelector('#likee')
var deleete = document.querySelector('#deleete')
deleete.addEventListener('click', function (e) {
    console.log(delet.innerText);
    axios.get(`/delete/${delet.innerText}`).then(function (response) {
        // likee.innerText = response.innerText;
        // console.log(response.data.likes.length);
        //  like.textContent = response.data.likes.length + ' ' + "Like "
        axios.get(`/profilee`).then(function (response) {
            var clutter = ' '
            console.log(response.data.img);

            response.data.posts.forEach(function (post) {


                clutter += `<div class="hh55 card p-3 mt-2">
              <a href="/profile"><img id="smallsize" src="${response.data.img} " alt=""></a>
              <div class="flex">

                <h1>
                  ${post.post}
                </h1>
                
                ${  if(post.imgpost.split(".")[2] == 'png' || post.imgpost.split(".")[2] == 'jpeg'||
                post.imgpost.split(".")[2] == 'jpg'|| post.imgpost.split(".")[2]== 'gif' || post.imgpost.split(".")[2]==
                'JPG'){
                  `<img class="imgs" src=" ${post.imgpost} " alt="">`

                }else{
                  ` <
                    iframe src = "${ post.imgpost }"
                frameborder = "0" > < /iframe>
                `
                }}
                

                <% if (post.imgpost.split(".")[2] == 'png' || post.imgpost.split(".")[2] == 'jpeg'|| post.imgpost.split(".")[2] == 'jpg'|| post.imgpost.split(".")[2]== 'gif' || post.imgpost.split(".")[2]== 'JPG') { %>
                <img class="imgs" src="<%= elem.imgpost %> " alt="">

                <%}else {  %>

                <iframe src="<%= elem.imgpost %> " frameborder="0"></iframe>
                <% }%>


                <div>
                  <!-- <a class="btn btn-primary " href="/like/<%= elem._id %> "><%=elem.likes.length  %> like</a> -->
                  <button id="like" class="btn btn-primary"><%=elem.likes.length %> %> Like </button>
                  <button id="deleete" class="btn btn-primary"> Delete </button>

                  <!-- <a class="btn btn-primary " href="/delete/<%= elem._id %>">Delete post</a> -->
                </div>
              </div>
              <% elem.comments.forEach(function(commentdata){ %>

              <div class=" pt-1 mt-3">
                <h4>&nbsp;&nbsp;<%= commentdata.comment %> </h4>
                <p>&nbsp;&nbsp; comment by- <%= commentdata.username %> (<%= commentdata.name %>)</p>

              </div>
              <%}) %>
              <form action="/comment/<%= elem._id %>" method="post">

                <input class="form-control mt-2" type="text" name="comment" placeholder="Write a Comment" id="">
              </form>
            </div>`


            })
        })

    })
})