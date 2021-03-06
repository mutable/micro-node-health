const Meta = require('@mutable/meta');
const request = require('request-promise');

const ServicesApi = {};
module.exports = ServicesApi;


ServicesApi.healthCheck = (req, res) => {
  Meta.services()
  .then((services) => {
    return services.map((serviceName) => {
      return Meta.service(serviceName)
      .then((service) => request(`http://${service}/health`))
      .then((health) => Object.assign({}, {
        name: serviceName,
        result: parseInt(health)
      }))      
      .catch((error) => {
        console.error(error)
        res(Object.assign({}, { name: serviceName, result: 0 }))
      })
    })
  })
  .then((promisesArr) => {
    return Promise.all(promisesArr).then(results => res.send(results) )
  })
}

ServicesApi.getServices = (req, res) => {
  Meta.services()
  .then((_services) => {
    res.send(_services);
  })
}