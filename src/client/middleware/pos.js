class pos {

static fetchEvents() {
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
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const posts = resData.data.posts;
        console.log(posts);
      })
      .catch(err => {
        console.log(err);
      });
  };

}