const url = "http://localhost:8088/"


const DataManager = {
  getAll: (resource) => {
    return fetch(`${url}${resource}`)
    .then(response => response.json())
  },
  post: (resource, data) => {
    return fetch(`${url}${resource}`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  getOne: (resource, id) => {
    return fetch(`${url}${resource}/${id}`)
    .then(response => response.json())
  },
  put: (resource, id, data) => {
    return fetch(`${url}${resource}/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }
}

export default DataManager