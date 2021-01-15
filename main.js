const router = new Navigo("/");

const renderer = (content) => {
    document.getElementById("page").innerHTML = content;
    router.updatePageLinks();

};



router
.on("/profile/:id",(data) => {
    fetchContent("/page/profile.html",function(file){
        console.log("profile", file );
        getProfile(file,data.data.id).then((toRender) => {
            renderer(toRender);
        })
    });
})
.on('*', (data) => {
    fetchContent("/page/login.html",function(file){
        getCharacters(file).then((toRender)=>{
            renderer(toRender);
        })
    });
}).resolve();


function fetchContent(path, callback) {
    fetch(path)
        .then(response => {
            return response.text()
        })
        .then(data => {
            callback(data)
    });
}

function getCharacters (file){
    return fetch('data/heroes.json')
    .then(response => response.json())
    .then(data => {
        let characters = data.data;
        file = createElementFromHTML(file);
        let placeholder = file.querySelector("#characters");
        let tmp = file.querySelector("#hero");
  	    for(var i = 0 ; i < characters.length ; i ++){
            let card = tmp.content.cloneNode(true);
            card.querySelector('.card-name').textContent = characters[i].name;
            card.querySelector("a").href = "profile/" +  characters[i].id;
            card.querySelector('.card-img').style.backgroundImage = "url('img/"+ characters[i].image + "')";
            placeholder.appendChild(card);
        }
        return file.innerHTML;

  });




}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  

    return div; 
}


function getProfile(file,id) {
    return fetch('/data/heroes.json')
    .then(response => response.json())
    .then(data => {
        console.log(file);
        file = createElementFromHTML(file);
        let hero = data.data;
        let user;
        for(var i= 0; i < hero.length ; i ++) {
            if ( hero[i].id === id){
                user = hero[i];
            }
        }
        file.querySelector(".profile-name").textContent = user.name;
        file.querySelector("#user-name").textContent = user.name;
        document.querySelector("body").style.backgroundColor = "#fff";

        getPosts();



        return file.innerHTML;
    });

}


function getPosts() {
    return fetch('/data/posts.json')
    .then(response => response.json ())
    .then(posts => {
        let post = posts.data;
        for ( var i = 0 ; i < post.length ; i ++ ) {
            let tmp = document.querySelector("#newPost");
            let newPost = tmp.content.cloneNode(true);
            newPost.querySelector(".post-photo").src = "/img/" + post[i].image;
            newPost.querySelector(".newPost-text").textContent = post[i].text;
            newPost.querySelector(".post-author").textContent = post[i].author;
            for ( var k = 0 ; k < post[i].comments.length ; k ++ ) {
                let div = document.createElement('div');
                div.classList.add("comment-item");
                let text = document.createElement('span');
                text.append(post[i].comments[k].text);
                text.classList.add("comment-text");
                let author = document.createElement('span');
                author.append(post[i].comments[k].author + " : ");
                author.classList.add("comment-author");
                div.appendChild(author);
                div.appendChild(text);
                newPost.querySelector(".comments").prepend(div);
            }
            document.querySelector(".myposts").appendChild(newPost);


        }
    })
}


function addPost(){
    let link = document.getElementById("post-link").value;
    let text = document.getElementById("post-text").value;
    if(link !== "" && text != "") {
        let tmp = document.querySelector("#newPost");
        let post = tmp.content.cloneNode(true);
        post.querySelector(".post-photo").src = link;
        post.querySelector(".newPost-text").textContent = text;
        post.querySelector(".post-author").textContent = "me";
        document.querySelector(".myposts").prepend(post);
        document.getElementById("post-link").value = "";
        document.getElementById("post-text").value = "";
    } else {
        alert ("Please enter post text and image link to add new post");
    }
    

}

function like(icon){
    icon.querySelector(".toFill").classList.toggle('filled');
}

function addComment(btn) {
    if(btn.previousElementSibling.value){
        let div = document.createElement('div');
        div.classList.add("comment-item");
        let text = document.createElement('span');
        text.append(btn.previousElementSibling.value);
        text.classList.add("comment-text");
        let author = document.createElement('span');
        author.append("Me : ");
        author.classList.add("comment-author");
        div.appendChild(author);
        div.appendChild(text);
        btn.parentNode.parentNode.prepend(div);
        btn.previousElementSibling.value = "";
    } else {
        alert("Please add comment text first");
    }
}