class pos {

  static fetchPosts() {
    const requestBody = {
      query: `
          query {
            posts {
              _id
            }
          }
        `
    };
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Middleware: fetchPosts failed!');
        }
        return res.json();
    }).then(resData => {
        const posts = resData.data.posts;
        console.log(posts);
    }).catch(err => {
        console.log(err);
    });
  };

  static addPost(disId, parId, owner, content) {
    console.log(disId + " " + parId + " " + owner + " " + content)
    const requestBody = {
      query: `
        mutation {
          createPost(postInput: {disId: "${disId}", parId: "${parId}", owner: "${owner}", content: "${content}"}) {
            _id
            disId {
              _id
            }
            parId
            owner
            content
          }
        }
      `
    };
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201) {
        throw new Error('Middleware: addPost failed!');
      }
      return res.json();
    }).then(resData => {
      const post = resData.data;
        console.log(post);
    }).catch(err => {
      console.log(err)
    });
  };

}