export const storageService = {
    query,
    get,
    post,
    put,
    remove,
    postMany,
  };



  
  function query(entityType, delay = 0) {
    var entities = JSON.parse(localStorage.getItem(entityType)) || [];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(entities);
      }, delay);
    });
    // return Promise.resolve(entities);
  }
  
  function get(entityType, entityId) {
    return query(entityType).then((entities) =>
      entities.find((entity) => entity._id === entityId)
    );
  }
  
  function post(entityType, newEntity) {
    newEntity._id = _makeId();
    return query(entityType).then((entities) => {
      entities.push(newEntity);
      _save(entityType, entities);
      return newEntity;
    });
  }
  
  async function postMany(entityType, newEntities) {
    const entities = await query(entityType)
    entities.push(...newEntities);
      _save(entityType, entities);
      return entities;
  }
  
  function put(entityType, updatedEntity) {
    return query(entityType).then((entities) => {
      const idx = entities.findIndex((entity) => entity._id === updatedEntity._id);
      entities.splice(idx, 1, updatedEntity);
      _save(entityType, entities);
      return updatedEntity;
    });
  }
  
  async function remove(entityType, entityId) {
    const users = await query(entityType);
    const idx = users.findIndex((entity) => entity._id === entityId);
    if (idx === -1)
      return Promise.reject(`Unknown Entity ${entityType} with Id: ${entityId}`);
    users.splice(idx, 1);
    _save(entityType, users);
    return users;
  }
  
  function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities));
  }
  
  function _makeId(length = 5) {
    var txt = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
  }
  

  

