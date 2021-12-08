
const state = {
    images: []
}

function renderImages() {
    const imageContainer = document.querySelector(`.image-container`)
    imageContainer.innerHTML = ``

    for(const image of state.images) {
        const card = document.createElement(`article`)
        card.setAttribute(`class`, `image-card`)

        const titleEl = document.createElement(`h2`)
        titleEl.setAttribute(`class`, 'title')
        titleEl.textContent = image.title

        const deletePostBtn = document.createElement('button')
        deletePostBtn.setAttribute('class', 'comment-button')
        deletePostBtn.textContent = 'X'

        deletePostBtn.addEventListener('click', function(){
          deletePost(image)
          render()
        })

        const imgEl = document.createElement(`img`)
        imgEl.setAttribute(`src`, image.image)
        imgEl.setAttribute(`class`, `image`)

        const likesSection = document.createElement(`div`)
        likesSection.setAttribute(`class`, `likes-section`)

        const likesEl = document.createElement(`span`)
        likesEl.setAttribute(`class`, `likes`)
        likesEl.textContent = `${image.likes} likes`

        const likeBtn = document.createElement(`button`)
        likeBtn.setAttribute(`class`, `like-button`)
        likeBtn.textContent = `♥`

        likeBtn.addEventListener('click', function(){
          plusLikes(image)
          render()
        })

        const ulEl = document.createElement(`ul`)
        ulEl.setAttribute(`class`, `comments`)

        for(const comment of image.comments){
            const liEl = document.createElement(`li`)
            liEl.textContent = comment.content 

            const deleteCommentBtn = document.createElement('button')
            deleteCommentBtn.setAttribute('class', 'comment-button')
            deleteCommentBtn.textContent = 'X'
            deleteCommentBtn.addEventListener('click', function(){
              deleteComment(image, comment)
              render()
            })
            
            ulEl.append(liEl, deleteCommentBtn)  
        }

        const commentForm = document.createElement('form')
        commentForm.setAttribute('class', 'comment-form')
      
        const commentInput = document.createElement('input')
        commentInput.setAttribute('class', 'comment-input')
        commentInput.setAttribute('type', 'text')
        commentInput.setAttribute('placeholder', 'Add a comment')
      
        const commentButton = document.createElement('button')
        commentButton.setAttribute('class', 'comment-button')
        commentButton.setAttribute('type','submit')
        commentButton.textContent = 'Post'
        
        commentButton.addEventListener('click', function(event){
          event.preventDefault()
          createComment(image, commentInput.value)
          render()
        })
      
        commentForm.append(commentInput, commentButton)

        likesSection.append(likesEl, likeBtn)
        card.append(titleEl, deletePostBtn, imgEl, likesSection, ulEl, commentForm)
        imageContainer.append(card)
    }

}

function getImages() {
    return fetch(`http://localhost:3000/images`)
    .then(function (response) {
        return response.json()
    })
}

getImages().then(function(postFromServer) {
    state.images = postFromServer
    render()
})

function createComment(image, comment) {

   image.comments.push({content: comment, imageId: image.id})

    return fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          imageId: image.id,
        content: comment
      })
    }).then(function (resp) {
      return resp.json()
    })
  }

function deleteComment(image, comment){
    image.comments = image.comments.filter(function(targetComment){
      return comment.content != targetComment.content
    })

    return fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: 'DELETE'
    })
  }

function plusLikes(image){
    image.likes ++
    return fetch(`http://localhost:3000/images/${image.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(image)
    })
  }

function deletePost(image){
    state.images = state.images.filter(function(otherImage){
      return image.id != otherImage.id
    })

    return fetch(`http://localhost:3000/images/${image.id}`, {
      method: 'DELETE'
    })
  }
  


function render() {
    renderImages()
}

render()